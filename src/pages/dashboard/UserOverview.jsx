import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTopbarConfig } from '../../redux/slices/uiSlice';
import { Card, Row, Col } from 'react-bootstrap';
import { BsJournalRichtext } from 'react-icons/bs';
import supabase from '../../utils/supabase';

export default function UserOverview() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const [courseCount, setCourseCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  useEffect(() => {
    dispatch(setTopbarConfig({
      title: 'Overview',
      description: 'Welcome back to your FHHF Dashboard',
    }));
  }, [dispatch]);

  useEffect(() => {
    const fetchCourseCount = async () => {
      if (!user?.id) return;
      try {
        const { count, error } = await supabase
          .from('fhhf_courses')
          .select('*', { count: 'exact', head: true })
          .eq('instructor_id', user.id);

        if (!error && count !== null) {
          setCourseCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch course count', err);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchCourseCount();
  }, [user?.id]);

  return (
    <div>
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-primary text-white">
            <Card.Body className="p-4 p-md-5 d-flex flex-column justify-content-center position-relative overflow-hidden">
              <div className="position-relative z-1">
                <h2 className="fw-bold mb-3 text-light" style={{ fontFamily: 'var(--font-family-heading)' }}>
                  Welcome back, {profile?.username || 'User'}!
                </h2>
                <p className="mb-0 text-white-50 fs-5" style={{ maxWidth: '500px' }}>
                  Ready to share your knowledge? Manage your curriculum, track your students, and create impactful courses right here from your dashboard.
                </p>
              </div>
              <div className="position-absolute" style={{ top: '-50%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(80px)', opacity: 0.2, zIndex: 0 }} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column justify-content-center text-center">
              <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(0, 31, 84, 0.05)' }}>
                <BsJournalRichtext size={24} className="text-primary" />
              </div>
              <h6 className="text-uppercase fw-bold text-muted small tracking-widest mb-2">Courses Created</h6>
              {isLoadingCount ? (
                <div className="spinner-border spinner-border-sm text-primary mx-auto mt-2" />
              ) : (
                <h1 className="fw-bold text-dark mb-0 display-4">{courseCount}</h1>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
