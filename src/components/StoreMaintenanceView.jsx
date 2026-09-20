import React from 'react';
import { 
  Wrench, 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  Clock, 
  Award, 
  ArrowRight, 
  Radio, 
  Layers, 
  Terminal,
  Zap,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function StoreMaintenanceView({ onSwitchToContracts, onSwitchToWeb }) {
  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      "Hello Buildify Solutions Hardware Team,\n\nI visited your IoT Hardware Store during the scheduled lab upgrade. I would like to inquire about component availability or place an urgent direct order."
    );
    window.open(`https://wa.me/94717790035?text=${text}`, '_blank');
  };

  return (
    <section className="store-maintenance-wrapper">
      {/* Animated Police / Caution Tape Ribbons */}
      <div className="caution-tape-container" aria-hidden="true">
        {/* Top Caution Ribbon (Angle -2.5deg) */}
        <div className="caution-tape tape-top">
          <div className="tape-track marquee-left">
            <span>🚧 CAUTION // HARDWARE LAB UNDER SCHEDULED UPGRADE 🚧 SYSTEM RE-CALIBRATION IN PROGRESS 🚧 DO NOT CROSS // BUILDIFY ROBOTICS 🚧 CAUTION // HARDWARE LAB UNDER SCHEDULED UPGRADE 🚧 SYSTEM RE-CALIBRATION IN PROGRESS 🚧 DO NOT CROSS // BUILDIFY ROBOTICS 🚧</span>
            <span>🚧 CAUTION // HARDWARE LAB UNDER SCHEDULED UPGRADE 🚧 SYSTEM RE-CALIBRATION IN PROGRESS 🚧 DO NOT CROSS // BUILDIFY ROBOTICS 🚧 CAUTION // HARDWARE LAB UNDER SCHEDULED UPGRADE 🚧 SYSTEM RE-CALIBRATION IN PROGRESS 🚧 DO NOT CROSS // BUILDIFY ROBOTICS 🚧</span>
          </div>
        </div>

        {/* Bottom Caution Ribbon (Angle +2.5deg) */}
        <div className="caution-tape tape-bottom">
          <div className="tape-track marquee-right">
            <span>⚡ RESTRICTED ACCESS // INVENTORY RESTOCK & AUTOMATION OVERHAUL ⚡ HIGH-VOLTAGE WORKBENCH ACTIVE ⚡ BUILDIFY SOLUTIONS ⚡ RESTRICTED ACCESS // INVENTORY RESTOCK & AUTOMATION OVERHAUL ⚡ HIGH-VOLTAGE WORKBENCH ACTIVE ⚡ BUILDIFY SOLUTIONS ⚡</span>
            <span>⚡ RESTRICTED ACCESS // INVENTORY RESTOCK & AUTOMATION OVERHAUL ⚡ HIGH-VOLTAGE WORKBENCH ACTIVE ⚡ BUILDIFY SOLUTIONS ⚡ RESTRICTED ACCESS // INVENTORY RESTOCK & AUTOMATION OVERHAUL ⚡ HIGH-VOLTAGE WORKBENCH ACTIVE ⚡ BUILDIFY SOLUTIONS ⚡</span>
          </div>
        </div>
      </div>

      <div className="section-container store-maintenance-container">
        {/* Main Stage: Mascot + Dialogue & Status */}
        <div className="maintenance-hero-grid">
          {/* Left: Builder Mascot with Cyber Holographic Pedestal */}
          <div className="maintenance-mascot-col">
            <div className="mascot-stage-arena">
              {/* Pulsing Radial Glow Behind Mascot */}
              <div className="mascot-ambient-pulse"></div>

              {/* Floating Tool Micro-Badges */}
              <div className="floating-tool-badge tool-badge-1">
                <Wrench size={16} />
                <span>Lab Re-Tooling</span>
              </div>

              <div className="floating-tool-badge tool-badge-2">
                <Cpu size={16} />
                <span>ESP32 & Sensors</span>
              </div>

              <div className="floating-tool-badge tool-badge-3">
                <Sparkles size={16} />
                <span>Quality Tested</span>
              </div>

              {/* Builder Mascot Image */}
              <img
                src="/mascot-maintenance.png"
                alt="Buildy the Builder Mascot"
                className="builder-mascot-img"
              />

              {/* Holographic Glowing Pedestal */}
              <div className="cyber-pedestal">
                <div className="pedestal-ring ring-outer"></div>
                <div className="pedestal-ring ring-inner"></div>
                <div className="pedestal-laser-line"></div>
              </div>
            </div>
          </div>

          {/* Right: Dialogue Box, Live Bench Telemetry & Actions */}
          <div className="maintenance-dialogue-col">
            {/* Top Eyebrow Badge */}
            <div className="maintenance-badge-strip">
              <span className="live-amber-beacon"></span>
              <ShieldAlert size={14} className="badge-icon" />
              <span>SCHEDULED LAB UPGRADE & RESTOCKING</span>
            </div>

            <h1 className="maintenance-headline">
              Pardon Our Dust, Maker! <br />
              <span className="gradient-text-amber">Buildy is Upgrading the Hardware Lab!</span>
            </h1>

            <p className="maintenance-description">
              Our component test benches, robotic pick-and-pack stations, and inventory logistics are currently undergoing a scheduled overhaul. We are preparing high-density stock of next-generation microcontrollers, sensors, and IoT maker modules.
            </p>

            {/* Live Lab Diagnostics Telemetry */}
            <div className="maintenance-telemetry-grid">
              <div className="telemetry-card">
                <div className="telemetry-header">
                  <Wrench size={16} className="text-amber" />
                  <span className="telemetry-tag">BENCH STATUS</span>
                </div>
                <div className="telemetry-value">RE-CALIBRATING</div>
                <span className="telemetry-note">Automated sensor diagnostics</span>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-header">
                  <Package size={16} className="text-amber" />
                  <span className="telemetry-tag">INVENTORY SHIPMENT</span>
                </div>
                <div className="telemetry-value text-cyan">IN TRANSIT</div>
                <span className="telemetry-note">Direct factory import batches</span>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-header">
                  <Zap size={16} className="text-green" />
                  <span className="telemetry-tag">CUSTOM BUILDS</span>
                </div>
                <div className="telemetry-value text-green">100% ONLINE</div>
                <span className="telemetry-note">Direct engineer dispatch active</span>
              </div>
            </div>

            {/* Concierge Action Box */}
            <div className="maintenance-concierge-card">
              <div className="concierge-content">
                <strong>Need an Urgent Component or Custom Project Build?</strong>
                <p>Our senior hardware architects and lab engineers are active on WhatsApp for urgent special part sourcing and custom prototyping requests.</p>
              </div>

              <div className="concierge-actions">
                <button
                  type="button"
                  className="btn-maintenance-wa"
                  onClick={handleWhatsAppContact}
                  title="Contact Buildify Engineering Desk on WhatsApp"
                >
                  <i className="bi bi-whatsapp"></i>
                  <span>WhatsApp Hardware Concierge</span>
                </button>

                {onSwitchToContracts && (
                  <button
                    type="button"
                    className="btn-maintenance-secondary"
                    onClick={onSwitchToContracts}
                    title="Switch to Bulk Stock & Custom STEM Contracts"
                  >
                    <Award size={15} />
                    <span>Bulk Contracts & Custom RFPs</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Alternative Hubs Navigation */}
            <div className="maintenance-sub-actions">
              <span className="sub-actions-label">Explore other operational divisions:</span>
              <div className="sub-actions-links">
                {onSwitchToWeb && (
                  <button type="button" className="sub-link-chip" onClick={onSwitchToWeb}>
                    🌐 Web Development Studio
                  </button>
                )}
                {onSwitchToContracts && (
                  <button type="button" className="sub-link-chip" onClick={onSwitchToContracts}>
                    ⚡ STEM Lab Projects
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
