import React, { useState } from 'react';
import { Container, Row, Col, Badge, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BsCopy, BsCheck2, BsBank, BsCreditCard, BsShieldCheck } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { addAlert } from '../../redux/slices/uiSlice';
import { BANK_DETAILS as FALLBACK_BANK_DETAILS } from '../../constants/bankDetails';
import ManualTransferModal from './ManualTransferModal';

export default function DonateMethods({ fadeUp, data }) {
  const dispatch = useDispatch();
  const [copiedField, setCopiedField] = useState(null);
  const [activeTier, setActiveTier] = useState(2); // Default to middle tier
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCardDonate = () => {
    dispatch(addAlert({
      variant: 'info',
      message: 'Card & Crypto payments are currently under construction. Please use Direct Bank Transfer.'
    }));
  };

  const tiers = [
    { amount: "₦5,000", desc: "Provides internet data" },
    { amount: "₦20,000", desc: "Sponsors a course" },
    { amount: "₦100,000", desc: "Funds hardware" },
    { amount: "Custom", desc: "Any amount helps" }
  ];

  const paymentHeadline = data?.payment_methods?.headline || "Choose How to Give";
  const paymentDesc = data?.payment_methods?.description || "We process all donations securely. 100% of your contribution goes directly to FHHF educational initiatives.";

  const bankName = data?.bank_details?.bankName || FALLBACK_BANK_DETAILS.bankName;
  const accountName = data?.bank_details?.accountName || FALLBACK_BANK_DETAILS.accountName;
  const accountNumber = data?.bank_details?.accountNumber || FALLBACK_BANK_DETAILS.accountNumber;
  const swiftCode = data?.bank_details?.swiftCode || FALLBACK_BANK_DETAILS.swiftCode;

  return (
    <section id="donate-methods" className="donate-methods-section">
      <Container>
        <Row className="mb-5 text-center justify-content-center">
          <Col lg={8}>
            <motion.h2
              className="fw-bold mb-3 text-light"
              style={{ fontFamily: 'var(--font-family-heading)' }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              dangerouslySetInnerHTML={{ __html: paymentHeadline }}
            />
            <motion.p
              className="text-white-50"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {paymentDesc}
            </motion.p>
          </Col>
        </Row>

        <Row className="g-5 justify-content-center">
          {/* Bank Transfer Card */}
          <Col lg={6}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="h-100"
            >
              <div className="method-card primary">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 rounded-circle text-light" style={{ backgroundColor: 'rgba(108, 92, 231, 0.25)' }}>
                    <BsBank size={24} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1 text-light">Direct Bank Transfer</h4>
                    <p className="text-white-50 small mb-0">Recommended for local contributors</p>
                  </div>
                </div>

                <div className="bg-dark bg-opacity-50 border border-secondary border-opacity-25 rounded-4 p-4 mb-4">
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Bank Name</span>
                    <span className="bank-detail-value">{bankName}</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Account Name</span>
                    <span className="bank-detail-value">{accountName}</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Account Number</span>
                    <div className="bank-detail-value">
                      <span className="fs-5 text-secondary tracking-widest">{accountNumber}</span>
                      <button
                        className="copy-btn"
                        onClick={() => handleCopy(accountNumber, 'accountNumber')}
                        title="Copy Account Number"
                      >
                        {copiedField === 'accountNumber' ? <BsCheck2 className="text-success" /> : <BsCopy />}
                      </button>
                    </div>
                  </div>
                  {swiftCode && (
                    <div className="bank-detail-row">
                      <span className="bank-detail-label">SWIFT / Routing</span>
                      <div className="bank-detail-value">
                        <span>{swiftCode}</span>
                        <button
                          className="copy-btn"
                          onClick={() => handleCopy(swiftCode, 'swiftCode')}
                        >
                          {copiedField === 'swiftCode' ? <BsCheck2 className="text-success" /> : <BsCopy />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-top border-secondary text-center">
                    <p className="text-white-50 small mb-3">Already made a direct transfer?</p>
                    <Button 
                      variant="outline-light" 
                      size="sm" 
                      className="rounded-pill px-4 py-2"
                      onClick={() => setShowTransferModal(true)}
                    >
                      I have made a transfer
                    </Button>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 text-white-50 small">
                  <BsShieldCheck className="text-success" />
                  <span>Transfers are securely verified by our finance team.</span>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Credit Card / Crypto Placeholder */}
          <Col lg={5}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="h-100"
            >
              <div className="method-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 rounded-circle text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <BsCreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1 text-light">Pay with Card</h4>
                    <p className="text-white-50 small mb-0">Instant processing</p>
                  </div>
                  <Badge bg="warning" text="dark" className="ms-auto rounded-pill">Coming Soon</Badge>
                </div>

                <div className="row g-3 mb-4">
                  {tiers.map((tier, idx) => (
                    <div className="col-6" key={idx}>
                      <div
                        className={`donation-tier ${activeTier === idx ? 'active' : ''}`}
                        onClick={() => setActiveTier(idx)}
                      >
                        <div className="donation-tier-amount">{tier.amount}</div>
                        <div className="donation-tier-desc">{tier.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {activeTier === 3 && (
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="number"
                      placeholder="Enter custom amount"
                      className="bg-dark border-secondary text-white py-3 rounded-3"
                    />
                  </Form.Group>
                )}

                <Button
                  variant="light"
                  className="w-100 py-3 fw-bold rounded-pill"
                  onClick={handleCardDonate}
                >
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      
      <ManualTransferModal 
        show={showTransferModal} 
        handleClose={() => setShowTransferModal(false)} 
      />
    </section>
  );
}
