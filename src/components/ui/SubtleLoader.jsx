import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getUiState } from '../../redux/slices/uiSlice';

export default function SubtleLoader() {
  const { isActive, label } = useSelector(state => getUiState(state).subtleLoader);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm rounded-pill d-flex align-items-center gap-3 px-4 py-2"
          style={{ backgroundColor: 'var(--color-white)', zIndex: 99995, border: '1px solid var(--color-border)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid rgba(0, 31, 84, 0.2)', 
              borderTopColor: 'var(--color-primary)', 
              borderRadius: '50%' 
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500 }}>
            {label || 'Processing...'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
