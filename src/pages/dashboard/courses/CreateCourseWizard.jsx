import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTopbarConfig } from '../../../redux/slices/uiSlice';
import supabase from '../../../utils/supabase';
import { Container, Row, Col } from 'react-bootstrap';

import CourseBasicsStep from './steps/CourseBasicsStep';
import CourseCurriculumStep from './steps/CourseCurriculumStep';
import CourseSettingsStep from './steps/CourseSettingsStep';
import CourseReviewStep from './steps/CourseReviewStep';

export default function CreateCourseWizard() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentStep = parseInt(searchParams.get('step') || '1', 10);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: courseId ? 'Edit Course' : 'Create New Course',
      description: 'Follow the steps to build your course content.'
    }));
  }, [dispatch, courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('fhhf_courses')
          .select('*')
          .eq('id', courseId)
          .single();
          
        if (error) throw error;
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleNextStep = (newCourseId) => {
    if (newCourseId && !courseId) {
      // We just created the draft, redirect to step 2 with the new ID
      navigate(`/dashboard/courses/builder/${newCourseId}?step=2`, { replace: true });
    } else {
      setSearchParams({ step: (currentStep + 1).toString() });
    }
  };

  if (isLoading) return null; 

  return (
    <Container fluid className="px-0 py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold text-primary mb-0">Step {currentStep} of 4</h4>
          </div>

          <div className="wizard-content-area">
            {currentStep === 1 && (
              <CourseBasicsStep course={course} setCourse={setCourse} onNext={handleNextStep} />
            )}
            {currentStep === 2 && (
              <CourseCurriculumStep 
                course={course} 
                onNext={() => setSearchParams({ step: '3' })} 
                onPrev={() => setSearchParams({ step: '1' })} 
              />
            )}
            {currentStep === 3 && (
              <CourseSettingsStep 
                course={course} 
                setCourse={setCourse}
                onNext={() => setSearchParams({ step: '4' })} 
                onPrev={() => setSearchParams({ step: '2' })} 
              />
            )}
            {currentStep === 4 && (
              <CourseReviewStep 
                course={course} 
                onPrev={() => setSearchParams({ step: '3' })} 
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
