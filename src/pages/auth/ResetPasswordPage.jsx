import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Logo from '../../components/ui/Logo';
import supabase, { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../utils/supabase';
import { generateAndSendOtp } from '../../utils/authServices';
import axios from 'axios';
import './Auth.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Protect route
  if (!state?.email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input only if a number was entered
    if (element.value) {
      const nextDiv = element.parentElement.nextElementSibling;
      if (nextDiv) {
        const nextInput = nextDiv.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index]) {
      const prevDiv = e.target.parentElement.previousElementSibling;
      if (prevDiv) {
        const prevInput = prevDiv.querySelector('input');
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      const prevDiv = e.target.parentElement.previousElementSibling;
      if (prevDiv) {
        const prevInput = prevDiv.querySelector('input');
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === 'ArrowRight') {
      const nextDiv = e.target.parentElement.nextElementSibling;
      if (nextDiv) {
        const nextInput = nextDiv.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleResend = async () => {
    dispatch(showAppLoader('Sending new code...'));
    setError('');

    try {
      await generateAndSendOtp(state.email, "User", "FHHF Password Reset Code");
      dispatch(addAlert({ title: 'Code Sent', message: 'A new verification code has been sent to your email.', variant: 'success' }));
    } catch (err) {
      console.error("Resend error:", err);
      dispatch(addAlert({ title: 'Resend Failed', message: "Failed to send a new code. Please try again.", variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const code = otp.join('');
    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    dispatch(showAppLoader('Resetting password...'));
    setError('');

    try {
      // Call edge function to verify OTP and reset password atomically
      const { error: resetError } = await supabase.functions.invoke('reset-fhhf-password', {
        body: {
          email: state.email,
          otpCode: code,
          password: password
        }
      });

      if (resetError) {
        console.error("Reset error:", resetError);
        throw new Error(resetError.message || "An error occurred while resetting your password.");
      }

      dispatch(addAlert({ title: 'Success', message: 'Password reset successfully. Please sign in.', variant: 'success' }));
      navigate('/login', { replace: true });

    } catch (err) {
      console.error(err);
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      dispatch(addAlert({ title: 'Reset Failed', message: msg, variant: 'danger' }));
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
            <h2 className="text-primary mt-4 fw-bold" style={{ fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.5px' }}>Reset Password</h2>
            <p className="text-muted small">Enter the 6-digit code sent to your email along with your new password.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="border-0 rounded-3 small fw-bold text-center">
                {error}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Verification Code</Form.Label>
              <div className="d-flex justify-content-center gap-2 gap-md-3">
                {otp.map((data, index) => {
                  return (
                    <div
                      key={index}
                      style={{ width: '15%', maxWidth: '60px' }}
                    >
                      <Form.Control
                        className="w-100 auth-input otp-input text-center fw-bold"
                        style={{
                          height: '60px',
                          fontSize: '1.5rem',
                          boxShadow: 'none',
                          borderRadius: '12px'
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="otp"
                        maxLength="1"
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onFocus={e => e.target.select()}
                      />
                    </div>
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-4 mt-4">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>New Password</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="auth-input pe-5" 
                  placeholder="Enter new password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-primary text-decoration-none p-0 pe-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: 10, opacity: 0.6 }}
                >
                  {showPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
                </button>
              </div>
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Confirm Password</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="auth-input pe-5" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </Form.Group>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-3 border-0 text-white fw-bold rounded-pill"
                style={{ fontSize: '1.1rem', backgroundColor: 'var(--color-primary)' }}
              >
                Reset Password
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Didn't receive the code?{' '}
              <button 
                className="btn btn-link p-0 text-secondary text-decoration-none fw-bold" 
                type="button"
                onClick={handleResend}
              >
                Resend Code
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
