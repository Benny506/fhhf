import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../ui/Logo';
import { BsInstagram, BsTwitter, BsLinkedin, BsArrowUpRight } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="bg-white pt-5 pb-4 border-top position-relative overflow-hidden">
      {/* Background decorations */}
      <div className="position-absolute" style={{ top: '0', right: '0', width: 'clamp(200px, 30vw, 400px)', height: 'clamp(200px, 30vw, 400px)', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(90px)', opacity: 0.04, zIndex: 0, pointerEvents: 'none' }} />
      <div className="position-absolute" style={{ bottom: '10%', left: '-5%', width: 'clamp(150px, 20vw, 300px)', height: 'clamp(150px, 20vw, 300px)', borderRadius: '50%', border: '1px solid rgba(0,31,84,0.05)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="fhhf-container pt-4 position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-5">
          {/* Brand Col */}
          <div className="col-lg-4 mb-5 mb-lg-0 pr-lg-5">
            <Logo iconSize={40} showWordmark={true} variant="dark" />
            <p className="mt-4 text-secondary pe-lg-5" style={{ lineHeight: 1.8 }}>
              A global foundation dedicated to empowering creatives through skill development, mentorship, and economic opportunities.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-secondary hover-primary transition-all"><BsInstagram size={20} /></a>
              <a href="#" className="text-secondary hover-primary transition-all"><BsTwitter size={20} /></a>
              <a href="#" className="text-secondary hover-primary transition-all"><BsLinkedin size={20} /></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="col-6 col-lg-2 offset-lg-1 mb-4 mb-lg-0">
            <h5 className="mb-4" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Platform</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><NavLink to="/about" className="text-secondary text-decoration-none hover-primary">About Us</NavLink></li>
              <li><NavLink to="/courses" className="text-secondary text-decoration-none hover-primary">Learning Hub</NavLink></li>
              <li><NavLink to="/courses" className="text-secondary text-decoration-none hover-primary">Courses</NavLink></li>
              <li><NavLink to="/mentors" className="text-secondary text-decoration-none hover-primary">Mentorship</NavLink></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="col-6 col-lg-2 mb-4 mb-lg-0">
            <h5 className="mb-4" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Get Involved</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><NavLink to="/donate" className="text-secondary text-decoration-none hover-primary">Donate <BsArrowUpRight size={12}/></NavLink></li>
              <li><NavLink to="/partner" className="text-secondary text-decoration-none hover-primary">Partner with Us</NavLink></li>
              <li><NavLink to="/volunteer" className="text-secondary text-decoration-none hover-primary">Volunteer</NavLink></li>
              <li><NavLink to="/contact" className="text-secondary text-decoration-none hover-primary">Contact</NavLink></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="col-lg-3">
            <h5 className="mb-4" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Newsletter</h5>
            <p className="text-secondary small mb-3">Stay updated with our latest impact stories and opportunities.</p>
            <div className="d-flex">
              <input 
                type="email" 
                className="form-control rounded-0 shadow-none border-secondary" 
                placeholder="Email address" 
                style={{ backgroundColor: 'transparent' }}
              />
              <button className="btn btn-primary rounded-0 px-3">→</button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <p className="text-muted small mb-0">
            &copy; {new Date().getFullYear()} Freedom Haute Humanitarian Foundation. All rights reserved.
          </p>
          <div className="d-flex gap-4 mt-3 mt-md-0">
            <a href="#" className="text-muted small text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-muted small text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
