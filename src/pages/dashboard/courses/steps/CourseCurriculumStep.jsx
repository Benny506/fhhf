import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, addAlert } from '../../../../redux/slices/uiSlice';
import supabase from '../../../../utils/supabase';
import { BsPlusCircle } from 'react-icons/bs';
import ModuleAccordion from '../components/ModuleAccordion';

export default function CourseCurriculumStep({ course, onNext, onPrev }) {
  const dispatch = useDispatch();
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  const fetchCurriculum = useCallback(async () => {
    if (!course?.id) return;
    
    try {
      const { data: mods, error: errMods } = await supabase
        .from('fhhf_course_modules')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true });
        
      if (errMods) throw errMods;
      
      const { data: less, error: errLess } = await supabase
        .from('fhhf_course_lessons')
        .select('*')
        .in('module_id', mods.length > 0 ? mods.map(m => m.id) : [course.id]) // Just needs an array
        .order('order_index', { ascending: true });
        
      if (errLess && mods.length > 0) throw errLess;

      setModules(mods);
      setLessons(less || []);
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Error', message: 'Failed to load curriculum', variant: 'danger' }));
    }
  }, [course?.id, dispatch]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  const handleAddModule = async () => {
    dispatch(showSubtleLoader('Adding module...'));
    try {
      const newOrder = modules.length;
      const { error } = await supabase
        .from('fhhf_course_modules')
        .insert({
          course_id: course.id,
          title: `Module ${newOrder + 1}: New Topic`,
          order_index: newOrder
        });
      
      if (error) throw error;
      await fetchCurriculum();
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Error', message: 'Failed to add module.', variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  const handleContinue = () => {
    if (modules.length === 0) {
      dispatch(addAlert({ title: 'Missing Content', message: 'Please add at least one module.', variant: 'warning' }));
      return;
    }
    onNext();
  };

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4 p-md-5">
        <h5 className="fw-bold text-primary mb-4">Course Curriculum</h5>
        <p className="text-muted mb-5">
          Start building your course. Add modules to break your course into topics, then add lessons to each module.
        </p>

        {modules.length === 0 ? (
          <div className="text-center p-5 bg-light rounded-3 mb-4" style={{ border: '2px dashed var(--color-border)' }}>
            <h6 className="fw-bold text-muted mb-3">Your curriculum is empty</h6>
            <Button variant="primary" onClick={handleAddModule} className="rounded-pill px-4">
              <BsPlusCircle className="me-2" /> Add First Module
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3 mb-5">
            {modules.map((mod, index) => {
              const modLessons = lessons.filter(l => l.module_id === mod.id);
              return (
                <ModuleAccordion 
                  key={mod.id} 
                  module={mod} 
                  lessons={modLessons} 
                  onRefresh={fetchCurriculum}
                  index={index}
                />
              );
            })}
            
            <div className="mt-3">
              <Button variant="outline-primary" onClick={handleAddModule} className="rounded-pill px-4 fw-bold w-100 py-3" style={{ borderStyle: 'dashed', borderWidth: '2px' }}>
                <BsPlusCircle className="me-2" /> Add New Module
              </Button>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between border-top pt-4 mt-4">
          <Button variant="light" onClick={onPrev} className="rounded-pill px-5 py-2 fw-bold text-muted">
            Back
          </Button>
          <Button variant="primary" onClick={handleContinue} className="rounded-pill px-5 py-2 fw-bold shadow-sm">
            Save & Continue
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
