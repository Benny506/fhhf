import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTopbarConfig, showSubtleLoader, hideSubtleLoader } from '../../redux/slices/uiSlice';
import { setOverview } from '../../redux/slices/authSlice';
import { Card, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import { BsJournalRichtext, BsPlayCircle, BsArrowRight, BsBook, BsCheckCircle } from 'react-icons/bs';
import supabase from '../../utils/supabase';

export default function UserOverview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const overview = useSelector((state) => state.auth.overview);

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'Overview',
      description: 'Welcome back to your FHHF Dashboard',
    }));
  }, [dispatch]);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!user?.id) return;
      
      dispatch(showSubtleLoader('Syncing dashboard...'));
      try {
        const { data, error } = await supabase.rpc('fhhf_get_user_overview_dashboard', {
          p_user_id: user.id
        });

        if (!error && data) {
          dispatch(setOverview(data));
        }
      } catch (err) {
        console.error('Failed to fetch overview data', err);
      } finally {
        dispatch(hideSubtleLoader());
      }
    };

    fetchOverview();
  }, [user?.id, dispatch]);

  if (!overview) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const {
    total_created,
    created_published,
    created_draft,
    total_completed,
    total_taking,
    recent_course
  } = overview;

  return (
    <div className="py-2">
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-primary text-white">
            <Card.Body className="p-4 p-md-5 d-flex flex-column justify-content-center position-relative overflow-hidden">
              <div className="position-relative z-1">
                <h2 className="fw-bold mb-3 text-light" style={{ fontFamily: 'var(--font-family-heading)' }}>
                  Welcome back, {profile?.username || 'User'}!
                </h2>
                <p className="mb-0 text-white-50 fs-5" style={{ maxWidth: '600px' }}>
                  Manage your learning journey, track your progress, and if you have knowledge to share, orchestrate your curriculum from right here.
                </p>
              </div>
              <div className="position-absolute" style={{ top: '-50%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(80px)', opacity: 0.2, zIndex: 0 }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* KPI: Courses Created */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column text-center">
              <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                <BsJournalRichtext size={24} className="text-primary" />
              </div>
              <h6 className="text-uppercase fw-bold text-muted small tracking-widest mb-2">Courses Created</h6>
              <h1 className="fw-bold text-dark mb-2 display-4">{total_created}</h1>
              <div className="mt-auto d-flex justify-content-center gap-3 small fw-semibold">
                <span className="text-success">{created_published} Published</span>
                <span className="text-muted">|</span>
                <span className="text-warning">{created_draft} Drafts</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* KPI: Courses Taking */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column justify-content-center text-center">
              <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 202, 240, 0.1)' }}>
                <BsBook size={24} className="text-info" />
              </div>
              <h6 className="text-uppercase fw-bold text-muted small tracking-widest mb-2">Currently Learning</h6>
              <h1 className="fw-bold text-dark mb-0 display-4">{total_taking}</h1>
            </Card.Body>
          </Card>
        </Col>

        {/* KPI: Courses Completed */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column justify-content-center text-center">
              <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
                <BsCheckCircle size={24} className="text-success" />
              </div>
              <h6 className="text-uppercase fw-bold text-muted small tracking-widest mb-2">Courses Completed</h6>
              <h1 className="fw-bold text-dark mb-0 display-4">{total_completed}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Resume Learning Section */}
        <Col md={total_taking === 0 && total_created === 0 ? 12 : 7}>
          {recent_course ? (
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <BsPlayCircle className="text-primary" /> Jump Back In
                </h5>
                <Row className="align-items-center g-4">
                  <Col sm={4}>
                    <div 
                      className="rounded-3 bg-light overflow-hidden"
                      style={{ 
                        height: '140px', 
                        backgroundImage: recent_course.thumbnail_url ? `url(${recent_course.thumbnail_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!recent_course.thumbnail_url && (
                        <div className="h-100 w-100 d-flex align-items-center justify-content-center text-muted">
                          <BsBook size={32} />
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col sm={8}>
                    <h5 className="fw-bold mb-2">{recent_course.title}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-1 mt-4">
                      <span className="small fw-semibold text-muted">Progress</span>
                      <span className="small fw-bold text-primary">{Math.round(recent_course.progress_percentage || 0)}%</span>
                    </div>
                    <ProgressBar 
                      now={recent_course.progress_percentage || 0} 
                      variant="primary" 
                      style={{ height: '8px' }} 
                      className="mb-4"
                    />
                    <Button 
                      variant="primary" 
                      className="rounded-pill px-4 fw-bold shadow-sm"
                      onClick={() => navigate(`/course/${recent_course.id}/learn`)}
                    >
                      Resume Learning <BsArrowRight className="ms-2" />
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-light">
              <Card.Body className="p-5 text-center d-flex flex-column justify-content-center">
                <div className="mb-4 text-muted opacity-50">
                  <BsBook size={64} />
                </div>
                <h5 className="fw-bold mb-2">Kick-off your learning journey!</h5>
                <p className="text-muted mb-4">You aren't currently enrolled in any courses. Explore our catalog to learn something new today.</p>
                <div>
                  <Button 
                    variant="primary" 
                    className="rounded-pill px-4 fw-bold shadow-sm"
                    onClick={() => navigate('/courses')}
                  >
                    Browse Courses
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Start Teaching Section (Only if 0 created) */}
        {total_created === 0 && (
          <Col md={5}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
              <Card.Body className="p-4 p-xl-5 text-center d-flex flex-column justify-content-center">
                <div className="mb-4 text-primary">
                  <BsJournalRichtext size={56} />
                </div>
                <h5 className="fw-bold mb-2">Become an Instructor</h5>
                <p className="text-muted mb-4 small">Share your expertise with the world. Create your first course in minutes with our intuitive builder.</p>
                <div>
                  <Button 
                    variant="outline-primary" 
                    className="rounded-pill px-4 fw-bold bg-white"
                    onClick={() => navigate('/dashboard/courses/builder')}
                  >
                    Create a Course
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
