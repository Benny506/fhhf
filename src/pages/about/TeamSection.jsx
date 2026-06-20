import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function TeamSection({ fadeUp }) {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.about?.team_section;

  const defaultTeamMembers = [
    {
      name: "Elena Rostova",
      role: "Founder & Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
    },
    {
      name: "Marcus Chen",
      role: "Head of Mentorship",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
    },
    {
      name: "Sarah Jenkins",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    },
    {
      name: "David Okafor",
      role: "Operations Lead",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=1935&auto=format&fit=crop"
    }
  ];

  const teamMembers = content?.teamMembers || defaultTeamMembers;

  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateBg = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yCardEven = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yCardOdd = useTransform(scrollYProgress, [0, 1], [-20, 80]);
  
  // Stagger variants for the team grid
  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section ref={containerRef} className="about-section-spacing bg-white position-relative overflow-hidden">
      {/* Hijacked rotating background meshes */}
      <motion.div className="position-absolute" style={{ top: '10%', right: '5%', width: 'clamp(300px, 50vw, 700px)', height: 'clamp(300px, 50vw, 700px)', borderRadius: '35%', background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.05, zIndex: 0, pointerEvents: 'none', rotate: rotateBg }} />
      <motion.div className="position-absolute" style={{ bottom: '5%', left: '5%', width: 'clamp(250px, 40vw, 500px)', height: 'clamp(250px, 40vw, 500px)', borderRadius: '45%', border: '4px solid var(--color-secondary)', opacity: 0.06, zIndex: 0, pointerEvents: 'none', rotate: rotateBg }} />

      <div className="fhhf-container position-relative" style={{ zIndex: 1 }}>
        <motion.div className="text-center mb-5 pb-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-secondary d-block mb-3 fw-bold tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>
            {content?.kicker || "The People"}
          </span>
          <h2 className="hero-headline" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--color-primary)' }}>
            {content?.title || "Meet the Team."}
          </h2>
        </motion.div>

        <motion.div 
          className="row g-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index} 
              className="col-12 col-sm-6 col-lg-3" 
              variants={itemVariants}
              style={{ y: index % 2 === 0 ? yCardEven : yCardOdd }}
            >
              <div className="team-card shadow-sm">
                <div className="team-image-wrapper">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h4 className="team-name">{member.name}</h4>
                  <span className="team-role">{member.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
