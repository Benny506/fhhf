import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BsArrowDown } from 'react-icons/bs';

export default function DonateHero({ fadeUp, data }) {
  const badge = data?.badge || 'Support The Mission';
  const headline = data?.headline || 'Empower the Next Generation of <span>Innovators</span>';
  const description = data?.description || 'Your contribution directly funds scholarships, provides essential learning equipment, and supports instructors in delivering world-class education to those who need it most.';
  const buttonText = data?.buttonText || 'Make a Donation';

  const scrollToMethods = () => {
    const el = document.getElementById('donate-methods');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="donate-hero">
      <div className="donate-glow-orb primary" />
      <div className="donate-glow-orb accent" />

      <Container className="donate-hero-content text-center">
        <Row className="justify-content-center">
          <Col lg={8}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="donate-badge text-uppercase fw-bold text-white-50">
                {badge}
              </div>
            </motion.div>

            <motion.h1 
              className="donate-heading fw-bold"
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              transition={{ delay: 0.1 }}
              dangerouslySetInnerHTML={{ __html: headline }}
            />

            <motion.p 
              className="lead text-white-50 mb-5 mx-auto" 
              style={{ maxWidth: '600px' }}
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>

            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              transition={{ delay: 0.3 }}
              className="d-flex flex-column flex-sm-row justify-content-center gap-3"
            >
              <Button variant="primary" size="lg" className="rounded-pill px-4 shadow-lg" onClick={scrollToMethods}>
                {buttonText}
              </Button>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Scroll indicator */}
      <motion.div 
        className="position-absolute bottom-0 start-50 translate-middle-x mb-5"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ cursor: 'pointer' }}
        onClick={scrollToMethods}
      >
        <BsArrowDown size={24} className="text-white-50" />
      </motion.div>
    </section>
  );
}
