import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { propertiesData, filterOptions, areaCoordinates } from '../data/propertiesData';
import ConsultationModal from '../components/ConsultationModal';
import './PropertiesPage.css';

// ─── Badge Component ────────────────────────────────────────────────────────
function PropertyBadge({ badge, color, isSold }) {
  if (isSold) return <span className="prop-badge sold">SOLD</span>;
  const cls = badge === 'High ROI' ? 'high-roi' : badge === 'New Launch' ? 'new-launch' : badge === 'Waterfront' ? 'waterfront' : badge === 'Exclusive' ? 'exclusive' : '';
  return <span className={`prop-badge ${cls}`}>{badge}</span>;
}

// ─── Property Card ───────────────────────────────────────────────────────────
function PropertyCard({ property, onHover, isHighlighted, navigate }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      className={`prop-card ${isHighlighted ? 'highlighted' : ''}`}
      onMouseEnter={() => onHover(property.area)}
      onMouseLeave={() => onHover(null)}
      onClick={() => navigate(`/properties/${property.slug}`)}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      layout
    >
      <div className="prop-card-image-wrap">
        {!imgLoaded && <div className="skeleton-img" />}
        <img
          src={property.images[0]}
          alt={property.name}
          className={`prop-card-img ${imgLoaded ? 'loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="prop-card-overlay" />
        <PropertyBadge badge={property.badge} color={property.badgeColor} isSold={property.isSold} />
        <div className="prop-card-type-pill">{property.type}</div>
        <div className="prop-card-roi-chip">
          <span>ROI</span>
          <strong>{property.roi}%</strong>
        </div>
      </div>

      <div className="prop-card-body">
        <div className="prop-card-location">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.location}
        </div>

        <h3 className="prop-card-name">{property.name}</h3>
        <p className="prop-card-price">{property.priceDisplay}</p>

        <div className="prop-card-specs">
          <div className="spec-chip">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {property.bedrooms} BR
          </div>
          <div className="spec-chip">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {property.sqft.toLocaleString()} sqft
          </div>
          <div className="spec-chip yield">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
            {property.rentalYield}% Yield
          </div>
        </div>

        <div className="prop-card-footer">
          <div className="demand-pill">
            <span className="demand-dot" />
            {property.rentalDemand} Demand
          </div>
          {property.isSold ? (
            <span className="sold-info">Sold in {property.soldIn}</span>
          ) : (
            <span className="status-info available">{property.status}</span>
          )}
        </div>

        <motion.div className="prop-card-cta" whileHover={{ scale: 1.03 }}>
          <span>View Details</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Dubai Map ───────────────────────────────────────────────────────────────
function DubaiMap({ highlightedArea, properties, onPinHover, navigate }) {
  const areas = Object.entries(areaCoordinates);

  return (
    <div className="dubai-map-wrap">
      <div className="dubai-map-header">
        <span className="map-eyebrow">PORTFOLIO LOCATIONS</span>
        <h3 className="map-title">Interactive Dubai Map</h3>
      </div>

      <div className="dubai-map-canvas">
        {/* SVG Dubai Shape */}
        <svg className="dubai-coastline" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          {/* Water gradient */}
          <defs>
            <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#051020" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="800" height="500" fill="url(#waterGrad)" />

          {/* Dubai coastline shape */}
          <path
            className="dubai-land"
            d="M 0 420 L 80 380 L 120 350 L 160 310 L 200 280 L 260 260 L 320 255 L 380 258 L 440 250 L 500 248 L 560 252 L 620 260 L 680 270 L 740 280 L 800 290 L 800 500 L 0 500 Z"
          />
          {/* Palm Jumeirah shape */}
          <ellipse cx="145" cy="310" rx="55" ry="28" className="palm-island" transform="rotate(-15, 145, 310)" />
          <rect x="138" y="282" width="14" height="45" className="palm-trunk" />
          {/* JBR Strip */}
          <rect x="66" y="278" width="65" height="18" rx="4" className="jbr-strip" />

          {/* Road lines */}
          <line x1="0" y1="345" x2="800" y2="295" stroke="rgba(201,168,76,0.08)" strokeWidth="1.5" strokeDasharray="8,6" />
          <line x1="320" y1="255" x2="320" y2="500" stroke="rgba(201,168,76,0.06)" strokeWidth="1" strokeDasharray="6,8" />

          {/* Creek */}
          <path d="M 480 250 Q 520 240 560 252 Q 600 270 640 265" stroke="rgba(0,180,216,0.25)" strokeWidth="8" fill="none" />

          {/* Grid lines */}
          {[200, 350, 500].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[150, 300, 400].map(y => (
            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
        </svg>

        {/* Map Pins */}
        {areas.map(([area, coords]) => {
          const areaProps = properties.filter(p => p.area === area);
          const isActive = highlightedArea === area;
          const hasProp = areaProps.length > 0;

          return (
            <motion.div
              key={area}
              className={`map-pin ${isActive ? 'active' : ''} ${hasProp ? 'has-prop' : ''}`}
              style={{ left: coords.x, top: coords.y }}
              onMouseEnter={() => onPinHover(area)}
              onMouseLeave={() => onPinHover(null)}
              animate={{ scale: isActive ? 1.4 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pin-dot">
                <div className="pin-inner" />
              </div>
              {isActive && (
                <motion.div
                  className="pin-tooltip"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <strong>{area}</strong>
                  <span>{areaProps.length} propert{areaProps.length === 1 ? 'y' : 'ies'}</span>
                  {areaProps[0] && (
                    <button onClick={() => navigate(`/properties/${areaProps[0].slug}`)}>
                      View →
                    </button>
                  )}
                </motion.div>
              )}
              <span className="pin-label">{coords.label}</span>
            </motion.div>
          );
        })}

        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-dot gold" /> Available
          </div>
          <div className="legend-item">
            <div className="legend-dot blue" /> Waterfront
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main PropertiesPage ─────────────────────────────────────────────────────
export default function PropertiesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: 'All',
    area: 'All',
    bedrooms: 'All',
    status: 'All',
    budget: 'All',
    roi: 'All',
    waterfront: false,
  });
  const [highlightedArea, setHighlightedArea] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'map'
  const [loading, setLoading] = useState(true);
  const [showConsultation, setShowConsultation] = useState(false);
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter logic
  const filteredProperties = propertiesData.filter(p => {
    if (filters.type !== 'All' && p.type !== filters.type) return false;
    if (filters.area !== 'All' && p.area !== filters.area) return false;
    if (filters.status !== 'All' && p.status !== filters.status) return false;
    if (filters.bedrooms !== 'All') {
      const br = filters.bedrooms === '6+' ? 6 : parseInt(filters.bedrooms);
      if (filters.bedrooms === '6+' ? p.bedrooms < br : p.bedrooms !== br) return false;
    }
    if (filters.budget !== 'All') {
      const range = filterOptions.budgetRanges.find(r => r.label === filters.budget);
      if (range && (p.price < range.min || p.price > range.max)) return false;
    }
    if (filters.roi !== 'All') {
      const range = filterOptions.roiRanges.find(r => r.label === filters.roi);
      if (range && p.roi < range.min) return false;
    }
    if (filters.waterfront && p.badge !== 'Waterfront') return false;
    return true;
  });

  const updateFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div className="props-page">
      {/* Back Nav */}
      <motion.button
        className="props-back-btn"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Home
      </motion.button>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="props-hero" ref={heroRef}>
        <div
          className="props-hero-bg"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div className="props-hero-overlay" />
        <div className="props-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="props-hero-eyebrow">DUBAI LUXURY REAL ESTATE PORTFOLIO</p>
            <h1 className="props-hero-title">
              Discover Exceptional
              <br />
              <span className="gold-gradient">Investment Properties</span>
            </h1>
            <p className="props-hero-subtitle">
              Curated ultra-premium properties across Dubai's most prestigious addresses.
              Handpicked for discerning investors who expect the extraordinary.
            </p>
            <div className="props-hero-stats">
              <div className="hero-stat">
                <strong>6+</strong>
                <span>Exclusive Listings</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>AED 168M+</strong>
                <span>Portfolio Value</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>9.4%</strong>
                <span>Peak ROI</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>5</strong>
                <span>Prime Locations</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="props-hero-scroll-indicator">
          <span>Scroll to Explore</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── FILTER SYSTEM ────────────────────────────────── */}
      <motion.section
        className="props-filters-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="props-filters-header">
          <h2 className="filters-label">Refine Your Search</h2>
          <button className="filters-reset" onClick={() => setFilters({ type: 'All', area: 'All', bedrooms: 'All', status: 'All', budget: 'All', roi: 'All', waterfront: false })}>
            Reset All
          </button>
        </div>

        <div className="props-filters-grid">
          {/* Property Type */}
          <div className="filter-group">
            <label>Property Type</label>
            <div className="filter-pills">
              {filterOptions.propertyTypes.map(t => (
                <button
                  key={t}
                  className={`filter-pill ${filters.type === t ? 'active' : ''}`}
                  onClick={() => updateFilter('type', t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div className="filter-group">
            <label>Location / Area</label>
            <select
              className="luxury-select"
              value={filters.area}
              onChange={e => updateFilter('area', e.target.value)}
            >
              {filterOptions.areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="filter-group">
            <label>Bedrooms</label>
            <div className="filter-pills">
              {filterOptions.bedrooms.map(b => (
                <button
                  key={b}
                  className={`filter-pill ${filters.bedrooms === b ? 'active' : ''}`}
                  onClick={() => updateFilter('bedrooms', b)}
                >
                  {b === 'All' ? 'Any' : `${b} BR`}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="filter-group">
            <label>Budget Range</label>
            <select
              className="luxury-select"
              value={filters.budget}
              onChange={e => updateFilter('budget', e.target.value)}
            >
              {filterOptions.budgetRanges.map(r => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* ROI */}
          <div className="filter-group">
            <label>Minimum ROI</label>
            <select
              className="luxury-select"
              value={filters.roi}
              onChange={e => updateFilter('roi', e.target.value)}
            >
              {filterOptions.roiRanges.map(r => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="filter-group">
            <label>Completion Status</label>
            <div className="filter-pills">
              {filterOptions.statuses.map(s => (
                <button
                  key={s}
                  className={`filter-pill ${filters.status === s ? 'active' : ''}`}
                  onClick={() => updateFilter('status', s)}
                >
                  {s === 'All' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Waterfront toggle */}
          <div className="filter-group">
            <label>Special Features</label>
            <button
              className={`filter-toggle ${filters.waterfront ? 'active' : ''}`}
              onClick={() => updateFilter('waterfront', !filters.waterfront)}
            >
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              Waterfront Only
            </button>
          </div>
        </div>

        {/* Results count + view toggle */}
        <div className="filter-results-bar">
          <span className="results-count">
            <strong>{filteredProperties.length}</strong> properties found
          </span>
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              Grid
            </button>
            <button
              className={`view-btn ${view === 'map' ? 'active' : ''}`}
              onClick={() => setView('map')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              Map View
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── PROPERTIES + MAP ─────────────────────────────── */}
      <section className={`props-content-section ${view === 'map' ? 'map-view' : ''}`}>
        {/* Property Grid */}
        <div className="props-grid-column">
          {loading ? (
            <div className="props-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton-line wide" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line narrow" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>No Properties Found</h3>
              <p>Try adjusting your filters to discover more properties</p>
              <button onClick={() => setFilters({ type: 'All', area: 'All', bedrooms: 'All', status: 'All', budget: 'All', roi: 'All', waterfront: false })}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div className="props-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onHover={setHighlightedArea}
                    isHighlighted={highlightedArea === property.area}
                    navigate={navigate}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Map Column */}
        {view === 'map' && (
          <motion.div
            className="props-map-column"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DubaiMap
              highlightedArea={highlightedArea}
              properties={filteredProperties}
              onPinHover={setHighlightedArea}
              navigate={navigate}
            />
          </motion.div>
        )}
      </section>

      {/* ── STICKY CTA ──────────────────────────────────── */}
      <AnimatePresence>
        {scrollY > 400 && (
          <motion.div
            className="props-sticky-cta"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <p>Ready to invest in Dubai real estate?</p>
            <div className="sticky-cta-btns">
              <button className="sticky-btn-primary" onClick={() => setShowConsultation(true)}>
                Schedule Consultation
              </button>
              <a href="https://wa.me/8438529815" target="_blank" rel="noreferrer" className="sticky-btn-wa">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER CTA ──────────────────────────────────── */}
      <motion.section
        className="props-footer-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="footer-cta-glow" />
        <p className="footer-cta-eyebrow">EXCLUSIVE ACCESS</p>
        <h2 className="footer-cta-title">Your Dream Property Awaits</h2>
        <p className="footer-cta-text">
          Book a private consultation with Waqar Rahiem and get access to off-market
          listings unavailable to the public.
        </p>
        <div className="footer-cta-btns">
          <motion.button
            className="btn-gold-luxury"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowConsultation(true)}
          >
            Book Private Consultation
          </motion.button>
          <motion.a
            href="https://wa.me/8438529815"
            target="_blank"
            rel="noreferrer"
            className="btn-outline-luxury"
            whileHover={{ scale: 1.04 }}
          >
            WhatsApp Advisor
          </motion.a>
        </div>
      </motion.section>

      <ConsultationModal isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
    </div>
  );
}
