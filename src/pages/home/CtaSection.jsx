import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import communityAnim from '../../assets/lotties/community.json';

const LottieComponent = Lottie.default || Lottie;

export default function CtaSection({ fadeUp }) {
  const { data } = useSelector((state) => state.siteContent);
  const content = data?.home?.cta_section;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background and content parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["-50%", "50%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={containerRef} className="cta-section position-relative text-center overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'var(--color-primary)',
          zIndex: 0
        }}
      >
        <motion.img 
          src={content?.backgroundImage || "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2069&auto=format&fit=crop"} 
          alt="Community" 
          className="w-100 h-100" 
          style={{ objectFit: 'cover', opacity: 0.15, mixBlendMode: 'luminosity', y: yBg, scale: 1.5 }}
        />
      </div>

      {/* Background decorations - Responsive */}
      <div className="position-absolute" style={{ top: '10%', right: '5%', width: 'clamp(150px, 20vw, 250px)', height: 'clamp(150px, 20vw, 250px)', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.08)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="position-absolute" style={{ bottom: '-10%', left: '0%', width: 'clamp(250px, 40vw, 400px)', height: 'clamp(250px, 40vw, 400px)', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(60px)', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />

      <div className="fhhf-container position-relative py-5 w-100" style={{ zIndex: 1 }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto"
          style={{ maxWidth: '800px', y: yContent }}
        >
          <div className="mx-auto mb-2" style={{ width: '320px', height: '320px' }}>
            <LottieComponent animationData={communityAnim} loop={true} />
          </div>

          <span className="text-secondary d-block mb-3 fw-bold tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>
            {content?.kicker || "Join The Movement"}
          </span>
          <h2 
            className="mb-4 text-white" 
            style={{ fontFamily: 'var(--font-family-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1 }}
            dangerouslySetInnerHTML={{ __html: content?.headline || "Empower a Creative.<br />Transform a Community." }}
          />
          <p className="text-white opacity-75 mb-5 mx-auto" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
            {content?.description || "Whether you're looking to learn, mentor, or support the next generation of fashion and design talent, there is a place for you here."}
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Button variant="primary" className="editorial-btn" style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}>
              {content?.primaryButton?.text || "Become a Partner"}
            </Button>
            <Button variant="outline-light" className="editorial-btn" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              {content?.secondaryButton?.text || "Explore Hub"}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
