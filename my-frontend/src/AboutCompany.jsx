import { useState, useEffect, useRef, useCallback } from 'react';
import aboutAgent from './assets/punith.png';
import ConsultationModal from './components/ConsultationModal';
import './AboutCompany.css';

// ==========================================================================
// LUXURY RUNNING COUNTER COMPONENT
// ==========================================================================
const LuxuryCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Smooth deceleration easeOutQuad formula
      const easeProgress = progress * (2 - progress);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return (
    <span ref={counterRef}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

// ==========================================================================
// MAIN ABOUT COMPANY COMPONENT
// ==========================================================================
export default function AboutCompany({ onClose }) {
  const [showConsultation, setShowConsultation] = useState(false);
  // Map Tooltip State
  const [activeLocation, setActiveLocation] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);

  // Testimonials Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialTimeoutRef = useRef(null);

  // Testimonials Data
  const testimonials = [
    {
      name: "Amit Sharma",
      role: "Tech Entrepreneur & NRI Investor",
      quote: "Investing in Dubai from Mumbai felt daunting until I met Waqar. He helped me secure a premium 4-bed villa in Dubai Hills with a seamless remote process and structured payment plan. His legal guidance was exemplary.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Elena Rostova",
      role: "Private Equity Partner, Zurich",
      quote: "Waqar's data-driven ROI modeling is superior. He managed my portfolio acquisition of three ready apartments in Business Bay. The current net yield is consistently at 8.7%, far exceeding expectations.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Lord Alistair Campbell",
      role: "International Property Investor, London",
      quote: "Waqar didn't just sell me a home; he helped me settle my family in Dubai. From the Palm Jumeirah penthouse purchase to the Golden Visa processing, his team handled everything flawlessly.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    }
  ];

  // Map Data
  const mapLocations = [
    {
      id: 'palm',
      name: 'Palm Jumeirah',
      x: 350,
      y: 310,
      price: 'AED 12.5M',
      roi: '8.5%',
      demand: 'High',
      rating: '5/5',
      desc: 'World-famous iconic man-made island luxury villas.'
    },
    {
      id: 'downtown',
      name: 'Downtown Dubai',
      x: 720,
      y: 190,
      price: 'AED 7.2M',
      roi: '7.8%',
      demand: 'High',
      rating: '5/5',
      desc: 'Home to Burj Khalifa and premium high-rise apartments.'
    },
    {
      id: 'marina',
      name: 'Dubai Marina',
      x: 230,
      y: 360,
      price: 'AED 5.8M',
      roi: '8.2%',
      demand: 'Very High',
      rating: '4.8/5',
      desc: 'Vibrant waterfront residential skyscrapers.'
    },
    {
      id: 'business-bay',
      name: 'Business Bay',
      x: 650,
      y: 230,
      price: 'AED 3.9M',
      roi: '9.0%',
      demand: 'Very High',
      rating: '4.7/5',
      desc: 'Commercial hub with high-yield investor micro-apartments.'
    }
  ];

  // Auto-slide Testimonials
  const stopSlideTimer = useCallback(() => {
    if (testimonialTimeoutRef.current) {
      clearTimeout(testimonialTimeoutRef.current);
    }
  }, []);

  const startSlideTimer = useCallback(() => {
    stopSlideTimer();
    testimonialTimeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  }, [stopSlideTimer, testimonials.length]);

  useEffect(() => {
    startSlideTimer();
    return () => stopSlideTimer();
  }, [currentSlide, startSlideTimer, stopSlideTimer]);

  // Scroll to top when consultation modal opens
  useEffect(() => {
    if (showConsultation) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showConsultation]);

  // Map Hover Coordinates
  const handleMapMouseMove = (e, loc) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();

    // Positioning tooltip above and slightly offset from cursor
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 180
    });
    setActiveLocation(loc);
  };

  return (
    <div className="about-company-page">
      {/* Luxury Navigation Header */}
      <header className="luxury-header">
        <div className="luxury-logo">
          <span className="gold-text-accent">W</span>AQAR <span className="gold-text-accent">R</span>AHIEM<span className="gold-text-accent">.</span>
        </div>
        <button className="btn-back-home" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </header>

      {/* ====================================================
         SECTION 1 — FOUNDER STORY
         ==================================================== */}
      <section className="cinematic-padding">
        <div className="founder-story-grid">
          {/* Left: Cinematic Founder Image */}
          <div className="founder-cinematic-frame">
            <img src={aboutAgent} alt="Waqar Rahiem" className="founder-cinematic-img" />
            <div className="founder-cinematic-overlay"></div>
            <div className="founder-signature-accent">Waqar Rahiem</div>
          </div>

          {/* Right: Premium Story Content */}
          <div className="founder-story-content">
            <span className="luxury-subtitle-small">The Founder's Journey</span>
            <h1 className="luxury-title-large">
              Helping Investors Build Wealth Through <span className="gold-text-accent">Dubai Real Estate</span>
            </h1>
            <div className="story-gold-divider"></div>
            <p className="story-description-lead">
              Since 2007, my mission has been simple: to safeguard international capital and help global investors build highly lucrative, tax-free property portfolios in Dubai.
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '30px', fontWeight: '300' }}>
              What started as a passion for luxury architecture has grown into a world-class advisory. Specializing in high-end villas, off-market penthouses, and remote safe transactions, I provide tailored, data-backed strategies that shield NRI and international clients from typical market pitfalls.
            </p>

            {/* Premium Bullet List */}
            <div className="story-bullets-container">
              <div className="story-bullet-point">
                <span className="story-bullet-icon">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <div className="story-bullet-text">
                  <strong style={{ color: '#f5f5f7' }}>Safeguarding NRIs</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>100% remote legal support</p>
                </div>
              </div>

              <div className="story-bullet-point">
                <span className="story-bullet-icon">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <div className="story-bullet-text">
                  <strong style={{ color: '#f5f5f7' }}>Vast Experience</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>Active in Dubai since 2007</p>
                </div>
              </div>

              <div className="story-bullet-point">
                <span className="story-bullet-icon">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <div className="story-bullet-text">
                  <strong style={{ color: '#f5f5f7' }}>Luxury Mansions</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>Exclusive off-market villa access</p>
                </div>
              </div>

              <div className="story-bullet-point">
                <span className="story-bullet-icon">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <div className="story-bullet-text">
                  <strong style={{ color: '#f5f5f7' }}>Long-Term Focus</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>Securing high compound ROI</p>
                </div>
              </div>
            </div>

            {/* luxury CTA */}
            <a href="#cta" className="btn-luxury-cta">
              Schedule Private Consultation
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================
         SECTION 2 — ANIMATED STATS COUNTERS
         ==================================================== */}
      <section className="cinematic-padding stats-banner-section">
        <div className="stats-luxury-grid">
          {/* Stat Item 1 */}
          <div className="stat-glass-card">
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="stat-counter-number">
              <LuxuryCounter end={500} suffix="+" />
            </div>
            <span className="stat-counter-label">Properties Sold</span>
          </div>

          {/* Stat Item 2 */}
          <div className="stat-glass-card">
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="stat-counter-number">
              <LuxuryCounter end={15} suffix="+" />
            </div>
            <span className="stat-counter-label">Years Experience</span>
          </div>

          {/* Stat Item 3 */}
          <div className="stat-glass-card">
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-counter-number">
              <LuxuryCounter end={98} suffix="%" />
            </div>
            <span className="stat-counter-label">Client Satisfaction</span>
          </div>

          {/* Stat Item 4 */}
          <div className="stat-glass-card">
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-counter-number">
              <LuxuryCounter end={1200} suffix="+" />
            </div>
            <span className="stat-counter-label">Global Investors</span>
          </div>

          {/* Stat Item 5 */}
          <div className="stat-glass-card">
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-counter-number">
              <LuxuryCounter end={200} prefix="₹" suffix="Cr" />
            </div>
            <span className="stat-counter-label">Total Transactions</span>
          </div>
        </div>
      </section>

      {/* ====================================================
         SECTION 3 — WHY CHOOSE US
         ==================================================== */}
      <section className="cinematic-padding why-choose-us-section">
        <div className="why-header-wrapper">
          <span className="luxury-subtitle-small">Unrivaled Expertise</span>
          <h2 className="luxury-title-large">
            Why Discerning Global Investors <span className="gold-text-accent">Choose Our Advisory</span>
          </h2>
        </div>

        <div className="why-grid-layout">
          {/* Card 1 */}
          <div className="why-glass-card">
            <div className="why-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="why-card-title">Legal Verified Properties</h3>
            <p className="why-card-desc">
              Complete security with rigorous title deed checks, developer escrow verification, and Dubai Land Department (DLD) compliance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="why-glass-card">
            <div className="why-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3 className="why-card-title">ROI Investment Analysis</h3>
            <p className="why-card-desc">
              Comprehensive net-yield models, capital appreciation forecasting, tax planning, and real-time comparative rental data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="why-glass-card">
            <div className="why-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="why-card-title">End-to-End Documentation</h3>
            <p className="why-card-desc">
              From contract drafting and golden visa applications to final title deeds, our in-house legal experts execute it all smoothly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="why-glass-card">
            <div className="why-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="why-card-title">Dedicated Relationship Managers</h3>
            <p className="why-card-desc">
              A single point of contact provides 24/7 personalized support, bespoke updates, and luxury concierge services.
            </p>
          </div>

          {/* Card 5 */}
          <div className="why-glass-card">
            <div className="why-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3 className="why-card-title">Luxury Villa Specialists</h3>
            <p className="why-card-desc">
              Deep alignment with Dubai's most exclusive communities, granting you pre-sale access to elite off-market luxury mansions.
            </p>
          </div>

          {/* Card 6 */}
          <div className="why-glass-card">
            <div className="why-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3 className="why-card-title">International Investor Assistance</h3>
            <p className="why-card-desc">
              Tailored support for international wires, golden visas, tax optimization, and seamless Power of Attorney remote sign-offs.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================
         SECTION 4 — INTERACTIVE DUBAI MAP
         ==================================================== */}
      <section className="cinematic-padding dubai-map-section">
        <div className="why-header-wrapper" style={{ marginBottom: '30px' }}>
          <span className="luxury-subtitle-small">Curated Destinations</span>
          <h2 className="luxury-title-large">
            Interactive Investment Map <span className="gold-text-accent">of Prime Dubai Zones</span>
          </h2>
        </div>

        <div className="map-instructions">
          <span className="pulse-hint-circle"></span>
          Hover or tap location beacons to reveal luxury investment ratings & ROI
        </div>

        <div className="map-container-outer" ref={mapContainerRef}>
          {/* Bespoke Hand-Drawn Dark Luxury Dubai Coast Map (SVG) */}
          <svg viewBox="0 0 1000 500" className="map-canvas-svg">
            <defs>
              {/* Sea/Land Gradients */}
              <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#08080a" />
                <stop offset="100%" stopColor="#0e0f13" />
              </linearGradient>
              <linearGradient id="coastGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a140c" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#C8A46B" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1a140c" stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C8A46B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#C8A46B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Sea Background Area */}
            <rect width="1000" height="500" fill="url(#seaGradient)" />

            {/* Coastline buffer gradient */}
            <path d="M -10,280 Q 250,280 480,240 T 1010,90 L 1010,510 L -10,510 Z" fill="url(#coastGradient)" />

            {/* The Coastline vector curve */}
            <path d="M -10,280 Q 250,280 480,240 T 1010,90" fill="none" stroke="#C8A46B" strokeWidth="2" opacity="0.3" strokeDasharray="5 5" />

            {/* GRID LINES FOR CINEMATIC TECH LOOK */}
            <line x1="100" y1="0" x2="100" y2="500" stroke="rgba(255,255,255,0.02)" />
            <line x1="300" y1="0" x2="300" y2="500" stroke="rgba(255,255,255,0.02)" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255,255,255,0.02)" />
            <line x1="700" y1="0" x2="700" y2="500" stroke="rgba(255,255,255,0.02)" />
            <line x1="900" y1="0" x2="900" y2="500" stroke="rgba(255,255,255,0.02)" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(255,255,255,0.02)" />
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255,255,255,0.02)" />
            <line x1="0" y1="400" x2="1000" y2="400" stroke="rgba(255,255,255,0.02)" />

            {/* ARTISTIC DRAWING: PALM JUMEIRAH SVG PATH */}
            <g transform="translate(325, 290) scale(0.65)" opacity="0.25">
              <path d="M 0,0 L 0,-60 M 0,-60 Q -20,-75 -50,-60 Q -70,-50 -60,-20 Q -50,0 0,0" fill="none" stroke="#C8A46B" strokeWidth="2" />
              <path d="M 0,-10 C -40,-20 -80,-10 -90,20" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <path d="M 0,-20 C -50,-35 -100,-20 -110,10" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <path d="M 0,-30 C -60,-50 -120,-30 -120,0" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <path d="M 0,-10 C 40,-20 80,-10 90,20" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <path d="M 0,-20 C 50,-35 100,-20 110,10" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <path d="M 0,-30 C 60,-50 120,-30 120,0" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              {/* Palm Outer Crescent */}
              <path d="M -130,-40 A 140,140 0 0,1 130,-40" fill="none" stroke="#C8A46B" strokeWidth="2" />
            </g>

            {/* ABSTRACT DUBAI MARINA INLET */}
            <path d="M 180,390 Q 230,360 210,330" fill="none" stroke="#C8A46B" strokeWidth="1.5" opacity="0.2" />

            {/* ABSTRACT DOWNTOWN SKYSCRAPERS */}
            <g transform="translate(710, 100)" opacity="0.15">
              <rect x="0" y="30" width="12" height="60" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <rect x="18" y="0" width="16" height="90" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <rect x="40" y="45" width="10" height="45" fill="none" stroke="#C8A46B" strokeWidth="1.5" />
              <line x1="26" y1="0" x2="26" y2="-20" stroke="#C8A46B" strokeWidth="1" />
            </g>

            {/* Glowing locations mapping */}
            {mapLocations.map((loc) => (
              <g
                key={loc.id}
                className="map-marker-group"
                onMouseEnter={(e) => handleMapMouseMove(e, loc)}
                onMouseMove={(e) => handleMapMouseMove(e, loc)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                {/* Glowing Outer Beacon */}
                <circle cx={loc.x} cy={loc.y} r="16" className="map-beacon-pulse" fill="url(#beaconGlow)" />
                {/* Solid Core Beacon */}
                <circle cx={loc.x} cy={loc.y} r="6" className="map-marker-dot" />
                {/* Label text */}
                <text x={loc.x} y={loc.y + 25} className="map-marker-label">{loc.name}</text>
              </g>
            ))}
          </svg>

          {/* Map floating glassmorphism card */}
          {activeLocation && (
            <div
              className="map-luxury-tooltip"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`
              }}
            >
              <h4 className="tooltip-title">{activeLocation.name}</h4>
              <p className="tooltip-desc">{activeLocation.desc}</p>

              <div className="tooltip-data-row">
                <span className="tooltip-data-label">Average Investment:</span>
                <span className="tooltip-data-value highlight">{activeLocation.price}</span>
              </div>
              <div className="tooltip-data-row">
                <span className="tooltip-data-label">Target Net ROI:</span>
                <span className="tooltip-data-value highlight">{activeLocation.roi}</span>
              </div>
              <div className="tooltip-data-row">
                <span className="tooltip-data-label">Rental Demand:</span>
                <span className="tooltip-data-value">{activeLocation.demand}</span>
              </div>
              <div className="tooltip-data-row">
                <span className="tooltip-data-label">Advisory Rating:</span>
                <span className="tooltip-data-value" style={{ color: '#C8A46B' }}>
                  {activeLocation.rating}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
         SECTION 5 — OUR PROCESS
         ==================================================== */}
      <section className="cinematic-padding process-timeline-section">
        <div className="why-header-wrapper">
          <span className="luxury-subtitle-small">Seamless Execution</span>
          <h2 className="luxury-title-large">
            Our Structured Six-Step <span className="gold-text-accent">Wealth-Building Process</span>
          </h2>
        </div>

        <div className="process-timeline-container">
          {/* Timeline connecting line */}
          <div className="process-connector-line"></div>

          <div className="process-grid-flex">
            {/* Step 1 */}
            <div className="process-step-node">
              <div className="process-circle-button">
                <span className="process-step-number">STEP 01</span>
                <svg className="process-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h4 className="process-node-title">Consultation</h4>
              <p className="process-node-desc">Deep dive into your investment goals, asset allocation goals, and budget safe points.</p>
            </div>

            {/* Step 2 */}
            <div className="process-step-node">
              <div className="process-circle-button">
                <span className="process-step-number">STEP 02</span>
                <svg className="process-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h4 className="process-node-title">Property Selection</h4>
              <p className="process-node-desc">Curating a tailored shortlist of prime, off-market, or high-ROI luxury builds.</p>
            </div>

            {/* Step 3 */}
            <div className="process-step-node">
              <div className="process-circle-button">
                <span className="process-step-number">STEP 03</span>
                <svg className="process-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h4 className="process-node-title">Site Visit</h4>
              <p className="process-node-desc">Private chauffeured community VIP tours or ultra-high definition live virtual walkthroughs.</p>
            </div>

            {/* Step 4 */}
            <div className="process-step-node">
              <div className="process-circle-button">
                <span className="process-step-number">STEP 04</span>
                <svg className="process-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h4 className="process-node-title">Documentation</h4>
              <p className="process-node-desc">Swift handling of DLD forms, reservation documents, and power-of-attorney signups.</p>
            </div>

            {/* Step 5 */}
            <div className="process-step-node">
              <div className="process-circle-button">
                <span className="process-step-number">STEP 05</span>
                <svg className="process-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h4 className="process-node-title">Investment Support</h4>
              <p className="process-node-desc">Managing mortgages, organizing swift overseas wires, and optimizing tax-free corporate setups.</p>
            </div>

            {/* Step 6 */}
            <div className="process-step-node">
              <div className="process-circle-button">
                <span className="process-step-number">STEP 06</span>
                <svg className="process-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h4 className="process-node-title">Management</h4>
              <p className="process-node-desc">Handling property handover, tenant selection, premium listings, and maintenance.</p>
            </div>
          </div>
        </div>
      </section>



      {/* ====================================================
         SECTION 7 — FINAL CTA SECTION
         ==================================================== */}
      <section id="cta" className="cinematic-padding final-cta-luxury-section">
        <div className="final-cta-glow-one"></div>
        <div className="final-cta-glow-two"></div>

        <div className="cta-content-wrapper">
          <span className="luxury-subtitle-small">Exclusive Invitation</span>
          <h2 className="cta-luxury-title">
            Secure Your Next High-Performance <span className="gold-text-accent">Dubai Asset</span>
          </h2>
          <p className="cta-luxury-subtext">
            Discover bespoke, high-yield wealth-building opportunities in Dubai tailored specifically for your investment targets and structural requirements.
          </p>

          <div className="cta-buttons-container">
            {/* Book Meeting */}
            <button type="button" className="btn-cta-gold-filled" onClick={() => setShowConsultation(true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Book Private Meeting
            </button>

            {/* WhatsApp */}
            <button type="button" className="btn-cta-whatsapp" onClick={() => window.open('https://wa.me/8438529815', '_blank')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat on WhatsApp
            </button>

            {/* Call Now */}
            <a href="tel:+8438529815" className="btn-cta-gold-border">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call +8438529815
            </a>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer style={{ padding: '40px 8%', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#050505', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
          © 2026 Waqar Rahiem Advisory. All Rights Reserved. Private Wealth Advisory & Strategy.
        </p>
      </footer>

      <ConsultationModal isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
    </div>
  );
}
