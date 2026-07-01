import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setTopbarConfig, showSubtleLoader, hideSubtleLoader, addAlert, showConfirmModal } from '../../../redux/slices/uiSlice';
import { setInstructorCourses, removeCourseLocally } from '../../../redux/slices/courseSlice';
import supabase from '../../../utils/supabase';
import CourseCard from '../../../components/ui/CourseCard';
import { BsPlusLg, BsPencilSquare, BsTrash, BsJournalRichtext } from 'react-icons/bs';
import InstructorGlobalAnalyticsTab from './InstructorGlobalAnalyticsTab';

export default function InstructorCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(state => state.auth.user);
  const courses = useSelector(state => state.course.instructorCourses);

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'My Courses',
      description: 'Manage and edit the courses you have created.'
    }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchCourses = async () => {
    dispatch(showSubtleLoader('Fetching your courses...'));
    try {
      const { data, error } = await supabase
        .from('fhhf_courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      dispatch(setInstructorCourses(data || []));
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Fetch Error', message: 'Failed to load your courses.', variant: 'danger' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  const handleDelete = (courseId, courseTitle) => {
    dispatch(showConfirmModal({
      title: 'Delete Course',
      message: `Are you sure you want to permanently delete "${courseTitle}"? All modules, lessons, and student progress will be lost.`,
      variant: 'danger',
      confirmText: 'Delete Forever',
      onConfirm: async () => {
        dispatch(showSubtleLoader('Deleting course...'));
        try {
          const { error } = await supabase.from('fhhf_courses').delete().eq('id', courseId);
          if (error) throw error;
          
          dispatch(removeCourseLocally(courseId));
          dispatch(addAlert({ title: 'Deleted', message: 'Course has been deleted.', variant: 'success' }));
        } catch (err) {
          console.error(err);
          dispatch(addAlert({ title: 'Delete Failed', message: 'Failed to delete the course.', variant: 'danger' }));
        } finally {
          dispatch(hideSubtleLoader());
        }
      }
    }));
  };

  const getStatusBadge = (course) => {
    switch(course.status) {
      case 'published': return <Badge bg="success" className="rounded-pill">Published</Badge>;
      case 'pending_approval': return <Badge bg="info" className="rounded-pill">Pending Approval</Badge>;
      case 'draft':
        if (course.rejection_reason) return <Badge bg="danger" className="rounded-pill shadow-sm">Needs Revision</Badge>;
        return <Badge bg="warning" text="dark" className="rounded-pill">Draft</Badge>;
      default: return <Badge bg="warning" text="dark" className="rounded-pill">Draft</Badge>;
    }
  };

  return (
    <Container fluid className="px-0 py-4">
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="primary" 
          className="rounded-pill fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => navigate('/dashboard/courses/builder')}
        >
          <BsPlusLg /> Create New Course
        </Button>
      </div>

      <Tabs defaultActiveKey="courses" id="instructor-courses-tabs" className="mb-4 custom-tabs">
        <Tab eventKey="courses" title="My Courses">
          {!courses ? null : courses.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center p-5">
          <Card.Body className="py-5 my-3">
            <BsJournalRichtext size={64} className="text-muted mb-4 opacity-50" />
            <h4 className="fw-bold text-dark">You haven't created any courses yet.</h4>
            <p className="text-muted mb-4 max-w-md mx-auto">
              Start building your first curriculum and share your knowledge with the world. Click the button above to begin!
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {courses.map(course => (
            <Col xs={12} md={6} xl={4} key={course.id}>
              <CourseCard 
                course={course}
                onViewCourse={() => navigate(`/courses/${course.id}`)}
                renderBadges={(c) => getStatusBadge(c)}
                renderMetadata={(c) => (
                  <>
                    <p className="small text-muted mb-3 fw-medium text-uppercase tracking-widest">
                      {c.is_free ? 'Free Course' : `₦${c.price?.toLocaleString()}`}
                    </p>
                    {c.status === 'draft' && c.rejection_reason && (
                      <div className="text-danger p-2 mb-3 rounded-3 small w-100" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                        <div className="fw-bold mb-1" style={{ fontSize: '0.8rem' }}>ADMIN FEEDBACK:</div>
                        <div style={{ fontSize: '0.85rem' }} className="line-clamp-2" title={c.rejection_reason}>
                          {c.rejection_reason}
                        </div>
                      </div>
                    )}
                  </>
                )}
                renderActions={(c) => (
                  <div className="d-flex flex-column gap-2 w-100">
                    <Button 
                      variant="outline-secondary" 
                      className="w-100 fw-bold rounded-pill shadow-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/courses/${c.id}/analytics`); }}
                    >
                      Analytics
                    </Button>
                    <div className="d-flex gap-2 w-100">
                      <Button 
                        variant="light" 
                        className="flex-grow-1 fw-bold rounded-pill text-primary border-primary border-opacity-25"
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/courses/builder/${c.id}`); }}
                      >
                        <BsPencilSquare className="me-2" /> Edit
                      </Button>
                      <Button 
                        variant="light" 
                        className="rounded-pill text-danger border-danger border-opacity-25 px-3"
                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.title); }}
                      >
                        <BsTrash />
                      </Button>
                    </div>
                  </div>
                )}
              />
            </Col>
          ))}
        </Row>
      )}
        </Tab>
        <Tab eventKey="analytics" title="Global Analytics">
          <InstructorGlobalAnalyticsTab user={user} />
        </Tab>
      </Tabs>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .custom-tabs .nav-link {
          color: #6c757d;
          font-weight: 600;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0.75rem 1.5rem;
        }
        .custom-tabs .nav-link.active {
          color: #0d6efd;
          background: transparent;
          border-bottom: 2px solid #0d6efd;
        }
      `}</style>
    </Container>
  );
}
