import React from 'react';
import { Button } from 'react-bootstrap';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';
import { showDonateModal } from '../../redux/slices/uiSlice';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const { data } = useSelector((state) => state.siteContent);
  const content = data?.home?.hero_section;
  const dispatch = useDispatch();

  // Parallax effects updated: text moves up slightly and fades out faster
  const yText = useTransform(scrollY, [0, 400], [0, -100]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  const scaleImage = useTransform(scrollY, [0, 1000], [1, 1.15]);
  const yImage = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <section className="immersive-hero">
      {/* Parallax Background */}
      <motion.div
        className="immersive-hero-bg"
        style={{ y: yImage, scale: scaleImage }}
      >
        <img
          src={content?.backgroundImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"}
          alt="Haute Fashion Creative"
        />
        <div className="immersive-hero-overlay"></div>
      </motion.div>

      {/* Parallax Content */}
      <motion.div
        className="immersive-hero-content fhhf-container"
        style={{ y: yText, opacity: opacityText }}
      >
        <div className="text-center w-100">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h4 className="hero-kicker">
              {content?.kicker || "Freedom Haute Humanitarian Foundation"}
            </h4>
            <h1
              className="hero-display-title"
              dangerouslySetInnerHTML={{ __html: content?.title || "Empowering<br />Creatives." }}
            />
          </motion.div>

          <motion.p
            className="hero-display-subtitle mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            {content?.subtitle || "Creating safe opportunities, nurturing talent, and building sustainable income streams from the first stitch to the final sale."}
          </motion.p>
        </div>
      </motion.div>

      {/* Floating Action Bar */}
      <motion.div
        className="hero-action-bar"
        initial={{ opacity: 0, y: 100, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      >
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
          <Button onClick={() => dispatch(showDonateModal({ context: 'creative' }))} variant="primary" size="lg" className="hero-btn shadow-lg">
            {content?.primaryButton?.text || "Support a Creative"}
          </Button>
          <span className="text-white opacity-50 d-none d-md-block">✦</span>
          <Button 
            href="https://chat.whatsapp.com/KQBfStEqlaM3pkChG81n7Z"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light" 
            size="lg" 
            className="hero-btn hero-btn-outline"
          >
            {content?.secondaryButton?.text || "Join the Hub"}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
