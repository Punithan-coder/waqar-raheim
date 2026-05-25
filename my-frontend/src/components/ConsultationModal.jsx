import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConsultationModal.css';

const ConsultationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    country: '',
    investmentGoal: '',
    budgetRange: '',
    interestedAreas: [],
    propertyType: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: '',
    additionalMessage: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      interestedAreas: prev.interestedAreas.includes(area)
        ? prev.interestedAreas.filter(a => a !== area)
        : [...prev.interestedAreas, area]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/consultation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          window.open('https://wa.me/8438529815?text=Hello,%20I%20recently%20submitted%20a%20private%20consultation%20request%20regarding%20Dubai%20real%20estate%20investment.', '_blank');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="modal-container"
        >
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Private Consultation</h2>
              <p className="modal-subtitle">Waqar Rahiem Advisory</p>
            </div>
            <button onClick={onClose} className="modal-close-btn">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="modal-success"
              >
                <div className="success-icon-wrapper">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="success-title">Request Submitted Successfully</h3>
                <p className="success-desc">
                  Our advisory team will contact you shortly. You will now be redirected to WhatsApp.
                </p>
                <div className="success-actions">
                  <button onClick={onClose} className="btn-continue">
                    Continue Browsing
                  </button>
                  <a href="https://wa.me/8438529815" target="_blank" rel="noreferrer" className="btn-whatsapp-success">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.014c-5.46 0-9.89 4.43-9.89 9.89 0 1.74.45 3.42 1.32 4.9L2.01 22.01l5.35-1.4c1.42.78 3.03 1.19 4.65 1.19 5.46 0 9.89-4.43 9.89-9.89 0-5.46-4.43-9.89-9.89-9.89zM17.47 16.2c-.23.64-1.29 1.19-1.8 1.25-.42.05-1.02.14-3.23-.78-2.67-1.11-4.4-3.83-4.54-4.01-.13-.19-1.08-1.44-1.08-2.75 0-1.31.68-1.96.93-2.22.25-.26.54-.33.72-.33s.36 0 .52.01c.16.01.39-.06.6.45.23.54.76 1.84.82 1.96.06.13.11.28.02.47-.09.19-.14.31-.28.47-.14.16-.29.35-.41.47-.13.13-.27.26-.12.52.14.26.64 1.07 1.38 1.73.95.85 1.74 1.11 2.01 1.24.26.13.41.11.56-.06.16-.18.66-.77.84-1.03.18-.26.36-.22.59-.13.23.09 1.48.7 1.74.83.26.13.44.19.5.3.06.11.06.63-.17 1.27z"/></svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                {/* Step Indicator */}
                <div className="step-indicator">
                  <div className="step-line-bg"></div>
                  <div className="step-line-active" style={{ width: `${(step - 1) * 50}%` }}></div>
                  
                  {[1, 2, 3].map((num) => (
                    <div key={num} className={`step-circle ${step >= num ? 'active' : 'inactive'}`}>
                      {num}
                    </div>
                  ))}
                </div>

                {/* Step 1 */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-title">1. Personal Details</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-input" placeholder="John Doe" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" placeholder="john@example.com" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="form-input" placeholder="+971 50 123 4567" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input type="text" name="country" required value={formData.country} onChange={handleChange} className="form-input" placeholder="United Arab Emirates" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-title">2. Investment Details</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Investment Goal</label>
                        <select name="investmentGoal" required value={formData.investmentGoal} onChange={handleChange} className="form-input">
                          <option value="">Select Goal</option>
                          <option value="Luxury Living">Luxury Living</option>
                          <option value="Rental Income">Rental Income</option>
                          <option value="Long-Term Investment">Long-Term Investment</option>
                          <option value="Commercial Property">Commercial Property</option>
                          <option value="Vacation Home">Vacation Home</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Budget Range</label>
                        <select name="budgetRange" required value={formData.budgetRange} onChange={handleChange} className="form-input">
                          <option value="">Select Budget</option>
                          <option value="AED 1M+">AED 1M+</option>
                          <option value="AED 5M+">AED 5M+</option>
                          <option value="AED 10M+">AED 10M+</option>
                          <option value="AED 25M+">AED 25M+</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label className="form-label">Interested Areas</label>
                        <div className="areas-grid">
                          {['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Business Bay', 'JVC', 'Emirates Hills'].map(area => (
                            <button
                              key={area}
                              type="button"
                              onClick={() => handleAreaToggle(area)}
                              className={`area-btn ${formData.interestedAreas.includes(area) ? 'selected' : 'unselected'}`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group full-width">
                        <label className="form-label">Preferred Property Type</label>
                        <select name="propertyType" required value={formData.propertyType} onChange={handleChange} className="form-input">
                          <option value="">Select Property Type</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-title">3. Scheduling</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Preferred Date</label>
                        <input type="date" name="preferredDate" required value={formData.preferredDate} onChange={handleChange} className="form-input" style={{ colorScheme: 'dark' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Preferred Time</label>
                        <input type="time" name="preferredTime" required value={formData.preferredTime} onChange={handleChange} className="form-input" style={{ colorScheme: 'dark' }} />
                      </div>
                      <div className="form-group full-width">
                        <label className="form-label">Consultation Type</label>
                        <select name="consultationType" required value={formData.consultationType} onChange={handleChange} className="form-input">
                          <option value="">Select Type</option>
                          <option value="Online Meeting">Online Meeting</option>
                          <option value="Office Consultation">Office Consultation</option>
                          <option value="Property Tour">Property Tour</option>
                          <option value="Investment Planning Session">Investment Planning Session</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label className="form-label">Additional Message (Optional)</label>
                        <textarea name="additionalMessage" value={formData.additionalMessage} onChange={handleChange} rows="3" className="form-input" placeholder="Any specific requirements..."></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Footer Buttons */}
                <div className="modal-footer">
                  {step > 1 ? (
                    <button type="button" onClick={prevStep} className="btn-back">
                      Back
                    </button>
                  ) : <div></div>}
                  
                  <button type="submit" disabled={isSubmitting} className="btn-next">
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      step === 3 ? 'Confirm Booking' : 'Continue'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConsultationModal;
