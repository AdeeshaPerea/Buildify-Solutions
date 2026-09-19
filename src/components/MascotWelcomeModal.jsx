import React from 'react';
import { Cpu, Code2, ArrowRight, Sparkles, X, Layers, Wifi, Globe, Terminal, CheckCircle2 } from 'lucide-react';

export default function MascotWelcomeModal({ isOpen, onClose, onSelectOption }) {
  if (!isOpen) return null;

  return (
    <div className="mascot-modal-overlay" onClick={onClose}>
      <div className="mascot-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className="mascot-modal-close-btn" 
          onClick={onClose} 
          aria-label="Close welcome modal"
          title="Enter website directly"
        >
          <X size={20} />
        </button>

        {/* Ambient Top Glow */}
        <div className="mascot-card-top-glow"></div>

        {/* Mascot + Speech Header */}
        <div className="mascot-intro-header">
          {/* 3D Mascot Character Avatar with Animated Glow */}
          <div className="mascot-avatar-wrapper">
            <div className="mascot-ring-pulse"></div>
            <div className="mascot-glow-backdrop"></div>
            <img 
              src="/mascot.png" 
              alt="Buildy - Buildify Solutions Mascot" 
              className="mascot-hero-img"
            />
            <span className="mascot-online-badge">
              <span className="pulse-dot"></span> Online
            </span>
          </div>

          {/* Speech Bubble */}
          <div className="mascot-speech-bubble">
            <div className="speech-badge">
              <Sparkles size={13} style={{ color: 'var(--accent-orange)' }} />
              <span>Meet Buildy • Your Personal Guide</span>
            </div>
            <h2 className="speech-title">
              Hi there! Welcome to <span className="gradient-text">Buildify Solutions</span>
            </h2>
            <p className="speech-desc">
              We build hardware prototypes and modern web solutions to grow your vision. 
              <strong> What do you need today?</strong> Choose your path below:
            </p>
          </div>
        </div>

        {/* The 2 Primary Choices */}
        <div className="mascot-choices-grid">
          {/* CHOICE 1: IOT PRODUCTS */}
          <div 
            className="mascot-choice-card iot-choice"
            onClick={() => onSelectOption('iot')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectOption('iot')}
          >
            <div className="choice-badge iot-badge">
              <Cpu size={14} /> Hardware & Lab
            </div>

            <div className="choice-icon-wrap iot-icon-bg">
              <Cpu size={32} />
              <div className="choice-chip-icon"><Wifi size={16} /></div>
            </div>

            <div className="choice-content">
              <h3 className="choice-title">IoT Products & Hardware</h3>
              <p className="choice-subtitle">
                ESP32, Arduino boards, precision sensors, robotics kits, and maker electronics with schematics.
              </p>

              <ul className="choice-features-list">
                <li><CheckCircle2 size={13} /> ESP32, Arduino & Raspberry Pi</li>
                <li><CheckCircle2 size={13} /> Sensors, Displays & Relay Modules</li>
                <li><CheckCircle2 size={13} /> STEM Kits & Robotics Chassis</li>
              </ul>
            </div>

            <button className="choice-action-btn iot-btn">
              <span>Browse IoT Products</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* CHOICE 2: WEB SOLUTIONS */}
          <div 
            className="mascot-choice-card web-choice"
            onClick={() => onSelectOption('web')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectOption('web')}
          >
            <div className="choice-badge web-badge">
              <Code2 size={14} /> Software & Cloud
            </div>

            <div className="choice-icon-wrap web-icon-bg">
              <Code2 size={32} />
              <div className="choice-chip-icon"><Globe size={16} /></div>
            </div>

            <div className="choice-content">
              <h3 className="choice-title">Web Solutions & Systems</h3>
              <p className="choice-subtitle">
                Custom full-stack web platforms, live IoT telemetry dashboards, and business automation software.
              </p>

              <ul className="choice-features-list">
                <li><CheckCircle2 size={13} /> Modern Web Apps (React, Next.js)</li>
                <li><CheckCircle2 size={13} /> Live IoT Telemetry & Dashboards</li>
                <li><CheckCircle2 size={13} /> Business Systems & Custom Portals</li>
              </ul>
            </div>

            <button className="choice-action-btn web-btn">
              <span>Explore Web Solutions</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Footer / Skip Action */}
        <div className="mascot-modal-footer">
          <button className="mascot-skip-btn" onClick={onClose}>
            <span>Or enter full website & explore everything</span>
            <ArrowRight size={14} />
          </button>
          <div className="mascot-founder-tag">
            <strong>Buildify Solutions</strong> • Sri Lanka
          </div>
        </div>
      </div>
    </div>
  );
}
