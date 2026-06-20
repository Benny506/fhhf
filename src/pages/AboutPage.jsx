import React, { useEffect } from 'react';
import AboutHero from './about/AboutHero';
import MissionVision from './about/MissionVision';
import OurStory from './about/OurStory';
import TeamSection from './about/TeamSection';

import './AboutPage.css';
import CtaSection from './home/CtaSection';

export default function AboutPage() {
  // Reusable animation variant for scroll reveals
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-wrapper">
      <AboutHero />
      <MissionVision fadeUp={fadeUp} />
      <OurStory fadeUp={fadeUp} />
      <TeamSection fadeUp={fadeUp} />
      <CtaSection fadeUp={fadeUp} />
    </div>
  );
}
