import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTopbarConfig, showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { setProfile } from '../../redux/slices/authSlice';
import { Card, Form, Button } from 'react-bootstrap';
import supabase from '../../utils/supabase';

export default function UserSettings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);

  const [username, setUsername] = useState('');

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'Settings',
      description: 'Manage your account preferences and details',
    }));
  }, [dispatch]);

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      dispatch(addAlert({ title: 'Validation Error', message: 'Username cannot be empty.', variant: 'warning' }));
      return;
    }

    if (username.trim() === profile?.username) {
      // No changes made
      dispatch(addAlert({ title: 'No Changes', message: 'No changes were made to your profile.', variant: 'info' }));
      return;
    }

    dispatch(showAppLoader('Saving changes...'));

    try {
      const { data, error } = await supabase
        .from('fhhf_user_profiles')
        .update({ username: username.trim() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update Redux state
      dispatch(setProfile(data));
      dispatch(addAlert({ title: 'Success', message: 'Profile updated successfully.', variant: 'success' }));
    } catch (err) {
      console.error('Update profile error:', err);
      dispatch(addAlert({ title: 'Update Failed', message: err.message || 'Failed to update profile.', variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4 p-md-5">
          <h5 className="fw-bold text-primary mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>Personal Information</h5>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Username</Form.Label>
              <Form.Control 
                type="text" 
                className="bg-light border-0 py-2 px-3 rounded-3" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Email Address</Form.Label>
              <Form.Control 
                type="email" 
                className="bg-light border-0 py-2 px-3 rounded-3" 
                value={user?.email || ''} 
                disabled 
              />
              <Form.Text className="text-muted">
                Your email address cannot be changed directly.
              </Form.Text>
            </Form.Group>

            <Button type="submit" variant="primary" className="fw-bold px-4 py-2 rounded-pill">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
