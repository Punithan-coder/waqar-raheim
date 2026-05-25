import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './InvestorsPage.css';

// ─── Animated Counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── ROI Calculator ────────────────────────────────────────────────────────
function ROICalculator() {
  const [budget, setBudget] = useState(5000000);
  const [roi, setRoi] = useState(8);
  const [years, setYears] = useState(5);
  const [propertyType, setPropertyType] = useState('apartment');

  const annualReturn = (budget * roi) / 100;
  const totalReturn = annualReturn * years;
  const totalValue = budget + totalReturn;
  const netProfit = totalReturn;

  const typeMultipliers = { apartment: 1, villa: 1.15, penthouse: 1.25, offplan: 0.85 };
  const adjustedROI = roi * (typeMultipliers[propertyType] || 1);
  const adjustedAnnual = (budget * adjustedROI) / 100;
  const adjustedTotal = adjustedAnnual * years;

  return (
    <div className="roi-calc">
      <div className="roi-inputs">
        <div className="roi-input-group">
          <label>Investment Amount</label>
          <div className="slider-wrap">
            <input type="range" min={1000000} max={50000000} step={500000}
              value={budget} onChange={e => setBudget(+e.target.value)}
              className="luxury-slider" />
            <div className="slider-val">AED {(budget / 1000000).toFixed(1)}M</div>
          </div>
        </div>

        <div className="roi-input-group">
          <label>Expected ROI</label>
          <div className="slider-wrap">
            <input type="range" min={4} max={14} step={0.5}
              value={roi} onChange={e => setRoi(+e.target.value)}
              className="luxury-slider" />
            <div className="slider-val">{roi}%</div>
          </div>
        </div>

        <div className="roi-input-group">
          <label>Investment Period</label>
          <div className="slider-wrap">
            <input type="range" min={1} max={15} step={1}
              value={years} onChange={e => setYears(+e.target.value)}
              className="luxury-slider" />
            <div className="slider-val">{years} Years</div>
          </div>
        </div>

        <div className="roi-input-group">
          <label>Property Type</label>
          <div className="type-pills">
            {[['apartment','Apartment'],['villa','Villa'],['penthouse','Penthouse'],['offplan','Off-Plan']].map(([val, label]) => (
              <button key={val} className={`type-pill ${propertyType === val ? 'active' : ''}`}
                onClick={() => setPropertyType(val)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="roi-results">
        <div className="roi-result-card primary">
          <span className="result-label">Projected Total Value</span>
          <span className="result-value">AED {(budget + adjustedTotal).toLocaleString()}</span>
        </div>
        <div className="roi-result-card">
          <span className="result-label">Annual Rental Income</span>
          <span className="result-value green">AED {Math.round(adjustedAnnual).toLocaleString()}</span>
        </div>
        <div className="roi-result-card">
          <span className="result-label">Net Profit ({years}Y)</span>
          <span className="result-value gold">AED {Math.round(adjustedTotal).toLocaleString()}</span>
        </div>
        <div className="roi-result-card">
          <span className="result-label">Effective ROI</span>
          <span className="result-value">{adjustedROI.toFixed(1)}% p.a.</span>
        </div>

        <div className="roi-bar-chart">
          <div className="roi-bar-label">Return vs Investment</div>
          <div className="bar-track">
            <div className="bar-fill investment" style={{ width: `${(budget / (budget + adjustedTotal)) * 100}%` }}>
              <span>Capital</span>
            </div>
            <div className="bar-fill returns" style={{ width: `${(adjustedTotal / (budget + adjustedTotal)) * 100}%` }}>
              <span>Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────
function MarketChart({ data, title, color = '#c9a84c' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="market-chart" ref={ref}>
      <h4 className="chart-title">{title}</h4>
      <div className="chart-bars">
        {data.map((item, i) => (
          <div key={i} className="chart-bar-wrap">
            <div className="chart-bar-track">
              <motion.div
                className="chart-bar-fill"
                style={{ background: color }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${(item.value / max) * 100}%` } : { height: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="chart-bar-val">{item.value}{item.suffix || '%'}</span>
            <span className="chart-bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Timeline Item ─────────────────────────────────────────────────────────
function TimelineItem({ step, title, desc, icon, isLast }) {
  return (
    <motion.div
      className="timeline-item"
      initial={{ opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: step * 0.12, duration: 0.5 }}
    >
      <div className="timeline-left">
        <div className="timeline-icon">{icon}</div>
        {!isLast && <div className="timeline-line" />}
      </div>
      <div className="timeline-content">
        <span className="timeline-step">STEP {String(step + 1).padStart(2, '0')}</span>
        <h4 className="timeline-title">{title}</h4>
        <p className="timeline-desc">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN InvestorsPage ────────────────────────────────────────────────────
export default function InvestorsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('residential');
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const yieldData = [
    { label: 'JBR', value: 8.8, suffix: '%' },
    { label: 'Marina', value: 9.1, suffix: '%' },
    { label: 'Downtown', value: 9.4, suffix: '%' },
    { label: 'Business Bay', value: 8.2, suffix: '%' },
    { label: 'Palm', value: 8.6, suffix: '%' },
    { label: 'DIFC', value: 7.9, suffix: '%' },
  ];

  const appreciationData = [
    { label: '2020', value: 12, suffix: '%' },
    { label: '2021', value: 28, suffix: '%' },
    { label: '2022', value: 44, suffix: '%' },
    { label: '2023', value: 38, suffix: '%' },
    { label: '2024', value: 33, suffix: '%' },
    { label: '2025', value: 29, suffix: '%' },
  ];

  const opportunities = {
    residential: [
      { title: 'Off-Plan Villas', roi: '9.2%', min: 'AED 1.5M', badge: 'HIGH GROWTH', desc: 'Secure pre-completion pricing with 20/80 payment plans and guaranteed handover.' },
      { title: 'Luxury Apartments', roi: '8.8%', min: 'AED 800K', badge: 'POPULAR', desc: 'Premium apartments in Downtown, Marina, and JBR with strong rental demand.' },
      { title: 'Penthouse Units', roi: '7.4%', min: 'AED 8M', badge: 'EXCLUSIVE', desc: 'Ultra-rare penthouse inventory across Dubai\'s most prestigious towers.' },
    ],
    commercial: [
      { title: 'DIFC Offices', roi: '7.1%', min: 'AED 2M', badge: 'STABLE', desc: 'Grade-A office space in the Middle East\'s premier financial centre.' },
      { title: 'Retail Units', roi: '8.3%', min: 'AED 1.2M', badge: 'GROWING', desc: 'High-footfall retail in Dubai\'s top malls and street-level developments.' },
      { title: 'Mixed-Use', roi: '9.0%', min: 'AED 3M', badge: 'DIVERSIFIED', desc: 'Combined residential and commercial investments for balanced portfolios.' },
    ],
    holiday: [
      { title: 'Short-Term Rentals', roi: '12.4%', min: 'AED 900K', badge: 'BEST YIELD', desc: 'Holiday homes in Marina and JBR generating premium STR income year-round.' },
      { title: 'Serviced Apartments', roi: '10.8%', min: 'AED 1.4M', badge: 'MANAGED', desc: 'Fully managed serviced apartments in Dubai\'s top tourist districts.' },
      { title: 'Holiday Villas', roi: '11.2%', min: 'AED 4M', badge: 'LUXURY', desc: 'Premium holiday villas on Palm Jumeirah with private pools and beach access.' },
    ],
  };

  const whyDubai = [
    { icon: '🏛️', title: 'Zero Income Tax', desc: 'No personal income tax, capital gains tax, or property tax for investors.' },
    { icon: '🌍', title: 'Golden Visa Eligibility', desc: 'AED 2M+ property investment qualifies for 10-year UAE Golden Visa.' },
    { icon: '📈', title: 'World\'s Fastest Growing Market', desc: 'Dubai property values grew 34% in 2023 — outperforming London, NY, and Singapore.' },
    { icon: '🔒', title: 'Government-Backed Safety', desc: 'RERA regulation and escrow laws protect every off-plan investor automatically.' },
    { icon: '💱', title: 'USD-Pegged Currency', desc: 'AED is pegged to USD — eliminating currency risk for international investors.' },
    { icon: '✈️', title: 'Global Connectivity', desc: '90M+ passengers through Dubai International — the world\'s busiest airport.' },
  ];

  const benefits = [
    { title: 'VIP Market Access', desc: 'Off-market listings and pre-launch access exclusive to our investor network.', icon: '👑' },
    { title: 'End-to-End Support', desc: 'Legal, mortgage, management — we handle everything from purchase to passive income.', icon: '🛡️' },
    { title: 'Portfolio Diversification', desc: 'Spread risk across areas, property types, and investment timelines.', icon: '📊' },
    { title: 'Guaranteed ROI Advisory', desc: 'Our consultants provide written ROI projections backed by market data.', icon: '📜' },
    { title: 'Currency Advantage', desc: 'USD/GBP/EUR buyers benefit from AED valuation arbitrage opportunities.', icon: '💹' },
    { title: 'Developer Incentives', desc: 'Access to exclusive developer deals — 0% commission, DLD waivers, and more.', icon: '🎁' },
  ];

  const areas = [
    { name: 'Palm Jumeirah', avg: 'AED 18.5M', yield: '8.6%', growth: '+28%', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Downtown Dubai', avg: 'AED 8.2M', yield: '9.4%', growth: '+34%', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80' },
    { name: 'Dubai Marina', avg: 'AED 6.5M', yield: '9.1%', growth: '+31%', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Business Bay', avg: 'AED 3.8M', yield: '8.2%', growth: '+22%', img: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Emirates Hills', avg: 'AED 45M', yield: '6.8%', growth: '+40%', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80' },
    { name: 'DIFC', avg: 'AED 5.2M', yield: '7.9%', growth: '+18%', img: 'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=600&auto=format&fit=crop&q=80' },
  ];

  const testimonials = [
    { name: 'James Thornton', title: 'London-Based Fund Manager', quote: 'Waqar helped me build a 4-property portfolio in Dubai generating AED 1.4M in annual rental income. The ROI projections were accurate to within 2%.', flag: '🇬🇧', initials: 'JT', roi: '9.2% ROI' },
    { name: 'Rajesh Mehta', title: 'NRI Investor, Mumbai', quote: 'As an NRI, I was nervous about investing abroad. Waqar handled everything — from property selection to tenant management. Now I earn passively every month.', flag: '🇮🇳', initials: 'RM', roi: '8.8% ROI' },
    { name: 'Sultan Al Mansoori', title: 'GCC Wealth Manager', quote: 'The off-market access and pre-launch opportunities Waqar provides are unavailable anywhere else. He is the top investment advisor I\'ve worked with in Dubai.', flag: '🇦🇪', initials: 'SM', roi: '11.4% ROI' },
    { name: 'Elena Kozlova', title: 'Moscow-Based Entrepreneur', quote: 'I needed a UAE residency solution and a sound investment. Waqar delivered both with a Palm Jumeirah villa that appreciated 22% within 18 months.', flag: '🇷🇺', initials: 'EK', roi: '10.1% ROI' },
  ];

  const processSteps = [
    { title: 'Discovery Consultation', desc: 'We understand your investment goals, budget, timeline, and risk profile in a private session.', icon: '🎯' },
    { title: 'Curated Property Selection', desc: 'Receive a handpicked shortlist of properties — including off-market opportunities — matched to your profile.', icon: '🏛️' },
    { title: 'Due Diligence & Analysis', desc: 'Full ROI projections, legal checks, developer vetting, and market comparables provided in writing.', icon: '📊' },
    { title: 'Reservation & Paperwork', desc: 'We handle all SPA, DLD registration, escrow setup, and mortgage coordination on your behalf.', icon: '📄' },
    { title: 'Handover & Management', desc: 'Post-purchase, we manage your property, find tenants, and deliver monthly performance reports.', icon: '🔑' },
  ];

  const rentalInsights = [
    { area: 'Downtown Dubai', monthly: 'AED 22,000', annual: 'AED 264,000', occupancy: '94%', trend: '↑ 12%' },
    { area: 'Dubai Marina', monthly: 'AED 16,500', annual: 'AED 198,000', occupancy: '91%', trend: '↑ 9%' },
    { area: 'Palm Jumeirah', monthly: 'AED 38,000', annual: 'AED 456,000', occupancy: '88%', trend: '↑ 15%' },
    { area: 'JBR', monthly: 'AED 14,000', annual: 'AED 168,000', occupancy: '93%', trend: '↑ 11%' },
    { area: 'Business Bay', monthly: 'AED 12,000', annual: 'AED 144,000', occupancy: '89%', trend: '↑ 7%' },
  ];

  return (
    <div className="inv-page">
      {/* ── Back Nav ── */}
      <motion.button className="inv-back-btn" onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Home
      </motion.button>

      {/* ── HERO ── */}
      <section className="inv-hero">
        <motion.div className="inv-hero-bg" style={{ y: yParallax }} />
        <div className="inv-hero-overlay" />
        <div className="inv-hero-content">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="inv-eyebrow">EXCLUSIVE INVESTOR ADVISORY · DUBAI UAE</p>
            <h1 className="inv-hero-title">
              Where Capital Meets<br />
              <span className="gold-gradient-text">Extraordinary Returns.</span>
            </h1>
            <p className="inv-hero-sub">
              The world's most dynamic real estate market. Zero tax. Golden Visa eligibility.
              Up to 12.4% ROI. Your global wealth strategy starts in Dubai.
            </p>
            <div className="inv-hero-actions">
              <motion.button className="btn-gold-inv" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/contact')}>
                Start Investing Today
              </motion.button>
              <motion.button className="btn-outline-inv" whileHover={{ scale: 1.04 }}
                onClick={() => { document.getElementById('roi-calc')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Calculate Your ROI
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="inv-hero-stats">
          {[
            { label: 'Annual ROI', value: '12.4', suffix: '%' },
            { label: 'Portfolio Value', value: '168', suffix: 'M+' },
            { label: 'Happy Investors', value: '500', suffix: '+' },
            { label: 'Years Experience', value: '16', suffix: '+' },
          ].map((s, i) => (
            <motion.div key={i} className="inv-hero-stat"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}>
              <strong><AnimatedCounter target={parseFloat(s.value)} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="inv-scroll-hint">
          <span>Scroll to Explore</span><div className="scroll-line-inv" />
        </div>
      </section>

      {/* ── INVESTMENT OPPORTUNITIES ── */}
      <section className="inv-section opportunities-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">CURATED FOR YOUR PORTFOLIO</span>
          <h2 className="inv-section-title">Dubai Investment Opportunities</h2>
        </div>

        <div className="opp-tabs">
          {[['residential', 'Residential'],['commercial','Commercial'],['holiday','Holiday Homes']].map(([val,lbl]) => (
            <button key={val} className={`opp-tab ${activeTab === val ? 'active' : ''}`}
              onClick={() => setActiveTab(val)}>{lbl}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} className="opp-grid"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}>
            {opportunities[activeTab].map((opp, i) => (
              <motion.div key={i} className="opp-card"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
                <div className="opp-card-header">
                  <span className="opp-badge">{opp.badge}</span>
                  <span className="opp-roi-chip">{opp.roi} ROI</span>
                </div>
                <h3 className="opp-title">{opp.title}</h3>
                <p className="opp-desc">{opp.desc}</p>
                <div className="opp-footer">
                  <span className="opp-min-label">From</span>
                  <span className="opp-min-val">{opp.min}</span>
                  <button className="opp-cta" onClick={() => navigate('/contact')}>Invest Now →</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── WHY DUBAI ── */}
      <section className="inv-section why-dubai-section">
        <div className="why-dubai-inner">
          <div className="inv-section-header">
            <span className="inv-eyebrow-sm">THE WORLD'S FAVOURITE INVESTMENT CITY</span>
            <h2 className="inv-section-title">Why Invest in Dubai?</h2>
            <p className="inv-section-sub">Dubai isn't just a city — it's the world's most powerful tax-free wealth engine for global investors.</p>
          </div>

          <div className="why-dubai-grid">
            {whyDubai.map((item, i) => (
              <motion.div key={i} className="why-card"
                initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(201,168,76,0.18)' }}>
                <span className="why-icon">{item.icon}</span>
                <h4 className="why-title">{item.title}</h4>
                <p className="why-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTOR BENEFITS ── */}
      <section className="inv-section benefits-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">YOUR INVESTMENT ADVANTAGE</span>
          <h2 className="inv-section-title">Investor Benefits</h2>
        </div>
        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <motion.div key={i} className="benefit-card"
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }} whileHover={{ y: -4 }}>
              <span className="benefit-icon">{b.icon}</span>
              <div>
                <h4 className="benefit-title">{b.title}</h4>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section className="inv-section calc-section" id="roi-calc">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">PROJECTED RETURNS</span>
          <h2 className="inv-section-title">ROI Calculator</h2>
          <p className="inv-section-sub">Model your Dubai property returns before you invest. Adjust parameters to see real-time projections.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <ROICalculator />
        </motion.div>
      </section>

      {/* ── RENTAL YIELD INSIGHTS ── */}
      <section className="inv-section rental-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">LIVE MARKET DATA</span>
          <h2 className="inv-section-title">Rental Yield Insights</h2>
        </div>
        <div className="rental-table-wrap">
          <div className="rental-table-header">
            <span>Area</span>
            <span>Monthly Rent</span>
            <span>Annual Yield</span>
            <span>Occupancy</span>
            <span>YOY Trend</span>
          </div>
          {rentalInsights.map((row, i) => (
            <motion.div key={i} className="rental-table-row"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <span className="rental-area">{row.area}</span>
              <span className="rental-monthly">{row.monthly}</span>
              <span className="rental-annual gold">{row.annual}</span>
              <span className="rental-occ">{row.occupancy}</span>
              <span className="rental-trend green">{row.trend}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MARKET CHARTS ── */}
      <section className="inv-section charts-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">MARKET INTELLIGENCE</span>
          <h2 className="inv-section-title">Animated Market Analytics</h2>
        </div>
        <div className="charts-duo">
          <MarketChart data={yieldData} title="Rental Yield by Area (%)" color="#c9a84c" />
          <MarketChart data={appreciationData} title="Annual Price Appreciation (%)" color="#06d6a0" />
        </div>

        <div className="market-kpi-row">
          {[
            { label: 'Transactions in 2024', val: '124,000', icon: '🏢' },
            { label: 'International Buyers', val: '68%', icon: '🌍' },
            { label: 'Avg Days on Market', val: '14', icon: '📅' },
            { label: 'Price Growth YOY', val: '+29%', icon: '📈' },
          ].map((k, i) => (
            <motion.div key={i} className="kpi-card"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <span className="kpi-icon">{k.icon}</span>
              <strong className="kpi-val">{k.val}</strong>
              <span className="kpi-label">{k.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INVESTMENT PROCESS ── */}
      <section className="inv-section process-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">YOUR JOURNEY WITH US</span>
          <h2 className="inv-section-title">Investment Process</h2>
          <p className="inv-section-sub">From first conversation to passive income — a seamless 5-step process.</p>
        </div>
        <div className="timeline-wrap">
          {processSteps.map((step, i) => (
            <TimelineItem key={i} step={i} title={step.title} desc={step.desc}
              icon={step.icon} isLast={i === processSteps.length - 1} />
          ))}
        </div>
      </section>

      {/* ── FEATURED AREAS ── */}
      <section className="inv-section areas-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">PRIME INVESTMENT ZONES</span>
          <h2 className="inv-section-title">Featured Investment Areas</h2>
        </div>
        <div className="areas-grid">
          {areas.map((area, i) => (
            <motion.div key={i} className="area-card"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -8 }}>
              <div className="area-card-img-wrap">
                <img src={area.img} alt={area.name} />
                <div className="area-card-overlay" />
                <span className="area-growth-badge">{area.growth}</span>
              </div>
              <div className="area-card-body">
                <h4 className="area-card-name">{area.name}</h4>
                <div className="area-stats">
                  <div className="area-stat">
                    <span>Avg Price</span>
                    <strong>{area.avg}</strong>
                  </div>
                  <div className="area-stat">
                    <span>Yield</span>
                    <strong className="gold">{area.yield}</strong>
                  </div>
                </div>
                <button className="area-explore-btn" onClick={() => navigate('/properties')}>
                  Explore Properties →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="inv-section testimonials-section">
        <div className="inv-section-header">
          <span className="inv-eyebrow-sm">INVESTOR SUCCESS STORIES</span>
          <h2 className="inv-section-title">What Investors Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div key={i} className="testimonial-card"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}>
              <div className="testi-quote-icon">"</div>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-footer">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <strong className="testi-name">{t.flag} {t.name}</strong>
                  <span className="testi-title">{t.title}</span>
                </div>
                <span className="testi-roi">{t.roi}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <motion.section className="inv-cta-section"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="inv-cta-glow" />
        <p className="inv-cta-eyebrow">BEGIN YOUR WEALTH JOURNEY</p>
        <h2 className="inv-cta-title">Ready to Invest in Dubai?</h2>
        <p className="inv-cta-sub">
          Book a private consultation with Waqar Rahiem and get exclusive access to
          off-market opportunities, tailored ROI projections, and a dedicated investment strategy.
        </p>
        <div className="inv-cta-btns">
          <motion.button className="btn-gold-inv lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/contact')}>
            Book Private Consultation
          </motion.button>
          <motion.a href="https://wa.me/8438529815" target="_blank" rel="noreferrer"
            className="btn-wa-inv lg" whileHover={{ scale: 1.04 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp Advisor
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
