import React, { useState, useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsList, BsX } from 'react-icons/bs';
import Logo from '../ui/Logo';
import supabase from '../../utils/supabase';
import { clearAuth } from '../../redux/slices/authSlice';
import './Navbar.css';

export default function AppNavbar() {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const isAuthenticated = user && profile;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    navigate('/');
  };

  // Close offcanvas when route changes
  useEffect(() => {
    handleClose();
  }, [location]);

  // Handle scroll effect for glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fhhf-navbar fixed-top ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-fluid px-4 px-lg-5 d-flex align-items-center justify-content-between h-100">

          {/* Left Nav (Desktop) */}
          <div className="d-none d-lg-flex align-items-center gap-5 flex-1">
            <NavLink to="/" className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}>Contact</NavLink>
          </div>

          {/* Center Brand */}
          <div className="d-flex justify-content-start justify-content-lg-center flex-1">
            <NavLink to="/" className="text-decoration-none logo-transition">
              <Logo iconSize={scrolled ? 50 : 75} showWordmark={true} variant="dark" />
            </NavLink>
          </div>

          {/* Right Nav & Actions (Desktop) */}
          <div className="d-none d-lg-flex align-items-center justify-content-end gap-5 flex-1">
            <NavLink to="/courses" className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}>Courses</NavLink>

            {isAuthenticated ? (
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}>Sign In</NavLink>
            )}

            <Button onClick={() => navigate('/donate')} variant="primary" className="editorial-btn shadow-sm">
              Donate
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="d-flex d-lg-none justify-content-end flex-1">
            <button className="btn btn-link text-primary p-0 border-0" onClick={handleShow} aria-label="Toggle Navigation">
              <BsList size={36} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="fhhf-offcanvas shadow-lg border-0"
      >
        <Offcanvas.Header className="px-4 py-4 d-flex justify-content-between align-items-start border-bottom" style={{ borderColor: 'var(--color-border)' }}>
          <NavLink to="/" className="text-decoration-none">
            <Logo iconSize={45} showWordmark={true} variant="dark" />
          </NavLink>
          <button className="btn btn-link text-muted p-0 border-0" onClick={handleClose} aria-label="Close">
            <BsX size={40} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="px-4 py-4 d-flex flex-column h-100 overflow-y-auto">
          <div className="d-flex flex-column gap-4 mb-auto">
            <NavLink to="/" className={({ isActive }) => `nav-link-mobile ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link-mobile ${isActive ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/courses" className={({ isActive }) => `nav-link-mobile ${isActive ? 'active' : ''}`}>Learning Hub</NavLink>
            <NavLink to="/courses" className={({ isActive }) => `nav-link-mobile ${isActive ? 'active' : ''}`}>Courses</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link-mobile ${isActive ? 'active' : ''}`}>Contact</NavLink>
          </div>
          <div className="mt-5 pb-4">
            <Button variant="primary" className="w-100 rounded-pill py-3 fw-bold shadow-sm mb-3">
              Donate Now
            </Button>
            {isAuthenticated ? (
              <Button as={NavLink} to="/dashboard" variant="outline-primary" className="w-100 rounded-pill py-3 fw-bold" onClick={handleClose}>
                Go to Dashboard
              </Button>
            ) : (
              <Button as={NavLink} to="/login" variant="outline-primary" className="w-100 rounded-pill py-3 fw-bold" onClick={handleClose}>
                Sign In / Join
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
