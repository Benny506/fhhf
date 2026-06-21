import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { authBootstrapper } from '../../utils/authBootstrapper';
import supabase from '../../utils/supabase';
import Logo from '../../components/ui/Logo';
import './Auth.css';

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    // Make sure we actually have an active session!
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setSessionUser(session.user);
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionUser) return;

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    dispatch(showAppLoader('Setting up your profile...'));
    setError('');

    try {
      // 1. Insert into fhhf_user_profiles
      const { error: insertError } = await supabase
        .from('fhhf_user_profiles')
        .insert({
          id: sessionUser.id,
          username: username.trim()
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('This username is already taken. Please choose another one.');
        }
        throw insertError;
      }

      // 2. Profile created! Re-run bootstrapper to hydrate redux state
      const bootRes = await authBootstrapper(dispatch);
      if (!bootRes.success) {
        throw new Error('Profile created, but failed to establish session. Please login again.');
      }

      // 3. Success!
      dispatch(addAlert({ title: 'Welcome!', message: 'Your profile has been created.', variant: 'success' }));
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      const msg = err.message || 'Failed to create profile. Please try again.';
      setError(msg);
      dispatch(addAlert({ title: 'Profile Creation Failed', message: msg, variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  if (!sessionUser) return null;

  return (
    <div className="auth-page-wrapper d-flex align-items-center justify-content-center position-relative overflow-hidden min-vh-100 py-5">
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
            <Logo size="md" variant="dark" />
            <h2 className="text-primary mt-4 fw-bold" style={{ fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.5px' }}>Almost There!</h2>
            <p className="text-muted small">Choose a username to complete your profile and start learning.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="border-0 rounded-3 small fw-bold text-center">
                {error}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>Username</Form.Label>
              <Form.Control 
                type="text" 
                required 
                className="auth-input" 
                placeholder="e.g. creative_genius" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-3 border-0 text-white fw-bold rounded-pill mt-5"
                style={{ fontSize: '1.1rem', backgroundColor: 'var(--color-primary)' }}
              >
                Complete Profile
              </Button>
            </motion.div>
          </Form>

        </motion.div>
      </div>
    </div>
  );
}
