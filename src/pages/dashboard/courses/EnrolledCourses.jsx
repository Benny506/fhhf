import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTopbarConfig, showSubtleLoader, hideSubtleLoader, addAlert } from '../../../redux/slices/uiSlice';
import { setEnrolledCourses } from '../../../redux/slices/courseSlice';
import supabase from '../../../utils/supabase';
import CourseCard from '../../../components/ui/CourseCard';
import { BsBook, BsPlayCircle } from 'react-icons/bs';

export default function EnrolledCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.user);
  const enrollments = useSelector(state => state.course.enrolledCourses);

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'My Learning',
      description: 'Resume the courses you are currently enrolled in.'
    }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      fetchEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchEnrollments = async () => {
    dispatch(showSubtleLoader('Fetching your enrolled courses...'));
    try {
      const { data, error } = await supabase
        .from('fhhf_user_enrollments')
        .select(`
          *,
          course:fhhf_courses(
            *,
            modules:fhhf_course_modules(
              lessons:fhhf_course_lessons(id)
            )
          ),
          progress:fhhf_user_progress(id)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      dispatch(setEnrolledCourses(data || []));
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Fetch Error', message: 'Failed to load your enrolled courses.', variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  return (
    <Container fluid className="px-0 py-4">
      {!enrollments ? null : enrollments.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center p-5">
          <Card.Body className="py-5 my-3">
            <BsBook size={64} className="text-muted mb-4 opacity-50" />
            <h4 className="fw-bold text-dark">You haven't enrolled in any courses yet.</h4>
            <p className="text-muted mb-4 max-w-md mx-auto">
              Explore our catalog to find exciting new topics to learn and grow your skills.
            </p>
            <Button
              variant="primary"
              className="rounded-pill fw-bold px-4 py-2"
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {enrollments.map(enrollment => {
            const course = enrollment.course;
            // Prevent crash if course was deleted after enrollment
            if (!course) return null;
            const totalLessons = course.modules?.flatMap(m => m.lessons)?.length || 0;
            const completedLessons = enrollment.progress?.length || 0;
            const isCompleted = enrollment.status === 'completed';
            const progressPercentage = isCompleted ? 100 : (enrollment.progress_percentage || 0);
            
            // Check if there is new content added since they completed it
            const hasNewContent = isCompleted && (completedLessons < totalLessons);

            return (
              <Col xs={12} md={6} xl={4} key={enrollment.id}>
                <CourseCard
                  course={course}
                  onViewCourse={() => navigate(`/courses/${course.id}`)}
                  renderMetadata={() => (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-dark">
                          {progressPercentage}% Complete {hasNewContent && <span className="text-primary ms-1">✨ New Content</span>}
                        </span>
                      </div>
                      <ProgressBar
                        variant="success"
                        now={progressPercentage}
                        style={{ height: '6px' }}
                        className="rounded-pill"
                      />
                    </div>
                  )}
                  renderActions={() => (
                    <Button
                      variant={isCompleted ? "outline-primary" : "primary"}
                      className="w-100 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learn/${course.id}`);
                      }}
                    >
                      <BsPlayCircle /> {isCompleted ? 'Review Course' : 'Continue Learning'}
                    </Button>
                  )}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}




// Analytics for people who have enrolled in my course
// Updating a course and enrolled users now see new uncompleted sections
// Donations flow