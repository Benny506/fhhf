import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { authBootstrapper } from '../../utils/authBootstrapper';
import { BsEyeFill, BsEyeSlashFill, BsArrowRight } from 'react-icons/bs';
import Logo from '../../components/ui/Logo';
import supabase from '../../utils/supabase';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showAppLoader('Signing in...'));
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const bootRes = await authBootstrapper(dispatch);
      if (!bootRes.success) {
        if (bootRes.reason === 'no_profile') {
          navigate('/complete-profile');
          return;
        }
        throw new Error("Failed to establish a secure session.");
      }

      dispatch(addAlert({ title: 'Welcome Back!', message: 'Signed in successfully.', variant: 'success' }));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const msg = err.message || "Invalid login credentials.";
      setError(msg);
      dispatch(addAlert({ title: 'Sign In Failed', message: msg, variant: 'danger' }));
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
            <h2 className="text-primary mt-4 fw-bold" style={{ fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.5px' }}>Welcome Back</h2>
            <p className="text-muted small">Sign in to your FHHF account to continue.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="border-0 rounded-3 small fw-bold text-center">
                {error}
              </Alert>
            )}

            <Form.Group className="mb-4">
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

            <Form.Group className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest m-0" style={{ letterSpacing: '1px' }}>Password</Form.Label>
                <Link to="/forgot-password" className="text-secondary small text-decoration-none fw-bold">Forgot password?</Link>
              </div>
              <div className="position-relative">
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="auth-input pe-5" 
                  placeholder="••••••••" 
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

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-3 border-0 text-white fw-bold rounded-pill"
                style={{ fontSize: '1.1rem', backgroundColor: 'var(--color-primary)' }}
              >
                Sign In
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary text-decoration-none fw-bold">Create one <BsArrowRight className="ms-1" /></Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
