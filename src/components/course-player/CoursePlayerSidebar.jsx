import React from 'react';
import { Accordion } from 'react-bootstrap';
import { BsCheckCircleFill, BsPlayCircle, BsListTask, BsFileText, BsMusicNoteBeamed, BsQuestionCircle } from 'react-icons/bs';

const getLessonIcon = (type) => {
  switch (type) {
    case 'video': return <BsPlayCircle className="text-primary" />;
    case 'audio': return <BsMusicNoteBeamed className="text-info" />;
    case 'text': return <BsFileText className="text-secondary" />;
    case 'quiz': return <BsListTask className="text-warning" />;
    default: return <BsQuestionCircle />;
  }
};

export default function CoursePlayerSidebar({ modules, activeLesson, completedLessons, onLessonSelect, onMobileSelect }) {
  if (!modules || !modules.length) return null;

  return (
    <Accordion defaultActiveKey={modules.findIndex(m => m.id === activeLesson?.module_id)?.toString() || "0"} flush className="custom-accordion">
      {modules.map((module, mIdx) => (
        <Accordion.Item eventKey={mIdx.toString()} key={module.id}>
          <Accordion.Header className="bg-light px-3 py-2 fw-bold text-dark border-bottom">
            <div className="d-flex flex-column pe-3 w-100">
              <span className="small text-muted mb-1 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Module {mIdx + 1}</span>
              <span className="fw-bold">{module.title}</span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="p-0">
            <div className="list-group list-group-flush">
              {module.lessons.map((lesson, lIdx) => {
                const isActive = activeLesson?.id === lesson.id;
                const isDone = completedLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex gap-3 align-items-start transition-all ${isActive ? 'bg-primary bg-opacity-10' : ''}`}
                    onClick={() => {
                      onLessonSelect(lesson);
                      if (onMobileSelect) onMobileSelect();
                    }}
                  >
                    <div className="mt-1">
                      {isDone ? (
                        <BsCheckCircleFill className="text-success" size={18} />
                      ) : (
                        <div className="rounded-circle border border-2 border-secondary opacity-50" style={{ width: '18px', height: '18px' }}></div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className={`fw-medium mb-1 ${isActive ? 'text-light' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                        {lIdx + 1}. {lesson.title}
                      </div>
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        {getLessonIcon(lesson.content_type)}
                        <span className="text-capitalize">{lesson.content_type}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
