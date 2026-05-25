import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './InsightsPage.css';

const articles = [
  {
    id: 1, category: 'Market Report', readTime: '6 min read', date: 'May 2025',
    title: 'Dubai Property Market Hits Record AED 142B in Q1 2025',
    excerpt: 'Dubai\'s real estate sector witnessed an unprecedented surge, with transaction volumes growing 34% year-on-year. Palm Jumeirah and Downtown lead the appreciation charts.',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    tags: ['Market Trends', 'Investment', 'Record Growth'], featured: true,
  },
  {
    id: 2, category: 'Investment Guide', readTime: '8 min read', date: 'Apr 2025',
    title: 'How NRIs Can Invest in Dubai Real Estate Tax-Free in 2025',
    excerpt: 'A step-by-step advisory for non-resident investors looking to build wealth in Dubai\'s booming property market with zero capital gains tax.',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    tags: ['NRI Guide', 'Tax-Free', 'Off-Plan'],
  },
  {
    id: 3, category: 'ROI Analysis', readTime: '5 min read', date: 'Apr 2025',
    title: 'Top 5 Highest-Yielding Areas in Dubai Right Now',
    excerpt: 'Data-driven analysis of Dubai\'s best-performing micro-markets for rental yield — from JBR and Business Bay to emerging zones in Dubai South.',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    tags: ['Rental Yield', 'ROI', 'Analytics'],
  },
  {
    id: 4, category: 'Area Report', readTime: '7 min read', date: 'Mar 2025',
    title: 'Palm Jumeirah: The World\'s Most Prestigious Address Explained',
    excerpt: 'Why global billionaires, celebrities, and sovereign wealth funds are acquiring Palm Jumeirah frond villas at record prices despite 40%+ appreciation.',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
    tags: ['Palm Jumeirah', 'Ultra-Luxury', 'Capital Gains'],
  },
  {
    id: 5, category: 'Off-Plan Guide', readTime: '9 min read', date: 'Mar 2025',
    title: 'The Complete 2025 Guide to Off-Plan Property Investment in Dubai',
    excerpt: 'From escrow protection and RERA regulations to developer due diligence and payment plan structures — the definitive off-plan investor guide.',
    img: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&auto=format&fit=crop&q=80',
    tags: ['Off-Plan', 'RERA', 'Beginner Guide'],
  },
  {
    id: 6, category: 'Golden Visa', readTime: '4 min read', date: 'Feb 2025',
    title: 'UAE Golden Visa Through Real Estate: Complete 2025 Eligibility Guide',
    excerpt: 'Everything you need to know about qualifying for a 10-year UAE Golden Visa through a minimum AED 2M property investment.',
    img: 'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800&auto=format&fit=crop&q=80',
    tags: ['Golden Visa', 'UAE Residency', 'Eligibility'],
  },
];

const categories = ['All', 'Market Report', 'Investment Guide', 'ROI Analysis', 'Area Report', 'Off-Plan Guide', 'Golden Visa'];

const trendingAreas = [
  { name: 'Dubai Creek Harbour', growth: '+41%', type: 'Emerging', desc: 'The next Downtown — masterplanned waterfront city with massive appreciation potential.' },
  { name: 'Dubai Hills Estate', growth: '+29%', type: 'Established', desc: 'Golf-course living with villa communities showing consistent 8.2% rental yields.' },
  { name: 'Jumeirah Village Circle', growth: '+22%', type: 'Affordable Entry', desc: 'Dubai\'s highest-volume transacted area — ideal for first-time investors targeting rental income.' },
  { name: 'Meydan', growth: '+35%', type: 'Up-and-Coming', desc: 'Race course views, F1-adjacent location, and off-plan pricing still 30% below market.' },
];

