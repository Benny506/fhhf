import React, { useState, useRef } from 'react';
import { Button, Form, Collapse, Image, Row, Col, Badge } from 'react-bootstrap';
import { BsGear, BsPersonPlus, BsImage, BsTrash, BsCameraVideo } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, addAlert, showAppLoader, hideAppLoader } from '../../../../redux/slices/uiSlice';
import supabase from '../../../../utils/supabase';
import { optimizeImg } from '../../../../utils/imageOptimizer';

export default function ModuleSettings({ module, onRefresh }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);

  // Parse existing JSONB defaults
  const [contributors, setContributors] = useState(module.contributors || []);
  const [previewMedia, setPreviewMedia] = useState(module.preview_media || { images: [], video_url: '' });

  // Contributor Form State
  const [showAddContributor, setShowAddContributor] = useState(false);
  const [contribName, setContribName] = useState('');
  const [contribRole, setContribRole] = useState('');
  const [contribDesc, setContribDesc] = useState('');
  const [contribImage, setContribImage] = useState('');

  const contribFileInputRef = useRef(null);
  const mediaFileInputRef = useRef(null);

  const saveModuleSettings = async (newContributors, newPreviewMedia) => {
    dispatch(showSubtleLoader('Saving module settings...'));
    try {
      const { error } = await supabase
        .from('fhhf_course_modules')
        .update({
          contributors: newContributors,
          preview_media: newPreviewMedia
        })
        .eq('id', module.id);
      
      if (error) throw error;
      onRefresh();
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Error', message: 'Failed to update module settings.', variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  const handleAddContributor = () => {
    if (!contribName || !contribRole) {
      dispatch(addAlert({ title: 'Missing fields', message: 'Name and role are required.', variant: 'warning' }));
      return;
    }

    const newContrib = {
      name: contribName,
      role: contribRole,
      description: contribDesc,
      profile_image_url: contribImage
    };

    const updated = [...contributors, newContrib];
    setContributors(updated);
    saveModuleSettings(updated, previewMedia);

    // Reset
    setContribName('');
    setContribRole('');
    setContribDesc('');
    setContribImage('');
    setShowAddContributor(false);
  };

  const handleRemoveContributor = (index) => {
    const updated = contributors.filter((_, i) => i !== index);
    setContributors(updated);
    saveModuleSettings(updated, previewMedia);
  };

  const handleAddVideo = () => {
    const url = prompt("Enter the video URL (e.g. YouTube/Vimeo):");
    if (url !== null) {
      const updatedMedia = { ...previewMedia, video_url: url };
      setPreviewMedia(updatedMedia);
      saveModuleSettings(contributors, updatedMedia);
    }
  };

  const handleRemoveVideo = () => {
    const updatedMedia = { ...previewMedia, video_url: '' };
    setPreviewMedia(updatedMedia);
    saveModuleSettings(contributors, updatedMedia);
  };

  const handleRemovePreviewImage = (index) => {
    const updatedImages = previewMedia.images.filter((_, i) => i !== index);
    const updatedMedia = { ...previewMedia, images: updatedImages };
    setPreviewMedia(updatedMedia);
    saveModuleSettings(contributors, updatedMedia);
  };

  // Generic Image Uploader (handles both Contributor Profile and Preview Images)
  const handleImageUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (type === 'preview') {
      if (previewMedia.images.length + files.length > 5) {
        dispatch(addAlert({ title: 'Limit Reached', message: 'You can only upload up to 5 preview images in total.', variant: 'warning' }));
        if (e.target) e.target.value = '';
        return;
      }
    } else {
      // Only process the first file for contributor
      files.length = 1;
    }

    dispatch(showAppLoader(`Optimizing and uploading image${files.length > 1 ? 's' : ''}...`));
    try {
      const ONE_MB = 1024 * 1024;
      let newPreviewUrls = [];
      let newContribUrl = '';

      for (let rawFile of files) {
        const file = await optimizeImg(rawFile);

        // STRICT 1MB CHECK AFTER OPTIMIZATION
        if (file.size > ONE_MB) {
          throw new Error(`Image ${rawFile.name} is too large (${(file.size / ONE_MB).toFixed(2)} MB). Maximum allowed size is 1 MB.`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('fhhf_course_assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('fhhf_course_assets')
          .getPublicUrl(filePath);

        if (type === 'preview') {
          newPreviewUrls.push(data.publicUrl);
        } else {
          newContribUrl = data.publicUrl;
        }
      }

      if (type === 'contributor') {
        setContribImage(newContribUrl);
      } else if (type === 'preview') {
        const updatedImages = [...previewMedia.images, ...newPreviewUrls];
        const updatedMedia = { ...previewMedia, images: updatedImages };
        setPreviewMedia(updatedMedia);
        await saveModuleSettings(contributors, updatedMedia);
      }

      dispatch(addAlert({ title: 'Success', message: `Image${files.length > 1 ? 's' : ''} uploaded.`, variant: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Upload Failed', message: err.message, variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="bg-light border-bottom p-3">
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold text-muted small text-uppercase tracking-widest">
          Module Configuration
        </span>
        <Button variant="outline-secondary" size="sm" onClick={() => setIsOpen(!isOpen)} className="d-flex align-items-center gap-2 rounded-pill">
          <BsGear /> {isOpen ? 'Hide Settings' : 'Configure Module'}
        </Button>
      </div>

      <Collapse in={isOpen}>
        <div className="mt-3 pt-3 border-top">
          
          {/* Contributors Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Contributors & Instructors</h6>
              <Button variant="link" size="sm" className="text-decoration-none" onClick={() => setShowAddContributor(!showAddContributor)}>
                <BsPersonPlus className="me-1" /> Add Contributor
              </Button>
            </div>
            
            {contributors.map((contrib, idx) => (
              <div key={idx} className="d-flex align-items-center p-2 mb-2 bg-white rounded border">
                {contrib.profile_image_url ? (
                  <Image src={contrib.profile_image_url} roundedCircle style={{ width: 40, height: 40, objectFit: 'cover' }} className="me-3" />
                ) : (
                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{ width: 40, height: 40 }}>
                    {contrib.name.charAt(0)}
                  </div>
                )}
                <div className="flex-grow-1">
                  <div className="fw-bold">{contrib.name} <Badge bg="light" text="dark" className="ms-2 border fw-normal">{contrib.role}</Badge></div>
                  {contrib.description && <div className="text-muted small">{contrib.description}</div>}
                </div>
                <Button variant="link" className="text-danger p-0" onClick={() => handleRemoveContributor(idx)}>
                  <BsTrash />
                </Button>
              </div>
            ))}

            {showAddContributor && (
              <div className="p-3 bg-white border rounded shadow-sm mt-2">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small fw-bold">Name</Form.Label>
                      <Form.Control size="sm" value={contribName} onChange={e => setContribName(e.target.value)} placeholder="John Doe" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small fw-bold">Role</Form.Label>
                      <Form.Control size="sm" value={contribRole} onChange={e => setContribRole(e.target.value)} placeholder="e.g. Co-Instructor, Editor" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small fw-bold">Description (Optional)</Form.Label>
                      <Form.Control size="sm" as="textarea" rows={2} value={contribDesc} onChange={e => setContribDesc(e.target.value)} placeholder="How did they contribute?" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Label className="small fw-bold">Profile Image (Optional)</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      {contribImage && <Image src={contribImage} roundedCircle style={{ width: 40, height: 40, objectFit: 'cover' }} />}
                      <Button variant="outline-primary" size="sm" onClick={() => contribFileInputRef.current?.click()}>
                        Upload Profile Pic
                      </Button>
                      <input type="file" ref={contribFileInputRef} className="d-none" accept="image/*" onChange={(e) => handleImageUpload(e, 'contributor')} />
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3 gap-2">
                  <Button variant="light" size="sm" onClick={() => setShowAddContributor(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleAddContributor}>Save Contributor</Button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Media Section */}
          <div className="mb-2">
            <h6 className="fw-bold mb-2">Module Preview Media</h6>
            <p className="text-muted small mb-3">Depict what students will achieve by the end of this module. (Max 5 images OR 1 video)</p>

            {previewMedia.video_url ? (
              <div className="p-3 bg-white border rounded d-flex align-items-center justify-content-between">
                <div>
                  <BsCameraVideo className="text-primary me-2" />
                  <a href={previewMedia.video_url} target="_blank" rel="noreferrer" className="small fw-medium">{previewMedia.video_url}</a>
                </div>
                <Button variant="link" className="text-danger p-0" onClick={handleRemoveVideo}><BsTrash /></Button>
              </div>
            ) : (
              <div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {previewMedia.images.map((img, idx) => (
                    <div key={idx} className="position-relative border rounded" style={{ width: '80px', height: '80px' }}>
                      <Image src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="rounded" />
                      <Button variant="danger" size="sm" className="position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center" style={{ width: 20, height: 20, transform: 'translate(30%, -30%)' }} onClick={() => handleRemovePreviewImage(idx)}>
                        <BsTrash size={10} />
                      </Button>
                    </div>
                  ))}
                  
                  {previewMedia.images.length < 5 && (
                    <Button variant="outline-secondary" className="d-flex flex-column align-items-center justify-content-center border-dashed bg-white" style={{ width: '80px', height: '80px', borderStyle: 'dashed' }} onClick={() => mediaFileInputRef.current?.click()}>
                      <BsImage size={20} className="mb-1" />
                      <span style={{ fontSize: '10px' }}>Add Image</span>
                    </Button>
                  )}
                  <input type="file" ref={mediaFileInputRef} className="d-none" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'preview')} />
                </div>
                
                {previewMedia.images.length === 0 && (
                  <Button variant="outline-primary" size="sm" onClick={handleAddVideo} className="mt-1">
                    <BsCameraVideo className="me-2" /> Add Preview Video URL Instead
                  </Button>
                )}
              </div>
            )}
          </div>

        </div>
      </Collapse>
    </div>
  );
}
