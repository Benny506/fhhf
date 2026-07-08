import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, addAlert } from '../../../../redux/slices/uiSlice';
import supabase from '../../../../utils/supabase';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import CustomModal from '../../../../components/ui/CustomModal';

export default function LessonBuilderModal({ show, onHide, moduleId, lesson, type, orderIndex, onSave }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState([
    { question: '', options: ['', ''], correct_option_index: 0, explanation: '' }
  ]);

  useEffect(() => {
    if (show) {
      if (lesson) {
        setTitle(lesson.title || '');
        setMediaUrl(lesson.media_url || '');
        setTextContent(lesson.text_content || '');
        setIsPreview(lesson.is_preview || false);
        
        // If it's a quiz, we need to fetch the quiz data (or handle it if we stored it inline)
        // For this streamlined approach, let's assume we fetch the quiz if type === 'quiz'
        if (type === 'quiz') {
          fetchQuizData(lesson.id);
        }
      } else {
        setTitle('');
        setMediaUrl('');
        setTextContent('');
        setIsPreview(false);
        setQuizQuestions([{ question: '', options: ['', ''], correct_option_index: 0, explanation: '' }]);
      }
    }
  }, [show, lesson, type]);

  const fetchQuizData = async (lessonId) => {
    try {
      const { data, error } = await supabase.from('fhhf_quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index', { ascending: true });
      if (data && data.length > 0) {
        setQuizQuestions(data.map(q => ({
          question: q.question || '',
          options: q.options || ['', ''],
          correct_option_index: q.correct_option_index || 0,
          explanation: q.explanation || ''
        })));
      }
    } catch (err) {
      console.error("Quiz fetch err", err);
    }
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', options: ['', ''], correct_option_index: 0, explanation: '' }]);
  };

  const handleRemoveQuestion = (qIndex) => {
    const newQs = quizQuestions.filter((_, i) => i !== qIndex);
    setQuizQuestions(newQs.length ? newQs : [{ question: '', options: ['', ''], correct_option_index: 0, explanation: '' }]);
  };

  const updateQuestion = (qIndex, field, value) => {
    const newQs = [...quizQuestions];
    newQs[qIndex][field] = value;
    setQuizQuestions(newQs);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].options[oIndex] = value;
    setQuizQuestions(newQs);
  };

  const addOptionToQuestion = (qIndex) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].options.push('');
    setQuizQuestions(newQs);
  };

  const removeOptionFromQuestion = (qIndex, oIndex) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].options = newQs[qIndex].options.filter((_, i) => i !== oIndex);
    if (newQs[qIndex].correct_option_index === oIndex) {
      newQs[qIndex].correct_option_index = 0;
    } else if (newQs[qIndex].correct_option_index > oIndex) {
      newQs[qIndex].correct_option_index -= 1;
    }
    setQuizQuestions(newQs);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      dispatch(addAlert({ title: 'Missing Title', message: 'Lesson title is required.', variant: 'warning' }));
      return;
    }

    if (type === 'quiz') {
      const isInvalid = quizQuestions.some(q => !q.question.trim() || q.options.some(o => !o.trim()));
      if (isInvalid) {
        dispatch(addAlert({ title: 'Invalid Quiz', message: 'All questions and options must be filled.', variant: 'warning' }));
        return;
      }
    }

    dispatch(showSubtleLoader('Saving lesson...'));
    try {
      let lessonIdToUse = lesson?.id;

      const lessonPayload = {
        module_id: moduleId,
        title,
        content_type: type,
        media_url: type === 'video' || type === 'audio' ? mediaUrl : null,
        text_content: type === 'text' ? textContent : null,
        is_preview: isPreview,
      };

      if (!lesson) {
        lessonPayload.order_index = orderIndex;
        const { data, error } = await supabase.from('fhhf_course_lessons').insert(lessonPayload).select().single();
        if (error) throw error;
        lessonIdToUse = data.id;
      } else {
        const { error } = await supabase.from('fhhf_course_lessons').update(lessonPayload).eq('id', lesson.id);
        if (error) throw error;
      }

      // Handle Quiz separate table logic
      if (type === 'quiz') {
        await supabase.from('fhhf_quizzes').delete().eq('lesson_id', lessonIdToUse);

        const quizPayload = quizQuestions.map((q, i) => ({
          lesson_id: lessonIdToUse,
          question: q.question,
          options: q.options,
          correct_option_index: q.correct_option_index,
          explanation: q.explanation,
          order_index: i
        }));

        await supabase.from('fhhf_quizzes').insert(quizPayload);
      }

      onSave();
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Save Failed', message: err.message, variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  const titleText = `${lesson ? 'Edit' : 'Add'} ${type === 'video' ? 'Video' : type === 'quiz' ? 'Quiz' : 'Article'}`;

  const footerContent = (
    <>
      <Button variant="secondary" onClick={onHide} className="rounded-pill fw-bold">Cancel</Button>
      <Button variant="primary" onClick={handleSave} className="rounded-pill fw-bold px-4">Save Lesson</Button>
    </>
  );

  return (
    <CustomModal 
      show={show} 
      onHide={onHide} 
      title={titleText}
      footer={footerContent}
    >
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Lesson Title</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
      </Form.Group>

      {type === 'video' && (
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Video URL</Form.Label>
          <Form.Control 
            type="url" 
            placeholder="https://youtube.com/..." 
            value={mediaUrl} 
            onChange={(e) => setMediaUrl(e.target.value)} 
          />
          <Form.Text className="text-muted">Paste a YouTube, Vimeo, or external video URL.</Form.Text>
        </Form.Group>
      )}

      {type === 'text' && (
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Article Content</Form.Label>
          <RichTextEditor 
            value={textContent}
            onChange={setTextContent}
            placeholder="Write your comprehensive lesson here..."
          />
        </Form.Group>
      )}

      {type === 'quiz' && (
        <div className="mb-4">
          {quizQuestions.map((q, qIndex) => (
            <div key={qIndex} className="bg-light p-3 rounded border mb-3 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-primary">Question {qIndex + 1}</h6>
                {quizQuestions.length > 1 && (
                  <Button variant="link" className="text-danger p-0" onClick={() => handleRemoveQuestion(qIndex)}>
                    Remove
                  </Button>
                )}
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-dark">Question Text</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="What is..." 
                  value={q.question} 
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)} 
                />
              </Form.Group>

              <Form.Label className="fw-bold text-dark">Options (Select the correct one)</Form.Label>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="d-flex align-items-center gap-2 mb-2">
                  <Form.Check 
                    type="radio" 
                    name={`correctOption_${qIndex}`}
                    checked={q.correct_option_index === oIndex} 
                    onChange={() => updateQuestion(qIndex, 'correct_option_index', oIndex)}
                  />
                  <Form.Control 
                    type="text" 
                    value={opt} 
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} 
                    placeholder={`Option ${oIndex + 1}`}
                  />
                  {q.options.length > 2 && (
                    <Button variant="link" className="text-danger p-0" onClick={() => removeOptionFromQuestion(qIndex, oIndex)}>Remove</Button>
                  )}
                </div>
              ))}
              <Button variant="link" className="text-primary p-0 fw-bold mt-1 mb-3" onClick={() => addOptionToQuestion(qIndex)}>
                + Add Option
              </Button>

              <Form.Group>
                <Form.Label className="fw-bold text-dark mb-1">Explanation (Optional)</Form.Label>
                <Form.Text className="d-block text-muted mb-2">Shown to students after they answer to explain why the selected option is correct.</Form.Text>
                <Form.Control 
                  as="textarea"
                  rows={2}
                  placeholder="The correct answer is..." 
                  value={q.explanation} 
                  onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)} 
                />
              </Form.Group>
            </div>
          ))}

          <Button variant="outline-primary" className="fw-bold rounded-pill w-100 py-2 border-dashed" onClick={handleAddQuestion} style={{ borderStyle: 'dashed', borderWidth: '2px' }}>
            + Add Another Question
          </Button>
        </div>
      )}

      <Form.Group className="mb-2">
        <Form.Check 
          type="checkbox" 
          label="Make this lesson available as a free preview"
          checked={isPreview}
          onChange={(e) => setIsPreview(e.target.checked)}
        />
      </Form.Group>
    </CustomModal>
  );
}
