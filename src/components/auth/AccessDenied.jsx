import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BsShieldLockFill } from 'react-icons/bs';
import Logo from '../ui/Logo';

export default function AccessDenied() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      {/* Decorative Blur */}
      <div className="position-absolute" style={{ top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }} />
      <div className="position-absolute" style={{ bottom: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />

      <div className="container position-relative z-1 d-flex justify-content-center w-100">
        <motion.div 
          className="bg-white bg-opacity-75 rounded-4 p-5 w-100 text-center shadow-sm"
          style={{ maxWidth: '500px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,31,84,0.1)' }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-4 d-inline-flex align-items-center justify-content-center bg-light text-danger rounded-circle shadow-sm" style={{ width: '80px', height: '80px' }}>
            <BsShieldLockFill size={40} />
          </div>
          <h2 className="text-primary fw-bold mb-3" style={{ fontFamily: 'var(--font-family-heading)' }}>Access Denied</h2>
          <p className="text-muted mb-5">You need to be signed in to view this page. Please log in to your account to continue.</p>
          
          <div className="d-flex flex-column gap-3">
            <Link to="/login" className="btn btn-primary py-3 fw-bold rounded-pill shadow-sm" style={{ backgroundColor: 'var(--color-primary)', border: 'none' }}>
              Sign In to Your Account
            </Link>
            <Link to="/" className="btn btn-link text-secondary text-decoration-none fw-bold">
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
