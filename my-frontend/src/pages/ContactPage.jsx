import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './ContactPage.css';

const officeGallery = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564069114551-7a949d63421e?w=600&auto=format&fit=crop&q=80',
];

const consultationProcess = [
  { icon: '📞', title: 'Initial Contact', desc: 'Reach out via WhatsApp, call, or our form. We respond within 2 hours during UAE business hours.' },
  { icon: '📊', title: 'Needs Assessment', desc: 'A brief discovery session to understand your investment goals, budget, and timeline.' },
  { icon: '🏛️', title: 'Strategy Session', desc: 'A dedicated 60-minute private consultation with Waqar Rahiem and a curated property shortlist.' },
  { icon: '🔑', title: 'Execution', desc: 'From first viewing to keys in hand — we manage the entire investment process on your behalf.' },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 280]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', budget: '', interest: '', consultationType: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeGallery, setActiveGallery] = useState(0);
  const [showWAToast, setShowWAToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Gallery auto-rotate
    const galleryTimer = setInterval(() => setActiveGallery(g => (g + 1) % officeGallery.length), 4000);
    return () => clearInterval(galleryTimer);
  }, []);

  const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5001/api/consultation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          budgetRange: formData.budget,
          investmentGoal: formData.interest,
          consultationType: formData.consultationType,
          additionalMessage: formData.message,
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', budget: '', interest: '', consultationType: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="contact-page">
      {/* Back */}
      <motion.button className="contact-back-btn" onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Home
      </motion.button>

      {/* Sticky WhatsApp */}
      <motion.a
        href="https://wa.me/8438529815" target="_blank" rel="noreferrer"
        className="sticky-wa-btn"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        onMouseEnter={() => setShowWAToast(true)}
        onMouseLeave={() => setShowWAToast(false)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <AnimatePresence>
          {showWAToast && (
            <motion.span className="wa-toast" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              Chat with Advisor
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>

      {/* ── HERO ── */}
      <section className="contact-hero">
        <motion.div className="contact-hero-bg" style={{ y: yParallax }} />
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="contact-eyebrow">PRIVATE CLIENT SERVICES · DUBAI</p>
            <h1 className="contact-hero-title">
              Begin Your
              <br />
              <span className="contact-gold-gradient">Investment Journey</span>
            </h1>
            <p className="contact-hero-sub">
              Exclusive private consultations for global investors, NRIs, and luxury property buyers.
              Your wealth conversation starts here.
            </p>
            <div className="contact-hero-btns">
              <motion.a href="https://wa.me/8438529815" target="_blank" rel="noreferrer"
                className="hero-btn-wa" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp Now
              </motion.a>
              <motion.a href="tel:+918438529815" className="hero-btn-call" whileHover={{ scale: 1.04 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Directly
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="contact-section contact-cards-section">
        <div className="contact-cards-grid">
          {[
            { icon: '📱', title: 'WhatsApp Advisory', sub: 'Instant Messaging', val: '+91 84385 29815', link: 'https://wa.me/8438529815', color: '#06d6a0', cta: 'Chat Now' },
            { icon: '📞', title: 'Direct Phone Line', sub: 'Call Hours: 9AM – 9PM GST', val: '+971 XX XXX XXXX', link: 'tel:+971XXXXXXXX', color: '#c9a84c', cta: 'Call Now' },

            { icon: '📍', title: 'Dubai Office', sub: 'Private Client Meetings', val: 'Downtown Dubai, UAE', link: '#map', color: '#c084fc', cta: 'Get Directions' },
          ].map((card, i) => (
            <motion.a key={i} href={card.link} className="contact-card"
              target={card.link.startsWith('http') ? '_blank' : undefined}
              rel={card.link.startsWith('http') ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -6, boxShadow: `0 16px 48px ${card.color}22` }}>
              <span className="contact-card-icon" style={{ color: card.color }}>{card.icon}</span>
              <h4 className="contact-card-title">{card.title}</h4>
              <span className="contact-card-sub">{card.sub}</span>
              <strong className="contact-card-val">{card.val}</strong>
              <div className="contact-card-cta" style={{ color: card.color, borderColor: `${card.color}55` }}>
                {card.cta} →
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── MAIN FORM + WHATSAPP ── */}
      <section className="contact-section form-section">
        <div className="form-layout">

          {/* Left: Form */}
          <motion.div className="form-wrapper"
            initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <div className="form-header">
              <span className="form-eyebrow">PRIVATE CONSULTATION REQUEST</span>
              <h2 className="form-title">Book Your Consultation</h2>
              <p className="form-sub">Fill in your details and our senior advisor will contact you within 2 hours to arrange your private session.</p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div className="form-success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="success-icon">✓</div>
                  <h3>Request Received!</h3>
                  <p>Thank you, <strong>{formData.name || 'Valued Investor'}</strong>. Our team will reach out within 2 hours.</p>
                  <a href="https://wa.me/8438529815" className="success-wa-link" target="_blank" rel="noreferrer">
                    For immediate assistance, chat on WhatsApp →
                  </a>
                </motion.div>
              ) : (
                <motion.form className="luxury-form" onSubmit={handleSubmit}
                  initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input type="text" name="name" placeholder="Your full name" value={formData.name}
                        onChange={handleChange} required className="luxury-input" />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" name="email" placeholder="your@email.com" value={formData.email}
                        onChange={handleChange} required className="luxury-input" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone / WhatsApp *</label>
                      <input type="tel" name="phone" placeholder="+971 or +91..." value={formData.phone}
                        onChange={handleChange} required className="luxury-input" />
                    </div>
                    <div className="form-group">
                      <label>Investment Budget</label>
                      <select name="budget" value={formData.budget} onChange={handleChange} className="luxury-select-form">
                        <option value="">Select budget range</option>
                        <option>AED 1M – 3M</option>
                        <option>AED 3M – 7M</option>
                        <option>AED 7M – 15M</option>
                        <option>AED 15M – 30M</option>
                        <option>AED 30M+</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Investment Interest</label>
                      <select name="interest" value={formData.interest} onChange={handleChange} className="luxury-select-form">
                        <option value="">Select interest area</option>
                        <option>Off-Plan Properties</option>
                        <option>Ready Properties</option>
                        <option>Luxury Villas</option>
                        <option>Portfolio Building</option>
                        <option>Short-Term Rental Yield</option>
                        <option>UAE Golden Visa</option>
                        <option>Property Management</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Consultation Type</label>
                      <select name="consultationType" value={formData.consultationType} onChange={handleChange} className="luxury-select-form">
                        <option value="">Select type</option>
                        <option>Virtual (Zoom / Teams)</option>
                        <option>Dubai Office Meeting</option>
                        <option>WhatsApp Consultation</option>
                        <option>Site Visit & Property Tour</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Message / Specific Requirements</label>
                    <textarea name="message" placeholder="Share any specific requirements, questions, or investment goals..."
                      value={formData.message} onChange={handleChange} rows={4} className="luxury-textarea" />
                  </div>

                  <motion.button type="submit" className="form-submit-btn"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Book Private Consultation
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: WhatsApp + Advisor */}
          <motion.div className="form-side"
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65 }}>

            {/* WhatsApp CTA */}
            <div className="wa-advisory-card">
              <div className="wa-advisory-header">
                <span className="wa-advisory-eyebrow">INSTANT RESPONSE</span>
                <h3 className="wa-advisory-title">Chat on WhatsApp</h3>
              </div>
              <p className="wa-advisory-text">
                Get an immediate response from our investment advisory team. Available 7 days a week,
                9AM – 10PM GST for urgent consultations and property inquiries.
              </p>
              <div className="wa-features">
                {['Instant response within 30 minutes', 'Property photos & virtual tours', 'ROI calculations on demand', 'Direct line to senior advisor'].map((f, i) => (
                  <div key={i} className="wa-feature">
                    <span className="wa-check">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <motion.a href="https://wa.me/8438529815" target="_blank" rel="noreferrer"
                className="wa-main-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Start WhatsApp Chat
              </motion.a>
            </div>

            {/* Advisor Profile */}
            <div className="advisor-profile-card">
              <div className="advisor-profile-avatar">WR</div>
              <div className="advisor-profile-info">
                <strong>Waqar Rahiem</strong>
                <span>Senior Investment Advisor</span>
                <div className="advisor-badges">
                  <span>🏆 16+ Years</span>
                  <span>🌍 50+ Countries</span>
                  <span>⭐ Top Rated</span>
                </div>
              </div>
              <p className="advisor-profile-note">
                "Every investor deserves a personalised strategy. I'll personally review your requirements
                and build a portfolio plan tailored to your financial goals."
              </p>
            </div>

            {/* Response Time */}
            <div className="response-time-card">
              <div className="rt-item">
                <strong className="rt-val">{'< 2 hrs'}</strong>
                <span className="rt-label">Form Responses</span>
              </div>
              <div className="rt-divider" />
              <div className="rt-item">
                <strong className="rt-val">{'< 30 min'}</strong>
                <span className="rt-label">WhatsApp Response</span>
              </div>
              <div className="rt-divider" />
              <div className="rt-item">
                <strong className="rt-val">Same Day</strong>
                <span className="rt-label">Property Tours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OFFICE LOCATION ── */}
      <section className="contact-section location-section" id="map">
        <div className="location-layout">
          <motion.div className="location-info"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="contact-eyebrow-sm">OUR BASE</span>
            <h2 className="location-title">Dubai Office</h2>
            <div className="location-details">
              <div className="location-detail">
                <span className="loc-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>Downtown Dubai, Near Dubai Mall<br />Dubai, United Arab Emirates</p>
                </div>
              </div>
              <div className="location-detail">
                <span className="loc-icon">🕐</span>
                <div>
                  <strong>Office Hours</strong>
                  <p>Sunday – Thursday: 9AM – 7PM GST<br />Saturday: 10AM – 4PM GST</p>
                </div>
              </div>
              <div className="location-detail">
                <span className="loc-icon">🚇</span>
                <div>
                  <strong>Getting Here</strong>
                  <p>Burj Khalifa / Dubai Mall Metro<br />Valet parking available</p>
                </div>
              </div>
            </div>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="directions-btn">
              Get Directions →
            </a>
          </motion.div>

          {/* Map placeholder */}
          <motion.div className="map-embed"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="map-placeholder">
              <div className="map-overlay-content">
                <div className="map-pin-anim">
                  <div className="map-pin-circle">
                    <span>WR</span>
                  </div>
                  <div className="map-pin-pulse" />
                </div>
                <p>Downtown Dubai, UAE</p>
                <a href="https://maps.google.com/?q=Downtown+Dubai" target="_blank" rel="noreferrer" className="open-maps-btn">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── CONSULTATION PROCESS ── */}
      <section className="contact-section process-section-c">
        <span className="contact-eyebrow-sm centered">HOW IT WORKS</span>
        <h2 className="process-title centered">Your Consultation Process</h2>
        <div className="process-steps">
          {consultationProcess.map((step, i) => (
            <motion.div key={i} className="process-step"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.45 }}
              whileHover={{ y: -5 }}>
              <div className="process-step-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="process-step-icon">{step.icon}</div>
              <h4 className="process-step-title">{step.title}</h4>
              <p className="process-step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>



      {/* ── FINAL CTA ── */}
      <motion.section className="contact-final-cta"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="final-cta-glow" />
        <p className="final-cta-eyebrow">YOUR NEXT STEP</p>
        <h2 className="final-cta-title">Start Your Wealth Journey Today</h2>
        <p className="final-cta-sub">Every great investment starts with one conversation. Waqar Rahiem is ready to guide you.</p>
        <div className="final-cta-btns">
          <motion.button className="final-btn-gold" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('.luxury-form input')?.focus()}>
            Book Private Consultation
          </motion.button>
          <motion.a href="https://wa.me/8438529815" target="_blank" rel="noreferrer"
            className="final-btn-wa" whileHover={{ scale: 1.04 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Chat on WhatsApp
          </motion.a>
          <motion.a href="tel:+918438529815" className="final-btn-call" whileHover={{ scale: 1.04 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Advisor
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
