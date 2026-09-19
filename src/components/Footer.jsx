import React from 'react';
import Logo from './Logo';

export default function Footer({ onSelectTab }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: '1rem' }} onClick={() => onSelectTab('store', 'all')}>
              <Logo size="medium" showTagline={true} />
            </div>
            <p className="footer-brand-desc">
              Buildify Solutions — Sri Lanka. Empowering creators, students, and businesses with IoT microcontrollers, robotics modules, and custom digital systems.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
              <span className="footer-link"><i className="bi bi-linkedin"></i></span>
              <span className="footer-link"><i className="bi bi-facebook"></i></span>
              <span className="footer-link"><i className="bi bi-instagram"></i></span>
              <span className="footer-link"><i className="bi bi-twitter-x"></i></span>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Store</h4>
            <ul className="footer-links-list">
              <li><span className="footer-link" onClick={() => onSelectTab('store', 'esp32')}>ESP32 Boards</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('store', 'arduino')}>Arduino Series</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('store', 'sensors')}>Sensors & Probes</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('store', 'modules')}>Drivers & Relays</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('store', 'robotics')}>Robotics Chassis & Arms</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('store', 'kits')}>All-In-One Kits</span></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Projects</h4>
            <ul className="footer-links-list">
              <li><span className="footer-link" onClick={() => onSelectTab('projects', 'student')}>Student Projects</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('projects', 'iot')}>IoT Nodes & Gateways</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('projects', 'robotics')}>Robotics & SLAM</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('projects', 'custom')}>Custom Engineering</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('learn', 'ideas')}>Idea Generator</span></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Learn & Company</h4>
            <ul className="footer-links-list">
              <li><span className="footer-link" onClick={() => onSelectTab('learn', 'tutorials')}>Tutorials & Code</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('learn', 'guides')}>Pinout Guides</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('about')}>Our Story</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('about')}>Meet the Team</span></li>
              <li><span className="footer-link" onClick={() => onSelectTab('about')}>Contact & Quotes</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Buildify Solutions (buildifysolutions.lk). All rights reserved. Sri Lanka.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">Terms of Service</span>
            <span className="footer-link">Warranty Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