const videoInsights = [
  { title: 'Dubai Property Market Overview Q1 2025', duration: '12:34', thumb: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80' },
  { title: 'Off-Plan vs Ready: What Smart Investors Choose', duration: '8:15', thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80' },
  { title: 'How to Get UAE Golden Visa via Property', duration: '6:42', thumb: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80' },
];

const educationModules = [
  { icon: '📘', title: 'Real Estate Fundamentals', lessons: 8, desc: 'Understand property types, valuation methods, and market cycles.' },
  { icon: '📊', title: 'Investment Analysis', lessons: 6, desc: 'Learn ROI calculation, cap rates, cash-on-cash returns, and due diligence.' },
  { icon: '⚖️', title: 'Dubai Legal Framework', lessons: 5, desc: 'RERA laws, SPA contracts, escrow, DLD registration, and tenant rights.' },
  { icon: '🏦', title: 'Mortgage & Financing', lessons: 7, desc: 'UAE bank financing, NRI eligibility, LTV ratios, and developer payment plans.' },
];

export default function InsightsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 250]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = articles.find(a => a.featured);
  const rest = filtered.filter(a => !a.featured || activeCategory !== 'All' || searchQuery);

  const handleSubscribe = async e => {
    e.preventDefault();
    if (email) { 
      try {
        await fetch('http://localhost:5001/api/consultation/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: 'Newsletter Subscriber',
            email: email,
            phoneNumber: 'N/A',
            budgetRange: 'N/A',
            investmentGoal: 'Market Insights',
            consultationType: 'Newsletter Subscription',
            additionalMessage: 'Please subscribe me to the newsletter.'
          }),
        });
      } catch (err) {
        console.error(err);
      }
      setSubscribed(true); 
      setEmail(''); 
      setTimeout(() => setSubscribed(false), 5000); 
    }
  };

  return (
    <div className="insights-page">
      {/* Back */}
      <motion.button className="insights-back-btn" onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Home
      </motion.button>

      {/* ── HERO ── */}
      <section className="insights-hero">
        <motion.div className="insights-hero-bg" style={{ y: yParallax }} />
        <div className="insights-hero-overlay" />
        <div className="insights-hero-content">
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <p className="insights-eyebrow">DUBAI REAL ESTATE INTELLIGENCE</p>
            <h1 className="insights-hero-title">
              Market Insights &<br />
              <span className="gold-gradient-ins">Investment Intelligence</span>
            </h1>
            <p className="insights-hero-sub">
              Data-driven analysis, expert commentary, and exclusive market intelligence
              trusted by Dubai's most discerning global investors.
            </p>
            {/* Search */}
            <div className="insights-search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search insights, areas, topics..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="insights-search-input" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED ARTICLE ── */}
      {featured && !searchQuery && activeCategory === 'All' && (
        <section className="insights-section">
          <div className="insights-section-label">FEATURED INSIGHT</div>
          <motion.div className="featured-article"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65 }} whileHover={{ y: -4 }}>
            <div className="featured-img-wrap">
              <img src={featured.img} alt={featured.title} />
              <div className="featured-img-overlay" />
              <span className="featured-cat-badge">{featured.category}</span>
            </div>
            <div className="featured-body">
              <div className="featured-meta">
                <span className="meta-date">{featured.date}</span>
                <span className="meta-sep">·</span>
                <span className="meta-read">{featured.readTime}</span>
              </div>
              <h2 className="featured-title">{featured.title}</h2>
              <p className="featured-excerpt">{featured.excerpt}</p>
              <div className="featured-tags">
                {featured.tags.map(tag => (
                  <span key={tag} className="article-tag">{tag}</span>
                ))}
              </div>

            </div>
          </motion.div>
        </section>
      )}

      {/* ── FILTER + ARTICLES ── */}
      <section className="insights-section articles-section">
        <div className="insights-section-label">MARKET INSIGHTS</div>
        <div className="insights-filters">
          {categories.map(cat => (
            <button key={cat} className={`insights-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div className="no-insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span>🔍</span>
              <h3>No insights found</h3>
              <p>Try a different category or search term</p>
            </motion.div>
          ) : (
            <motion.div className="articles-grid" layout>
              <AnimatePresence mode="popLayout">
                {(searchQuery || activeCategory !== 'All' ? filtered : filtered.filter(a => !a.featured)).map((article, i) => (
                  <motion.article key={article.id} className="article-card"
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    whileHover={{ y: -6 }}>
                    <div className="article-img-wrap">
                      <img src={article.img} alt={article.title} />
                      <div className="article-img-overlay" />
                      <span className="article-cat-badge">{article.category}</span>
                      <div className="article-read-overlay">
                        <span>Read Article →</span>
                      </div>
                    </div>
                    <div className="article-body">
                      <div className="article-meta">
                        <span className="meta-date">{article.date}</span>
                        <span className="meta-sep">·</span>
                        <span className="meta-read">{article.readTime}</span>
                      </div>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-excerpt">{article.excerpt}</p>
                      <div className="article-tags">
                        {article.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="article-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── DUBAI TRENDS CHART ── */}
      <section className="insights-section trends-section">
        <div className="insights-section-label">PRICE TRENDS</div>
        <h2 className="insights-section-title">Dubai Real Estate Trends</h2>
        <div className="trends-grid">
          {[
            { area: 'Palm Jumeirah', q1: 62, q2: 74, q3: 81, q4: 89, yoy: '+28%', color: '#c9a84c' },
            { area: 'Downtown Dubai', q1: 55, q2: 70, q3: 82, q4: 91, yoy: '+34%', color: '#06d6a0' },
            { area: 'Dubai Marina', q1: 48, q2: 61, q3: 72, q4: 85, yoy: '+31%', color: '#00b4d8' },
            { area: 'Business Bay', q1: 40, q2: 52, q3: 64, q4: 72, yoy: '+22%', color: '#c084fc' },
          ].map((trend, i) => (
            <motion.div key={i} className="trend-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="trend-card-header">
                <h4 className="trend-area">{trend.area}</h4>
                <span className="trend-yoy" style={{ color: trend.color }}>{trend.yoy}</span>
              </div>
              <div className="trend-bars">
                {[
                  { q: 'Q1', val: trend.q1 }, { q: 'Q2', val: trend.q2 },
                  { q: 'Q3', val: trend.q3 }, { q: 'Q4', val: trend.q4 },
                ].map((bar, j) => (
                  <div key={j} className="trend-bar-wrap">
                    <div className="trend-bar-track">
                      <motion.div className="trend-bar-fill"
                        style={{ background: trend.color }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${bar.val}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.08, duration: 0.7, ease: 'easeOut' }} />
                    </div>
                    <span className="trend-bar-label">{bar.q}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RENTAL YIELD ANALYSIS ── */}
      <section className="insights-section yield-section">
        <div className="insights-section-label">YIELD ANALYSIS</div>
        <h2 className="insights-section-title">Rental Yield Analysis 2025</h2>
        <div className="yield-grid">
          {[
            { area: 'Downtown Dubai', type: 'Apartment 2BR', yield: 9.4, rent: 'AED 22K/mo', occupancy: 94 },
            { area: 'JBR', type: 'Apartment 1BR (STR)', yield: 12.4, rent: 'AED 14K/mo', occupancy: 92 },
            { area: 'Palm Jumeirah', type: 'Villa 5BR', yield: 8.6, rent: 'AED 38K/mo', occupancy: 88 },
            { area: 'Dubai Marina', type: 'Penthouse 4BR', yield: 9.1, rent: 'AED 16.5K/mo', occupancy: 91 },
            { area: 'Business Bay', type: 'Office 2000sqft', yield: 7.9, rent: 'AED 12K/mo', occupancy: 89 },
            { area: 'Emirates Hills', type: 'Villa 8BR', yield: 6.8, rent: 'AED 70K/mo', occupancy: 82 },
          ].map((item, i) => (
            <motion.div key={i} className="yield-card"
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}>
              <div className="yield-header">
                <div>
                  <h4 className="yield-area">{item.area}</h4>
                  <span className="yield-type">{item.type}</span>
                </div>
                <div className="yield-pct">
                  <strong>{item.yield}%</strong>
                  <span>Yield</span>
                </div>
              </div>
              <div className="yield-bar-track">
                <motion.div className="yield-bar"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.yield / 14) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.7 }}
                  style={{ background: `linear-gradient(90deg, #c9a84c, #e8cc7a)` }} />
              </div>
              <div className="yield-footer">
                <span>{item.rent}</span>
                <span>{item.occupancy}% Occupancy</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {/* ── TRENDING AREAS ── */}
      <section className="insights-section trending-section">
        <div className="insights-section-label">HOT MARKETS</div>
        <h2 className="insights-section-title">Trending Investment Areas</h2>
        <div className="trending-grid">
          {trendingAreas.map((area, i) => (
            <motion.div key={i} className="trending-card"
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -5 }}>
              <div className="trending-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="trending-body">
                <div className="trending-header">
                  <h4>{area.name}</h4>
                  <span className="trending-growth">{area.growth}</span>
                </div>
                <span className="trending-type">{area.type}</span>
                <p className="trending-desc">{area.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <motion.section className="insights-newsletter"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="newsletter-glow" />
        <p className="newsletter-eyebrow">STAY AHEAD OF THE MARKET</p>
        <h2 className="newsletter-title">
          Dubai Market Intelligence<br />
          <span className="gold-gradient-ins">Straight to Your Inbox</span>
        </h2>
        <p className="newsletter-sub">
          Weekly market reports, ROI alerts, area growth data, and exclusive off-plan opportunities —
          curated by Waqar Rahiem for serious investors.
        </p>
        <form className="newsletter-form-ins" onSubmit={handleSubscribe}>
          <input type="email" placeholder="Enter your email address"
            value={email} onChange={e => setEmail(e.target.value)} required
            className="newsletter-input-ins" />
          <button type="submit" className="newsletter-btn-ins">
            {subscribed ? '✓ Subscribed!' : 'Subscribe Free'}
          </button>
        </form>
        <p className="newsletter-note">Join 2,400+ global investors · No spam · Unsubscribe anytime</p>
      </motion.section>
    </div>
  );
}
