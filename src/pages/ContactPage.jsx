import React, { useEffect } from 'react';
import ContactHero from './contact/ContactHero';
import ContactInfoGrid from './contact/ContactInfoGrid';
import ContactForm from './contact/ContactForm';
import FaqSection from './contact/FaqSection';
import './ContactPage.css';

export default function ContactPage() {
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
    <div className="contact-page-wrapper">
      <ContactHero />
      <ContactInfoGrid fadeUp={fadeUp} />
      <ContactForm fadeUp={fadeUp} />
      <FaqSection fadeUp={fadeUp} />
    </div>
  );
}
