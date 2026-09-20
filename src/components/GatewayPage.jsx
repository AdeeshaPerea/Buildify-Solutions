import React, { useState } from 'react';
import Logo from './Logo';
import { 
  Cpu, 
  Code2, 
  ArrowRight, 
  Sparkles, 
  Wifi, 
  CheckCircle2, 
  Monitor, 
  TrendingUp, 
  Phone, 
  Mail, 
  MapPin, 
  QrCode, 
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bot,
  X
} from 'lucide-react';

const BUILDY_SPEECHES = [
  {
    greeting: "Ayubowan! What can I help you build today?",
    subtext: "Choose IoT Products for development boards & sensors, or Web Solutions for cloud platforms & custom business software!"
  },
  {
    greeting: "Need hardware prototyping? Check out our IoT Store!",
    subtext: "We have ESP32, Arduino boards, precision sensors, relay modules, robotics chassis, and verified schematics."
  },
  {
    greeting: "Looking for modern software? Explore Web Solutions!",
    subtext: "We architect full-stack React & Next.js web applications, live IoT telemetry dashboards, and business ERPs."
  },
  {
    greeting: "Need custom PCB design or 3D fabrication?",
    subtext: "Our engineering team at Buildify Solutions can prototype and manufacture your custom setup in Sri Lanka!"
  }
];

