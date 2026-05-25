import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { servicesData } from '../data/servicesData';
import ConsultationModal from '../components/ConsultationModal';
import './ServiceDetail.css';

// Animated counter component
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const prefix = value.replace(/[0-9.]+.*/, '');

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const displayVal = isNaN(numericValue) ? value : `${prefix}${count}${value.replace(/^[^0-9]*[0-9.]+/, '')}`;
  return <span ref={ref}>{displayVal}</span>;
}

// FAQ Accordion item
function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={`faq-item ${open ? 'open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{faq.q}</span>
        <span className={`faq-icon ${open ? 'rotated' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const service = servicesData[serviceId];

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setShowStickyBtn(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="sd-not-found">
        <h2>Service Not Found</h2>
        <Link to="/">Return Home</Link>
      </div>
    );
  }

  const timelineSteps = ['Consultation', 'Research', 'Property Selection', 'Documentation', 'Closing', 'Support'];

  return (
    <div className="sd-wrapper">
      <ConsultationModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Sticky CTA */}
      <AnimatePresence>
        {showStickyBtn && (
          <motion.button
            className="sd-sticky-cta"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setShowModal(true)}
          >
            Book Private Meeting
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="sd-nav">
        <button className="sd-nav-back" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </button>
        <div className="sd-nav-brand">
          <span className="gold-text">WR</span> WAQAR RAHIEM<span className="gold-text">.</span>
        </div>
        <button className="sd-nav-book" onClick={() => setShowModal(true)}>BOOK CONSULTATION</button>
      </nav>

      {/* SECTION 1: Cinematic Hero */}
      <section className="sd-hero">
        <div className="sd-hero-overlay" />
        <div className="sd-hero-grid-bg" />
        <motion.div
          className="sd-hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p className="sd-hero-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            WAQAR RAHIEM ADVISORY
          </motion.p>
          <motion.h1 className="sd-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            {service.title}
          </motion.h1>
          <motion.p className="sd-hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            {service.heroTagline}
          </motion.p>
          <motion.p className="sd-hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            {service.subtitle}
          </motion.p>
          <motion.div className="sd-hero-ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <button className="sd-btn-gold" onClick={() => setShowModal(true)}>Book Private Consultation</button>
            <button className="sd-btn-outline" onClick={() => window.open('https://wa.me/8438529815', '_blank')}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.014c-5.46 0-9.89 4.43-9.89 9.89 0 1.74.45 3.42 1.32 4.9L2.01 22.01l5.35-1.4c1.42.78 3.03 1.19 4.65 1.19 5.46 0 9.89-4.43 9.89-9.89 0-5.46-4.43-9.89-9.89-9.89zM17.47 16.2c-.23.64-1.29 1.19-1.8 1.25-.42.05-1.02.14-3.23-.78-2.67-1.11-4.4-3.83-4.54-4.01-.13-.19-1.08-1.44-1.08-2.75 0-1.31.68-1.96.93-2.22.25-.26.54-.33.72-.33s.36 0 .52.01c.16.01.39-.06.6.45.23.54.76 1.84.82 1.96.06.13.11.28.02.47-.09.19-.14.31-.28.47-.14.16-.29.35-.41.47-.13.13-.27.26-.12.52.14.26.64 1.07 1.38 1.73.95.85 1.74 1.11 2.01 1.24.26.13.41.11.56-.06.16-.18.66-.77.84-1.03.18-.26.36-.22.59-.13.23.09 1.48.7 1.74.83.26.13.44.19.5.3.06.11.06.63-.17 1.27z"/></svg>
              WhatsApp Advisor
            </button>
          </motion.div>
        </motion.div>
        <div className="sd-hero-scroll-hint">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="sd-scroll-dot" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* SECTION 2: About the Service */}
      <section className="sd-about">
        <div className="sd-container">
          <div className="sd-about-grid">
            <motion.div className="sd-about-left" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="sd-label">ABOUT THIS SERVICE</span>
              <h2 className="sd-section-title">{service.title}</h2>
              <div className="sd-gold-bar" />
            </motion.div>
            <motion.div className="sd-about-right" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <p className="sd-about-lead">{service.description}</p>
              <p className="sd-about-body">{service.longDescription}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Benefits */}
      <section className="sd-benefits">
        <div className="sd-container">
          <div className="sd-section-header">
            <span className="sd-label">WHY CHOOSE THIS SERVICE</span>
            <h2 className="sd-section-title">Key Benefits</h2>
          </div>
          <div className="sd-benefits-grid">
            {service.benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="sd-benefit-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(200, 164, 107, 0.15)' }}
              >
                <div className="sd-benefit-number">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="sd-benefit-title">{benefit.title}</h3>
                <p className="sd-benefit-desc">{benefit.desc}</p>
                <div className="sd-benefit-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Process Timeline */}
      <section className="sd-timeline">
        <div className="sd-container">
          <div className="sd-section-header">
            <span className="sd-label">OUR PROCESS</span>
            <h2 className="sd-section-title">How It Works</h2>
          </div>
          <div className="sd-timeline-track">
            <div className="sd-timeline-line" />
            {timelineSteps.map((step, i) => (
              <motion.div
                key={i}
                className="sd-timeline-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <motion.div
                  className="sd-timeline-node"
                  whileHover={{ scale: 1.15 }}
                >
                  {i + 1}
                </motion.div>
                <p className="sd-timeline-label">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Featured Areas */}
      <section className="sd-areas">
        <div className="sd-container">
          <div className="sd-section-header">
            <span className="sd-label">PRIME LOCATIONS</span>
            <h2 className="sd-section-title">Featured Dubai Areas</h2>
          </div>
          <div className="sd-areas-grid">
            {service.areas.map((area, i) => (
              <motion.div
                key={i}
                className="sd-area-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <div className="sd-area-badge">{area.demand}</div>
                <h3 className="sd-area-name">{area.name}</h3>
                <div className="sd-area-stats">
                  <div className="sd-area-stat">
                    <span className="sd-area-stat-value gold">{area.roi}</span>
                    <span className="sd-area-stat-label">Avg. ROI</span>
                  </div>
                  <div className="sd-area-divider" />
                  <div className="sd-area-stat">
                    <span className="sd-area-stat-value">{area.avgPrice}</span>
                    <span className="sd-area-stat-label">Avg. Price</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Stats */}
      <section className="sd-stats">
        <div className="sd-container">
          <div className="sd-stats-grid">
            {service.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="sd-stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="sd-stat-value">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="sd-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Testimonials */}
      <section className="sd-testimonials">
        <div className="sd-container">
          <div className="sd-section-header">
            <span className="sd-label">CLIENT VOICES</span>
            <h2 className="sd-section-title">What Investors Say</h2>
          </div>
          <div className="sd-testimonials-grid">
            {service.testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="sd-testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -6 }}
              >
                <div className="sd-testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <span key={s} className="star">★</span>
                  ))}
                </div>
                <p className="sd-testimonial-text">"{t.text}"</p>
                <div className="sd-testimonial-author">
                  <div className="sd-testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="sd-testimonial-name">{t.name}</div>
                    <div className="sd-testimonial-country">{t.country}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section className="sd-faq">
        <div className="sd-container sd-faq-container">
          <div className="sd-section-header">
            <span className="sd-label">ANSWERS</span>
            <h2 className="sd-section-title">Frequently Asked Questions</h2>
          </div>
          <div className="sd-faq-list">
            {service.faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: Final CTA */}
      <section className="sd-final-cta">
        <div className="sd-final-cta-overlay" />
        <div className="sd-container">
          <motion.div
            className="sd-final-cta-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="sd-label">BEGIN YOUR JOURNEY</span>
            <h2 className="sd-final-cta-title">Ready to Invest in Dubai's Finest?</h2>
            <p className="sd-final-cta-desc">
              Book a private consultation with Waqar Rahiem Advisory. Our team of investment specialists is ready to craft a bespoke strategy for your wealth goals.
            </p>
            <div className="sd-final-cta-actions">
              <motion.button
                className="sd-btn-gold large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
              >
                Book Private Meeting
              </motion.button>
              <motion.button
                className="sd-btn-whatsapp"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://wa.me/8438529815?text=I%20am%20interested%20in%20your%20' + encodeURIComponent(service.title) + '%20service', '_blank')}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.014c-5.46 0-9.89 4.43-9.89 9.89 0 1.74.45 3.42 1.32 4.9L2.01 22.01l5.35-1.4c1.42.78 3.03 1.19 4.65 1.19 5.46 0 9.89-4.43 9.89-9.89 0-5.46-4.43-9.89-9.89-9.89zM17.47 16.2c-.23.64-1.29 1.19-1.8 1.25-.42.05-1.02.14-3.23-.78-2.67-1.11-4.4-3.83-4.54-4.01-.13-.19-1.08-1.44-1.08-2.75 0-1.31.68-1.96.93-2.22.25-.26.54-.33.72-.33s.36 0 .52.01c.16.01.39-.06.6.45.23.54.76 1.84.82 1.96.06.13.11.28.02.47-.09.19-.14.31-.28.47-.14.16-.29.35-.41.47-.13.13-.27.26-.12.52.14.26.64 1.07 1.38 1.73.95.85 1.74 1.11 2.01 1.24.26.13.41.11.56-.06.16-.18.66-.77.84-1.03.18-.26.36-.22.59-.13.23.09 1.48.7 1.74.83.26.13.44.19.5.3.06.11.06.63-.17 1.27z"/></svg>
                WhatsApp Advisor
              </motion.button>
              <motion.a
                className="sd-btn-call"
                href="tel:+918438529815"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="sd-footer">
        <div className="sd-container">
          <div className="sd-footer-inner">
            <span className="sd-nav-brand"><span className="gold-text">WR</span> WAQAR RAHIEM<span className="gold-text">.</span></span>
            <p className="sd-footer-copy">© 2026 Waqar Rahiem Advisory. All Rights Reserved. Private Wealth Advisory & Strategy.</p>
            <Link to="/" className="sd-footer-home">Return to Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
