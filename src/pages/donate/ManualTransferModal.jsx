import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { showAppLoader, hideAppLoader, addAlert } from '../../redux/slices/uiSlice';
import supabase from '../../utils/supabase';
import { uploadAsset } from '../../utils/uploadApi';

export default function ManualTransferModal({ show, handleClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    donor_address: '',
    amount: ''
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setReceiptFile(file);

      // Generate preview
      if (previewUrl) URL.revokeObjectURL(previewUrl); // cleanup previous

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      if (file.type.startsWith('image/')) {
        setPreviewType('image');
      } else if (file.type === 'application/pdf') {
        setPreviewType('pdf');
      } else {
        setPreviewType('unknown');
      }
    } else {
      setReceiptFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  const handleClearFile = () => {
    setReceiptFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please provide a valid amount transferred.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    dispatch(showAppLoader("Submitting transfer report..."));

    try {
      let receipt_url = null;
      let receipt_type = null;

      // 1. Upload receipt if provided
      if (receiptFile) {
        const { filePaths, error: uploadErr, fileType } = await uploadAsset({
          file: receiptFile,
          bucket_name: 'fhhf_donations_receipts',
          sku: `receipt_${Date.now()}`
        });

        if (uploadErr) throw new Error("Failed to upload receipt. Please try again.");
        if (filePaths && filePaths.length > 0) {
          receipt_url = filePaths[0];
          receipt_type = fileType;
        }
      }

      // 2. Insert into database
      const { error: dbError } = await supabase
        .from('fhhf_donations')
        .insert([{
          donor_name: formData.donor_name || null,
          donor_email: formData.donor_email || null,
          donor_phone: formData.donor_phone || null,
          donor_address: formData.donor_address || null,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          receipt_url,
          receipt_type,
          payment_method: 'manual_transfer',
          status: 'pending'
        }]);

      if (dbError) {
        throw dbError;
      }

      // Reset form
      setFormData({ donor_name: '', donor_email: '', donor_phone: '', donor_address: '', amount: '' });
      handleClearFile();
      
      handleClose();
      dispatch(addAlert({
        title: "Success",
        message: "Thank you! Your transfer report has been submitted and is pending confirmation.",
        variant: "success"
      }));
    } catch (err) {
      console.error("Donation Report Error:", err);
      setError(err.message || "An error occurred while submitting your report.");
    } finally {
      setIsSubmitting(false);
      dispatch(hideAppLoader());
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size='lg'
      backdrop="static"
      data-lenis-prevent
      contentClassName="bg-white text-dark border-0 shadow-lg rounded-4"
    >
      <Modal.Header closeButton className="border-bottom border-light">
        <Modal.Title className="fw-bold" style={{ fontFamily: 'var(--font-family-heading)' }}>
          Report Bank Transfer
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
              <Alert variant="danger" className="rounded-3 border-0">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-muted small mb-4">
          Please provide your transfer details below. The transfer amount is required, while other fields are optional but helpful for verification.
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted fw-bold">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="donor_name"
              value={formData.donor_name}
              onChange={handleInputChange}
              placeholder="e.g. Jane Doe"
              className="bg-light border-0 text-dark rounded-3 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted fw-bold">Email Address</Form.Label>
            <Form.Control
              type="email"
              name="donor_email"
              value={formData.donor_email}
              onChange={handleInputChange}
              placeholder="jane@example.com"
              className="bg-light border-0 text-dark rounded-3 py-2"
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label className="small text-muted fw-bold">Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="donor_phone"
                  value={formData.donor_phone}
                  onChange={handleInputChange}
                  placeholder="+123..."
                  className="bg-light border-0 text-dark rounded-3 py-2"
                />
              </Form.Group>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label className="small text-muted fw-bold">Amount Transferred <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="e.g. 5000"
                  required
                  min="1"
                  className="bg-light border-0 text-dark rounded-3 py-2"
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted fw-bold">Address</Form.Label>
            <Form.Control
              type="text"
              name="donor_address"
              value={formData.donor_address}
              onChange={handleInputChange}
              placeholder="e.g. 123 Main St, City"
              className="bg-light border-0 text-dark rounded-3 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small text-muted fw-bold">Transfer Receipt (Image or PDF)</Form.Label>

            {!previewUrl ? (
              <Form.Control
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="bg-light border-0 text-dark rounded-3"
              />
            ) : (
              <div className="position-relative border rounded-3 p-2 bg-light text-center">
                <Button
                  variant="dark"
                  size="sm"
                  className="position-absolute rounded-circle p-1 d-flex align-items-center justify-content-center shadow"
                  style={{ top: '-10px', right: '-10px', width: '28px', height: '28px', zIndex: 10 }}
                  onClick={handleClearFile}
                  title="Remove file"
                >
                  &times;
                </Button>

                {previewType === 'image' && (
                  <img
                    src={previewUrl}
                    alt="Receipt preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                )}

                {previewType === 'pdf' && (
                  <div className="d-flex flex-column align-items-center justify-content-center py-4 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-file-earmark-pdf mb-2" viewBox="0 0 16 16">
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                      <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.246c-.328.205-.543.411-.598.59-.015.048-.015.085-.005.11.004.01.017.02.042.02.052 0 .146-.03.268-.14.122-.11.25-.262.385-.43.136-.168.258-.354.368-.535zm2.846-1.54a10 10 0 0 1 1.131-1.492c-.16.27-.314.54-.46.804q-.15.266-.273.535a11 11 0 0 1-.398.153zM8 4.535c-.206.12-.312.28-.312.436 0 .156.106.316.312.436.206-.12.312-.28.312-.436 0-.156-.106-.316-.312-.436z" />
                    </svg>
                    <span className="fw-bold">{receiptFile?.name}</span>
                    <small>PDF Document selected</small>
                  </div>
                )}

                {previewType === 'unknown' && (
                  <div className="py-4 text-muted">
                    <span className="fw-bold">{receiptFile?.name}</span>
                    <br />
                    <small>File selected</small>
                  </div>
                )}
              </div>
            )}
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-pill py-2 fw-bold"
            disabled={isSubmitting}
          >
            Submit Report
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