export default function GatewayPage({ onChoosePortal, onExploreAll }) {
  const [hoveredPortal, setHoveredPortal] = useState(null);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // High-tech cheerful robotic chime using native Web Audio API
  const playBuildyChime = () => {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.22); // C6
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch (err) {
      // AudioContext blocked or not supported
    }
  };

  const handleMascotClick = () => {
    playBuildyChime();
    setIsSpeaking(true);
    setSpeechIndex((prev) => (prev + 1) % BUILDY_SPEECHES.length);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 600);
  };

  const currentSpeech = BUILDY_SPEECHES[speechIndex];

  return (
    <div className="gateway-page-wrapper">
      {/* Ambient Canvas Glow Effects */}
      <div className="gateway-ambient-backdrop"></div>
      <div className="gateway-hex-grid"></div>

      {/* Pure Fullscreen Diagonal Landing Arena (No Navbar, No Card Boxes) */}
      <main className="gateway-fullscreen-arena">
        
        {/* TOP-LEFT MASCOT EMBEDDED DIRECTLY INTO PAGE */}
        <div className="page-mascot-anchor">
          <div 
            className={`mascot-avatar-popper ${isSpeaking ? 'speaking-bounce' : ''}`}
            onClick={handleMascotClick}
            role="button"
            tabIndex={0}
            title="Click Buildy to chat!"
          >
            <div className="mascot-orange-aura"></div>
            <img 
              src="/mascot.png" 
              alt="Buildify Solutions Mascot Buildy" 
              className="mascot-corner-img mascot-orange-body-border"
            />
            <span className="mascot-online-pill">
              <span className="pulse-dot"></span> Online
            </span>
            <div className="mascot-click-hint-tag">
              <Sparkles size={11} />
              <span>Click me!</span>
            </div>
          </div>

          {/* Cloud Speech Bubble: "Ayubowan! How can I help you today?" */}
          <div 
            className="mascot-cloud-bubble"
            onClick={handleMascotClick}
            role="button"
            tabIndex={0}
            title="Click to hear next tip from Buildy!"
          >
            <div className="cloud-bubble-tail"></div>

            <div className="cloud-bubble-header">
              <span className="dialogue-mascot-pill">
                <span className="mascot-status-pulse"></span>
                <strong>BUILDY</strong> • Mascot
              </span>
              <span className="bubble-soundwave">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </span>
            </div>

            <h2 className="cloud-bubble-greeting">
              "{currentSpeech.greeting}"
            </h2>

            <p className="cloud-bubble-subtext">
              {currentSpeech.subtext}
            </p>

            <div className="cloud-bubble-footer">
              <span className="bubble-hint-tag">
                <Zap size={11} /> Tap to talk • {speechIndex + 1}/{BUILDY_SPEECHES.length}
              </span>
            </div>
          </div>
        </div>

        {/* UPPER-RIGHT HALF: IOT (EMBEDDED INTO PAGE WITH CIRCUIT ANIMATION) */}
        <div 
          className={`page-split-territory territory-iot ${hoveredPortal === 'iot' ? 'is-hovered' : ''}`}
          onMouseEnter={() => setHoveredPortal('iot')}
          onMouseLeave={() => setHoveredPortal(null)}
          onClick={() => onChoosePortal('iot')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onChoosePortal('iot')}
        >
          <div className="territory-ambient-glow iot-glow"></div>
          <div className="territory-grid-pattern iot-grid"></div>

          {/* DYNAMIC ANIMATED PCB CIRCUIT BOARD TRACES & PULSES */}
          <div className="territory-circuit-canvas" aria-hidden="true">
            <svg className="circuit-board-svg" viewBox="0 0 700 500" preserveAspectRatio="none">
              <defs>
                <filter id="circuitGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Passive PCB Copper Bus Traces */}
              <g className="passive-circuit-traces" stroke="rgba(255, 107, 0, 0.16)" strokeWidth="1.5" fill="none">
                <path d="M 60 110 H 220 L 270 160 H 480 L 530 110 H 680" />
                <path d="M 140 30 V 90 L 180 130 V 290 L 240 350 H 510" />
                <path d="M 320 20 L 370 70 H 550 L 590 110 V 270" />
                <path d="M 90 240 H 200 L 250 190 H 410 L 470 250 V 410" />
                <path d="M 240 440 L 290 390 H 430 L 490 450 H 650" />
                <path d="M 400 150 L 440 110 V 40" />
                <path d="M 190 330 L 150 370 H 70" />
              </g>

              {/* 100% Mathematically Seamless Electric Pulses (Dual-Layer: Plasma Aura + Electric Core) */}
              <g className="active-circuit-pulse-traces" fill="none">
                {/* Layer 1: Wide Glowing Amber Plasma */}
                <g stroke="#ff851b" strokeWidth="4.5" opacity="0.85" filter="url(#circuitGlowFilter)">
                  <path d="M 60 110 H 220 L 270 160 H 480 L 530 110 H 680" pathLength="1000" className="circuit-pulse track-1" />
                  <path d="M 140 30 V 90 L 180 130 V 290 L 240 350 H 510" pathLength="1000" className="circuit-pulse track-2" />
                  <path d="M 320 20 L 370 70 H 550 L 590 110 V 270" pathLength="1000" className="circuit-pulse track-3" />
                  <path d="M 90 240 H 200 L 250 190 H 410 L 470 250 V 410" pathLength="1000" className="circuit-pulse track-4" />
                  <path d="M 240 440 L 290 390 H 430 L 490 450 H 650" pathLength="1000" className="circuit-pulse track-5" />
                  <path d="M 400 150 L 440 110 V 40" pathLength="1000" className="circuit-pulse track-6" />
                </g>

                {/* Layer 2: Ultra-Crisp White Electric Stream Core */}
                <g stroke="#ffffff" strokeWidth="1.6" opacity="0.95">
                  <path d="M 60 110 H 220 L 270 160 H 480 L 530 110 H 680" pathLength="1000" className="circuit-pulse track-1" />
                  <path d="M 140 30 V 90 L 180 130 V 290 L 240 350 H 510" pathLength="1000" className="circuit-pulse track-2" />
                  <path d="M 320 20 L 370 70 H 550 L 590 110 V 270" pathLength="1000" className="circuit-pulse track-3" />
                  <path d="M 90 240 H 200 L 250 190 H 410 L 470 250 V 410" pathLength="1000" className="circuit-pulse track-4" />
                  <path d="M 240 440 L 290 390 H 430 L 490 450 H 650" pathLength="1000" className="circuit-pulse track-5" />
                  <path d="M 400 150 L 440 110 V 40" pathLength="1000" className="circuit-pulse track-6" />
                </g>
              </g>

              {/* Blinking Solder Joint Nodes & Microcontroller Status LEDs */}
              <g className="circuit-joint-nodes">
                <circle cx="220" cy="110" r="4.5" fill="#ff7a00" className="circuit-led led-orange-1" />
                <circle cx="270" cy="160" r="3.5" fill="#ffaa00" className="circuit-led led-orange-2" />
                <circle cx="480" cy="160" r="5" fill="#ff6b00" className="circuit-led led-orange-3" />
                <circle cx="180" cy="130" r="3.5" fill="#ff851b" className="circuit-led led-orange-2" />
                <circle cx="240" cy="350" r="4.5" fill="#ffaa00" className="circuit-led led-orange-1" />
                <circle cx="370" cy="70" r="3.5" fill="#ff7a00" className="circuit-led led-orange-3" />
                <circle cx="550" cy="70" r="4.5" fill="#ff9f43" className="circuit-led led-orange-2" />
                <circle cx="250" cy="190" r="4" fill="#ff851b" className="circuit-led led-orange-1" />
                <circle cx="410" cy="190" r="5" fill="#ffaa00" className="circuit-led led-orange-3" />
                <circle cx="470" cy="250" r="3.5" fill="#ff6b00" className="circuit-led led-orange-2" />
                <circle cx="290" cy="390" r="4.5" fill="#ff851b" className="circuit-led led-orange-1" />
                <circle cx="430" cy="390" r="4" fill="#ffaa00" className="circuit-led led-orange-3" />
              </g>

              {/* Silicon IC Microcontroller Outline */}
              <g className="circuit-ic-package" opacity="0.65">
                <rect x="385" y="130" width="55" height="55" rx="8" fill="rgba(255, 107, 0, 0.08)" stroke="rgba(255, 107, 0, 0.45)" strokeWidth="1.5" />
                <rect x="398" y="143" width="29" height="29" rx="4" fill="rgba(255, 107, 0, 0.18)" />
                <circle cx="412" cy="157" r="3.5" fill="#ffaa00" className="circuit-led led-core" />
              </g>
            </svg>
          </div>

          <div className="territory-page-content iot-content-side">
            <div className="territory-badge-label iot-badge-label">
              <Cpu size={15} />
              <span>HARDWARE & MAKER STORE</span>
            </div>

            <h1 className="territory-title-display iot-title-glow">
              IOT
            </h1>

            <p className="territory-text-lead">
              ESP32, Arduino boards, precision sensors, robotics kits, maker development modules, and tested STEM schematics.
            </p>

            <div className="territory-tags-cloud">
              <span className="territory-tag-item">ESP32 & Arduino</span>
              <span className="territory-tag-item">Sensors & Relays</span>
              <span className="territory-tag-item">Robotics Kits</span>
              <span className="territory-tag-item">3D Fabrication</span>
            </div>

            <button className="territory-main-btn iot-btn-glow">
              <span>Explore IoT Store</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* THE DIAGONAL LASER SPLITTER CUTTING DIRECTLY ACROSS THE WEBPAGE */}
        <div className={`page-diagonal-divider ${hoveredPortal ? `active-${hoveredPortal}` : ''}`}>
          <svg 
            className="page-diagonal-svg" 
            viewBox="0 0 1000 650" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="naturalLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#ff9f43" stopOpacity="1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="55%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
              </linearGradient>

              <filter id="naturalLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Wide Plasma Line */}
            <line 
              x1="0" y1="0" x2="1000" y2="650" 
              stroke="url(#naturalLaserGrad)" 
              strokeWidth="6" 
              opacity="0.8"
              filter="url(#naturalLaserGlow)" 
            />

            {/* Crisp Center Core Laser Line */}
            <line 
              x1="0" y1="0" x2="1000" y2="650" 
              stroke="url(#naturalLaserGrad)" 
              strokeWidth="2.5" 
            />

            {/* High-Speed Traveling Laser Pulse Line */}
            <line 
              x1="0" y1="0" x2="1000" y2="650" 
              stroke="#ffffff" 
              strokeWidth="4" 
              strokeDasharray="100 400" 
              className="natural-laser-pulse-run"
            />
          </svg>

          {/* Glowing Center Interactive Badge with OR */}
          <div className="page-diagonal-center-node" title="Choose IoT Hardware or Web Solutions">
            <div className="center-node-ring"></div>
            <Zap size={14} className="center-node-zap" />
            <span className="center-node-text">OR</span>
          </div>
        </div>

        {/* MOBILE RESPONSIVE LASER SEPARATOR (VISIBLE ONLY ON MOBILE/TABLET WHEN SPLIT STACKS) */}
        <div className="gateway-mobile-laser-divider" aria-hidden="true">
          <div className="mobile-laser-track">
            <span className="mobile-laser-glow-bar"></span>
            <span className="mobile-laser-core-bar"></span>
            <span className="mobile-laser-runner"></span>
          </div>
          <div className="mobile-laser-node" title="Choose IoT Hardware or Web Solutions">
            <div className="mobile-node-ring"></div>
            <Zap size={14} className="mobile-node-zap" />
            <span className="mobile-node-text">OR</span>
          </div>
        </div>

        {/* LOWER-LEFT HALF: WEB (EMBEDDED INTO PAGE) */}
        <div 
          className={`page-split-territory territory-web ${hoveredPortal === 'web' ? 'is-hovered' : ''}`}
          onMouseEnter={() => setHoveredPortal('web')}
          onMouseLeave={() => setHoveredPortal(null)}
          onClick={() => onChoosePortal('web')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onChoosePortal('web')}
        >
          <div className="territory-ambient-glow web-glow"></div>
          <div className="territory-grid-pattern web-grid"></div>

          {/* DYNAMIC ANIMATED DRIFTING CLOUD SYSTEM & DATA TELEMETRY STREAMS */}
          <div className="territory-cloud-canvas" aria-hidden="true">
            {/* Drifting Cyber Cloud Layer 1 (Far Depth) */}
            <div className="cloud-drift-layer cloud-layer-back">
              <svg className="cloud-svg-shape cloud-back-1" viewBox="0 0 320 160">
                <path d="M 45 120 A 30 30 0 0 1 75 75 A 55 55 0 0 1 170 55 A 48 48 0 0 1 245 85 A 35 35 0 0 1 285 120 A 24 24 0 0 1 265 145 H 65 A 24 24 0 0 1 45 120 Z" />
              </svg>
              <svg className="cloud-svg-shape cloud-back-2" viewBox="0 0 260 130">
                <path d="M 35 95 A 25 25 0 0 1 60 60 A 45 45 0 0 1 140 45 A 40 40 0 0 1 200 70 A 30 30 0 0 1 235 95 A 20 20 0 0 1 220 118 H 50 A 20 20 0 0 1 35 95 Z" />
              </svg>
            </div>

            {/* Drifting Cyber Cloud Layer 2 (Foreground Glowing Clouds) */}
            <div className="cloud-drift-layer cloud-layer-front">
              <svg className="cloud-svg-shape cloud-front-1" viewBox="0 0 380 190">
                <path d="M 50 145 A 36 36 0 0 1 85 90 A 65 65 0 0 1 200 65 A 58 58 0 0 1 290 100 A 42 42 0 0 1 340 145 A 30 30 0 0 1 315 175 H 75 A 30 30 0 0 1 50 145 Z" />
              </svg>
              <svg className="cloud-svg-shape cloud-front-2" viewBox="0 0 290 150">
                <path d="M 40 115 A 30 30 0 0 1 70 70 A 50 50 0 0 1 160 50 A 45 45 0 0 1 225 80 A 35 35 0 0 1 260 115 A 24 24 0 0 1 240 138 H 60 A 24 24 0 0 1 40 115 Z" />
              </svg>
            </div>

            {/* Connected Cloud Telemetry Network Node Arcs */}
            <svg className="cloud-network-svg" viewBox="0 0 500 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cloudDataGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <g stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.2" strokeDasharray="4 6" fill="none">
                <path d="M 80 340 Q 150 200 220 180" />
                <path d="M 220 180 Q 290 160 360 210" />
                <path d="M 160 380 Q 220 280 270 240" />
                <path d="M 270 240 Q 320 200 410 260" />
              </g>
              <circle cx="220" cy="180" r="4" fill="#38bdf8" className="cloud-node node-pulse-1" />
              <circle cx="360" cy="210" r="3.5" fill="#7dd3fc" className="cloud-node node-pulse-2" />
              <circle cx="270" cy="240" r="4.5" fill="#38bdf8" className="cloud-node node-pulse-3" />
            </svg>

            {/* Rising Real-Time Cloud Telemetry Data Stream Packets */}
            <div className="cloud-data-stream-container">
              <span className="cloud-data-packet packet-p1"></span>
              <span className="cloud-data-packet packet-p2"></span>
              <span className="cloud-data-packet packet-p3"></span>
              <span className="cloud-data-packet packet-p4"></span>
              <span className="cloud-data-packet packet-p5"></span>
              <span className="cloud-data-packet packet-p6"></span>
            </div>
          </div>

          <div className="territory-page-content web-content-side">
            <div className="territory-badge-label web-badge-label">
              <Code2 size={15} />
              <span>SOFTWARE & CLOUD SYSTEMS</span>
            </div>

            <h1 className="territory-title-display web-title-glow">
              WEB
            </h1>

            <p className="territory-text-lead">
              Custom full-stack web platforms, live IoT telemetry dashboards, and enterprise business automation portals.
            </p>

            <div className="territory-tags-cloud">
              <span className="territory-tag-item">React / Next.js</span>
              <span className="territory-tag-item">IoT Telemetry Hub</span>
              <span className="territory-tag-item">Business ERP</span>
              <span className="territory-tag-item">Custom APIs</span>
            </div>

            <button className="territory-main-btn web-btn-glow">
              <span>Explore Web Solutions</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </main>

      {/* Seamless Natural Page Footer (Buildify Solutions Official) */}
      <footer className="gateway-page-footer">
        <div className="gateway-footer-container">
          <div className="gateway-footer-brand" onClick={onExploreAll} role="button" tabIndex={0} title="Buildify Solutions">
            <Logo size="small" showTagline={true} />
          </div>

          <a 
            href="tel:0717790035" 
            className="gateway-footer-detail"
            title="Call Buildify Solutions (071 7790035)"
          >
            <div className="footer-icon-circle"><Phone size={14} /></div>
            <div>
              <span className="footer-detail-label">OFFICIAL PHONE</span>
              <span className="footer-detail-value">071 7790035</span>
            </div>
          </a>

          <a 
            href="mailto:buildifysolution@gmail.com" 
            className="gateway-footer-detail"
            title="Send Email to buildifysolution@gmail.com"
          >
            <div className="footer-icon-circle"><Mail size={14} /></div>
            <div>
              <span className="footer-detail-label">OFFICIAL EMAIL</span>
              <span className="footer-detail-value">buildifysolution@gmail.com</span>
            </div>
          </a>

          <a 
            href="https://maps.google.com/?q=Sri+Lanka" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="gateway-footer-detail"
            title="View Location on Google Maps (Sri Lanka)"
          >
            <div className="footer-icon-circle"><MapPin size={14} /></div>
            <div>
              <span className="footer-detail-label">LOCATION</span>
              <span className="footer-detail-value">Sri Lanka</span>
            </div>
          </a>

          <div className="gateway-footer-social">
            <span className="footer-detail-label">CONNECT</span>
            <div className="footer-social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-glass-btn" title="Twitter X">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
