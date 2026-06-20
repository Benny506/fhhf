import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

export default function NotFoundPage() {
  return (
    <div className="py-5 bg-light" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container className="text-center">
        <h1 className="fw-bold text-primary display-1" style={{ fontFamily: 'var(--font-family-heading)' }}>404</h1>
        <h3 className="fw-bold text-dark mb-3">Page Not Found</h3>
        <p className="text-muted mb-5 max-w-md mx-auto fs-5" style={{ maxWidth: '500px' }}>
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Button as={Link} to="/" variant="primary" className="rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2">
          <BsArrowLeft /> Back to Home
        </Button>
      </Container>
    </div>
  );
}
