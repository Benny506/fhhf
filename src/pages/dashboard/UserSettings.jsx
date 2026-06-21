import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTopbarConfig, showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import { setProfile } from '../../redux/slices/authSlice';
import { Card, Form, Button, Image } from 'react-bootstrap';
import supabase from '../../utils/supabase';
import { optimizeImg } from '../../utils/imageOptimizer';

export default function UserSettings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);

  const [username, setUsername] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [instructorPositionTitle, setInstructorPositionTitle] = useState('');
  const [instructorBio, setInstructorBio] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'Settings',
      description: 'Manage your account preferences and details',
    }));
  }, [dispatch]);

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setProfileImg(profile.profile_img || '');
      setInstructorPositionTitle(profile.instructor_position_title || '');
      setInstructorBio(profile.instructor_bio || '');
    }
  }, [profile]);

  const handleImageUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    dispatch(showAppLoader('Optimizing and uploading image...'));
    try {
      file = await optimizeImg(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fhhf_profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('fhhf_profiles')
        .getPublicUrl(filePath);

      const newImageUrl = data.publicUrl;
      setProfileImg(newImageUrl);

      // Save immediately to DB
      const { data: updatedProfile, error: dbError } = await supabase
        .from('fhhf_user_profiles')
        .update({ profile_img: newImageUrl })
        .eq('id', user.id)
        .select()
        .single();

      if (dbError) throw dbError;

      dispatch(setProfile(updatedProfile));
      dispatch(addAlert({ title: 'Upload Success', message: "Profile image updated successfully.", variant: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Upload Failed', message: err.message, variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      dispatch(addAlert({ title: 'Validation Error', message: 'Username cannot be empty.', variant: 'warning' }));
      return;
    }

    if (
      username.trim() === profile?.username && 
      profileImg === profile?.profile_img &&
      instructorPositionTitle.trim() === (profile?.instructor_position_title || '') &&
      instructorBio.trim() === (profile?.instructor_bio || '')
    ) {
      // No changes made
      dispatch(addAlert({ title: 'No Changes', message: 'No changes were made to your profile.', variant: 'info' }));
      return;
    }

    dispatch(showAppLoader('Saving changes...'));

    try {
      const { data, error } = await supabase
        .from('fhhf_user_profiles')
        .update({ 
          username: username.trim(), 
          profile_img: profileImg,
          instructor_position_title: instructorPositionTitle.trim(),
          instructor_bio: instructorBio.trim()
        })
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

  const initials = username ? username.substring(0, 2).toUpperCase() : (profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'U');

  return (
    <div style={{ maxWidth: '800px' }}>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4 p-md-5">
          <h5 className="fw-bold text-primary mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>Personal Information</h5>
          
          <div className="d-flex align-items-center gap-4 mb-5 border-bottom pb-4">
            <div className="position-relative">
              {profileImg ? (
                <Image src={profileImg} roundedCircle style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
              ) : (
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '80px', height: '80px', fontSize: '24px', fontWeight: 'bold' }}>
                  {initials}
                </div>
              )}
            </div>
            <div>
              <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()} className="rounded-pill px-4 btn-sm fw-bold">
                {profileImg ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="d-none" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <div className="text-muted small mt-2">Recommended: 256x256px. Max 2MB.</div>
            </div>
          </div>

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

            <hr className="my-5" style={{ opacity: 0.1 }} />

            <h5 className="fw-bold text-primary mb-2" style={{ fontFamily: 'var(--font-family-heading)' }}>Instructor Profile</h5>
            <p className="text-muted small mb-4">Set this ONLY if you have courses or intend to create courses.</p>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Position / Title</Form.Label>
              <Form.Control 
                type="text" 
                className="bg-light border-0 py-2 px-3 rounded-3" 
                placeholder="e.g. Senior Industry Professional" 
                value={instructorPositionTitle}
                onChange={(e) => setInstructorPositionTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Instructor Bio</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                className="bg-light border-0 py-2 px-3 rounded-3" 
                placeholder="An experienced professional dedicated to bringing world-class education..." 
                value={instructorBio}
                onChange={(e) => setInstructorBio(e.target.value)}
              />
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
