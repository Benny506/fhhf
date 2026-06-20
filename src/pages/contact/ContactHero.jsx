import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function ContactHero() {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.contact?.contact_hero;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={containerRef} className="position-relative overflow-hidden bg-primary d-flex align-items-center" style={{ minHeight: '60vh', paddingTop: '100px', paddingBottom: '100px' }}>
      
      {/* Background Ambient Mesh */}
      <div className="position-absolute w-100 h-100 top-0 start-0 z-0" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,215,0,0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />

      <div className="fhhf-container position-relative z-1 text-center w-100">
        <motion.div style={{ y: yText, opacity: opacityText }}>
          <span className="text-secondary fw-bold tracking-widest text-uppercase mb-3 d-block" style={{ letterSpacing: '4px' }}>
            {content?.kicker || "Get in Touch"}
          </span>
          <h1 
            className="text-white display-2 fw-bold mb-4" 
            style={{ fontFamily: 'var(--font-family-heading)', letterSpacing: '-1px' }}
            dangerouslySetInnerHTML={{ __html: content?.title || "Let's Build the <br /> Future Together." }}
          />
          <p className="text-white opacity-75 mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem', lineHeight: 1.8 }}>
            {content?.subtitle || "Whether you're looking to partner with us, apply for a grant, or simply learn more about our mission, our team is here and ready to connect."}
          </p>
        </motion.div>
      </div>
      
      {/* Curved Bottom Divider (Matches aesthetic from other pages) */}
      <div className="position-absolute bottom-0 start-0 w-100 z-1" style={{ height: '50px', background: 'var(--color-bg-light)', borderTopLeftRadius: '50px', borderTopRightRadius: '50px' }} />
    </section>
  );
}
