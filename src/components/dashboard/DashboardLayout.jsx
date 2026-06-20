import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar
        isMobile={isMobile}
        showMobile={showMobileSidebar}
        onHideMobile={() => setShowMobileSidebar(false)}
      />

      <div className="main-content-area">
        <Topbar
          isMobile={isMobile}
          onToggleSidebar={() => setShowMobileSidebar(true)}
        />

        <main className="scrollable-content" data-lenis-prevent>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
