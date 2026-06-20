import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';

// Extracted component to dynamically calculate Framer Motion maps for N blocks
const StoryImageItem = ({ block, index, totalBlocks, scrollYProgress }) => {
  const C = 1 / totalBlocks;
  const fadeDur = C * 0.3; // crossfade takes 30% of the segment
  const fadeStart = index * C - fadeDur;
  const fadeEnd = index * C;
  const fadeOutStart = (index + 1) * C - fadeDur;
  const fadeOutEnd = (index + 1) * C;

  const opacityInput = [];
  const opacityOutput = [];

  if (index === 0) {
    opacityInput.push(0, fadeOutStart, fadeOutEnd);
    opacityOutput.push(1, 1, 0);
  } else if (index === totalBlocks - 1) {
    opacityInput.push(fadeStart, fadeEnd, 1);
    opacityOutput.push(0, 1, 1);
  } else {
    opacityInput.push(fadeStart, fadeEnd, fadeOutStart, fadeOutEnd);
    opacityOutput.push(0, 1, 1, 0);
  }

  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);

  const scaleStart = index === 0 ? 0 : fadeStart;
  const scaleEnd = index === totalBlocks - 1 ? 1 : fadeOutEnd;
  const scale = useTransform(scrollYProgress, [scaleStart, scaleEnd], [1, 1.1]);

  return (
    <motion.img 
      src={block?.image} 
      alt={block?.kicker} 
      className="w-100 h-100 position-absolute top-0 start-0"
      style={{ objectFit: 'cover', scale, opacity }}
    />
  );
};

export default function OurStory({ fadeUp }) {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.about?.our_story;

  const defaultBlocks = [
    {
      kicker: "The Genesis",
      title: "From a Single Stitch <br /> to a Global Movement.",
      description: "Freedom Haute Humanitarian Foundation was born out of a stark realization: the fashion industry is filled with brilliant minds who lack the foundational business toolkit to survive. We saw incredible designers shutting down simply because they didn't have access to the right mentorship or funding.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
    },
    {
      kicker: "Building the Hub",
      title: "A Comprehensive <br /> Learning Ecosystem.",
      description: "We started by hosting small, local workshops focusing on the unglamorous side of fashion: unit economics, supply chain management, and digital marketing. The response was overwhelming. What started as a local initiative quickly grew into a demand for a comprehensive, scalable learning hub.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
    },
    {
      kicker: "The Future",
      title: "Investing in <br /> Creative Leaders.",
      description: "Today, FHHF operates on a global scale. We're not just teaching; we're actively investing in the next generation of creative leaders through grants and fellowships. We are building the infrastructure that allows creativity to become a sustainable, generational wealth-building career.",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  const blocks = content?.blocks || defaultBlocks;

  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] 
  });

  const rotateBlob = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const yEnd = blocks.length > 1 ? `-${((blocks.length - 1) / blocks.length) * 100}%` : "0%";
  const yTextTrack = useTransform(scrollYProgress, [0, 1], ["0%", yEnd]);

  return (
    <>
      {/* DESKTOP LAYOUT (Full Scroll Hijacking) */}
      <div className="d-none d-lg-block">
        <section ref={containerRef} className="story-hijack-track" style={{ height: `${(blocks.length + 1) * 100}vh` }}>
          <div className="story-hijack-sticky">
        
        {/* LEFT COLUMN: TEXT */}
        <div className="story-hijack-text-col">
          <motion.div className="position-absolute" style={{ top: '20%', right: '-10%', width: '600px', height: '600px', borderRadius: '40%', border: '2px dashed var(--color-secondary)', opacity: 0.1, zIndex: 0, rotate: rotateBlob }} />
          
          <motion.div className="hijack-text-slide-track position-relative" style={{ y: yTextTrack, zIndex: 1, height: `${blocks.length * 100}%` }}>
            
            {blocks.map((block, i) => (
              <div key={i} className="hijack-text-block" style={{ height: `${100 / blocks.length}%` }}>
                <span className="text-secondary d-block mb-3 fw-bold tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>
                  {block.kicker}
                </span>
                <h2 className="hero-headline mb-4" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', color: 'var(--color-primary)' }} dangerouslySetInnerHTML={{ __html: block.title }} />
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {block.description}
                </p>
              </div>
            ))}

          </motion.div>
        </div>

        {/* RIGHT COLUMN: IMAGES */}
        <div className="story-hijack-image-col bg-dark position-relative">
          {blocks.map((block, i) => (
            <StoryImageItem 
              key={i} 
              block={block} 
              index={i} 
              totalBlocks={blocks.length} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>

        </div>
      </section>
    </div>

      {/* MOBILE LAYOUT (Stacked Grid) */}
      <div className="d-block d-lg-none">
        <section className="about-section-spacing" style={{ backgroundColor: 'var(--color-bg-light)' }}>
          <div className="fhhf-container">
            
            <div className="mb-5 text-center">
              <span className="text-secondary d-block mb-3 fw-bold tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>
                {content?.kicker || "Our Story"}
              </span>
              <h2 className="hero-headline" style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', color: 'var(--color-primary)' }}>
                {content?.title || "How We Started."}
              </h2>
            </div>

            {blocks.map((block, i) => (
              <motion.div key={i} className={i < blocks.length - 1 ? "mb-5 pb-5 border-bottom" : ""} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
                <img 
                  src={block.image} 
                  alt={block.kicker} 
                  className="w-100 rounded-4 mb-4 shadow-sm" 
                  style={{ height: '300px', objectFit: 'cover' }} 
                />
                <span className="text-secondary d-block mb-2 fw-bold tracking-widest text-uppercase" style={{ letterSpacing: '3px' }}>{block.kicker}</span>
                <h2 className="hero-headline mb-3" style={{ fontSize: '2rem', color: 'var(--color-primary)' }} dangerouslySetInnerHTML={{ __html: block.title }} />
                <p className="text-muted" style={{ lineHeight: 1.8 }}>
                  {block.description}
                </p>
              </motion.div>
            ))}

          </div>
        </section>
      </div>
    </>
  );
}
