import React, { useState } from 'react';
import { Card, Button, Form, Collapse } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp, BsPencil, BsTrash, BsPlusCircle, BsPlayCircle, BsFileText, BsQuestionCircle } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, addAlert, showConfirmModal } from '../../../../redux/slices/uiSlice';
import supabase from '../../../../utils/supabase';
import LessonBuilderModal from './LessonBuilderModal';
import ModuleSettings from './ModuleSettings';

export default function ModuleAccordion({ module, lessons, onRefresh, index }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(module.title);
  
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderType, setBuilderType] = useState('text'); // 'video', 'text', 'quiz'
  const [editingLesson, setEditingLesson] = useState(null);

  const handleSaveTitle = async () => {
    if (!title.trim() || title === module.title) {
      setIsEditingTitle(false);
      setTitle(module.title);
      return;
    }
    
    dispatch(showSubtleLoader('Saving module...'));
    try {
      const { error } = await supabase
        .from('fhhf_course_modules')
        .update({ title: title.trim() })
        .eq('id', module.id);
      
      if (error) throw error;
      setIsEditingTitle(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Error', message: 'Failed to update module title.', variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  const handleDeleteModule = () => {
    dispatch(showConfirmModal({
      title: 'Delete Module',
      message: `Are you sure you want to delete "${module.title}"? All lessons inside will be permanently deleted.`,
      variant: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        dispatch(showSubtleLoader('Deleting module...'));
        try {
          const { error } = await supabase.from('fhhf_course_modules').delete().eq('id', module.id);
          if (error) throw error;
          onRefresh();
        } catch (err) {
          console.error(err);
          dispatch(addAlert({ title: 'Error', message: 'Failed to delete module.', variant: 'danger' }));
        } finally {
          dispatch(hideSubtleLoader());
        }
      }
    }));
  };

  const handleDeleteLesson = (lessonId, lessonTitle) => {
    dispatch(showConfirmModal({
      title: 'Delete Lesson',
      message: `Are you sure you want to delete "${lessonTitle}"?`,
      variant: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        dispatch(showSubtleLoader('Deleting lesson...'));
        try {
          const { error } = await supabase.from('fhhf_course_lessons').delete().eq('id', lessonId);
          if (error) throw error;
          onRefresh();
        } catch (err) {
          console.error(err);
          dispatch(addAlert({ title: 'Error', message: 'Failed to delete lesson.', variant: 'danger' }));
        } finally {
          dispatch(hideSubtleLoader());
        }
      }
    }));
  };

  const openBuilder = (type, lesson = null) => {
    setBuilderType(type);
    setEditingLesson(lesson);
    setShowBuilder(true);
  };

  const getLessonIcon = (type) => {
    switch(type) {
      case 'video': return <BsPlayCircle className="text-primary me-3" size={20} />;
      case 'quiz': return <BsQuestionCircle className="text-warning me-3" size={20} />;
      default: return <BsFileText className="text-info me-3" size={20} />;
    }
  };

  return (
    <Card className="border shadow-sm rounded-4 overflow-hidden mb-3">
      {/* Header */}
      <div className="bg-light p-3 d-flex align-items-center justify-content-between border-bottom cursor-pointer">
        <div className="d-flex align-items-center flex-grow-1">
          <Button variant="link" className="text-dark p-0 me-3" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <BsChevronUp /> : <BsChevronDown />}
          </Button>
          
          {isEditingTitle ? (
            <Form.Control 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSaveTitle() }}
              autoFocus
              className="fw-bold bg-white"
              style={{ maxWidth: '400px' }}
            />
          ) : (
            <span className="fw-bold m-0" onClick={() => setIsEditingTitle(true)} style={{ cursor: 'text' }}>
              {module.title}
            </span>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button variant="link" className="text-muted p-0" onClick={() => setIsEditingTitle(!isEditingTitle)}>
            <BsPencil size={16} />
          </Button>
          <Button variant="link" className="text-danger p-0" onClick={handleDeleteModule}>
            <BsTrash size={16} />
          </Button>
        </div>
      </div>

      {/* Body / Lessons List */}
      <Collapse in={isOpen}>
        <div>
          <ModuleSettings module={module} onRefresh={onRefresh} />
          <Card.Body className="p-0">
            {lessons.length === 0 ? (
              <div className="p-4 text-center text-muted small">
                No lessons added yet.
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="list-group-item px-4 py-3 d-flex align-items-center justify-content-between bg-white hover-bg-light transition-all">
                    <div className="d-flex align-items-center">
                      {getLessonIcon(lesson.content_type)}
                      <span className="fw-medium">{lesson.title}</span>
                    </div>
                    <div className="d-flex gap-3">
                      <Button variant="link" className="text-primary p-0 text-decoration-none small fw-bold" onClick={() => openBuilder(lesson.content_type, lesson)}>
                        Edit
                      </Button>
                      <Button variant="link" className="text-danger p-0 text-decoration-none small fw-bold" onClick={() => handleDeleteLesson(lesson.id, lesson.title)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Lesson Action Buttons */}
            <div className="p-3 bg-white border-top d-flex gap-2 justify-content-end">
              <Button variant="outline-primary" size="sm" className="rounded-pill fw-bold" onClick={() => openBuilder('video')}>
                + Video
              </Button>
              <Button variant="outline-info" size="sm" className="rounded-pill fw-bold" onClick={() => openBuilder('text')}>
                + Article
              </Button>
              <Button variant="outline-warning" size="sm" className="rounded-pill fw-bold" onClick={() => openBuilder('quiz')}>
                + Quiz
              </Button>
            </div>
          </Card.Body>
        </div>
      </Collapse>

      {/* Inline Modals for creating lessons */}
      <LessonBuilderModal 
        show={showBuilder} 
        onHide={() => setShowBuilder(false)} 
        moduleId={module.id} 
        lesson={editingLesson}
        type={builderType}
        orderIndex={lessons.length}
        onSave={() => {
          setShowBuilder(false);
          onRefresh();
        }}
      />
    </Card>
  );
}
