import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { rfpStore } from '../services/rfpStore';
import { 
  Code2, 
  Monitor, 
  TrendingUp, 
  Wifi, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Server,
  Database,
  Smartphone,
  Sliders,
  Send,
  Phone,
  Mail,
  ChevronDown,
  ArrowLeft,
  Rocket,
  Lock,
  Globe,
  Award,
  Users,
  FolderGit2,
  MapPin
} from 'lucide-react';

const ROTATING_PHRASES = [
  "Inventory Systems",
  "IoT Cloud Telemetry",
  "E-Commerce Platforms",
  "Business ERP Portals",
  "Custom Web Apps"
];

const FAQ_ITEMS = [
  {
    q: "How does the project estimation and delivery timeline work?",
    a: "Our base non-functional presentation and showcase websites start from Rs. 25,000 ($82 USD). Dynamic full-stack business applications, inventory ERPs, and IoT cloud telemetry hubs range from Rs. 45,000 to Rs. 125,000+. Production timelines typically range from 5 to 21 working days depending on custom integrations like Firebase database, PayHere payment gateways, and role-based authentication."
  },
  {
    q: "Can I connect custom IoT hardware (ESP32 / Arduino) to my web portal?",
    a: "Yes! Buildify specializes in bridging physical microcontroller hardware with web platforms. We engineer real-time MQTT and WebSocket telemetry pipelines that display live sensor streams (temperature, humidity, load cells, liquid levels) and allow instant remote relay switching directly from your mobile or PC browser."
  },
  {
    q: "Do you integrate Sri Lankan payment gateways like PayHere?",
    a: "Absolutely. We integrate PayHere, WebXpay, and direct Visa/Mastercard processing, alongside automated direct bank transfer slip uploads and instant WhatsApp/SMS order notifications for both you and your customers."
  },
  {
    q: "Will my website look great on mobile and rank well on Google?",
    a: "Every web system we deliver is engineered mobile-first with 100% fluid responsiveness across smartphones, tablets, laptops, and ultra-wide desktops. We optimize Core Web Vitals, page load speeds (under 1.5s), automated sitemaps, and Open Graph social cards for superior search engine rankings."
  },
  {
    q: "What cloud backend and hosting infrastructure do you deploy on?",
    a: "We deploy on robust modern cloud infrastructures including Google Cloud Firebase (Firestore, Cloud Functions, Cloud Storage), Supabase, Node.js, and Vercel/Netlify with automatic SSL encryption and 99.9% uptime guarantees."
  },
  {
    q: "Can I manage and update content on my website after launch?",
    a: "Yes. Depending on your chosen scope, we provide intuitive role-based admin portals (Admin, Manager, Staff) where you can easily update inventory, view customer quote requests, manage orders, and edit website text without writing code."
  }
];

