import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Form, Alert } from 'react-bootstrap';
import { BsSendFill } from 'react-icons/bs';

export default function ContactForm({ fadeUp }) {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      e.target.reset();
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const fields = {
    nameLabel: "Full Name *",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email Address *",
    emailPlaceholder: "jane@example.com",
    typeLabel: "Inquiry Type",
    typeOptions: [
      "General Question",
      "Grant Application Inquiry",
      "Partnership/Sponsorship",
      "Media & Press"
    ],
    messageLabel: "Your Message *",
    messagePlaceholder: "How can we help you today?",
    buttonText: "Send Message",
    buttonLoadingText: "Sending Message..."
  };

  const parsedTypeOptions = fields.typeOptions;

  return (
    <section className="contact-section-spacing bg-white position-relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="position-absolute" style={{ top: '-10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />

      <div className="fhhf-container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <motion.div 
            className="col-lg-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center mb-5">
              <h2 className="hero-headline text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                Drop Us a Message
              </h2>
              <p className="text-secondary">
                Fill out the form below and our team will get back to you within 24-48 hours.
              </p>
            </div>

            <div className="contact-glass-card rounded-4 p-4 p-md-5">
              {status === 'success' && (
                <Alert variant="success" className="mb-4 rounded-3 border-0 bg-success text-white" style={{ opacity: 0.9 }}>
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-check-circle-fill fs-4"></i>
                    <div>
                      <strong>Message Sent Successfully!</strong>
                      <div className="small">We've received your inquiry and will be in touch shortly.</div>
                    </div>
                  </div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>{fields.nameLabel}</Form.Label>
                      <Form.Control type="text" required className="contact-input" placeholder={fields.namePlaceholder} disabled={status === 'loading'} />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>{fields.emailLabel}</Form.Label>
                      <Form.Control type="email" required className="contact-input" placeholder={fields.emailPlaceholder} disabled={status === 'loading'} />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>{fields.typeLabel}</Form.Label>
                  <Form.Select className="contact-input" disabled={status === 'loading'}>
                    {parsedTypeOptions.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Label className="fw-bold text-primary small text-uppercase tracking-widest mb-2" style={{ letterSpacing: '1px' }}>{fields.messageLabel}</Form.Label>
                  <Form.Control as="textarea" rows={5} required className="contact-input" placeholder={fields.messagePlaceholder} disabled={status === 'loading'} />
                </Form.Group>

                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="editorial-btn w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-3"
                      disabled={status === 'loading'}
                      style={{ fontSize: '1.1rem' }}
                    >
                      {status === 'loading' ? fields.buttonLoadingText : fields.buttonText} 
                      {status !== 'loading' && <BsSendFill />}
                    </Button>
                  </motion.div>
                </div>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
