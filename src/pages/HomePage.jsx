import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showConfirmModal, showAppLoader, hideAppLoader, showSubtleLoader, hideSubtleLoader, addAlert } from '../redux/slices/uiSlice';
import './HomePage.css';

// Subcomponents
import HeroSection from './home/HeroSection';
import ImpactBand from './home/ImpactBand';
import BentoGrid from './home/BentoGrid';
import SpotlightSection from './home/SpotlightSection';
import CtaSection from './home/CtaSection';

export default function HomePage() {
  const dispatch = useDispatch();

  // Reusable animation variant for scroll reveals
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className="homepage-wrapper">

      {/* 1. HERO SECTION (Immersive Parallax) */}
      <HeroSection />

      {/* 2. IMPACT COUNTER BAND */}
      <ImpactBand fadeUp={fadeUp} />

      {/* 3. LEARNING TO EARNING (BENTO GRID) */}
      <BentoGrid fadeUp={fadeUp} />

      {/* 4. CREATIVE SPOTLIGHT */}
      <SpotlightSection fadeUp={fadeUp} />

      {/* 5. CTA SECTION */}
      <CtaSection fadeUp={fadeUp} />

      {/* 5. DEBUG SECTION (Kept for testing UI components) */}
      {/* <section className="fhhf-container py-5 my-5 border-top">
        <p className="text-muted small mb-3 text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>Dev Sandbox</p>
        <div className="d-flex flex-wrap gap-3">
          <Button variant="danger" size="sm" onClick={() => dispatch(showConfirmModal({ title: 'Delete?', variant: 'danger' }))}>Test Confirm Modal</Button>
          <Button variant="success" size="sm" onClick={() => dispatch(addAlert({ title: 'Success', message: 'Test alert!', variant: 'success' }))}>Test Success Alert</Button>
          <Button variant="primary" size="sm" onClick={() => { dispatch(showAppLoader('Processing...')); setTimeout(() => dispatch(hideAppLoader()), 5000); }}>Test Global Loader</Button>
          <Button variant="outline-primary" size="sm" onClick={() => { dispatch(showSubtleLoader('Syncing...')); setTimeout(() => dispatch(hideSubtleLoader()), 5000); }}>Test Subtle Loader</Button>
        </div>
      </section> */}

    </div>
  );
}
