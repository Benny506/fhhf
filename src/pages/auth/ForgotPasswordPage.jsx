import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { BsArrowLeft } from 'react-icons/bs';
import Logo from '../../components/ui/Logo';
import supabase from '../../utils/supabase';
import { generateAndSendOtp } from '../../utils/authServices';
import './Auth.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showAppLoader('Sending reset link...'));
    setError('');
    
    try {
      // 1. Check if email exists
      const { data: userId, error: rpcError } = await supabase.rpc('get_user_id_by_email', { p_email: email });
      if (rpcError) throw rpcError;

      if (!userId) {
        throw new Error("You are not registered on this platform.");
      }

      // 2. Send OTP
      await generateAndSendOtp(email, "User", "FHHF Password Reset Code");

      // 3. Navigate
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      console.error(err);
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      dispatch(addAlert({ title: 'Request Failed', message: msg, variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className="auth-page-wrapper d-flex align-items-center justify-content-center position-relative overflow-hidden min-vh-100 py-5">
      {/* Decorative Blur */}
      <div className="position-absolute" style={{ top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }} />
      <div className="position-absolute" style={{ bottom: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />

      <div className="container position-relative z-1 d-flex justify-content-center w-100">
        <motion.div 
          className="auth-glass-card rounded-4 p-4 p-md-5 w-100"
          style={{ maxWidth: '450px' }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-5">
            <Link to="/">
              <Logo size="md" variant="dark" />
            </Link>
            <h2 className="text-primary mt-4 fw-bold" style={{ fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.5px' }}>Forgot Password</h2>
            <p className="text-muted small">Enter your email address and we'll send you a code to reset your password.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="border-0 rounded-3 small fw-bold">
                {error}
              </Alert>
            )}

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Email Address</Form.Label>
              <Form.Control 
                type="email" 
                required 
                className="auth-input" 
                placeholder="jane@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-3 border-0 text-white fw-bold rounded-pill"
                style={{ fontSize: '1.1rem', backgroundColor: 'var(--color-primary)' }}
              >
                Send Reset Link
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-4">
            <Link to="/login" className="text-muted text-decoration-none small d-inline-flex align-items-center gap-2 hover-text-primary transition-colors">
              <BsArrowLeft /> Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
