import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function FaqSection({ fadeUp }) {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.contact?.faq_section;

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const defaultFaqs = [
    {
      question: "How do I apply for a toolkit grant?",
      answer: "Toolkit grants open twice a year (Spring and Fall). When applications are open, a link will be provided on our homepage. We evaluate candidates based on creative merit, financial need, and community impact."
    },
    {
      question: "Do you offer online mentorship?",
      answer: "Yes, our learning ecosystem includes both localized in-person hubs and a comprehensive online academy accessible to creatives worldwide. You can enroll in specific modules or apply for full-stack mentorship."
    },
    {
      question: "How can my company partner with FHHF?",
      answer: "We are always looking for corporate partners to sponsor grants or provide industry expertise. Please select 'Partnership/Sponsorship' in the contact form above, and our development team will reach out to discuss bespoke partnership opportunities."
    },
    {
      question: "Is FHHF a registered non-profit?",
      answer: "Yes, Freedom Haute Humanitarian Foundation is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the extent allowed by law."
    }
  ];

  const faqs = content?.faqs || defaultFaqs;

  return (
    <section className="contact-section-spacing" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <div className="fhhf-container">
        <div className="row justify-content-center">
          <motion.div
            className="col-lg-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center mb-5">
              <span className="text-secondary fw-bold tracking-widest text-uppercase mb-3 d-block" style={{ letterSpacing: '4px' }}>
                {content?.kicker || "FAQs"}
              </span>
              <h2 className="hero-headline text-primary mb-4" style={{ fontSize: '2.5rem' }}>
                {content?.title || "Frequently Asked Questions"}
              </h2>
            </div>

            <div className="accordion faq-accordion">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div className="accordion-item" key={index} style={{ borderBottom: '1px solid rgba(0, 31, 84, 0.1)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', backgroundColor: 'transparent' }}>
                    <h2 className="accordion-header m-0">
                      <button
                        className="accordion-button shadow-none bg-transparent d-flex justify-content-between align-items-center w-100 text-start border-0 py-4"
                        onClick={() => toggleFaq(index)}
                        style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.2rem', paddingLeft: 0, paddingRight: 0 }}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="accordion-body pb-4" style={{ color: '#4a5568', lineHeight: 1.8, fontSize: '1.1rem', paddingLeft: 0, paddingRight: 0 }}>
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
