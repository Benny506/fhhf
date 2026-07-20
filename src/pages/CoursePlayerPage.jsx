import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, showSubtleLoader, hideSubtleLoader } from '../redux/slices/uiSlice';
import supabase from '../utils/supabase';
import usePaystack from '../hooks/usePaystack';
import { PAYSTACK_CONFIG } from '../utils/paystack';

import CoursePlayerLayout from '../components/course-player/CoursePlayerLayout';
import CoursePlayerSidebar from '../components/course-player/CoursePlayerSidebar';
import VideoPlayerRenderer from '../components/course-player/VideoPlayerRenderer';
import AudioPlayerRenderer from '../components/course-player/AudioPlayerRenderer';
import TextContentRenderer from '../components/course-player/TextContentRenderer';
import QuizEngineRenderer from '../components/course-player/QuizEngineRenderer';

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine all lessons in order to handle Auto-Advance
  const allLessons = modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  useEffect(() => {
    if (user) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Enrollment & Progress
      const { data: enrollmentData, error: enrollError } = await supabase
        .from('fhhf_user_enrollments')
        .select(`
          *,
          progress:fhhf_user_progress(lesson_id)
        `)
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (enrollError || !enrollmentData) {
        dispatch(addAlert({ variant: 'danger', message: 'You are not enrolled in this course.' }));
        navigate('/courses');
        return;
      }

      setEnrollment(enrollmentData);
      const completedSet = new Set(enrollmentData.progress.map(p => p.lesson_id));
      setCompletedLessons(completedSet);

      // 2. Fetch Course & Curriculum
      const { data: courseData, error: courseError } = await supabase
        .from('fhhf_courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: modData, error: modError } = await supabase
        .from('fhhf_course_modules')
        .select(`
          *,
          lessons:fhhf_course_lessons (
            *,
            quizzes:fhhf_quizzes (*)
          )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modError) throw modError;

      const sortedMods = modData?.map(mod => ({
        ...mod,
        lessons: mod.lessons?.sort((a, b) => a.order_index - b.order_index).map(lesson => ({
          ...lesson,
          quizzes: lesson.quizzes?.sort((q1, q2) => (q1.order_index || 0) - (q2.order_index || 0)) || []
        })) || []
      })) || [];

      setModules(sortedMods);

      // 3. Set Active Lesson
      const flatLessons = sortedMods.flatMap(m => m.lessons);
      if (flatLessons.length > 0) {
        if (enrollmentData.last_accessed_lesson_id) {
          const lastLesson = flatLessons.find(l => l.id === enrollmentData.last_accessed_lesson_id);
          setActiveLesson(lastLesson || flatLessons[0]);
        } else {
          setActiveLesson(flatLessons[0]);
        }
      }

    } catch (err) {
      console.error(err);
      dispatch(addAlert({ variant: 'danger', message: 'Failed to load course player.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = async (lesson) => {
    setActiveLesson(lesson);
    // Update last_accessed quietly
    if (enrollment) {
      await supabase
        .from('fhhf_user_enrollments')
        .update({ last_accessed_lesson_id: lesson.id })
        .eq('id', enrollment.id);
    }
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || !enrollment) return;

    try {
      dispatch(showSubtleLoader());
      // Insert into progress
      const { error } = await supabase
        .from('fhhf_user_progress')
        .upsert({
          enrollment_id: enrollment.id,
          lesson_id: activeLesson.id,
          completed_at: new Date().toISOString()
        }, { onConflict: 'enrollment_id, lesson_id' });

      if (error) throw error;

      // Update local state
      const newCompleted = new Set(completedLessons);
      newCompleted.add(activeLesson.id);
      setCompletedLessons(newCompleted);

      console.log(enrollment.status)

      // Update progress_percentage and status quietly ONLY if not already completed
      if (enrollment.status !== 'completed') {
        const newProgress = Math.round((newCompleted.size / totalLessons) * 100);
        const newStatus = newProgress === 100 ? 'completed' : 'in_progress';

        await supabase
          .from('fhhf_user_enrollments')
          .update({
            progress_percentage: newProgress,
            ...(newProgress === 100 && { status: 'completed' })
          })
          .eq('id', enrollment.id)

        // Update local enrollment state to prevent immediate re-runs from causing issues
        setEnrollment(prev => ({ ...prev, status: newStatus, progress_percentage: newProgress }));
      }

      // Auto-advance
      const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
      if (currentIndex < allLessons.length - 1) {
        handleLessonSelect(allLessons[currentIndex + 1]);
      } else {
        dispatch(addAlert({ variant: 'success', message: 'Congratulations! You have finished the course.' }));
      }
    } catch (err) {
      console.error(err);
      dispatch(addAlert({ variant: 'danger', message: 'Failed to save progress.' }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  // Paystack Configuration for the lock screen
  const paystackConfig = {
    reference: `FHHF_ENR_${enrollment?.id}_${new Date().getTime()}`,
    email: user?.email,
    amount: Math.round((Number(course?.price) || 0) * 100),
    publicKey: PAYSTACK_CONFIG.PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      transaction_type: 'fhhf_course',
      enrollment_id: enrollment?.id,
      course_id: course?.id
    }
  };

  const initializePayment = usePaystack(paystackConfig);

  const handlePayNow = () => {
    initializePayment({
      onSuccess: (response) => {
        console.log("Course Payment Success:", response);
        dispatch(addAlert({ variant: 'success', message: 'Payment successful! Unlocking course...' }));
        // Update local state to unlock immediately
        setEnrollment(prev => ({ ...prev, has_paid: true }));
      },
      onClose: () => {
        dispatch(addAlert({ variant: 'warning', message: 'Payment window closed. Complete your payment to unlock the course.' }));
      }
    });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted fw-bold">Loading Theater Mode...</p>
      </div>
    );
  }

  // --- HARD BLOCKER FOR UNPAID COURSES ---
  if (enrollment && !enrollment.has_paid) {
    return (
      <CoursePlayerLayout
        course={course}
        progressPercentage={0}
        sidebar={<div className="p-3 text-muted">Locked</div>}
      >
        <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="text-center p-5 rounded-4 bg-white shadow-sm border" style={{ maxWidth: '500px' }}>
            <div className="mb-4 d-inline-flex p-4 rounded-circle bg-warning bg-opacity-10 text-warning">
              <BsCheckCircleFill size={48} className="opacity-75" />
            </div>
            <h3 className="fw-bold mb-3">Payment Required</h3>
            <p className="text-muted mb-4">
              You are enrolled in this premium course, but we are still waiting on payment. 
              Please complete your purchase to unlock the curriculum.
            </p>
            <Button variant="primary" size="lg" className="rounded-pill px-5 fw-bold" onClick={handlePayNow}>
              Pay ₦{course.price?.toLocaleString()} to Unlock
            </Button>
          </div>
        </div>
      </CoursePlayerLayout>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <h4 className="text-muted mb-3">No content available for this course yet.</h4>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const isCompleted = completedLessons.has(activeLesson.id);

  return (
    <CoursePlayerLayout
      course={course}
      progressPercentage={progressPercentage}
      sidebar={
        <CoursePlayerSidebar
          modules={modules}
          activeLesson={activeLesson}
          completedLessons={completedLessons}
          onLessonSelect={handleLessonSelect}
        />
      }
    >
      {activeLesson.content_type === 'video' && (
        <VideoPlayerRenderer lesson={activeLesson} onComplete={handleMarkComplete} />
      )}

      {activeLesson.content_type === 'audio' && (
        <AudioPlayerRenderer lesson={activeLesson} onComplete={handleMarkComplete} />
      )}

      {activeLesson.content_type === 'text' && (
        <TextContentRenderer lesson={activeLesson} onComplete={handleMarkComplete} isCompleted={isCompleted} />
      )}

      {activeLesson.content_type === 'quiz' && (
        <QuizEngineRenderer lesson={activeLesson} onComplete={handleMarkComplete} isCompleted={isCompleted} />
      )}

      {/* If Video/Audio is completed, show a continue button below it just in case auto-advance didn't work or they re-watched */}
      {(activeLesson.content_type === 'video' || activeLesson.content_type === 'audio') && (
        <div className="mt-4 d-flex justify-content-between align-items-center bg-white p-4 rounded-4 shadow-sm">
          <div>
            <h5 className="fw-bold mb-1">{activeLesson.title}</h5>
            <p className="text-muted small mb-0">Module: {modules.find(m => m.id === activeLesson.module_id)?.title}</p>
          </div>
          <Button
            variant={isCompleted ? "success" : "primary"}
            className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
            onClick={handleMarkComplete}
            disabled={isCompleted}
          >
            {isCompleted ? <><BsCheckCircleFill /> Completed</> : 'Mark Complete & Continue'}
          </Button>
        </div>
      )}
    </CoursePlayerLayout>
  );
}
