import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroAgent from '../assets/hero_agent.png'
import aboutAgent from '../assets/punith.png'
import villaImg from '../assets/villa.png'
import aptImg from '../assets/apt.png'
import penthouseImg from '../assets/penthouse.png'
import ConsultationModal from '../components/ConsultationModal'
import '../App.css'

function App() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [showConsultation, setShowConsultation] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }


  return (
    <div className="container">
      <ConsultationModal isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="gold-text">W</span>AQAR <span className="gold-text">R</span>AHIEM<span className="gold-text">.</span>
        </div>
        <div className="nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#about">About Me</a>
          <a href="#services">Services</a>
          <a href="#properties" onClick={(e) => { e.preventDefault(); navigate('/properties'); }}>Properties</a>
          <a href="#investors" onClick={(e) => { e.preventDefault(); navigate('/investors'); }}>Investors</a>
          <a href="#insights" onClick={(e) => { e.preventDefault(); navigate('/insights'); }}>Insights</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
        </div>
        <button className="btn-nav-consultation" onClick={() => setShowConsultation(true)}>BOOK A CONSULTATION</button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-subtitle">REAL ESTATE ENTREPRENEUR</p>
            <h1 className="hero-title">
              Dubai Real Estate<br />
              Built Around<br />
              <span className="gold-text serif">Smart Investments.</span>
            </h1>
            <p className="hero-description">
              With 16+ years of experience, I help investors buy, manage and scale
              profitable property portfolios in Dubai with confidence. From off-plan
              to ready properties — I make every deal count.
            </p>

            <div className="hero-callout">
              <span className="phone-icon-circle">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span className="callout-text">Call now to discuss your next Dubai Real Estate Investment.</span>
            </div>

            <div className="hero-buttons">
              <button className="btn-primary-gold" onClick={() => setShowConsultation(true)}>
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                BOOK A CONSULTATION
              </button>
              <button className="btn-secondary-outline" onClick={() => window.open('https://wa.me/8438529815', '_blank')}>
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </span>
                WHATSAPP ME
              </button>
            </div>
          </div>

          <div className="hero-image-container">
            <div className="agent-frame">
              <img src={heroAgent} alt="Waqar Rahiem" className="agent-image" />
            </div>
          </div>
        </div>

        {/* Stats Grid Container */}
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">16+</div>
                <div className="stat-meta">
                  <span className="stat-title">YEARS OF EXPERIENCE</span>
                  <span className="stat-subtitle">Since 2007</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">$50M+</div>
                <div className="stat-meta">
                  <span className="stat-title">IN SALES CLOSED</span>
                  <span className="stat-subtitle">Last year</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">94.7%</div>
                <div className="stat-meta">
                  <span className="stat-title">CLOSURE RATE</span>
                  <span className="stat-subtitle">Proven Results</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">TOP RATED</div>
                <div className="stat-meta">
                  <span className="stat-title">REAL ESTATE ADVISOR</span>
                  <span className="stat-subtitle">By Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-grid">
          <div className="about-image-column">
            <div className="about-frame">
              <img src={aboutAgent} alt="Waqar Rahiem Podcast" className="about-image" />
              <div className="signature-overlay">Waqar Rahiem</div>
            </div>
          </div>

          <div className="about-content-column">
            <div className="section-label">
              <span className="gold-text">ABOUT WAQAR RAHIEM</span>
              <span className="label-line"></span>
            </div>
            <h2 className="about-title">
              Handling Dubai Investors<br />
              Portfolios Since 2007
            </h2>
            <p className="about-description">
              I specialize in helping investors buy, sell and manage high-performing
              property portfolios. My goal is simple – to make real estate investment
              in Dubai seamless, profitable and stress-free for you.
            </p>

            <div className="about-bullets">
              <div className="bullet-item">
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span className="bullet-text">Deep market knowledge & data-driven insights</span>
              </div>
              <div className="bullet-item">
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span className="bullet-text">Strong network of developers, buyers & industry experts</span>
              </div>
              <div className="bullet-item">
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span className="bullet-text">End-to-end support from investment to management</span>
              </div>
              <div className="bullet-item">
                <span className="check-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span className="bullet-text">Honest advice, transparent deals, lasting relationships</span>
              </div>
            </div>

            <button className="btn-secondary-outline learn-more-btn" onClick={() => navigate('/about')}>LEARN MORE ABOUT ME</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <p className="services-subtitle">LUXURY SERVICE PORTFOLIO</p>
        <h2 className="services-title">Premium Dubai Real Estate Services</h2>
        <p className="services-description">
          Curated investment, sales and management services tailored for elite Dubai property portfolios.
        </p>

        <div className="services-grid">
          {/* Card 1 */}
          <div className="service-card" onClick={() => navigate('/service/off-plan')} style={{ cursor: 'pointer' }}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="1"></rect>
                <line x1="9" y1="22" x2="9" y2="2"></line>
                <line x1="15" y1="22" x2="15" y2="2"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="11" x2="20" y2="11"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
              </svg>
            </div>
            <h3 className="service-card-title">Off-Plan Evaluation</h3>
            <p className="service-card-description">
              Expert analysis of off-plan projects to find the best investment opportunities with high ROI.
            </p>
            <div className="service-arrow">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="service-card" onClick={() => navigate('/service/ready-property')} style={{ cursor: 'pointer' }}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className="service-card-title">Ready Property</h3>
            <p className="service-card-description">
              Find the perfect ready property for living or investment from the best communities in Dubai.
            </p>
            <div className="service-arrow">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="service-card" onClick={() => navigate('/service/property-management')} style={{ cursor: 'pointer' }}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="service-card-title">Property Management</h3>
            <p className="service-card-description">
              Complete property management solutions for landlords – hassle-free and stress-free.
            </p>
            <div className="service-arrow">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 4 */}
          <div className="service-card" onClick={() => navigate('/service/investment-consultant')} style={{ cursor: 'pointer' }}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 className="service-card-title">Real Estate Investment Consultant</h3>
            <p className="service-card-description">
              Strategic investment planning to build and grow your real estate portfolio.
            </p>
            <div className="service-arrow">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 5 */}
          <div className="service-card" onClick={() => navigate('/service/selling-resale')} style={{ cursor: 'pointer' }}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <h3 className="service-card-title">Selling & Resale</h3>
            <p className="service-card-description">
              Get the best value for your property with my expert marketing and negotiation skills.
            </p>
            <div className="service-arrow">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Sold Section */}
      <section id="properties" className="properties-section">
        <div className="properties-header">
          <div className="properties-header-left">
            <p className="section-label-small">RECENT SUCCESS STORIES</p>
            <h2 className="properties-title">Properties Sold</h2>
          </div>
          <button className="btn-secondary-outline btn-view-all" onClick={() => navigate('/properties')}>VIEW ALL PROPERTIES</button>
        </div>

        <div className="properties-grid">
          {/* Property 1 */}
          <div className="property-card">
            <div className="property-image-wrapper">
              <img src={villaImg} alt="Palm Jumeirah Villa" className="property-image" />
              <span className="sold-badge">SOLD</span>
            </div>
            <div className="property-details">
              <h3 className="property-card-title">Palm Jumeirah Villa</h3>
              <p className="property-price">AED 28,500,000</p>
              <div className="property-specs">
                <span className="spec-item">ROI: 8.6%</span>
                <span className="spec-divider">|</span>
                <span className="spec-item">Sold in 18 Days</span>
              </div>
              <p className="property-location">Palm Jumeirah</p>
            </div>
          </div>

          {/* Property 2 */}
          <div className="property-card">
            <div className="property-image-wrapper">
              <img src={aptImg} alt="Downtown Dubai Apt" className="property-image" />
              <span className="sold-badge">SOLD</span>
            </div>
            <div className="property-details">
              <h3 className="property-card-title">Downtown Dubai Apt</h3>
              <p className="property-price">AED 6,800,000</p>
              <div className="property-specs">
                <span className="spec-item">ROI: 7.2%</span>
                <span className="spec-divider">|</span>
                <span className="spec-item">Sold in 12 Days</span>
              </div>
              <p className="property-location">Downtown Dubai</p>
            </div>
          </div>

          {/* Property 3 */}
          <div className="property-card">
            <div className="property-image-wrapper">
              <img src={penthouseImg} alt="Dubai Marina Penthouse" className="property-image" />
              <span className="sold-badge">SOLD</span>
            </div>
            <div className="property-details">
              <h3 className="property-card-title">Dubai Marina Penthouse</h3>
              <p className="property-price">AED 15,200,000</p>
              <div className="property-specs">
                <span className="spec-item">ROI: 9.1%</span>
                <span className="spec-divider">|</span>
                <span className="spec-item">Sold in 21 Days</span>
              </div>
              <p className="property-location">Dubai Marina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Informed (Newsletter) */}
      <section className="newsletter-section">
        <div className="newsletter-grid">
          <div className="newsletter-content">
            <p className="newsletter-subtitle">STAY INFORMED</p>
            <h2 className="newsletter-title serif">
              Dubai Real Estate Insights<br />
              Straight to Your Inbox
            </h2>
            <p className="newsletter-description">
              Get the latest market trends, investment opportunities & exclusive updates.
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="btn-subscribe">
                {subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE NOW'}
              </button>
            </form>
          </div>

          {/* This represents the graphic/silhouette Burj Khalifa on the right of stay informed */}
          <div className="newsletter-burj-column">
            <div className="burj-graphic-container"></div>
          </div>
        </div>
      </section>

      {/* CTA Whatsapp Banner */}
      <section className="cta-banner">
        <div className="cta-flex">
          <div className="cta-left">
            <div className="cta-phone-circle">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="cta-info">
              <h3 className="cta-title">Let's Discuss Your Next Move</h3>
              <p className="cta-subtitle">Your next smart investment is just a conversation away.</p>
            </div>
          </div>
          <button className="btn-secondary-outline btn-whatsapp-now" onClick={() => window.open('https://wa.me/8438529815', '_blank')}>
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </span>
            WHATSAPP ME NOW
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-flex">
          <p className="footer-copyright">© 2026 Waqar Rahiem. All Rights Reserved.</p>
          <div className="footer-socials">
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
