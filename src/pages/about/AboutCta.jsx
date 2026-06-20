import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';

export default function AboutCta({ fadeUp }) {
  return (
    <section className="position-relative py-5 overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
      {/* Background decorations */}
      <div className="position-absolute" style={{ top: '-10%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(80px)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }} />
      <div className="position-absolute" style={{ bottom: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.05)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="fhhf-container position-relative py-5 my-4" style={{ zIndex: 1 }}>
        <div className="row justify-content-center text-center">
          <motion.div className="col-lg-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-family-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2 }}>
              Ready to Shape the Future of Fashion?
            </h2>
            <p className="text-white opacity-75 mb-5 mx-auto" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
              Whether you are an emerging designer looking for a launchpad or an established brand looking to partner, FHHF is your community.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button variant="primary" className="editorial-btn" style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}>
                Partner With Us
              </Button>
              <Button variant="outline-light" className="editorial-btn" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                View Programs
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
