import React, { useState, useEffect } from 'react';
import { Button, ProgressBar, Offcanvas } from 'react-bootstrap';
import { BsArrowLeft, BsList } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './CoursePlayerLayout.css';

export default function CoursePlayerLayout({ course, progressPercentage, sidebar, children }) {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="course-player-layout">
      {/* Top Navbar */}
      <div className="course-player-topbar bg-dark">
        <div className="d-flex align-items-center gap-2 gap-md-4">
          <Button variant="link" className="text-white p-0 text-decoration-none d-flex align-items-center opacity-75 hover-opacity-100" onClick={() => navigate('/dashboard/enrolled')}>
            <BsArrowLeft size={20} className="me-1 me-md-2" /> <span className="d-none d-md-inline">Dashboard</span>
          </Button>
          <h5 className="mb-0 fw-bold line-clamp-1 text-light" style={{ maxWidth: isMobile ? '180px' : '400px', fontFamily: 'var(--font-family-heading)' }}>{course?.title || 'Loading...'}</h5>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-md-flex align-items-center gap-3">
            <span className="small fw-bold opacity-75">{progressPercentage}% Complete</span>
            <ProgressBar variant="success" now={progressPercentage} style={{ width: '150px', height: '8px' }} />
          </div>
          {isMobile && (
            <Button variant="outline-light" size="sm" className="d-flex align-items-center justify-content-center p-1" onClick={() => setShowMobileSidebar(true)}>
              <BsList size={24} />
            </Button>
          )}
        </div>
      </div>

      <div className="course-player-body">
        {/* Main Content Pane */}
        <main className="course-player-main custom-scrollbar" data-lenis-prevent>
          <div className="d-flex flex-column align-items-center p-4 p-md-5 w-100 h-100">
            <div className="w-100 pb-5" style={{ maxWidth: '1000px' }}>
              {children}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        {!isMobile ? (
          <aside className="course-player-sidebar">
            <div className="course-player-sidebar-header">
              <h5 className="fw-bold mb-0">Course Content</h5>
            </div>
            <div className="course-player-sidebar-content custom-scrollbar" data-lenis-prevent>
              {sidebar}
            </div>
          </aside>
        ) : (
          <Offcanvas show={showMobileSidebar} onHide={() => setShowMobileSidebar(false)} placement="end" style={{ width: '320px' }}>
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title className="fw-bold">Course Content</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0 custom-scrollbar" data-lenis-prevent>
              {React.isValidElement(sidebar) ? React.cloneElement(sidebar, {
                onMobileSelect: () => setShowMobileSidebar(false)
              }) : sidebar}
            </Offcanvas.Body>
          </Offcanvas>
        )}
      </div>
    </div>
  );
}
