import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function ImpactBand({ fadeUp }) {
  const { data } = useSelector((state) => state.siteContent);
  const content = data?.home?.impact_band;

  const stats = content?.stats || [
    { number: "500+", label: "Creatives Trained" },
    { number: "$120k", label: "Funds Raised" },
    { number: "1,200", label: "Opportunities Created" }
  ];

  return (
    <section className="impact-band position-relative overflow-hidden">
      {/* Background decorations */}
      <div className="position-absolute" style={{ top: '-50%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', border: '40px solid var(--color-secondary)', opacity: 0.05, zIndex: 0, pointerEvents: 'none' }} />
      <div className="position-absolute" style={{ bottom: '-20%', right: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'var(--color-secondary)', opacity: 0.05, zIndex: 0, pointerEvents: 'none' }} />

      <div className="fhhf-container position-relative" style={{ zIndex: 1 }}>
        <div className="row text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={`col-md-4 ${index < stats.length - 1 ? 'mb-4 mb-md-0' : ''}`} 
              variants={fadeUp} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: index > 0 ? "-100px" : undefined }}
            >
              <div className="impact-number">{stat.number}</div>
              <div className="impact-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
