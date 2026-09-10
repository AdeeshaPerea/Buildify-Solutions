import React from 'react';
import { ShoppingBag, FolderGit2, Wrench, Code2, Monitor, TrendingUp } from 'lucide-react';

export default function Hero({ onSelectTab }) {
  return (
    <section className="hero-section">
      <div className="container hero-content">
        <div className="hero-pill-badge">
          <span style={{ color: '#fff' }}>BUILDIFY SOLUTIONS</span> • WE BUILD. YOU GROW.
        </div>
        <h1 className="hero-title">
          Smart IoT, Embedded Hardware & <span className="gradient-text">Digital Systems</span>
        </h1>
        <p className="hero-subtitle">
          Your premier destination for IoT hardware, genuine ESP32 & Arduino microcontrollers, industrial sensors, robotics kits, tested schematics, and custom turn-key digital solutions.
        </p>

        {/* 3 Pillars from Official Business Card */}
        <div className="pillars-row">
          <div className="pillar-chip">
            <Code2 size={16} style={{ color: 'var(--accent-orange)' }} /> Web Development
          </div>
          <div className="pillar-chip">
            <Monitor size={16} style={{ color: 'var(--accent-orange)' }} /> Business Systems
          </div>
          <div className="pillar-chip">
            <TrendingUp size={16} style={{ color: 'var(--accent-orange)' }} /> Digital Solutions
          </div>
        </div>

        <div className="hero-cta-group">
          <button className="btn btn-primary" onClick={() => onSelectTab('store', 'all')}>
            <ShoppingBag size={18} /> Explore Store Catalog
          </button>
          <button className="btn btn-secondary" onClick={() => onSelectTab('projects', 'all')}>
            <FolderGit2 size={18} /> Browse Projects & Schematics
          </button>
          <button className="btn btn-amber" onClick={() => onSelectTab('about')}>
            <Wrench size={18} /> Request Custom Build
          </button>
        </div>

        {/* Stats Grid */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-number">2,500+</div>
            <div className="stat-label">Hardware Components</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">450+</div>
            <div className="stat-label">Student & IoT Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">35,000+</div>
            <div className="stat-label">Engineers & Makers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1,200+</div>
            <div className="stat-label">Custom Builds Delivered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
