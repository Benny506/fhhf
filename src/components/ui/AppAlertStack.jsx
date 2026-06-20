import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getUiState, removeAlert } from '../../redux/slices/uiSlice';
import { BsCheckCircleFill, BsExclamationTriangleFill, BsInfoCircleFill, BsX } from 'react-icons/bs';

const AlertItem = ({ alert, getBorderColor, getIcon }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeAlert(alert.id));
    }, 5000);
    return () => clearTimeout(timer);
  }, [alert.id, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="mb-3 pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="bg-white shadow-sm p-3 rounded-3 d-flex align-items-start gap-3 position-relative"
        style={{ borderLeft: `4px solid ${getBorderColor(alert.variant)}` }}
      >
        <div className="mt-1">{getIcon(alert.variant)}</div>
        <div className="flex-grow-1 pe-4">
          {alert.title && <h6 className="mb-1" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{alert.title}</h6>}
          <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>{alert.message}</p>
        </div>
        <button 
          onClick={() => dispatch(removeAlert(alert.id))}
          className="btn btn-sm btn-link text-muted position-absolute top-0 end-0 p-2 text-decoration-none"
        >
          <BsX size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default function AppAlertStack() {
  const alerts = useSelector(state => getUiState(state).alerts);

  if (!alerts || alerts.length === 0) return null;

  const getIcon = (variant) => {
    switch (variant) {
      case 'success': return <BsCheckCircleFill size={20} className="text-success" />;
      case 'danger': return <BsExclamationTriangleFill size={20} className="text-danger" />;
      case 'warning': return <BsExclamationTriangleFill size={20} className="text-warning" />;
      default: return <BsInfoCircleFill size={20} className="text-primary" />;
    }
  };

  const getBorderColor = (variant) => {
    switch (variant) {
      case 'success': return 'var(--color-success)';
      case 'danger': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-primary)';
    }
  };

  const content = (
    <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 99999, width: '400px', maxWidth: '90vw', pointerEvents: 'none' }}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} getBorderColor={getBorderColor} getIcon={getIcon} />
        ))}
      </AnimatePresence>
    </div>
  );

  // Fallback if document.body isn't ready
  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
