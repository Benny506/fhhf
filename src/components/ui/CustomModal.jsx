import React from 'react';
import { Modal } from 'react-bootstrap';

/**
 * Custom wrapper for React-Bootstrap Modal to ensure uniform styling 
 * and fix Lenis scrolling issues inside modals.
 */
export default function CustomModal({ 
  show, 
  onHide, 
  title, 
  children, 
  footer, 
  size = 'lg',
  backdrop = 'static',
  keyboard = false
}) {
  return (
    <Modal show={show} onHide={onHide} size={size} backdrop={backdrop} keyboard={keyboard} scrollable>
      {title && (
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title className="fw-bold text-primary fs-5">
            {title}
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="p-4" data-lenis-prevent>
        {children}
      </Modal.Body>
      {footer && (
        <Modal.Footer className="border-top bg-light">
          {footer}
        </Modal.Footer>
      )}
    </Modal>
  );
}
