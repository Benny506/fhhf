import React, { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, addAlert } from '../../../../redux/slices/uiSlice';
import supabase from '../../../../utils/supabase';

export default function CourseSettingsStep({ course, setCourse, onNext, onPrev }) {
  const dispatch = useDispatch();
  const [isFree, setIsFree] = useState(course?.is_free ?? true);
  const [price, setPrice] = useState(course?.price || '');

  const handleSaveAndContinue = async (e) => {
    e.preventDefault();

    if (!isFree && (!price || parseFloat(price) <= 0)) {
      dispatch(addAlert({ title: 'Invalid Price', message: 'Please enter a valid price greater than 0.', variant: 'warning' }));
      return;
    }

    dispatch(showSubtleLoader('Saving settings...'));
    try {
      const { data, error } = await supabase
        .from('fhhf_courses')
        .update({ 
          is_free: isFree, 
          price: isFree ? 0 : parseFloat(price) 
        })
        .eq('id', course.id)
        .select()
        .single();
        
      if (error) throw error;
      setCourse(data);
      onNext();
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
        <h5 className="fw-bold text-primary mb-4">Pricing & Settings</h5>
        <Form onSubmit={handleSaveAndContinue}>
          
          <Form.Group className="mb-5">
            <Form.Label className="fw-bold text-dark mb-3">Course Pricing Strategy</Form.Label>
            
            <div 
              className={`p-3 rounded-3 border mb-3 cursor-pointer transition-all ${isFree ? 'border-primary' : ''}`} 
              onClick={() => setIsFree(true)}
              style={{ backgroundColor: isFree ? 'rgba(0, 31, 84, 0.05)' : 'transparent' }}
            >
              <Form.Check 
                type="radio" 
                id="price-free"
                label={<span className="fw-bold">Free Course</span>}
                checked={isFree}
                onChange={() => setIsFree(true)}
              />
              <div className="text-muted small ms-4">Anyone can enroll and access the contents for free.</div>
            </div>

            <div 
              className={`p-3 rounded-3 border transition-all ${!isFree ? 'border-primary' : ''}`} 
              onClick={() => setIsFree(false)}
              style={{ backgroundColor: !isFree ? 'rgba(0, 31, 84, 0.05)' : 'transparent' }}
            >
              <Form.Check 
                type="radio" 
                id="price-paid"
                label={<span className="fw-bold">Paid Course</span>}
                checked={!isFree}
                onChange={() => setIsFree(false)}
              />
              <div className="text-muted small ms-4 mb-3">Require payment before students can access the curriculum.</div>
              
              {!isFree && (
                <div className="ms-4">
                  <Form.Label className="fw-bold small text-muted text-uppercase tracking-widest">Price Amount</Form.Label>
                  <InputGroup style={{ maxWidth: '200px' }}>
                    <InputGroup.Text className="bg-white border-end-0 fw-bold">₦</InputGroup.Text>
                    <Form.Control 
                      type="number" 
                      min="1"
                      step="0.01"
                      className="bg-white border-start-0 py-2 px-3" 
                      placeholder="99.99" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required={!isFree}
                      onClick={e => e.stopPropagation()}
                    />
                  </InputGroup>
                </div>
              )}
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between border-top pt-4 mt-4">
            <Button variant="light" onClick={onPrev} className="rounded-pill px-5 py-2 fw-bold text-muted">
              Back
            </Button>
            <Button type="submit" variant="primary" className="rounded-pill px-5 py-2 fw-bold shadow-sm">
              Save & Continue
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
