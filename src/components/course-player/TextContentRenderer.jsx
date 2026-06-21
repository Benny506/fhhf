import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function TextContentRenderer({ lesson, onComplete, isCompleted }) {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <Card.Body className="p-4 p-md-5">
        <h3 className="fw-bold mb-4">{lesson.title}</h3>
        <div
          className="ql-editor content-rich text-dark mb-5"
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: lesson.text_content }}
        />
        
        <hr className="my-5" />
        
        <div className="d-flex justify-content-center">
          <Button 
            variant={isCompleted ? "success" : "primary"} 
            size="lg" 
            className="rounded-pill px-5 fw-bold shadow-sm d-flex align-items-center gap-2 hover-scale"
            onClick={() => onComplete()}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <>
                <BsCheckCircleFill /> Completed
              </>
            ) : (
              'Mark as Complete & Continue'
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
