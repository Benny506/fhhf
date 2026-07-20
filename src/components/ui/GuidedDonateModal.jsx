import React from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { hideDonateModal } from '../../redux/slices/uiSlice';
import DonateMethods from '../../pages/donate/DonateMethods';

export default function GuidedDonateModal() {
  const dispatch = useDispatch();
  const { isOpen, context } = useSelector((state) => state.ui.donateModal);

  const handleClose = () => {
    dispatch(hideDonateModal());
  };

  // Determine tailored copy based on context
  const getContextCopy = () => {
    switch (context) {
      case 'toolkit':
        return {
          title: 'Sponsor a Toolkit',
          description: 'A complete toolkit provides a creative with the essential hardware, software, and resources they need to start producing independently. Your contribution directly funds their success.',
          cards: [
            { title: 'Professional Hardware', desc: 'High-quality laptops, specialized gear, or production equipment for their craft.' },
            { title: 'Software & Licenses', desc: 'Access to industry-standard creative suites and professional digital tools.' },
            { title: 'Starter Materials', desc: 'Premium resources and materials to help them build their first portfolio.' },
          ]
        };
      case 'creative':
        return {
          title: 'Support a Creative',
          description: 'Empower a talented individual to learn, create, and build a sustainable livelihood in their chosen industry. Your support changes lives.',
          cards: [
            { title: 'Skill Acquisition', desc: 'Fund a student\'s enrollment in our comprehensive training programs.' },
            { title: 'Mentorship', desc: 'Provide 1-on-1 guidance from seasoned industry veterans.' },
            { title: 'Business Incubation', desc: 'Help them launch their own micro-brand or freelance career after graduation.' },
          ]
        };
      case 'partner':
        return {
          title: 'Become a Partner',
          description: 'Join hands with us to scale our impact. Your financial partnership allows us to expand our facilities, digital courses, and community reach.',
          cards: [
            { title: 'Brand Visibility', desc: 'Get your company\'s logo featured on our physical hubs and digital platforms.' },
            { title: 'Impact Reports', desc: 'Receive detailed quarterly reports on the lives you\'ve empowered.' },
            { title: 'Community Events', desc: 'Exclusive invites to our exhibitions, showcases, and networking events.' },
          ]
        };
      default:
        return {
          title: 'Make a Contribution',
          description: 'Your generous donation helps us continue our mission of empowering global creatives through skill acquisition and technology.',
          cards: [
            { title: 'Education', desc: 'Fund a scholarship for an aspiring creative.' },
            { title: 'Infrastructure', desc: 'Help us maintain and upgrade our modern training hubs.' },
            { title: 'Sustainability', desc: 'Support our ongoing operations and community outreach programs.' },
          ]
        };
    }
  };

  const copy = getContextCopy();

  // Create a minimal fade-up variant for the modal contents
  const modalFadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      size="xl"
      centered
      className="guided-donate-modal"
      contentClassName="bg-dark border-secondary"
      backdrop="static"
      scrollable={true}
    >
      <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25 pb-4">
        <div className="w-100 text-center pt-3">
          <h3 className="fw-bold text-light mb-2" style={{ fontFamily: 'var(--font-family-heading)' }}>
            {copy.title}
          </h3>
          <p className="text-white-50 mb-0 px-3">
            {copy.description}
          </p>
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-0" data-lenis-prevent="true">
        <div className="bg-dark px-4 pt-4 pb-2">
          <Row className="g-3">
            {copy.cards.map((card, idx) => (
              <Col md={4} key={idx}>
                <div className="bg-black rounded-3 p-3 h-100 border border-secondary border-opacity-25 shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <BsCheckCircleFill className="text-primary" />
                    <h6 className="text-light fw-bold mb-0">{card.title}</h6>
                  </div>
                  <p className="text-white-50 small mb-0 lh-sm">{card.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <DonateMethods fadeUp={modalFadeUp} isModal={true} />
      </Modal.Body>
    </Modal>
  );
}
