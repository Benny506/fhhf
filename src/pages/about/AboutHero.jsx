import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function AboutHero() {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.about?.hero_section;

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="about-hero">
      <motion.div className="about-hero-img-wrapper" style={{ y: yBg }}>
        <img
          src={content?.image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"}
          alt="Creative Workshop"
        />
        {/* Dark overlay for text readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,31,84,0.3), rgba(0,31,84,0.8))' }} />
      </motion.div>

      <motion.div className="about-hero-content fhhf-container" style={{ y: yText, opacity: opacityText }}>
        <motion.h1
          className="about-hero-title text-light"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          dangerouslySetInnerHTML={{ __html: content?.title || "Our Purpose." }}
        />
        <motion.p
          className="about-hero-subtitle text-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {content?.subtitle || "We are building the definitive launchpad for the next generation of creative visionaries."}
        </motion.p>
      </motion.div>
    </section>
  );
}
