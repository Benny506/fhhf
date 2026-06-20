import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getUiState } from '../../redux/slices/uiSlice';
import Logo from './Logo';

export default function AppLoader() {
  const { isActive, label } = useSelector(state => getUiState(state).appLoader);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0, 31, 84, 0.95)', zIndex: 99990 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          aria-busy="true"
          aria-live="polite"
        >
          <div className="text-center" style={{ color: 'var(--color-secondary)' }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-4"
            >
              <Logo iconSize={80} showWordmark={false} />
            </motion.div>
            <h3 style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--color-white)', fontWeight: '600' }}>
              Freedom Haute
            </h3>
            <p 
              className="mt-2" 
              style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--color-secondary)' }}
            >
              {label || 'Loading...'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
