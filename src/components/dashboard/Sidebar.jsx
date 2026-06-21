import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsGrid1X2Fill, BsPersonFill, BsBoxArrowRight, BsPencilSquare, BsBook } from 'react-icons/bs';
import Logo from '../ui/Logo';
import { showConfirmModal, showAppLoader, hideAppLoader } from '../../redux/slices/uiSlice';
import { clearAuth } from '../../redux/slices/authSlice';
import supabase from '../../utils/supabase';

export default function Sidebar({ showMobile, onHideMobile, isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.profile);

  const handleLogoutClick = () => {
    if (isMobile) onHideMobile();
    
    dispatch(showConfirmModal({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out of your account?',
      variant: 'warning',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        dispatch(showAppLoader('Logging out...'));
        try {
          await supabase.auth.signOut();
          dispatch(clearAuth());
          dispatch(hideAppLoader());
          navigate('/login');
        } catch (error) {
          console.error("Logout error", error);
          dispatch(hideAppLoader());
        }
      }
    }));
  };

  const navLinks = [
    { name: 'Overview', path: '/dashboard', icon: <BsGrid1X2Fill size={18} /> },
    { name: 'My Learning', path: '/dashboard/enrolled', icon: <BsBook size={18} /> },
    { name: 'My Courses', path: '/dashboard/courses', icon: <BsPencilSquare size={18} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <BsPersonFill size={18} /> },
  ];

  const siteContentLinks = [
    { name: 'Landing Page', path: '/', icon: <BsBoxArrowRight size={18} /> },
    { name: 'Courses', path: '/courses', icon: <BsGrid1X2Fill size={18} /> },
  ];

  const SidebarContent = (
    <div className="d-flex flex-column h-100 sidebar-wrapper">
      <div className="p-4 d-flex align-items-center justify-content-center border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <Logo size="sm" variant="light" />
      </div>
      
      <div className="sidebar-scrollable d-flex flex-column">
        <div className="flex-grow-1">
          <p className="text-uppercase small fw-bold mb-3 px-3 mt-4" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px' }}>
            Main Menu
          </p>
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              end={link.path === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => { if(isMobile) onHideMobile(); }}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          <div className="my-4 border-top mx-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <p className="text-uppercase small fw-bold mb-3 px-3" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px' }}>
            Site Content
          </p>
          {siteContentLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              className={({ isActive }) => `sidebar-link ${isActive && link.path !== '/' ? 'active' : ''}`}
              onClick={() => { if(isMobile) onHideMobile(); }}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto pt-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogoutClick}
            className="sidebar-link w-100 bg-transparent border-0 text-start text-white"
            style={{ opacity: 0.8 }}
          >
            <BsBoxArrowRight size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Offcanvas show={showMobile} onHide={onHideMobile} className="custom-offcanvas-sidebar">
        {SidebarContent}
      </Offcanvas>
    );
  }

  return SidebarContent;
}
