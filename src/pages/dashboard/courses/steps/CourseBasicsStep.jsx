import React, { useState, useRef } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, showAppLoader, hideAppLoader, addAlert } from '../../../../redux/slices/uiSlice';
import supabase from '../../../../utils/supabase';
import { optimizeImg } from '../../../../utils/imageOptimizer';

export default function CourseBasicsStep({ course, setCourse, onNext }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState(course?.category || '');
  const [thumbnailImage, setThumbnailImage] = useState(course?.thumbnail_image || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url || '');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(course?.what_you_will_learn?.length ? course.what_you_will_learn : ['']);
  
  const handleAddLearningOutcome = () => {
    setWhatYouWillLearn([...whatYouWillLearn, '']);
  };

  const handleRemoveLearningOutcome = (index) => {
    const newItems = whatYouWillLearn.filter((_, i) => i !== index);
    setWhatYouWillLearn(newItems.length ? newItems : ['']);
  };

  const handleLearningOutcomeChange = (index, value) => {
    const newItems = [...whatYouWillLearn];
    newItems[index] = value;
    setWhatYouWillLearn(newItems);
  };
  
  const CATEGORY_SUGGESTIONS = [
    'Technology & Programming',
    'Web Development',
    'Mobile Development',
    'Data Science & AI',
    'Business & Entrepreneurship',
    'Marketing & Sales',
    'Design & Creativity',
    'UI/UX Design',
    'Graphic Design',
    'Personal Development',
    'Productivity & Time Management',
    'Leadership & Management',
    'Finance & Accounting',
    'Investing & Trading',
    'Health & Fitness',
    'Music & Audio',
    'Photography & Video',
    'Language Learning',
    'Teaching & Academics',
    'Lifestyle & Hobbies',
    'Engineering & Electronics'
  ];
  
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    dispatch(showAppLoader('Optimizing and uploading thumbnail...'));
    try {
      file = await optimizeImg(file);

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

      setThumbnailImage(data.publicUrl);
      dispatch(addAlert({ title: 'Upload Success', message: 'Thumbnail uploaded.', variant: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Upload Failed', message: err.message, variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveAndContinue = async (e) => {
    e.preventDefault();
    const cleanedOutcomes = whatYouWillLearn.filter(item => item.trim() !== '');

    if (!title.trim() || !description.trim() || !category.trim()) {
      dispatch(addAlert({ title: 'Missing Fields', message: 'Title, description, and category are required.', variant: 'warning' }));
      return;
    }

    if (!thumbnailImage && !thumbnailUrl) {
      dispatch(addAlert({ title: 'Missing Media', message: 'You must provide either a thumbnail image or a promo video URL.', variant: 'warning' }));
      return;
    }

    dispatch(showSubtleLoader('Saving draft...'));
    try {
      if (course?.id) {
        // Update existing
        const { data, error } = await supabase
          .from('fhhf_courses')
          .update({ 
            title, 
            description, 
            thumbnail_image: thumbnailImage, 
            thumbnail_url: thumbnailUrl, 
            category: category.trim(),
            what_you_will_learn: cleanedOutcomes,
            status: 'draft'
          })
          .eq('id', course.id)
          .select()
          .single();
          
        if (error) throw error;
        setCourse(data);
        onNext(); // Proceed to next step
      } else {
        // Create new
        const { data, error } = await supabase
          .from('fhhf_courses')
          .insert({
            instructor_id: user.id,
            title,
            description,
            thumbnail_image: thumbnailImage,
            thumbnail_url: thumbnailUrl,
            category: category.trim(),
            what_you_will_learn: cleanedOutcomes,
            status: 'draft'
          })
          .select()
          .single();
          
        if (error) throw error;
        onNext(data.id); // Proceed with new ID
      }
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Save Failed', message: err.message, variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4 p-md-5">
        <h5 className="fw-bold text-primary mb-4">Course Basics</h5>
        <Form onSubmit={handleSaveAndContinue}>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Course Title *</Form.Label>
            <Form.Control 
              type="text" 
              className="bg-light border-0 py-2 px-3 rounded-3" 
              placeholder="e.g. Master React in 30 Days" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Course Category *</Form.Label>
            <Form.Control 
              list="categoryOptions"
              className="bg-light border-0 py-2 px-3 rounded-3" 
              placeholder="Select or type a category (e.g. Web Development)" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <datalist id="categoryOptions">
              {CATEGORY_SUGGESTIONS.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Course Description *</Form.Label>
            <Form.Control 
              as="textarea"
              rows={4}
              className="bg-light border-0 py-2 px-3 rounded-3" 
              placeholder="Give a brief summary of what students will learn..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Course Thumbnail Image</Form.Label>
            <div className="d-flex align-items-center gap-3">
              {thumbnailImage && (
                <Image src={thumbnailImage} alt="Thumbnail preview" rounded style={{ width: '150px', height: '100px', objectFit: 'cover' }} />
              )}
              <div>
                <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()} className="rounded-pill px-4">
                  {thumbnailImage ? 'Change Image' : 'Upload Image'}
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="d-none" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                <div className="small text-muted mt-2">Recommended: 1280x720. Max 2MB.</div>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Promo Video URL</Form.Label>
            <Form.Control 
              type="url" 
              className="bg-light border-0 py-2 px-3 rounded-3" 
              placeholder="e.g. https://www.youtube.com/watch?v=..." 
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
            <Form.Text className="text-muted">An external video link to preview the course.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">What You'll Learn</Form.Label>
            {whatYouWillLearn.map((item, idx) => (
              <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                <Form.Control 
                  type="text" 
                  className="bg-light border-0 py-2 px-3 rounded-3" 
                  placeholder="e.g. Master the core concepts completely from scratch" 
                  value={item}
                  onChange={(e) => handleLearningOutcomeChange(idx, e.target.value)}
                />
                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveLearningOutcome(idx)}>Remove</Button>
              </div>
            ))}
            <Button variant="link" className="text-decoration-none p-0 mt-2 fw-bold" onClick={handleAddLearningOutcome}>
              + Add another learning outcome
            </Button>
          </Form.Group>

          <div className="d-flex justify-content-end border-top pt-4">
            <Button type="submit" variant="primary" className="rounded-pill px-5 py-2 fw-bold shadow-sm">
              Save & Continue
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
