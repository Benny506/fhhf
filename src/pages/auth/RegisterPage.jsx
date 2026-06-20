import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { BsEyeFill, BsEyeSlashFill, BsArrowRight } from 'react-icons/bs';
import Logo from '../../components/ui/Logo';
import supabase from '../../utils/supabase';
import { generateAndSendOtp } from '../../utils/authServices';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showAppLoader('Creating your account...'));
    setError('');

    try {
      // 1. Check if user already exists
      const { data: existingUserId, error: rpcError } = await supabase.rpc('get_user_id_by_email', {
        p_email: formData.email
      });

      if (rpcError) throw rpcError;

      if (existingUserId) {
        throw new Error("An account with this email already exists. Please sign in.");
      }

      // 2. Generate and Send OTP
      try {
        await generateAndSendOtp(formData.email, formData.username, "Your FHHF Verification Code");
      } catch (error) {
        console.error("Email send error:", error);
        throw new Error("Failed to send verification email. Please try again.");
      }

      // 4. Navigate to OTP page
      navigate('/verify-otp', {
        state: {
          email: formData.email,
          username: formData.username,
          password: formData.password
        }
      });

    } catch (err) {
      console.error(err);
      const msg = err.message || 'An unexpected error occurred.';
      setError(msg);
      dispatch(addAlert({ title: 'Registration Failed', message: msg, variant: 'danger' }));
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
          style={{ maxWidth: '500px' }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-5">
            <Link to="/">
              <Logo size="md" variant="dark" />
            </Link>
            <h2 className="text-primary mt-4 fw-bold" style={{ fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.5px' }}>Join Our Community</h2>
            <p className="text-muted small">Create an account to track donations and events.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="border-0 rounded-3 small fw-bold">
                {error}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Username</Form.Label>
              <Form.Control
                type="text"
                required
                className="auth-input"
                placeholder="janedoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Email Address</Form.Label>
              <Form.Control
                type="email"
                required
                className="auth-input"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Password</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  required
                  className="auth-input pe-5"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="secondary"
                className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-3 border-0 text-primary fw-bold rounded-pill"
                style={{ fontSize: '1.1rem', backgroundColor: 'var(--color-secondary)' }}
              >
                Create Account
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In <BsArrowRight className="ms-1" /></Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
