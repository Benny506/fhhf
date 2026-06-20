import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import missionAnim from '../../assets/lotties/mission.json';
import visionAnim from '../../assets/lotties/vision.json';

const LottieComponent = Lottie.default || Lottie;

export default function MissionVision({ fadeUp }) {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.about?.mission_vision;

  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"] // Animation finishes exactly as it centers
  });

  const rotateBg = useTransform(scrollYProgress, [0, 1], [-45, 0]);
  
  // Mission text subtle float
  const yMission = useTransform(scrollYProgress, [0, 1], [40, 0]);

  // Vision card morphs shapes, scales, and rotates
  const borderRadiusVision = useTransform(scrollYProgress, [0, 1], ["6rem", "1.5rem"]);
  const rotateVision = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const scaleVision = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <section ref={containerRef} className="about-section-spacing bg-white position-relative overflow-hidden">
      {/* Dynamic Background decorations */}
      <motion.div className="position-absolute" style={{ top: '10%', right: '-10%', width: 'clamp(300px, 40vw, 600px)', height: 'clamp(300px, 40vw, 600px)', borderRadius: '40%', background: 'var(--color-secondary)', filter: 'blur(80px)', opacity: 0.08, zIndex: 0, pointerEvents: 'none', rotate: rotateBg }} />
      <motion.div className="position-absolute" style={{ bottom: '-5%', left: '-5%', width: 'clamp(200px, 30vw, 400px)', height: 'clamp(200px, 30vw, 400px)', borderRadius: '30%', border: '2px solid rgba(0,31,84,0.03)', zIndex: 0, pointerEvents: 'none', rotate: rotateBg }} />

      <div className="fhhf-container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center">
          <motion.div className="col-lg-6 mb-5 mb-lg-0" style={{ y: yMission }}>
            <div className="d-flex align-items-center mb-0">
              <span className="text-secondary fw-bold tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>
                {content?.missionKicker || "The"}
              </span>
              <div style={{ width: '260px', marginLeft: '0.5rem' }}>
                <LottieComponent animationData={missionAnim} loop={true} />
              </div>
            </div>
            <h2 
              className="hero-headline mb-4" 
              style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--color-primary)', lineHeight: 1.1 }}
              dangerouslySetInnerHTML={{ __html: content?.missionTitle || "Democratizing <br />Creative Success." }}
            />
            <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: 1.8, maxWidth: '90%' }}>
              {content?.missionDescription || "We believe that raw talent is distributed equally, but opportunity is not. Our mission is to bridge that gap by providing unparalleled access to world-class toolkits, mentorship from industry veterans, and sustainable economic pathways."}
            </p>
          </motion.div>
          
          <motion.div className="col-lg-5 offset-lg-1">
            <motion.div 
              className="position-relative p-5" 
              style={{ 
                background: 'var(--color-primary)', 
                color: 'white',
                borderRadius: borderRadiusVision,
                rotate: rotateVision,
                scale: scaleVision
              }}
            >
              {/* Lottie Accent */}
              <div className="position-absolute" style={{ top: '-40px', right: '-30px', width: '120px', height: '120px', opacity: 0.9 }}>
                <LottieComponent animationData={visionAnim} loop={true} />
              </div>

              <h3 className="mb-3 text-light" style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem' }}>
                {content?.visionTitle || "Our Vision"}
              </h3>
              <p className="mb-0 opacity-75 text-light" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                {content?.visionDescription || "To cultivate a global ecosystem where independent fashion designers and creatives can thrive sustainably, turning passion into a lifelong, profitable career. To cultivate a global ecosystem where independent fashion designers and creatives can thrive sustainably, turning passion into a lifelong, profitable career. To cultivate a global ecosystem where independent fashion designers and creatives can thrive sustainably, turning passion into a lifelong, profitable career."}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
