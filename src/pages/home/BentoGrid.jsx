import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';

import skillsAnim from '../../assets/lotties/skills.json';
import mentorshipAnim from '../../assets/lotties/donation-1.json';
import communityAnim from '../../assets/lotties/community-3.json';
import empowermentAnim from '../../assets/lotties/donation.json';

// Handle potential ESM default export wrapping
const LottieComponent = Lottie.default || Lottie;

export default function BentoGrid({ fadeUp }) {
  const { data } = useSelector((state) => state.siteContent);
  const content = data?.home?.bento_grid;

  const headline = content?.headline || "From Learning... To Earning";
  const description = content?.description || "We provide an end-to-end ecosystem that nurtures talent from the first stitch to the final sale.";

  const defaultCards = [
    {
      id: "skills",
      title: "Skills Development",
      description: "Access to high-quality training hubs, both free and premium, tailored for the modern creative.",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop"
    },
    { id: "mentorship", title: "Mentorship", description: "Guidance from industry veterans." },
    { id: "community", title: "Community", description: "A network of safe opportunities." },
    {
      id: "empowerment",
      title: "Economic Empowerment",
      description: "Grants, fellowships, and a premium circle designed to help you monetize your craft sustainably.",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const cards = (content?.cards && content.cards.length >= 4) ? content.cards : defaultCards;

  // Staggered entrance for the grid cards
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const containerRef = useRef(null);

  // Scroll reveal only for the image cards
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yCard1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yCard4 = useTransform(scrollYProgress, [0, 1], [-50, 80]);

  const isOdd = cards.length % 2 !== 0;
  const gridCards = isOdd ? cards.slice(0, -1) : cards;
  const lastCard = isOdd ? cards[cards.length - 1] : null;

  return (
    <section ref={containerRef} className="fhhf-container position-relative py-5 my-5">
      {/* Background soft mesh gradients - Responsive and visible on all screens */}
      <div className="position-absolute" style={{ top: '15%', right: '-5%', width: 'clamp(250px, 40vw, 500px)', height: 'clamp(250px, 40vw, 500px)', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(80px)', opacity: 0.08, zIndex: -1, pointerEvents: 'none' }} />
      <div className="position-absolute" style={{ bottom: '10%', left: '-5%', width: 'clamp(300px, 50vw, 600px)', height: 'clamp(300px, 50vw, 600px)', borderRadius: '50%', background: 'var(--color-primary)', filter: 'blur(100px)', opacity: 0.05, zIndex: -1, pointerEvents: 'none' }} />

      <motion.div className="text-center mb-5 position-relative" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ zIndex: 1 }}>
        <h2 className="hero-headline mb-3" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--color-primary)' }}>
          {headline}
        </h2>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
          {description}
        </p>
      </motion.div>

      <motion.div
        className="bento-grid"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {gridCards.map((card, index) => {
          let cardClass = '';
          if (index === 0) cardClass = 'bento-card-large';
          else if (index === 1 || index === 2) cardClass = 'bento-card-medium';
          else if (index === 3) cardClass = 'bento-card-large';
          else {
            cardClass = index % 2 === 0 ? 'bento-card-large' : 'bento-card-medium';
          }

          // Decide animation and visual logic based on index
          const yStyle = index % 2 === 0 ? yCard1 : yCard4;
          const bgStyle = (index === 1 || index === 2)
            ? { background: 'var(--color-white)' }
            : { y: yStyle };
          const isLottie = index === 1 || index === 2;

          return (
            <motion.div key={card.id || index} className={`bento-card ${cardClass} shadow-sm`} variants={cardVariants} style={bgStyle}>
              {isLottie ? (
                <div className="bento-lottie">
                  <LottieComponent animationData={index === 1 ? mentorshipAnim : communityAnim} loop={true} />
                </div>
              ) : (
                <img src={card.image || "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop"} alt={card.title} className="bento-image" />
              )}

              <div className="bento-overlay">
                <h3 className="bento-title">{card.title}</h3>
                <p className="mb-0 text-secondary">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {lastCard && (
        <motion.div
          className="bento-card shadow-sm w-100"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true, amount: 0.1 }}
          style={{ minHeight: '350px', marginTop: '80px' }}
        >
          <img src={lastCard.image || "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop"} alt={lastCard.title} className="bento-image" />
          <div className="bento-overlay">
            <h3 className="bento-title">{lastCard.title}</h3>
            <p className="mb-0 text-secondary">{lastCard.description}</p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
