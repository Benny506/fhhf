import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showAppLoader, hideAppLoader, addAlert } from '../../../../redux/slices/uiSlice';
import supabase, { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../../../utils/supabase';
import { EMAIL_CONFIG } from '../../../../constants/adminConstants';
import { BsCheckCircleFill, BsXCircleFill, BsRocketTakeoff } from 'react-icons/bs';

export default function CourseReviewStep({ course, onPrev }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState({ modules: 0, lessons: 0, quizzes: 0 });
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!course?.id) return;
      try {
        const { data: mods } = await supabase.from('fhhf_course_modules').select('id').eq('course_id', course.id);
        const modIds = mods?.map(m => m.id) || [];

        let lessonsCount = 0;
        let quizzesCount = 0;

        if (modIds.length > 0) {
          const { data: less } = await supabase.from('fhhf_course_lessons').select('id, content_type').in('module_id', modIds);
          lessonsCount = less?.length || 0;
          quizzesCount = less?.filter(l => l.content_type === 'quiz').length || 0;
        }

        setStats({ modules: modIds.length, lessons: lessonsCount, quizzes: quizzesCount });
      } catch (err) {
        console.error(err);
      } finally {
        setIsValidating(false);
      }
    };
    fetchStats();
  }, [course?.id]);

  const checks = [
    { label: 'Course Title & Description', passed: !!course?.title && !!course?.description },
    { label: 'Course Thumbnail or Promo Video', passed: !!course?.thumbnail_image || !!course?.thumbnail_url },
    { label: 'At least 1 Module', passed: stats.modules > 0 },
    { label: 'At least 1 Lesson', passed: stats.lessons > 0 },
    { label: 'Pricing Configured', passed: course?.is_free !== null },
  ];

  const canPublish = checks.every(c => c.passed);

  const handleSubmitForApproval = async () => {
    if (!canPublish) return;

    dispatch(showAppLoader('Submitting for approval and notifying admins...'));
    try {
      const { error } = await supabase
        .from('fhhf_courses')
        .update({ status: 'pending_approval' })
        .eq('id', course.id);

      if (error) {
        console.log(error)
        throw error
      };

      // Notify Admin
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${EMAIL_CONFIG.LOGO_URL}" alt="FHHF Logo" style="max-height: 60px;" />
          </div>
          <h2 style="color: #0d6efd;">New Course Submission Pending Approval</h2>
          <p>Hi Admin,</p>
          <p>The instructor <strong>${user?.user_metadata?.username || user?.email || 'A user'}</strong> has submitted their course <strong>"${course.title}"</strong> for review.</p>
          <p>Please log in to the FHHF Admin Dashboard to review the curriculum, preview the content, and either approve or reject the submission.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://admin.fhhf.com/dashboard/course-moderation" style="background-color: #0d6efd; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Moderation Queue</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">Automated Notification via FHHF LMS</p>
        </div>
      `;

      const response = await axios.post(`${SUPABASE_URL}/functions/v1/send-email`, {
        to: EMAIL_CONFIG.ADMIN_EMAIL,
        subject: `New Course Pending Review: ${course.title}`,
        html: emailHtml,
        from_email: EMAIL_CONFIG.FROM_EMAIL,
        from_name: EMAIL_CONFIG.FROM_NAME
      }, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (response.data?.error) {
        console.error("Email notification failed to send:", response.data.error);
      }

      dispatch(addAlert({
        title: 'Course Submitted!',
        message: 'Your course has been submitted. Our team will review it shortly.',
        variant: 'success'
      }));
      navigate('/dashboard/courses', { replace: true });
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ title: 'Submission Failed', message: err.message, variant: 'danger' }));
    } finally {
      dispatch(hideAppLoader());
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4 p-md-5">
        <h5 className="fw-bold text-primary mb-4">Review & Publish</h5>

        <p className="text-muted mb-4">
          Review your course details before submitting it for approval. An admin must review and approve your course before it becomes visible to the public.
        </p>

        <Row className="mb-5">
          <Col md={8}>
            <h6 className="fw-bold mb-3 text-uppercase small tracking-widest text-muted">Pre-Flight Checklist</h6>
            <ListGroup variant="flush" className="bg-light rounded-3 border">
              {checks.map((check, idx) => (
                <ListGroup.Item key={idx} className="bg-transparent d-flex align-items-center gap-3 py-3 border-bottom">
                  {isValidating ? (
                    <div className="spinner-border spinner-border-sm text-primary" />
                  ) : check.passed ? (
                    <BsCheckCircleFill className="text-success" size={20} />
                  ) : (
                    <BsXCircleFill className="text-danger" size={20} />
                  )}
                  <span className={check.passed ? 'text-dark' : 'text-danger fw-bold'}>
                    {check.label}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <div
              className="p-4 rounded-3 border border-primary border-opacity-25 h-100 d-flex flex-column justify-content-center"
              style={{ backgroundColor: 'rgba(0, 31, 84, 0.05)' }}
            >
              <h6 className="fw-bold text-primary mb-3">Course Stats</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-medium">Modules</span>
                <span className="fw-bold">{stats.modules}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-medium">Total Lessons</span>
                <span className="fw-bold">{stats.lessons}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-medium">Quizzes</span>
                <span className="fw-bold">{stats.quizzes}</span>
              </div>
              <div className="d-flex justify-content-between pt-2 border-top border-primary border-opacity-25 mt-2">
                <span className="text-primary fw-bold">Price</span>
                <Badge bg={course?.is_free ? 'success' : 'primary'} className="rounded-pill">
                  {course?.is_free ? 'FREE' : `₦${course?.price?.toLocaleString()}`}
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        <div className="d-flex flex-wrap gap-2 justify-content-between border-top pt-4">
          <Button variant="light" onClick={onPrev} className="rounded-pill px-5 py-2 fw-bold text-muted">
            Back to Pricing
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitForApproval}
            className="rounded-pill px-5 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
            disabled={isValidating || !canPublish}
          >
            <BsRocketTakeoff />
            {canPublish ? 'Submit for Approval' : 'Fix Errors to Submit'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
