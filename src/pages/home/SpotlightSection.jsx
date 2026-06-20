import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BsArrowRight } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import skillsAnim from '../../assets/lotties/community-1.json';

const LottieComponent = Lottie.default || Lottie;

export default function SpotlightSection({ fadeUp }) {
  const { data } = useSelector((state) => state.siteContent);
  const content = data?.home?.spotlight_section;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"] // Animate as it enters the screen until it's centered
  });

  // Imaginative Scroll Effects
  // Image scales up, straightens from a tilt, and border radius sharpens
  const scaleImage = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const rotateImage = useTransform(scrollYProgress, [0, 1], [-8, 0]);
  const borderRadiusImage = useTransform(scrollYProgress, [0, 1], ["40%", "2rem"]);

  // Content slides in from the right with a blur-like fade
  const xText = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Lottie badge scale and float
  const scaleLottie = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const yLottie = useTransform(scrollYProgress, [0, 1], [50, -20]);
  const yCard = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={containerRef} className="spotlight-section position-relative py-5 my-5 overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>

      {/* Small circular bg at top right */}
      <div className="position-absolute" style={{ top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--color-secondary)', opacity: 0.05, zIndex: 0 }} />

      <div className="fhhf-container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center">
          <motion.div className="col-lg-5 mb-5 mb-lg-0 position-relative">
            <motion.div
              className="spotlight-image-wrapper"
              style={{
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,31,84,0.15)',
                height: '650px',
                scale: scaleImage,
                rotate: rotateImage,
                borderRadius: borderRadiusImage
              }}
            >
              <motion.img
                src={content?.image || "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=1973&auto=format&fit=crop"}
                alt="Featured Creative"
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>

            {/* Lottie Badge overlapping the image instead of a background */}
            <motion.div
              className="position-absolute shadow-lg d-none d-lg-flex"
              style={{
                top: '-3rem',
                left: '-3rem',
                width: '140px',
                height: '140px',
                background: 'var(--color-white)',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                border: '8px solid var(--color-bg-light)',
                scale: scaleLottie,
                y: yLottie,
                zIndex: 2
              }}
            >
              <div style={{ width: '70%', height: '70%' }}>
                <LottieComponent animationData={skillsAnim} loop={true} />
              </div>
            </motion.div>

            {/* Overlapping Glass Card with separate parallax */}
            <motion.div
              className="position-absolute p-4 shadow-lg d-none d-md-block"
              style={{
                bottom: '-2rem',
                right: '-3rem',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1.5rem',
                border: '1px solid rgba(255,255,255,0.5)',
                maxWidth: '280px',
                y: yCard
              }}
            >
              <h5 className="mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-family-heading)', fontWeight: '700', fontSize: '1.5rem' }}>
                {content?.glassCard?.title || "\"Life Changing\""}
              </h5>
              <p className="small mb-0 text-secondary" style={{ lineHeight: 1.6 }}>
                {content?.glassCard?.description || "The toolkit grant allowed me to launch my own bespoke tailoring line within months."}
              </p>
            </motion.div>
          </motion.div>

          <motion.div className="col-lg-5 offset-lg-2 mt-5 mt-lg-0" style={{ x: xText, opacity: opacityText }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-secondary)' }}></span>
              <h4 className="text-secondary fw-bold text-uppercase m-0" style={{ letterSpacing: '2px', fontSize: '0.85rem' }}>
                {content?.badgeText || "Featured Program"}
              </h4>
            </div>
            <h2 className="hero-headline mb-4" style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', color: 'var(--color-primary)' }}>
              {content?.headline || "The Fashion Design Toolkit Initiative"}
            </h2>
            <p className="text-secondary mb-5" style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
              {content?.description || "Many brilliant minds lack the basic tools to start their journey. By sponsoring a toolkit, you directly equip a creative with the sewing machines, fabrics, and equipment they need to launch their career."}
            </p>
            <Button variant="primary" className="editorial-btn shadow-lg d-inline-flex align-items-center gap-3">
              {content?.button?.text || "Sponsor a Toolkit"} <BsArrowRight size={20} />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
