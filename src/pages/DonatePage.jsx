import React, { useEffect } from 'react';
import DonateHero from './donate/DonateHero';
import DonateImpact from './donate/DonateImpact';
import DonateMethods from './donate/DonateMethods';
import { useSelector } from 'react-redux';
import './DonatePage.css';

export default function DonatePage() {
  const { data } = useSelector((state) => state.siteContent);
  const donateData = data?.donate || null;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reusable entrance variant
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className="donate-page-wrapper">
      <DonateHero fadeUp={fadeUp} data={donateData?.hero_section} />
      <DonateMethods fadeUp={fadeUp} data={donateData} />
      <DonateImpact fadeUp={fadeUp} data={donateData?.impact_metrics} />
    </div>
  );
}
