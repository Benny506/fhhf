import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { BsCollectionPlay } from 'react-icons/bs';

export default function CoursesPage() {
  return (
    <div className="py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Card className="border-0 shadow-sm rounded-4 text-center p-5 max-w-lg mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Body className="py-5 my-4">
            <div className="mx-auto mb-4 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              <BsCollectionPlay size={32} className="text-primary" />
            </div>
            <h2 className="fw-bold text-dark mb-3" style={{ fontFamily: 'var(--font-family-heading)' }}>
              Courses Coming Soon
            </h2>
            <p className="text-muted mb-0 mx-auto fs-5">
              We are actively curating world-class courses to elevate your skills. Check back soon!
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
