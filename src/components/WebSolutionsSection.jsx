import React, { useState } from 'react';
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
  Sliders
} from 'lucide-react';

export default function WebSolutionsSection({ currency, onOpenConsultation, onShowToast }) {
  const [activeDemo, setActiveDemo] = useState('telemetry');
  
  // Interactive Project Estimator State
  const [projectType, setProjectType] = useState('iot_dashboard');
  const [hasAuth, setHasAuth] = useState(true);
  const [hasPayment, setHasPayment] = useState(false);
  const [hasRealtime, setHasRealtime] = useState(true);
  const [hasMobileApp, setHasMobileApp] = useState(false);

  // Simulated live sensor toggle in demo
  const [pumpRelayState, setPumpRelayState] = useState(false);
  const [sensorValues, setSensorValues] = useState({
    temp: 28.4,
    humidity: 65,
    soil: 72,
    voltage: 3.32
  });

  // Calculate web estimate
  const basePrices = {
    landing: { lkr: 45000, usd: 145, days: "5-7 Days", name: "Corporate Landing & Showcase" },
    ecommerce: { lkr: 95000, usd: 305, days: "10-14 Days", name: "E-Commerce & Digital Storefront" },
    iot_dashboard: { lkr: 110000, usd: 355, days: "12-16 Days", name: "IoT Cloud Telemetry & Control Dashboard" },
    business_system: { lkr: 140000, usd: 450, days: "18-24 Days", name: "Custom Business ERP & Inventory Portal" }
  };

  const selectedBase = basePrices[projectType] || basePrices.iot_dashboard;
  let addOnsCostLKR = 0;
  if (hasAuth) addOnsCostLKR += 20000;
  if (hasPayment) addOnsCostLKR += 25000;
  if (hasRealtime) addOnsCostLKR += 30000;
  if (hasMobileApp) addOnsCostLKR += 55000;

  const totalEstimateLKR = selectedBase.lkr + addOnsCostLKR;
  const totalEstimateUSD = totalEstimateLKR / 310.0;

  const handleTogglePump = () => {
    const next = !pumpRelayState;
    setPumpRelayState(next);
    onShowToast(`MQTT Command Sent: 12V Pump Relay switched ${next ? 'ON' : 'OFF'}!`, next ? 'success' : 'info');
  };

  const handleConsultationClick = () => {
    onOpenConsultation(`Web Solutions Inquiry: ${selectedBase.name} (Estimated: ${currency === 'LKR' ? `Rs. ${totalEstimateLKR.toLocaleString()}` : `$${Math.round(totalEstimateUSD)}`})`);
  };

  return (
    <section className="view-section web-solutions-view">
      {/* Section Top Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <Code2 size={14} /> Official Digital Engineering Studio
          </div>
          <h2 className="section-title">
            Web Development, Business Systems & <span className="gradient-text">IoT Dashboards</span>
          </h2>
          <p className="section-desc">
            Buildify Solutions bridges the gap between hardware and software. We craft modern, resilient web platforms, real-time IoT cloud telemetry hubs, and enterprise business automation systems.
          </p>
        </div>
      </div>

      {/* 3 Core Pillars From Official Brand Identity */}
      <div className="web-pillars-grid">
        {/* Pillar 1: Web Development */}
        <div className="web-pillar-card">
          <div className="pillar-badge web-badge">
            <Code2 size={15} /> Pillar 01
          </div>
          <div className="pillar-icon-box">
            <Code2 size={28} />
          </div>
          <h3 className="pillar-title">Web Development</h3>
          <p className="pillar-description">
            High-speed, SEO-optimized web applications built with modern stacks (React, Vite, Next.js, Node.js). Tailored for tech companies, hardware startups, and e-commerce enterprises.
          </p>
          <ul className="pillar-highlights">
            <li><CheckCircle2 size={14} /> Full-Stack React & Next.js Platforms</li>
            <li><CheckCircle2 size={14} /> E-Commerce with LKR & USD Payments</li>
            <li><CheckCircle2 size={14} /> Responsive, Micro-Animated Glassmorphic UI</li>
            <li><CheckCircle2 size={14} /> RESTful & GraphQL Microservices</li>
          </ul>
        </div>

        {/* Pillar 2: Business Systems */}
        <div className="web-pillar-card">
          <div className="pillar-badge business-badge">
            <Monitor size={15} /> Pillar 02
          </div>
          <div className="pillar-icon-box">
            <Monitor size={28} />
          </div>
          <h3 className="pillar-title">Business Systems</h3>
          <p className="pillar-description">
            Custom enterprise software that eliminates manual spreadsheet headaches. Streamline your inventory, automated billing, team roles, and internal logistics with custom portals.
          </p>
          <ul className="pillar-highlights">
            <li><CheckCircle2 size={14} /> Warehouse & SKU Inventory Trackers</li>
            <li><CheckCircle2 size={14} /> Automated Invoice & Order Dispatch</li>
            <li><CheckCircle2 size={14} /> Role-Based Access Control (RBAC)</li>
            <li><CheckCircle2 size={14} /> Real-Time Analytics & Profit Metrics</li>
          </ul>
        </div>

        {/* Pillar 3: Digital Solutions & IoT Telemetry */}
        <div className="web-pillar-card">
          <div className="pillar-badge iot-badge">
            <TrendingUp size={15} /> Pillar 03
          </div>
          <div className="pillar-icon-box">
            <Wifi size={28} />
          </div>
          <h3 className="pillar-title">Digital Solutions & IoT</h3>
          <p className="pillar-description">
            Connect your ESP32, Arduino, or industrial hardware directly to the web. Monitor sensors, trigger relays worldwide, and visualize data streams in low-latency dashboards.
          </p>
          <ul className="pillar-highlights">
            <li><CheckCircle2 size={14} /> Real-Time MQTT / WebSocket Streaming</li>
            <li><CheckCircle2 size={14} /> Remote Relay & Actuator Switching</li>
            <li><CheckCircle2 size={14} /> Cloud Historical Telemetry Logs</li>
            <li><CheckCircle2 size={14} /> Over-The-Air (OTA) Firmware Updates</li>
          </ul>
        </div>
      </div>

      {/* Interactive Live Demo Preview Box */}
      <div className="web-demo-section">
        <div className="demo-header">
          <div>
            <div className="demo-badge">
              <Sparkles size={14} /> Live Interactive Prototype
            </div>
            <h3 className="demo-title">Experience Our Web & Telemetry Architecture</h3>
          </div>
          <div className="demo-tab-pills">
            <button 
              className={`demo-tab-btn ${activeDemo === 'telemetry' ? 'active' : ''}`}
              onClick={() => setActiveDemo('telemetry')}
            >
              <Wifi size={14} /> IoT Telemetry Dashboard
            </button>
            <button 
              className={`demo-tab-btn ${activeDemo === 'business' ? 'active' : ''}`}
              onClick={() => setActiveDemo('business')}
            >
              <Monitor size={14} /> Business ERP & Inventory
            </button>
          </div>
        </div>

        {activeDemo === 'telemetry' ? (
          <div className="demo-mockup-frame">
            <div className="mockup-browser-bar">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-url">
                https://telemetry.buildifysolutions.lk/nodes/esp32-live-node-01
              </div>
              <div className="mockup-status">
                <span className="live-pulse"></span> MQTT CONNECTED (PORT 8883)
              </div>
            </div>

            <div className="mockup-body">
              <div className="telemetry-grid">
                <div className="telemetry-metric-card">
                  <div className="metric-header">
                    <span>Ambient Temp</span>
                    <Zap size={14} style={{ color: 'var(--accent-orange)' }} />
                  </div>
                  <div className="metric-val">{sensorValues.temp}°C</div>
                  <div className="metric-sub">ESP32 DHT22 • Stable</div>
                </div>

                <div className="telemetry-metric-card">
                  <div className="metric-header">
                    <span>Soil Hydration</span>
                    <Activity size={14} style={{ color: 'var(--accent-emerald)' }} />
                  </div>
                  <div className="metric-val">{sensorValues.soil}%</div>
                  <div className="metric-sub">Capacitive Sensor V2</div>
                </div>

                <div className="telemetry-metric-card">
                  <div className="metric-header">
                    <span>Air Humidity</span>
                    <Wifi size={14} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div className="metric-val">{sensorValues.humidity}%</div>
                  <div className="metric-sub">Relative Humidity</div>
                </div>

                <div className="telemetry-metric-card">
                  <div className="metric-header">
                    <span>Supply Rail</span>
                    <ShieldCheck size={14} style={{ color: '#60a5fa' }} />
                  </div>
                  <div className="metric-val">{sensorValues.voltage}V</div>
                  <div className="metric-sub">Regulated DC Bus</div>
                </div>
              </div>

              {/* Interactive Control Console */}
              <div className="demo-controls-bar">
                <div className="controls-left">
                  <div className="control-label">Remote Actuator Control:</div>
                  <div className="control-desc">Click to send real-time MQTT payload to simulated ESP32 node</div>
                </div>
                <button 
                  className={`btn ${pumpRelayState ? 'btn-danger-active' : 'btn-primary'}`}
                  onClick={handleTogglePump}
                >
                  <Zap size={16} />
                  <span>{pumpRelayState ? 'Turn Relay Pump OFF (Active)' : 'Trigger 12V Pump Relay ON'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="demo-mockup-frame">
            <div className="mockup-browser-bar">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-url">
                https://portal.buildifysolutions.lk/admin/warehouse-inventory
              </div>
              <div className="mockup-status">
                <span className="live-pulse"></span> REST API V2 • POSTGRESQL
              </div>
            </div>

            <div className="mockup-body">
              <div className="erp-table-mockup">
                <div className="erp-row erp-header-row">
                  <span>SKU / Component</span>
                  <span>Category</span>
                  <span>Stock Available</span>
                  <span>Reorder Threshold</span>
                  <span>Unit Price</span>
                  <span>Status</span>
                </div>
                <div className="erp-row">
                  <span className="font-mono">BF-ESP32-DEV1</span>
                  <span>Microcontrollers</span>
                  <span className="highlight-stock">48 Units</span>
                  <span>15 Units</span>
                  <span>Rs. 2,165</span>
                  <span className="badge-ok">Optimal</span>
                </div>
                <div className="erp-row">
                  <span className="font-mono">BF-ARD-UNO-R3</span>
                  <span>Arduino Family</span>
                  <span className="highlight-stock">24 Units</span>
                  <span>10 Units</span>
                  <span>Rs. 2,465</span>
                  <span className="badge-ok">Optimal</span>
                </div>
                <div className="erp-row">
                  <span className="font-mono">BF-RPI-PICO-W</span>
                  <span>RP2040 Wi-Fi</span>
                  <span className="highlight-stock" style={{ color: 'var(--accent-rose)' }}>4 Units</span>
                  <span>12 Units</span>
                  <span>Rs. 2,790</span>
                  <span className="badge-warning">Low Stock Reorder</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Web Project Estimator & Scope Builder */}
      <div className="web-estimator-card">
        <div className="estimator-left">
          <div className="section-eyebrow">
            <Sliders size={14} /> Instant Quotation
          </div>
          <h3 className="estimator-title">Web & Digital Solutions Estimator</h3>
          <p className="estimator-desc">
            Select your target project specifications to receive an immediate budget and timeline estimate from our engineering team in Sri Lanka.
          </p>

          <div className="estimator-types">
            <label className="input-label">Select Core Architecture:</label>
            <div className="project-type-pills">
              {Object.entries(basePrices).map(([key, val]) => (
                <button
                  key={key}
                  className={`type-pill ${projectType === key ? 'active' : ''}`}
                  onClick={() => setProjectType(key)}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>

          <div className="estimator-features">
            <label className="input-label">Select Add-on Modules:</label>
            <div className="checkbox-features-grid">
              <label className="feature-checkbox">
                <input 
                  type="checkbox" 
                  checked={hasAuth} 
                  onChange={(e) => setHasAuth(e.target.checked)} 
                />
                <span>User Authentication & RBAC Roles (+Rs. 20k)</span>
              </label>

              <label className="feature-checkbox">
                <input 
                  type="checkbox" 
                  checked={hasPayment} 
                  onChange={(e) => setHasPayment(e.target.checked)} 
                />
                <span>Sri Lanka Payment Gateway (PayHere/Direct LKR) (+Rs. 25k)</span>
              </label>

              <label className="feature-checkbox">
                <input 
                  type="checkbox" 
                  checked={hasRealtime} 
                  onChange={(e) => setHasRealtime(e.target.checked)} 
                />
                <span>Real-Time WebSockets / MQTT Live Feeds (+Rs. 30k)</span>
              </label>

              <label className="feature-checkbox">
                <input 
                  type="checkbox" 
                  checked={hasMobileApp} 
                  onChange={(e) => setHasMobileApp(e.target.checked)} 
                />
                <span>Progressive Web App (PWA) / Mobile Hybrid (+Rs. 55k)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Quotation Summary Card */}
        <div className="estimator-right">
          <div className="summary-box">
            <div className="summary-badge">Estimated Engineering Scope</div>
            <div className="summary-timeline">
              <span>Estimated Delivery:</span>
              <strong>{selectedBase.days}</strong>
            </div>

            <div className="summary-price-wrap">
              <span className="summary-label">Estimated Investment</span>
              <div className="summary-amount">
                {currency === 'LKR' ? (
                  <>Rs. {totalEstimateLKR.toLocaleString()}</>
                ) : (
                  <>${Math.round(totalEstimateUSD)} <span className="usd-note">USD</span></>
                )}
              </div>
              <span className="summary-sub">Includes UI/UX Design, Development, Cloud Deployment & 30 Days Free Support</span>
            </div>

            <button 
              className="btn btn-primary btn-block"
              onClick={handleConsultationClick}
            >
              <MessageSquare size={18} />
              <span>Request Quote & Consultation</span>
            </button>

            <div className="founder-direct-note">
              <ShieldCheck size={14} style={{ color: 'var(--accent-orange)' }} />
              <span>Direct review by <strong>Buildify Solutions</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Banner */}
      <div className="tech-stack-row">
        <span className="stack-label">Our Modern Technology Stack:</span>
        <div className="stack-tags">
          <span className="stack-tag">React 18</span>
          <span className="stack-tag">Next.js</span>
          <span className="stack-tag">Node.js</span>
          <span className="stack-tag">Python & FastAPI</span>
          <span className="stack-tag">MQTT / Mosquitto</span>
          <span className="stack-tag">WebSockets</span>
          <span className="stack-tag">PostgreSQL</span>
          <span className="stack-tag">Tailwind & Vanilla CSS</span>
          <span className="stack-tag">Docker</span>
          <span className="stack-tag">ESP-IDF</span>
        </div>
      </div>
    </section>
  );
}