export default function WebDevelopmentPage({ onBackToGateway, onSwitchToIoT }) {
  // Typewriter text animation state
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(120);

  // Active mockup preview tab ('inventory' | 'telemetry' | 'ecommerce')
  const [mockupTab, setMockupTab] = useState('inventory');

  // Simulated IoT demo controls
  const [relayActive, setRelayActive] = useState(true);
  const [sensorValues, setSensorValues] = useState({ temp: 28.6, humidity: 64, pressure: 1013 });

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Currency state: 'LKR' | 'USD'
  const [currency, setCurrency] = useState('LKR');
  const USD_RATE = 305;

  // Interactive Project Estimator State
  const [projectType, setProjectType] = useState('static_non_functional');
  const [hasDomain, setHasDomain] = useState(false);
  const [hasFirebase, setHasFirebase] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);
  const [hasRealtime, setHasRealtime] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectScope: 'Static UI Showcase (Starting Rs. 25k)',
    message: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Typewriter effect loop
  useEffect(() => {
    const currentPhrase = ROTATING_PHRASES[textIndex];
    let timer;

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(60);
        }, 1800);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        }, typingSpeed);
      } else {
        setIsDeleting(false);
        setTypingSpeed(110);
        setTextIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, textIndex, typingSpeed]);

  // Project Estimator Base Plans (Starting at Rs. 25,000 for non-functional/static UI)
  const baseEstimates = {
    static_non_functional: { 
      lkr: 25000, 
      name: "Non-Functional / Static UI", 
      desc: "Starting at Rs. 25,000 / $82 USD. Responsive presentation, styling & component architecture without backend database",
      timeline: "Depends on Requirements & Scope"
    },
    dynamic_web: { 
      lkr: 45000, 
      name: "Dynamic Business Web App", 
      desc: "Interactive forms, CMS integration, reactive state management & dynamic UI flows",
      timeline: "Depends on Requirements & Scope"
    },
    inventory_erp: { 
      lkr: 95000, 
      name: "Warehouse Inventory & ERP", 
      desc: "Stock tracking, SKU meters, purchase orders & multi-hub management",
      timeline: "Depends on Requirements & Scope"
    },
    iot_dashboard: { 
      lkr: 125000, 
      name: "Real-Time IoT Telemetry Hub", 
      desc: "Live ESP32 sensor streams, MQTT telemetry graphs & remote relay triggers",
      timeline: "Depends on Requirements & Scope"
    }
  };

  // Add-on Features & Cloud Infrastructure Pricing
  const addOnPricing = {
    domain: { lkr: 6000, name: "Custom Domain & DNS Setup", desc: ".com / .lk registration & SSL certificate" },
    firebase: { lkr: 15000, name: "Firebase Cloud DB & Hosting", desc: "Firestore, Cloud Functions & real-time backend" },
    auth: { lkr: 12000, name: "User Authentication & Roles", desc: "Multi-role JWT auth (Admin, Staff, Client access)" },
    payment: { lkr: 20000, name: "Payment Gateway Integration", desc: "PayHere, Stripe or direct Visa/Mastercard processing" },
    realtime: { lkr: 25000, name: "IoT WebSockets / MQTT Streaming", desc: "Live sensor telemetry & instant relay actuation" },
    notifications: { lkr: 8000, name: "Automated WhatsApp & SMS Alerts", desc: "Instant customer transaction & order dispatch alerts" }
  };

  const selectedBase = baseEstimates[projectType] || baseEstimates.static_non_functional;
  let addOnsLKR = 0;
  if (hasDomain) addOnsLKR += addOnPricing.domain.lkr;
  if (hasFirebase) addOnsLKR += addOnPricing.firebase.lkr;
  if (hasAuth) addOnsLKR += addOnPricing.auth.lkr;
  if (hasPayment) addOnsLKR += addOnPricing.payment.lkr;
  if (hasRealtime) addOnsLKR += addOnPricing.realtime.lkr;
  if (hasNotifications) addOnsLKR += addOnPricing.notifications.lkr;

  const totalLKR = selectedBase.lkr + addOnsLKR;

  // Currency Formatter Helper
  const formatPrice = (lkrAmount) => {
    if (currency === 'USD') {
      const usd = Math.round(lkrAmount / USD_RATE);
      return `$${usd.toLocaleString()}`;
    }
    return `Rs. ${lkrAmount.toLocaleString()}`;
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone) return;

    setIsSubmittingQuote(true);

    const activeAddons = [
      hasDomain ? 'Custom Domain & DNS Setup' : null,
      hasFirebase ? 'Firebase Cloud DB & Hosting' : null,
      hasAuth ? 'User Authentication & Roles' : null,
      hasPayment ? 'Payment Gateway Integration' : null,
      hasRealtime ? 'IoT WebSockets / MQTT Streaming' : null,
      hasNotifications ? 'Automated WhatsApp & SMS Alerts' : null
    ].filter(Boolean);

    try {
      await rfpStore.addProposal({
        category: 'Web Development',
        inquiryType: 'Web Development',
        companyName: quoteForm.company ? quoteForm.company.trim() : 'Direct Client',
        contactPerson: quoteForm.name.trim(),
        phone: quoteForm.phone.trim(),
        email: quoteForm.email ? quoteForm.email.trim() : '',
        contractType: `Web Dev: ${selectedBase.name}`,
        volumeQty: 1,
        estimatedValueLKR: totalLKR,
        addons: activeAddons,
        projectBrief: quoteForm.message?.trim() || `Client requested ${selectedBase.name} (${activeAddons.length > 0 ? 'Selected Addons: ' + activeAddons.join(', ') : 'Standard package with no add-ons'}).`
      });
    } catch (err) {
      console.warn('Failed to record web development quote in database:', err);
    } finally {
      setIsSubmittingQuote(false);
      setQuoteSubmitted(true);
    }
  };

  const handleWhatsAppQuote = () => {
    const formattedPrice = formatPrice(totalLKR);
    const addonsList = [
      hasDomain ? '• Custom Domain & DNS' : null,
      hasFirebase ? '• Firebase Cloud DB' : null,
      hasAuth ? '• User Authentication & Roles' : null,
      hasPayment ? '• Payment Gateway Integration' : null,
      hasRealtime ? '• IoT Telemetry / MQTT' : null,
      hasNotifications ? '• Automated WhatsApp & SMS' : null,
    ].filter(Boolean).join('\n');

    const text = encodeURIComponent(
      `Hello Buildify Solutions Web Engineering Team,\n\nI would like to discuss a Web Development Project.\nName: ${quoteForm.name || 'Client'}\nCompany: ${quoteForm.company || 'Business'}\nScope: ${selectedBase.name}\nEstimated Budget: ${formattedPrice} (${currency})\nDelivery Timeline: Tailored to project scope & requirements\nSelected Add-ons:\n${addonsList || 'None selected'}\n\nPlease send me a detailed project proposal.`
    );
    window.open(`https://wa.me/94717790035?text=${text}`, '_blank');
  };

  return (
    <div className="web-agency-page">
      {/* Authentic Gateway Web Background Animation (Zero Circuit Design) */}
      <div className="web-gateway-bg-ambient">
        {/* Gateway Ambient Glow & Dot Matrix Grid */}
        <div className="web-gateway-ambient-glow"></div>
        <div className="territory-grid-pattern web-grid"></div>

        {/* Dynamic Animated Drifting Cloud System & Telemetry Data Streams from Gateway Page */}
        <div className="territory-cloud-canvas web-page-cloud-canvas" aria-hidden="true">
          {/* Layer 1: Background Atmospheric Clouds */}
          <div className="cloud-drift-layer cloud-layer-back">
            <svg className="cloud-svg-shape cloud-back-1" viewBox="0 0 320 160">
              <path d="M 45 120 A 30 30 0 0 1 75 75 A 55 55 0 0 1 170 55 A 48 48 0 0 1 245 85 A 35 35 0 0 1 285 120 A 24 24 0 0 1 265 145 H 65 A 24 24 0 0 1 45 120 Z" />
            </svg>
            <svg className="cloud-svg-shape cloud-back-2" viewBox="0 0 260 130">
              <path d="M 35 95 A 25 25 0 0 1 60 60 A 45 45 0 0 1 140 45 A 40 40 0 0 1 200 70 A 30 30 0 0 1 235 95 A 20 20 0 0 1 220 118 H 50 A 20 20 0 0 1 35 95 Z" />
            </svg>
            <svg className="cloud-svg-shape cloud-back-3" viewBox="0 0 320 160">
              <path d="M 45 120 A 30 30 0 0 1 75 75 A 55 55 0 0 1 170 55 A 48 48 0 0 1 245 85 A 35 35 0 0 1 285 120 A 24 24 0 0 1 265 145 H 65 A 24 24 0 0 1 45 120 Z" />
            </svg>
            <svg className="cloud-svg-shape cloud-back-4" viewBox="0 0 260 130">
              <path d="M 35 95 A 25 25 0 0 1 60 60 A 45 45 0 0 1 140 45 A 40 40 0 0 1 200 70 A 30 30 0 0 1 235 95 A 20 20 0 0 1 220 118 H 50 A 20 20 0 0 1 35 95 Z" />
            </svg>
          </div>

          {/* Layer 2: Foreground Glowing Clouds */}
          <div className="cloud-drift-layer cloud-layer-front">
            <svg className="cloud-svg-shape cloud-front-1" viewBox="0 0 380 190">
              <path d="M 50 145 A 36 36 0 0 1 85 90 A 65 65 0 0 1 200 65 A 58 58 0 0 1 290 100 A 42 42 0 0 1 340 145 A 30 30 0 0 1 315 175 H 75 A 30 30 0 0 1 50 145 Z" />
            </svg>
            <svg className="cloud-svg-shape cloud-front-2" viewBox="0 0 290 150">
              <path d="M 40 115 A 30 30 0 0 1 70 70 A 50 50 0 0 1 160 50 A 45 45 0 0 1 225 80 A 35 35 0 0 1 260 115 A 24 24 0 0 1 240 138 H 60 A 24 24 0 0 1 40 115 Z" />
            </svg>
            <svg className="cloud-svg-shape cloud-front-3" viewBox="0 0 380 190">
              <path d="M 50 145 A 36 36 0 0 1 85 90 A 65 65 0 0 1 200 65 A 58 58 0 0 1 290 100 A 42 42 0 0 1 340 145 A 30 30 0 0 1 315 175 H 75 A 30 30 0 0 1 50 145 Z" />
            </svg>
            <svg className="cloud-svg-shape cloud-front-4" viewBox="0 0 290 150">
              <path d="M 40 115 A 30 30 0 0 1 70 70 A 50 50 0 0 1 160 50 A 45 45 0 0 1 225 80 A 35 35 0 0 1 260 115 A 24 24 0 0 1 240 138 H 60 A 24 24 0 0 1 40 115 Z" />
            </svg>
          </div>

          {/* Connected Cloud Telemetry Network Node Arcs */}
          <svg className="cloud-network-svg" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cloudDataGradWeb" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <g stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1.3" strokeDasharray="4 6" fill="none">
              <path d="M 80 540 Q 220 320 380 290" />
              <path d="M 380 290 Q 520 250 680 310" />
              <path d="M 680 310 Q 820 370 940 280" />
              <path d="M 220 620 Q 360 480 510 430" />
              <path d="M 510 430 Q 660 380 830 450" />
              <path d="M 120 220 Q 320 150 540 210" />
              <path d="M 540 210 Q 750 260 920 180" />
            </g>
            <circle cx="380" cy="290" r="4.5" fill="#38bdf8" className="cloud-node node-pulse-1" />
            <circle cx="680" cy="310" r="4" fill="#7dd3fc" className="cloud-node node-pulse-2" />
            <circle cx="510" cy="430" r="5" fill="#38bdf8" className="cloud-node node-pulse-3" />
            <circle cx="540" cy="210" r="4" fill="#38bdf8" className="cloud-node node-pulse-2" />
            <circle cx="830" cy="450" r="4.5" fill="#7dd3fc" className="cloud-node node-pulse-1" />
            <circle cx="940" cy="280" r="4" fill="#38bdf8" className="cloud-node node-pulse-3" />
          </svg>

          {/* Rising Real-Time Cloud Telemetry Data Stream Packets */}
          <div className="cloud-data-stream-container">
            <span className="cloud-data-packet packet-p1"></span>
            <span className="cloud-data-packet packet-p2"></span>
            <span className="cloud-data-packet packet-p3"></span>
            <span className="cloud-data-packet packet-p4"></span>
            <span className="cloud-data-packet packet-p5"></span>
            <span className="cloud-data-packet packet-p6"></span>
            <span className="cloud-data-packet packet-p7"></span>
            <span className="cloud-data-packet packet-p8"></span>
            <span className="cloud-data-packet packet-p9"></span>
            <span className="cloud-data-packet packet-p10"></span>
            <span className="cloud-data-packet packet-p11"></span>
            <span className="cloud-data-packet packet-p12"></span>
          </div>
        </div>
      </div>

      {/* Agency Header / Navbar (Matching Reference Style with Buildify Cyber Blue) */}
      <header className="web-agency-header">
        <div className="web-header-container">
          <div 
            className="web-header-brand" 
            onClick={onBackToGateway} 
            style={{ cursor: 'pointer' }}
            title="Return to Buildify Gateway"
          >
            <Logo size="small" showTagline={true} />
          </div>

          <nav className="web-nav-links">
            <a href="#aboutSection" className="web-nav-item">About</a>
            <a href="#solutionsSection" className="web-nav-item">Solutions</a>
            <a href="#estimatorSection" className="web-nav-item">Estimator</a>
            <a href="#portfolioSection" className="web-nav-item">Portfolio</a>
            <a href="#faqSection" className="web-nav-item">FAQ</a>
          </nav>

          <div className="web-header-actions">
            <button 
              className="web-switch-portal-btn"
              onClick={onSwitchToIoT}
              title="Switch to IoT Products & Hardware Store"
            >
              <span className="switch-desktop-label">⚡ Switch to IoT Store</span>
              <span className="switch-mobile-label">⚡ IoT Store</span>
            </button>

            <button 
              className="web-lets-talk-btn"
              onClick={handleWhatsAppQuote}
              title="Chat with Web Engineering Team on WhatsApp"
            >
              <i className="bi bi-whatsapp"></i>
              <span className="talk-desktop-label">Let's Talk</span>
              <span className="talk-mobile-label">Chat</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Horizontal Scroller Navigation */}
        <div className="web-mobile-quick-nav" aria-label="Mobile Navigation">
          <div className="web-mobile-nav-scroller">
            <a href="#aboutSection" className="mobile-nav-chip">About</a>
            <a href="#solutionsSection" className="mobile-nav-chip">Solutions</a>
            <a href="#estimatorSection" className="mobile-nav-chip">Estimator</a>
            <a href="#portfolioSection" className="mobile-nav-chip">Portfolio</a>
            <a href="#faqSection" className="mobile-nav-chip">FAQ</a>
            <a href="#quoteSection" className="mobile-nav-chip chip-highlight">Get Quote</a>
          </div>
        </div>
      </header>

      {/* Hero Section: Exact layout from reference image with animated typewriter text */}
      <section className="web-agency-hero" id="aboutSection">
        <div className="web-hero-grid">
          
          {/* Left Hero Content */}
          <div className="web-hero-left">
            <div className="web-agency-badge">
              <span className="badge-pulse-cyan"></span>
              <Globe size={13} className="badge-icon" />
              <span>Sri Lanka's Trusted Web & Digital Agency</span>
            </div>

            <h1 className="web-hero-headline">
              We Build <span className="typewriter-dynamic-word">{displayedText}</span>
              <span className="typewriter-cursor">|</span> That Drive Real Results
            </h1>

            <p className="web-hero-subtitle">
              Buildify Solutions crafts fast, secure, and SEO-optimized websites, real-time IoT dashboards, inventory ERP systems & custom web applications for growing businesses across Sri Lanka.
            </p>

            <div className="web-hero-cta-row">
              <button 
                className="web-btn-primary"
                onClick={() => {
                  const el = document.getElementById('quoteSection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <i className="bi bi-whatsapp"></i>
                <span>Get Free Quote</span>
              </button>

              <button 
                className="web-btn-secondary"
                onClick={() => {
                  const el = document.getElementById('portfolioSection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FolderGit2 size={16} />
                <span>View Portfolio</span>
              </button>
            </div>

            {/* Stats Counter Row (Matching Reference) */}
            <div className="web-stats-row">
              <div className="web-stat-item">
                <div className="stat-number">8<span className="stat-plus">+</span></div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="web-stat-divider"></div>

              <div className="web-stat-item">
                <div className="stat-number">35<span className="stat-plus">+</span></div>
                <div className="stat-label">Happy Clients</div>
              </div>
              <div className="web-stat-divider"></div>

              <div className="web-stat-item">
                <div className="stat-number">50<span className="stat-plus">+</span></div>
                <div className="stat-label">Projects Done</div>
              </div>
            </div>
          </div>

          {/* Right Hero Preview: Interactive Live Browser Mockup with floating badges */}
          <div className="web-hero-right">
            <div className="browser-mockup-wrapper">
              
              {/* Floating Badge 1: Tailored Scope */}
              <div className="floating-badge badge-fast-delivery">
                <Rocket size={15} className="floating-badge-icon" />
                <span>Tailored Scope</span>
              </div>

              {/* Floating Badge 2: 100% Secure (From Reference) */}
              <div className="floating-badge badge-secure">
                <ShieldCheck size={15} className="floating-badge-icon" />
                <span>100% Secure</span>
              </div>

              {/* Browser Window Chrome */}
              <div className="browser-window">
                <div className="browser-topbar">
                  <div className="browser-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="browser-address">
                    <Lock size={11} className="addr-lock" />
                    <span>https://app.buildifysolutions.lk/portal</span>
                  </div>
                  <div className="browser-status">
                    <span className="status-indicator-dot"></span> Online
                  </div>
                </div>

                {/* Mockup Interactive Navigation Tabs */}
                <div className="mockup-tab-selector">
                  <button 
                    className={`mockup-tab ${mockupTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setMockupTab('inventory')}
                  >
                    Inventory ERP
                  </button>
                  <button 
                    className={`mockup-tab ${mockupTab === 'telemetry' ? 'active' : ''}`}
                    onClick={() => setMockupTab('telemetry')}
                  >
                    IoT Telemetry
                  </button>
                  <button 
                    className={`mockup-tab ${mockupTab === 'ecommerce' ? 'active' : ''}`}
                    onClick={() => setMockupTab('ecommerce')}
                  >
                    E-Commerce
                  </button>
                </div>

                {/* Mockup Content Display */}
                <div className="mockup-content-body">
                  {mockupTab === 'inventory' && (
                    <div className="mockup-view inventory-view">
                      <div className="mockup-stats-bar">
                        <div className="mockup-metric">
                          <span className="metric-title">Total SKUs</span>
                          <span className="metric-val">1,248</span>
                        </div>
                        <div className="mockup-metric">
                          <span className="metric-title">Orders Dispatched</span>
                          <span className="metric-val text-cyan">42 Today</span>
                        </div>
                        <div className="mockup-metric">
                          <span className="metric-title">System Status</span>
                          <span className="metric-val text-green">Optimal</span>
                        </div>
                      </div>

                      {/* Mockup Table Representation */}
                      <div className="mockup-bars-container">
                        <div className="mockup-bar-row">
                          <div className="bar-label">ESP32 DevKit Stocks</div>
                          <div className="bar-track">
                            <div className="bar-fill fill-85"></div>
                          </div>
                          <div className="bar-meta">480 / 500</div>
                        </div>

                        <div className="mockup-bar-row">
                          <div className="bar-label">Arduino Uno R4 Batch</div>
                          <div className="bar-track">
                            <div className="bar-fill fill-65"></div>
                          </div>
                          <div className="bar-meta">260 / 400</div>
                        </div>

                        <div className="mockup-bar-row">
                          <div className="bar-label">Ultrasonic Sensors</div>
                          <div className="bar-track">
                            <div className="bar-fill fill-95"></div>
                          </div>
                          <div className="bar-meta">950 / 1000</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mockupTab === 'telemetry' && (
                    <div className="mockup-view telemetry-view">
                      <div className="mockup-stats-bar">
                        <div className="mockup-metric">
                          <span className="metric-title">ESP32 Node 01</span>
                          <span className="metric-val text-cyan">{sensorValues.temp}°C</span>
                        </div>
                        <div className="mockup-metric">
                          <span className="metric-title">Relative Humidity</span>
                          <span className="metric-val text-green">{sensorValues.humidity}%</span>
                        </div>
                        <div className="mockup-metric">
                          <span className="metric-title">Relay Switch</span>
                          <span className={`metric-val ${relayActive ? 'text-green' : 'text-red'}`}>
                            {relayActive ? 'ACTIVE' : 'IDLE'}
                          </span>
                        </div>
                      </div>

                      <div className="telemetry-interactive-toggle">
                        <div className="toggle-info">
                          <strong>Remote Solenoid Relay Actuator</strong>
                          <span>Click to dispatch live MQTT packet to node</span>
                        </div>
                        <button 
                          className={`relay-switch-btn ${relayActive ? 'active' : ''}`}
                          onClick={() => setRelayActive(!relayActive)}
                        >
                          <Zap size={14} />
                          <span>{relayActive ? 'Relay ON' : 'Relay OFF'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {mockupTab === 'ecommerce' && (
                    <div className="mockup-view ecommerce-view">
                      <div className="mockup-stats-bar">
                        <div className="mockup-metric">
                          <span className="metric-title">Revenue (LKR)</span>
                          <span className="metric-val text-cyan">Rs. 485,000</span>
                        </div>
                        <div className="mockup-metric">
                          <span className="metric-title">Payment Gateway</span>
                          <span className="metric-val text-green">PayHere Live</span>
                        </div>
                        <div className="mockup-metric">
                          <span className="metric-title">Checkout Speed</span>
                          <span className="metric-val">1.2s</span>
                        </div>
                      </div>

                      <div className="ecommerce-preview-cards">
                        <div className="ecom-card">
                          <div className="ecom-card-title">Direct Bank Transfer + PayHere</div>
                          <div className="ecom-card-sub">Automated payment verification</div>
                        </div>
                        <div className="ecom-card">
                          <div className="ecom-card-title">Live Order SMS Updates</div>
                          <div className="ecom-card-sub">Instant courier dispatch alerts</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Solutions Grid */}
      <section className="web-solutions-section" id="solutionsSection">
        <div className="section-container">
          <div className="section-header-centered">
            <div className="section-eyebrow eyebrow-cyan">
              <Code2 size={13} /> Our Core Competencies
            </div>
            <h2 className="section-title-large">
              Engineered for Speed, Scale & <span className="gradient-text-cyan">High Performance</span>
            </h2>
            <p className="section-desc-centered">
              From high-converting corporate portals to complex industrial telemetry backends, we build reliable web platforms designed to scale your operations.
            </p>
          </div>

          <div className="solutions-cards-grid">
            <div className="solution-card">
              <div className="solution-icon-box">
                <Code2 size={26} />
              </div>
              <h3>Modern Web Applications</h3>
              <p>Lightning-fast web applications engineered with Next.js, React, and Node.js. Optimized for SEO, user experience, and mobile responsiveness.</p>
              <ul className="solution-bullets">
                <li><CheckCircle2 size={14} /> React 18 & Next.js Architecture</li>
                <li><CheckCircle2 size={14} /> Full Responsive & Mobile-First Design</li>
                <li><CheckCircle2 size={14} /> Micro-Interactions & Glass UI</li>
              </ul>
            </div>

            <div className="solution-card">
              <div className="solution-icon-box">
                <Monitor size={26} />
              </div>
              <h3>Business ERP & Inventory</h3>
              <p>Eliminate manual spreadsheets with custom internal software. Real-time SKU tracking, role-based access control, and automated invoicing.</p>
              <ul className="solution-bullets">
                <li><CheckCircle2 size={14} /> Multi-Warehouse Stock Management</li>
                <li><CheckCircle2 size={14} /> Role-Based Access (Admin, Staff, Client)</li>
                <li><CheckCircle2 size={14} /> PDF Invoicing & Audit Trails</li>
              </ul>
            </div>

            <div className="solution-card">
              <div className="solution-icon-box">
                <Wifi size={26} />
              </div>
              <h3>IoT Cloud Telemetry Hubs</h3>
              <p>Connect your hardware nodes to the cloud. Real-time MQTT streaming, low-latency live charts, remote relay controls, and SMS alert pipelines.</p>
              <ul className="solution-bullets">
                <li><CheckCircle2 size={14} /> MQTT Broker & WebSocket Feeds</li>
                <li><CheckCircle2 size={14} /> Remote Relay & Actuator Switching</li>
                <li><CheckCircle2 size={14} /> Historical Sensor Data Logging</li>
              </ul>
            </div>

            <div className="solution-card">
              <div className="solution-icon-box">
                <ShoppingBag size={26} />
              </div>
              <h3>E-Commerce & Payment Portals</h3>
              <p>Sell products seamlessly with custom digital storefronts. Integrated with Sri Lankan payment gateways (PayHere, WebXpay) and multi-currency billing.</p>
              <ul className="solution-bullets">
                <li><CheckCircle2 size={14} /> PayHere / Direct Bank Slip Uploads</li>
                <li><CheckCircle2 size={14} /> Automated Order Email & SMS Dispatch</li>
                <li><CheckCircle2 size={14} /> High-Conversion Checkout Funnel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scope & Cost Estimator */}
      <section className="web-estimator-section" id="estimatorSection">
        <div className="section-container">
          <div className="estimator-box-glass">
            <div className="estimator-header">
              <div className="estimator-header-top">
                <div className="section-eyebrow eyebrow-cyan">
                  <Sliders size={13} /> Transparent Pricing
                </div>
                
                {/* Currency Switcher Toggle */}
                <div className="currency-switcher-pill">
                  <span className="currency-label">Currency:</span>
                  <button 
                    className={`curr-btn ${currency === 'LKR' ? 'active' : ''}`}
                    onClick={() => setCurrency('LKR')}
                    type="button"
                  >
                    🇱🇰 LKR (Rs.)
                  </button>
                  <button 
                    className={`curr-btn ${currency === 'USD' ? 'active' : ''}`}
                    onClick={() => setCurrency('USD')}
                    type="button"
                  >
                    🇺🇸 USD ($)
                  </button>
                </div>
              </div>

              <h2 className="estimator-title-main">Instant Project Scope & Cost Estimator</h2>
              <p className="estimator-desc-main">
                Configure your target system specifications. Base static website presentation starts from <strong>{formatPrice(25000)}</strong>, with custom domain, Firebase cloud database, payment gateways, and tailored delivery schedules.
              </p>
            </div>

            <div className="estimator-body-grid">
              <div className="estimator-config-col">
                <label className="config-label">1. Select Base Solution Tier:</label>
                <div className="config-pills-row">
                  {Object.entries(baseEstimates).map(([key, val]) => (
                    <button
                      key={key}
                      className={`config-pill-btn ${projectType === key ? 'active' : ''}`}
                      onClick={() => setProjectType(key)}
                      type="button"
                    >
                      <span className="pill-name">{val.name}</span>
                      <span className="pill-price">{formatPrice(val.lkr)}</span>
                    </button>
                  ))}
                </div>

                <label className="config-label" style={{ marginTop: '1.6rem' }}>2. Add-on Infrastructure & Cloud Services:</label>
                <div className="config-checkboxes-grid">
                  <label className="config-check-card">
                    <input 
                      type="checkbox" 
                      checked={hasDomain} 
                      onChange={(e) => setHasDomain(e.target.checked)} 
                    />
                    <div>
                      <strong>Custom Domain & DNS Setup</strong>
                      <span>.com / .lk registration, SSL certificate & DNS records (+{formatPrice(addOnPricing.domain.lkr)})</span>
                    </div>
                  </label>

                  <label className="config-check-card">
                    <input 
                      type="checkbox" 
                      checked={hasFirebase} 
                      onChange={(e) => setHasFirebase(e.target.checked)} 
                    />
                    <div>
                      <strong>Firebase Cloud DB & Hosting</strong>
                      <span>Firestore database, Cloud Storage & serverless backend (+{formatPrice(addOnPricing.firebase.lkr)})</span>
                    </div>
                  </label>

                  <label className="config-check-card">
                    <input 
                      type="checkbox" 
                      checked={hasAuth} 
                      onChange={(e) => setHasAuth(e.target.checked)} 
                    />
                    <div>
                      <strong>User Authentication & Roles</strong>
                      <span>Multi-role login (Admin, Staff, Client) & JWT session (+{formatPrice(addOnPricing.auth.lkr)})</span>
                    </div>
                  </label>

                  <label className="config-check-card">
                    <input 
                      type="checkbox" 
                      checked={hasPayment} 
                      onChange={(e) => setHasPayment(e.target.checked)} 
                    />
                    <div>
                      <strong>Payment Gateway Integration</strong>
                      <span>PayHere / Direct Visa & Mastercard payment gateway (+{formatPrice(addOnPricing.payment.lkr)})</span>
                    </div>
                  </label>

                  <label className="config-check-card">
                    <input 
                      type="checkbox" 
                      checked={hasRealtime} 
                      onChange={(e) => setHasRealtime(e.target.checked)} 
                    />
                    <div>
                      <strong>IoT Telemetry & WebSockets / MQTT</strong>
                      <span>Live ESP32 / sensor streaming & remote relay actuation (+{formatPrice(addOnPricing.realtime.lkr)})</span>
                    </div>
                  </label>

                  <label className="config-check-card">
                    <input 
                      type="checkbox" 
                      checked={hasNotifications} 
                      onChange={(e) => setHasNotifications(e.target.checked)} 
                    />
                    <div>
                      <strong>Automated WhatsApp & SMS Alerts</strong>
                      <span>Automated order dispatch notices & sensor trigger alerts (+{formatPrice(addOnPricing.notifications.lkr)})</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="estimator-summary-col">
                <div className="summary-glass-card">
                  <div className="summary-card-badge">Engineering Scope Summary</div>
                  
                  <div className="summary-spec-row">
                    <span>Selected Tier:</span>
                    <strong>{selectedBase.name}</strong>
                  </div>

                  <div className="summary-spec-row">
                    <span>Delivery Schedule:</span>
                    <strong className="text-cyan">Tailored to Requirements</strong>
                  </div>

                  <div className="summary-investment-wrap">
                    <span className="invest-label">Estimated Budget ({currency}):</span>
                    <div className="invest-amount">
                      {formatPrice(totalLKR)}
                    </div>
                    <span className="invest-note">
                      {currency === 'USD' ? 'Exchange rate estimated at ~Rs. 305 per USD' : 'Transparent pricing with zero hidden surcharges'}
                    </span>
                  </div>

                  <button 
                    className="web-btn-primary btn-block"
                    onClick={handleWhatsAppQuote}
                    type="button"
                  >
                    <i className="bi bi-whatsapp"></i>
                    <span>Discuss Scope via WhatsApp</span>
                  </button>

                  <div className="summary-guarantee-note">
                    <ShieldCheck size={14} className="text-cyan" />
                    <span>Direct engineering review by <strong>Buildify Solutions</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio / Showcase Section */}
      <section className="web-portfolio-section" id="portfolioSection">
        <div className="section-container">
          <div className="section-header-centered">
            <div className="section-eyebrow eyebrow-cyan">
              <Award size={13} /> Proven Track Record
            </div>
            <h2 className="section-title-large">Recent Web & Digital Deployments</h2>
            <p className="section-desc-centered">
              Explore platforms deployed for enterprise clients, agribusinesses, and retail storefronts across Sri Lanka.
            </p>
          </div>

          <div className="portfolio-cards-grid">
            {/* Card 1: AWT Australia */}
            <div className="portfolio-card">
              <a 
                href="https://awt-austrlia-travel-website-5m9d.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="portfolio-img-container"
              >
                {/* Browser Window Tab Bar */}
                <div className="portfolio-browser-tab-bar">
                  <div className="browser-dots">
                    <span className="b-dot b-red"></span>
                    <span className="b-dot b-yellow"></span>
                    <span className="b-dot b-green"></span>
                  </div>
                  <div className="browser-tab-title">
                    <Lock size={10} className="tab-lock-icon" />
                    <span>awt-austrlia-travel-website-5m9d.vercel.app</span>
                  </div>
                  <div className="browser-tab-actions">
                    <ExternalLink size={11} />
                  </div>
                </div>

                <div className="portfolio-img-inner">
                  <img 
                    src="/portfolio/awt-australia.jpg" 
                    alt="AWT Australia Travel Portal" 
                    className="portfolio-cover-img"
                  />
                  <div className="portfolio-overlay-gradient"></div>
                  <div className="portfolio-tag">Travel & Tourism</div>
                  <div className="portfolio-live-badge">
                    <span className="live-dot-pulse"></span>
                    <ExternalLink size={11} /> Live Site
                  </div>
                </div>
              </a>
              <div className="portfolio-card-body">
                <h4>AWT Australia Travel Portal</h4>
                <p>Full-scale Australian tour booking platform with flight search, top destination highlights, and custom itinerary booking.</p>
                <div className="portfolio-tech-tags">
                  <span>React</span>
                  <span>Vite</span>
                  <span>Tailwind CSS</span>
                  <span>Vercel</span>
                </div>
                <a 
                  href="https://awt-austrlia-travel-website-5m9d.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="portfolio-visit-btn"
                >
                  <span>Explore Live Deployment</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Wealthy Minds */}
            <div className="portfolio-card">
              <a 
                href="https://wealthyminds.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="portfolio-img-container"
              >
                {/* Browser Window Tab Bar */}
                <div className="portfolio-browser-tab-bar">
                  <div className="browser-dots">
                    <span className="b-dot b-red"></span>
                    <span className="b-dot b-yellow"></span>
                    <span className="b-dot b-green"></span>
                  </div>
                  <div className="browser-tab-title">
                    <Lock size={10} className="tab-lock-icon" />
                    <span>wealthyminds.netlify.app</span>
                  </div>
                  <div className="browser-tab-actions">
                    <ExternalLink size={11} />
                  </div>
                </div>

                <div className="portfolio-img-inner">
                  <img 
                    src="/portfolio/wealthy-minds.png" 
                    alt="Wealthy Minds Financial AI" 
                    className="portfolio-cover-img"
                  />
                  <div className="portfolio-overlay-gradient"></div>
                  <div className="portfolio-tag">Fintech & AI Analytics</div>
                  <div className="portfolio-live-badge">
                    <span className="live-dot-pulse"></span>
                    <ExternalLink size={11} /> Live Site
                  </div>
                </div>
              </a>
              <div className="portfolio-card-body">
                <h4>Wealthy Minds Financial AI</h4>
                <p>Intelligent financial behavior and prediction dashboard with wealth growth forecasts, currency trends, behavioral spend metrics, and automated portfolio analysis.</p>
                <div className="portfolio-tech-tags">
                  <span>React</span>
                  <span>AI Prediction</span>
                  <span>Charts.js</span>
                  <span>Netlify</span>
                </div>
                <a 
                  href="https://wealthyminds.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="portfolio-visit-btn"
                >
                  <span>Explore Live Deployment</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Swiszta Hotel Services */}
            <div className="portfolio-card">
              <a 
                href="https://www.swiszta.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="portfolio-img-container"
              >
                {/* Browser Window Tab Bar */}
                <div className="portfolio-browser-tab-bar">
                  <div className="browser-dots">
                    <span className="b-dot b-red"></span>
                    <span className="b-dot b-yellow"></span>
                    <span className="b-dot b-green"></span>
                  </div>
                  <div className="browser-tab-title">
                    <Lock size={10} className="tab-lock-icon" />
                    <span>swiszta.com</span>
                  </div>
                  <div className="browser-tab-actions">
                    <ExternalLink size={11} />
                  </div>
                </div>

                <div className="portfolio-img-inner">
                  <img 
                    src="/portfolio/swiszta.png" 
                    alt="Swiszta Hotel Services" 
                    className="portfolio-cover-img"
                  />
                  <div className="portfolio-overlay-gradient"></div>
                  <div className="portfolio-tag">Hospitality & Facilities</div>
                  <div className="portfolio-live-badge">
                    <span className="live-dot-pulse"></span>
                    <ExternalLink size={11} /> Live Site
                  </div>
                </div>
              </a>
              <div className="portfolio-card-body">
                <h4>Swiszta Hotel Services</h4>
                <p>Integrated hospitality management platform for world-class hotel partners, powering luxury guest services, dining, housekeeping excellence, and facilities.</p>
                <div className="portfolio-tech-tags">
                  <span>Vite React</span>
                  <span>Enterprise ERP</span>
                  <span>Custom Domain</span>
                  <span>Live Production</span>
                </div>
                <a 
                  href="https://www.swiszta.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="portfolio-visit-btn"
                >
                  <span>Explore Live Deployment</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="web-faq-section" id="faqSection">
        <div className="section-container">
          <div className="section-header-centered">
            <div className="section-eyebrow eyebrow-cyan">
              <Sparkles size={13} /> Common Inquiries
            </div>
            <h2 className="section-title-large">Frequently Asked <span className="gradient-text-cyan">Questions</span></h2>
            <p className="section-desc-centered">
              Clear answers regarding pricing, project workflows, payment gateways, and IoT hardware connectivity.
            </p>
          </div>

          <div className="faq-accordion-container">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`faq-glass-card ${isOpen ? 'active' : ''}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenFaq(isOpen ? null : index); }}
                >
                  <div className="faq-question-row">
                    <div className="faq-question-left">
                      <span className="faq-num">0{index + 1}</span>
                      <h3 className="faq-question-text">{faq.q}</h3>
                    </div>
                    <div 
                      className="faq-toggle-circle" 
                      aria-expanded={isOpen}
                    >
                      <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Quote Consultation / RFP Form */}
      <section className="web-quote-section" id="quoteSection">
        <div className="section-container">
          <div className="quote-card-wrapper">
            <div className="quote-left-info">
              <div className="section-eyebrow eyebrow-cyan">
                <MessageSquare size={13} /> Start Your Project
              </div>
              <h2 className="quote-title">Let's Build Something Exceptional Together</h2>
              <p className="quote-desc">
                Have an upcoming web project, SaaS concept, or enterprise software requirement? Connect with our Lead Systems Architect for a free 30-minute discovery consultation.
              </p>

              <div className="quote-contact-points">
                <a href="tel:0717790035" className="contact-point-item">
                  <div className="contact-icon"><Phone size={15} /></div>
                  <div>
                    <span className="point-label">OFFICIAL PHONE</span>
                    <strong className="point-value">071 7790035</strong>
                  </div>
                </a>

                <a href="mailto:buildifysolution@gmail.com" className="contact-point-item">
                  <div className="contact-icon"><Mail size={15} /></div>
                  <div>
                    <span className="point-label">OFFICIAL EMAIL</span>
                    <strong className="point-value">buildifysolution@gmail.com</strong>
                  </div>
                </a>
              </div>
            </div>

            <div className="quote-right-form">
              {quoteSubmitted ? (
                <div className="quote-success-state">
                  <div className="success-icon-bubble">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3>Quote Request Received!</h3>
                  <p>
                    Thank you, <strong>{quoteForm.name}</strong>. Our engineering desk has received your request and will contact you within 24 hours.
                  </p>
                  <button 
                    className="web-btn-primary" 
                    onClick={() => setQuoteSubmitted(false)}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="quote-form-body">
                  <div className="form-group-2">
                    <div className="form-field">
                      <label>Your Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g., Kasun Silva"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                      />
                    </div>

                    <div className="form-field">
                      <label>Phone / WhatsApp *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="07X XXXXXXX"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group-2">
                    <div className="form-field">
                      <label>Work Email</label>
                      <input 
                        type="email" 
                        placeholder="kasun@business.lk"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                      />
                    </div>

                    <div className="form-field">
                      <label>Company / Organization</label>
                      <input 
                        type="text" 
                        placeholder="Company Name"
                        value={quoteForm.company}
                        onChange={(e) => setQuoteForm({...quoteForm, company: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Project Scope & Requirements</label>
                    <textarea 
                      rows={3}
                      placeholder="Briefly describe what you'd like to build (e.g., Inventory system, IoT dashboard, E-commerce store)..."
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="quote-btn-group">
                    <button type="submit" className="web-btn-primary" disabled={isSubmittingQuote} style={{ opacity: isSubmittingQuote ? 0.7 : 1, cursor: isSubmittingQuote ? 'not-allowed' : 'pointer' }}>
                      <span>{isSubmittingQuote ? 'Sending to Database...' : 'Submit Quote Request'}</span>
                      <Send size={15} />
                    </button>

                    <button 
                      type="button" 
                      className="web-btn-whatsapp"
                      onClick={handleWhatsAppQuote}
                    >
                      <i className="bi bi-whatsapp"></i>
                      <span>Instant WhatsApp Chat</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Floating Glass Page Footer (Blended with Gateway Theme) */}
      <footer className="web-floating-footer">
        <div className="web-footer-glass-bar">
          <div className="gateway-footer-brand" onClick={onBackToGateway} role="button" tabIndex={0} title="Buildify Solutions - Back to Gateway">
            <Logo size="small" showTagline={true} />
          </div>

          <a 
            href="tel:0717790035" 
            className="gateway-footer-detail web-footer-cyan-detail"
            title="Call Buildify Solutions (071 7790035)"
          >
            <div className="footer-icon-circle web-cyan-circle"><Phone size={14} /></div>
            <div>
              <span className="footer-detail-label">OFFICIAL PHONE</span>
              <span className="footer-detail-value">071 7790035</span>
            </div>
          </a>

          <a 
            href="mailto:buildifysolution@gmail.com" 
            className="gateway-footer-detail web-footer-cyan-detail"
            title="Send Email to buildifysolution@gmail.com"
          >
            <div className="footer-icon-circle web-cyan-circle"><Mail size={14} /></div>
            <div>
              <span className="footer-detail-label">OFFICIAL EMAIL</span>
              <span className="footer-detail-value">buildifysolution@gmail.com</span>
            </div>
          </a>

          <a 
            href="https://maps.google.com/?q=Sri+Lanka" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="gateway-footer-detail web-footer-cyan-detail"
            title="View Location on Google Maps (Sri Lanka)"
          >
            <div className="footer-icon-circle web-cyan-circle"><MapPin size={14} /></div>
            <div>
              <span className="footer-detail-label">LOCATION</span>
              <span className="footer-detail-value">Sri Lanka</span>
            </div>
          </a>

          <div className="gateway-footer-social">
            <span className="footer-detail-label">CONNECT</span>
            <div className="footer-social-icons">
              <a href="https://wa.me/94717790035" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="Twitter X">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn web-social-btn" title="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Sub-strip for copyright */}
        <div className="web-footer-sub-strip">
          <span>&copy; {new Date().getFullYear()} Buildify Solutions. Full-Stack Web Applications & Smart Telemetry Systems.</span>
        </div>
      </footer>
    </div>
  );
}

// Helper icons
function ShoppingBag(props) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
