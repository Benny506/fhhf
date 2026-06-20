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
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState(['', '']);
  const [correctOption, setCorrectOption] = useState(0);

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
        setQuizQuestion('');
        setQuizOptions(['', '']);
        setCorrectOption(0);
      }
    }
  }, [show, lesson, type]);

  const fetchQuizData = async (lessonId) => {
    try {
      const { data, error } = await supabase.from('fhhf_quizzes').select('*').eq('lesson_id', lessonId).single();
      if (data) {
        setQuizQuestion(data.question || '');
        setQuizOptions(data.options || ['', '']);
        setCorrectOption(data.correct_option_index || 0);
      }
    } catch (err) {
      console.error("Quiz fetch err", err);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...quizOptions];
    newOptions[index] = value;
    setQuizOptions(newOptions);
  };

  const handleAddOption = () => setQuizOptions([...quizOptions, '']);
  const handleRemoveOption = (index) => {
    const newOptions = quizOptions.filter((_, i) => i !== index);
    setQuizOptions(newOptions);
    if (correctOption === index) setCorrectOption(0);
    else if (correctOption > index) setCorrectOption(correctOption - 1);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      dispatch(addAlert({ title: 'Missing Title', message: 'Lesson title is required.', variant: 'warning' }));
      return;
    }

    if (type === 'quiz') {
      if (!quizQuestion.trim() || quizOptions.some(o => !o.trim())) {
        dispatch(addAlert({ title: 'Invalid Quiz', message: 'Question and all options must be filled.', variant: 'warning' }));
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
        const quizPayload = {
          lesson_id: lessonIdToUse,
          question: quizQuestion,
          options: quizOptions,
          correct_option_index: correctOption
        };

        if (!lesson) {
          await supabase.from('fhhf_quizzes').insert(quizPayload);
        } else {
          // It could exist or not exist yet if they switched types, but normally we assume it does if it was a quiz
          const { data: existing } = await supabase.from('fhhf_quizzes').select('id').eq('lesson_id', lessonIdToUse).single();
          if (existing) {
            await supabase.from('fhhf_quizzes').update(quizPayload).eq('lesson_id', lessonIdToUse);
          } else {
            await supabase.from('fhhf_quizzes').insert(quizPayload);
          }
        }
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
        <div className="bg-light p-3 rounded border mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-dark">Question</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="What is..." 
              value={quizQuestion} 
              onChange={(e) => setQuizQuestion(e.target.value)} 
            />
          </Form.Group>

          <Form.Label className="fw-bold text-dark">Options (Select the correct one)</Form.Label>
          {quizOptions.map((opt, i) => (
            <div key={i} className="d-flex align-items-center gap-2 mb-2">
              <Form.Check 
                type="radio" 
                name="correctOption" 
                checked={correctOption === i} 
                onChange={() => setCorrectOption(i)}
              />
              <Form.Control 
                type="text" 
                value={opt} 
                onChange={(e) => handleOptionChange(i, e.target.value)} 
                placeholder={`Option ${i + 1}`}
              />
              {quizOptions.length > 2 && (
                <Button variant="link" className="text-danger p-0" onClick={() => handleRemoveOption(i)}>Remove</Button>
              )}
            </div>
          ))}
          <Button variant="link" className="text-primary p-0 fw-bold mt-2" onClick={handleAddOption}>+ Add Option</Button>
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
