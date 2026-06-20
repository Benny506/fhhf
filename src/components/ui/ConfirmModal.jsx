import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUiState, hideConfirmModal } from '../../redux/slices/uiSlice';
import { BsExclamationTriangle, BsInfoCircle, BsTrash } from 'react-icons/bs';

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, title, message, variant, confirmText, cancelText, onConfirm, onCancel } = useSelector(state => getUiState(state).confirmModal);

  const handleClose = () => {
    if (onCancel) onCancel();
    dispatch(hideConfirmModal());
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch(hideConfirmModal());
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger': return <BsTrash size={32} />;
      case 'warning': return <BsExclamationTriangle size={32} />;
      default: return <BsInfoCircle size={32} />;
    }
  };

  const getAccentColor = () => {
    switch (variant) {
      case 'danger': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-primary)';
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered backdrop="static" contentClassName="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '1rem' }}>
      <div className="bg-white p-5 text-center rounded-4">
        <div 
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
          style={{ width: '80px', height: '80px', backgroundColor: `rgba(0, 31, 84, 0.05)`, color: getAccentColor() }}
        >
          {getIcon()}
        </div>
        
        <h4 className="mb-3" style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--color-primary)' }}>
          {title || 'Please Confirm'}
        </h4>
        
        <p className="mb-4 text-secondary" style={{ fontSize: '0.95rem' }}>
          {message || 'Are you sure you want to proceed?'}
        </p>
        
        <div className="d-flex gap-3 justify-content-center mt-2">
          <Button 
            variant="light" 
            className="rounded-pill px-4 text-secondary" 
            onClick={handleClose}
            style={{ border: '1px solid var(--color-border)' }}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            className="rounded-pill px-4" 
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
