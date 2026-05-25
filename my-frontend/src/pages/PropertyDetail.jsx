import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { propertiesData } from '../data/propertiesData';
import './PropertyDetail.css';

// ─── Image Gallery ────────────────────────────────────────────────────────────
function HeroGallery({ images, name }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate_slide = (newIdx) => {
    setDirection(newIdx > current ? 1 : -1);
    setCurrent(newIdx);
  };

  const next = () => navigate_slide((current + 1) % images.length);
  const prev = () => navigate_slide((current - 1 + images.length) % images.length);

  return (
    <div className="pd-gallery">
      <div className="pd-gallery-main">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${name} - ${current + 1}`}
            className="pd-gallery-img"
            custom={direction}
            variants={{
              enter: d => ({ x: d > 0 ? 120 : -120, opacity: 0, scale: 1.05 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: d => ({ x: d > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </AnimatePresence>

        <div className="pd-gallery-overlay" />

        {/* Controls */}
        <button className="gallery-arrow prev" onClick={prev}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <button className="gallery-arrow next" onClick={next}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {/* Counter */}
        <div className="gallery-counter">
          <span>{String(current + 1).padStart(2, '0')}</span>
          <span>/</span>
          <span>{String(images.length).padStart(2, '0')}</span>
        </div>

        {/* Video placeholder */}
        <button className="gallery-video-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Virtual Tour
        </button>
      </div>

      {/* Thumbnails */}
      <div className="pd-thumbnails">
        {images.map((img, i) => (
          <button
            key={i}
            className={`pd-thumb ${i === current ? 'active' : ''}`}
            onClick={() => navigate_slide(i)}
          >
            <img src={img} alt="" />
            {i === current && <div className="thumb-active-line" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ value, max = 100, label, color = '#c9a84c' }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const pct = value / max;
  const dash = circ * pct;

  return (
    <div className="score-ring-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <motion.circle
          cx="45" cy="45" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={circ}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          transform="rotate(-90 45 45)"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        <text x="45" y="49" textAnchor="middle" fill={color} fontSize="14" fontWeight="600">
          {value}{max === 10 ? '' : '%'}
        </text>
      </svg>
      <span className="score-ring-label">{label}</span>
    </div>
  );
}

// ─── Investment Card ───────────────────────────────────────────────────────────
function InvestmentCard({ icon, title, value, description, color }) {
  return (
    <motion.div
      className="invest-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.4 }}
    >
      <div className="invest-card-icon" style={{ color }}>
        {icon}
      </div>
      <div className="invest-card-body">
        <span className="invest-card-title">{title}</span>
        <strong className="invest-card-value" style={{ color }}>{value}</strong>
        <p className="invest-card-desc">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main PropertyDetail ───────────────────────────────────────────────────────
export default function PropertyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareWith, setCompareWith] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [showConsultation, setShowConsultation] = useState(false);

  const property = propertiesData.find(p => p.slug === slug);
  const otherProperties = propertiesData.filter(p => p.slug !== slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  if (!property) {
    return (
      <div className="pd-not-found">
        <h2>Property not found</h2>
        <button onClick={() => navigate('/properties')}>Back to Properties</button>
      </div>
    );
  }

  const { investmentHighlights: ih } = property;

  return (
    <div className="pd-page">
      {/* ── BACK BUTTON ──────────────────────────────── */}
      <motion.button
        className="pd-back-btn"
        onClick={() => navigate('/properties')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        All Properties
      </motion.button>

      {/* ── SAVE BUTTON ──────────────────────────────── */}
      <motion.button
        className={`pd-save-btn ${saved ? 'saved' : ''}`}
        onClick={() => setSaved(!saved)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {saved ? 'Saved to Wishlist' : 'Save Property'}
      </motion.button>

      {/* ── HERO GALLERY ─────────────────────────────── */}
      <section className="pd-hero-section">
        <HeroGallery images={property.images} name={property.name} />

        {/* Property Title Overlay */}
        <motion.div
          className="pd-hero-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="pd-hero-badge-row">
            <span className={`pd-status-pill ${property.status === 'Ready' ? 'ready' : 'off-plan'}`}>
              {property.status}
            </span>
            <span className="pd-type-pill">{property.type}</span>
            {property.isSold && <span className="pd-sold-pill">SOLD</span>}
          </div>
          <h1 className="pd-hero-title">{property.name}</h1>
          <div className="pd-hero-location">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {property.location}, Dubai
          </div>
        </motion.div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <div className="pd-main-layout">

        {/* ── LEFT COLUMN ─────────────────────────── */}
        <div className="pd-left-col">

          {/* Property Overview */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pd-section-header">
              <span className="pd-section-eyebrow">PROPERTY OVERVIEW</span>
              <h2 className="pd-section-title">Key Details</h2>
            </div>

            <div className="pd-overview-grid">
              <div className="pd-overview-card price-card">
                <span className="ov-label">ASKING PRICE</span>
                <span className="ov-price">{property.priceDisplay}</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">ROI</span>
                <span className="ov-value gold">{property.roi}%</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">RENTAL YIELD</span>
                <span className="ov-value green">{property.rentalYield}%</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">BEDROOMS</span>
                <span className="ov-value">{property.bedrooms}</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">AREA</span>
                <span className="ov-value">{property.sqft.toLocaleString()} sqft</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">BATHROOMS</span>
                <span className="ov-value">{property.bathrooms}</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">PARKING</span>
                <span className="ov-value">{property.parking} Spaces</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">FURNISHING</span>
                <span className="ov-value">{property.furnishing}</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">COMPLETION</span>
                <span className="ov-value">{property.completionStatus}</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">DEVELOPER</span>
                <span className="ov-value">{property.developer}</span>
              </div>
              <div className="pd-overview-card">
                <span className="ov-label">RENTAL DEMAND</span>
                <span className="ov-value green">{property.rentalDemand}</span>
              </div>
              {property.isSold && (
                <div className="pd-overview-card">
                  <span className="ov-label">SOLD IN</span>
                  <span className="ov-value gold">{property.soldIn}</span>
                </div>
              )}
            </div>

            <p className="pd-description">{property.description}</p>
          </motion.section>

          {/* Investment Analysis */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pd-section-header">
              <span className="pd-section-eyebrow">INVESTMENT ANALYTICS</span>
              <h2 className="pd-section-title">Investment Analysis</h2>
            </div>

            <div className="invest-analysis-grid">
              <div className="invest-rings">
                <ScoreRing value={ih.appreciation} label="Appreciation" color="#c9a84c" />
                <ScoreRing value={ih.rentalDemand} label="Rental Demand" color="#06d6a0" />
                <ScoreRing value={ih.marketGrowth} label="Market Growth" color="#00b4d8" />
                <ScoreRing value={ih.investorScore} max={10} label="Investor Score" color="#c084fc" />
              </div>

              <div className="invest-cards-grid">
                <InvestmentCard
                  icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
                  title="Capital Appreciation"
                  value={`${ih.appreciation}%`}
                  description="Historical appreciation index based on 5-year performance in this micro-location"
                  color="#c9a84c"
                />
                <InvestmentCard
                  icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
                  title="Rental Demand"
                  value={`${ih.rentalDemand}%`}
                  description="Tenant demand score — measures how quickly similar units are absorbed in this area"
                  color="#06d6a0"
                />
                <InvestmentCard
                  icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v18H3z" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>}
                  title="Market Growth"
                  value={`${ih.marketGrowth}%`}
                  description="Forward-looking growth trajectory for this area over the next 36 months"
                  color="#00b4d8"
                />
                <InvestmentCard
                  icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                  title="Investor Score"
                  value={`${ih.investorScore}/10`}
                  description="Composite score combining ROI, location, demand, and growth potential"
                  color="#c084fc"
                />
              </div>
            </div>
          </motion.section>

          {/* Why This Property */}
          <motion.section
            className="pd-section why-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pd-section-header">
              <span className="pd-section-eyebrow">INVESTMENT RATIONALE</span>
              <h2 className="pd-section-title">Why This Property?</h2>
            </div>

            <div className="why-reasons">
              {property.whyThisProperty.map((reason, i) => (
                <motion.div
                  key={i}
                  className="why-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="why-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="why-text">{reason}</div>
                  <div className="why-check">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Area Insights */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pd-section-header">
              <span className="pd-section-eyebrow">LOCAL INFRASTRUCTURE</span>
              <h2 className="pd-section-title">Area Insights</h2>
            </div>

            <div className="area-insights-grid">
              {[
                { icon: '🛍️', label: 'Nearest Mall', value: property.areaInsights.mall },
                { icon: '🏖️', label: 'Beach Access', value: property.areaInsights.beach },
                { icon: '🚇', label: 'Metro / Transit', value: property.areaInsights.metro },
                { icon: '🏫', label: 'Top School', value: property.areaInsights.school },
                { icon: '✈️', label: 'DXB Airport', value: property.areaInsights.airport },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="area-insight-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  whileHover={{ y: -3 }}
                >
                  <span className="area-icon">{item.icon}</span>
                  <div>
                    <span className="area-label">{item.label}</span>
                    <strong className="area-value">{item.value}</strong>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Compare Section */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pd-section-header">
              <span className="pd-section-eyebrow">PORTFOLIO ANALYSIS</span>
              <h2 className="pd-section-title">Compare Properties</h2>
            </div>

            <div className="compare-select-row">
              <select
                className="luxury-select-dark"
                value={compareWith || ''}
                onChange={e => setCompareWith(e.target.value)}
              >
                <option value="">Select a property to compare...</option>
                {otherProperties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {compareWith && (() => {
              const comp = propertiesData.find(p => p.id === compareWith);
              if (!comp) return null;
              const rows = [
                { label: 'Price', a: property.priceDisplay, b: comp.priceDisplay },
                { label: 'ROI', a: `${property.roi}%`, b: `${comp.roi}%` },
                { label: 'Rental Yield', a: `${property.rentalYield}%`, b: `${comp.rentalYield}%` },
                { label: 'Bedrooms', a: `${property.bedrooms} BR`, b: `${comp.bedrooms} BR` },
                { label: 'Area', a: `${property.sqft.toLocaleString()} sqft`, b: `${comp.sqft.toLocaleString()} sqft` },
                { label: 'Location', a: property.location, b: comp.location },
                { label: 'Status', a: property.status, b: comp.status },
                { label: 'Investor Score', a: `${property.investmentHighlights.investorScore}/10`, b: `${comp.investmentHighlights.investorScore}/10` },
              ];
              return (
                <div className="compare-table">
                  <div className="compare-header">
                    <div />
                    <div className="compare-prop-name">{property.name}</div>
                    <div className="compare-prop-name">{comp.name}</div>
                  </div>
                  {rows.map((row, i) => (
                    <div key={i} className={`compare-row ${i % 2 === 0 ? 'even' : ''}`}>
                      <div className="compare-row-label">{row.label}</div>
                      <div className="compare-row-val">{row.a}</div>
                      <div className="compare-row-val">{row.b}</div>
                    </div>
                  ))}
                  <div className="compare-actions">
                    <button
                      className="compare-view-btn"
                      onClick={() => navigate(`/properties/${comp.slug}`)}
                    >
                      View {comp.name} →
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.section>
        </div>

        {/* ── RIGHT COLUMN (Sticky CTA) ─────────────── */}
        <div className="pd-right-col">
          <div className="pd-sticky-panel">
            {/* Price Summary */}
            <div className="sticky-price-block">
              <span className="sticky-label">INVESTMENT STARTS AT</span>
              <div className="sticky-price">{property.priceDisplay}</div>
              <div className="sticky-roi-row">
                <span className="sticky-roi-item">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  </svg>
                  ROI {property.roi}%
                </span>
                <span className="sticky-roi-divider">·</span>
                <span className="sticky-roi-item green">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  Yield {property.rentalYield}%
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="sticky-cta-actions">
              <motion.button
                className="sticky-cta-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowConsultation(true)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book Property Tour
              </motion.button>

              <motion.button
                className="sticky-cta-secondary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowConsultation(true)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Schedule Consultation
              </motion.button>

              <motion.a
                href="https://wa.me/8438529815"
                target="_blank"
                rel="noreferrer"
                className="sticky-cta-whatsapp"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp Advisor
              </motion.a>

              <motion.a
                href="tel:+918438529815"
                className="sticky-cta-call"
                whileHover={{ scale: 1.03 }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Now
              </motion.a>
            </div>

            {/* Quick Stats */}
            <div className="sticky-quick-stats">
              <div className="sticky-stat">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="sticky-stat">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
              <div className="sticky-stat">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>{property.location}</span>
              </div>
            </div>

            {/* Advisor Note */}
            <div className="sticky-advisor-note">
              <div className="advisor-avatar">WR</div>
              <div>
                <span className="advisor-name">Waqar Rahiem</span>
                <span className="advisor-title">Senior Investment Advisor</span>
                <p className="advisor-note">I personally curate every listing on this platform. Let's discuss this property.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SIMILAR PROPERTIES ───────────────────────── */}
      <motion.section
        className="pd-similar-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="pd-section-header centered">
          <span className="pd-section-eyebrow">CURATED FOR YOU</span>
          <h2 className="pd-section-title">Similar Properties</h2>
        </div>

        <div className="pd-similar-grid">
          {otherProperties.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.id}
              className="similar-card"
              onClick={() => navigate(`/properties/${p.slug}`)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -6 }}
            >
              <div className="similar-img-wrap">
                <img src={p.images[0]} alt={p.name} />
                <div className="similar-overlay" />
                <span className="similar-roi">ROI {p.roi}%</span>
              </div>
              <div className="similar-body">
                <span className="similar-location">{p.location}</span>
                <h3>{p.name}</h3>
                <p>{p.priceDisplay}</p>
                <div className="similar-cta">View Property →</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CONSULTATION MODAL ────────────────────────── */}
      <AnimatePresence>
        {showConsultation && (
          <motion.div
            className="pd-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConsultation(false)}
          >
            <motion.div
              className="pd-modal"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="pd-modal-close" onClick={() => setShowConsultation(false)}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <span className="pd-modal-eyebrow">PRIVATE CONSULTATION</span>
              <h3>Book Your Property Tour</h3>
              <p>Our senior advisor will arrange an exclusive viewing of <strong>{property.name}</strong> at your convenience.</p>
              <div className="pd-modal-actions">
                <a href="https://wa.me/8438529815" target="_blank" rel="noreferrer" className="modal-btn-wa">
                  WhatsApp Now
                </a>
                <a href="tel:+918438529815" className="modal-btn-call">
                  Call Directly
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
