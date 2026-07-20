import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BsCopy, BsCheck2, BsBank, BsCreditCard, BsShieldCheck } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { addAlert } from '../../redux/slices/uiSlice';
import { EMAIL_CONFIG } from '../../constants/adminConstants';
import { BANK_DETAILS as FALLBACK_BANK_DETAILS } from '../../constants/bankDetails';
import { PAYSTACK_CONFIG } from '../../utils/paystack';
import ManualTransferModal from './ManualTransferModal';

export default function DonateMethods({ fadeUp, data, isModal = false }) {
  const dispatch = useDispatch();
  const [copiedField, setCopiedField] = useState(null);
  const [activeTier, setActiveTier] = useState(2); // Default to middle tier
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getSelectedAmount = () => {
    if (activeTier === 3) return customAmount ? parseFloat(customAmount) : 0;
    const tierMapping = { 0: 5000, 1: 20000, 2: 100000 };
    return tierMapping[activeTier] || 0;
  };

  const handleCardDonate = (e) => {
    if (e) e.preventDefault();
    const amount = getSelectedAmount();
    if (amount <= 0) {
      dispatch(addAlert({ variant: 'warning', message: 'Please select or enter a valid amount.' }));
      return;
    }

    if (!window.PaystackPop) {
      dispatch(addAlert({ variant: 'danger', message: 'Payment gateway is still loading. Please try again in a moment.' }));
      return;
    }

    const paystackEmail = donorEmail.trim() || EMAIL_CONFIG.ADMIN_EMAIL;

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_CONFIG.PUBLIC_KEY,
      email: paystackEmail,
      amount: amount * 100, // Convert to kobo
      metadata: {
        transaction_type: 'fhhf_donation',
        donor_name: donorName.trim() || 'Anonymous',
        donor_phone: donorPhone.trim() || null,
        original_donor_email: donorEmail.trim() || null,
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: donorName.trim() || 'Anonymous'
          },
          {
            display_name: "Phone Number",
            variable_name: "donor_phone",
            value: donorPhone.trim() || 'N/A'
          }
        ]
      },
      callback: function(response) {
        dispatch(addAlert({
          title: 'Payment Successful',
          message: 'Thank you for your generous donation! A receipt has been sent to your email.',
          variant: 'success'
        }));
        // Reset form
        setDonorName('');
        setDonorEmail('');
        setDonorPhone('');
        setCustomAmount('');
      },
      onClose: function() {
        dispatch(addAlert({ variant: 'info', message: 'Payment window closed.' }));
      }
    });

    handler.openIframe();
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
    <section id="donate-methods" className={isModal ? 'py-2' : 'donate-methods-section'}>
      <Container>
        {!isModal && (
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
        )}

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

          {/* Secure Online Payment */}
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
                    <p className="text-white-50 small mb-0">Secure instant processing</p>
                  </div>
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
                  <Form.Group className="mb-4 position-relative" data-bs-theme="dark">
                    <div className="position-absolute top-50 start-0 translate-middle-y ms-4 text-white-50 fw-bold fs-5">₦</div>
                    <Form.Control
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="bg-black border-secondary border-opacity-50 text-white py-3 ps-5 pe-4 rounded-4 fs-5"
                      style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)' }}
                    />
                  </Form.Group>
                )}

                <Form onSubmit={handleCardDonate}>
                  <div className="mb-4" data-bs-theme="dark">
                    <Form.Group className="mb-3">
                      <Form.Control 
                        type="email" 
                        placeholder="Email Address (Optional)" 
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="bg-dark border-secondary text-white py-2"
                      />
                    </Form.Group>
                    <Row className="g-3">
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Control 
                            type="text" 
                            placeholder="Full Name (Optional)" 
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="bg-dark border-secondary text-white py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Control 
                            type="tel" 
                            placeholder="Phone (Optional)" 
                            value={donorPhone}
                            onChange={(e) => setDonorPhone(e.target.value)}
                            className="bg-dark border-secondary text-white py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <Button
                    variant="light"
                    type="submit"
                    className="w-100 py-3 fw-bold rounded-pill"
                  >
                    Continue to Payment
                  </Button>
                </Form>
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
