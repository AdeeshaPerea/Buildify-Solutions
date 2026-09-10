import React, { useState } from 'react';
import { Layers, Printer, Cpu, UploadCloud, CheckCircle2, Calculator, Send } from 'lucide-react';

export default function ServicesPortal({ customServices, currency, onOpenConsultation, onShowToast }) {
  const [activeService, setActiveService] = useState('pcb');

  // PCB Calculator State
  const [pcbLayers, setPcbLayers] = useState(2);
  const [pcbQuantity, setPcbQuantity] = useState(5);
  const [pcbColor, setPcbColor] = useState('Buildify Matte Black');
  const [pcbFinish, setPcbFinish] = useState('HASL with Lead');
  const [pcbWidth, setPcbWidth] = useState(100);
  const [pcbHeight, setPcbHeight] = useState(100);

  // 3D Print Calculator State
  const [material, setMaterial] = useState('pla_plus');
  const [weightGrams, setWeightGrams] = useState(80);
  const [infill, setInfill] = useState('30% (Standard Strength)');
  const [printQty, setPrintQty] = useState(1);

  // PCB Price Calculation
  const selectedLayerObj = customServices.pcb.layerOptions.find(l => l.layers === pcbLayers) || customServices.pcb.layerOptions[1];
  const pcbAreaSqCm = (pcbWidth * pcbHeight) / 100;
  const pcbBaseLKR = selectedLayerObj.basePriceLKR + (pcbAreaSqCm * 8 * (pcbQuantity / 5));
  const finishMultiplier = pcbFinish.includes('ENIG') ? 1.4 : (pcbFinish.includes('Lead-Free') ? 1.15 : 1.0);
  const totalPcbCostLKR = pcbBaseLKR * finishMultiplier;
  const totalPcbCostUSD = totalPcbCostLKR / 310.0;

  // 3D Print Price Calculation
  const selectedMatObj = customServices.threeDPrint.materials.find(m => m.id === material) || customServices.threeDPrint.materials[0];
  const total3DCostLKR = (selectedMatObj.pricePerGramLKR * weightGrams * printQty) + 500; // Base slicer fee
  const total3DCostUSD = total3DCostLKR / 310.0;

  const handlePcbSubmit = (e) => {
    e.preventDefault();
    onShowToast(`PCB quotation #${Math.floor(1000 + Math.random() * 9000)} generated! An engineer will review your Gerber file.`, 'success');
  };

  const handle3DSubmit = (e) => {
    e.preventDefault();
    onShowToast(`3D print request submitted! Estimated print completion: 2 Days.`, 'success');
  };

  return (
    <section className="view-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <Cpu size={14} /> Custom Fabrication & Engineering
          </div>
          <h2 className="section-title">Buildify Custom Services Portal</h2>
          <p className="section-desc">
            Direct online quotation and fabrication for Custom PCB Design, 3D Prototyping, and Industrial Embedded R&D in Sri Lanka.
          </p>
        </div>
      </div>

      {/* Services Switcher Tabs */}
      <div className="filter-bar">
        <button 
          className={`filter-btn ${activeService === 'pcb' ? 'active' : ''}`}
          onClick={() => setActiveService('pcb')}
        >
          <Layers size={16} /> Custom PCB Prototyping
        </button>
        <button 
          className={`filter-btn ${activeService === '3dprint' ? 'active' : ''}`}
          onClick={() => setActiveService('3dprint')}
        >
          <Printer size={16} /> 3D Printing On-Demand
        </button>
        <button 
          className={`filter-btn ${activeService === 'rd' ? 'active' : ''}`}
          onClick={() => setActiveService('rd')}
        >
          <Cpu size={16} /> R&D & Firmware Consulting
        </button>
      </div>

      {/* TAB 1: PCB FABRICATION CALCULATOR */}
      {activeService === 'pcb' && (
        <div className="service-calc-grid">
          <div className="calc-form-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} style={{ color: 'var(--accent-orange)' }} /> Instant PCB Quote Estimator
            </h3>
            <form onSubmit={handlePcbSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">PCB Layers</label>
                  <select 
                    className="form-control" 
                    value={pcbLayers} 
                    onChange={(e) => setPcbLayers(parseInt(e.target.value, 10))}
                  >
                    <option value={1}>1-Layer (Single Sided)</option>
                    <option value={2}>2-Layers (Standard Dual)</option>
                    <option value={4}>4-Layers (High-Density Multi)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Quantity</label>
                  <select 
                    className="form-control" 
                    value={pcbQuantity} 
                    onChange={(e) => setPcbQuantity(parseInt(e.target.value, 10))}
                  >
                    <option value={5}>5 Pieces (Prototyping)</option>
                    <option value={10}>10 Pieces</option>
                    <option value={25}>25 Pieces</option>
                    <option value={50}>50 Pieces (Small Batch)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dimensions (Width mm)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={pcbWidth} 
                    onChange={(e) => setPcbWidth(Math.max(10, parseInt(e.target.value, 10) || 10))} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dimensions (Height mm)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={pcbHeight} 
                    onChange={(e) => setPcbHeight(Math.max(10, parseInt(e.target.value, 10) || 10))} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Solder Mask Color</label>
                  <select className="form-control" value={pcbColor} onChange={(e) => setPcbColor(e.target.value)}>
                    {customServices.pcb.colorOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Surface Finish</label>
                  <select className="form-control" value={pcbFinish} onChange={(e) => setPcbFinish(e.target.value)}>
                    {customServices.pcb.surfaceFinishOptions.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gerber File Upload */}
              <div className="form-group">
                <label className="form-label">Upload Gerber Files (.ZIP / .RAR)</label>
                <div className="upload-dropzone">
                  <UploadCloud size={28} style={{ color: 'var(--accent-orange)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>Click or Drag Gerber Archive Here</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Supports RS-274X format exported from Altium, KiCad, or EasyEDA</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} /> Submit Gerber & Confirm PCB Order
              </button>
            </form>
          </div>

          {/* PCB Quote Summary Card */}
          <div className="calc-summary-card">
            <div className="calc-badge">Turnaround: {selectedLayerObj.leadDays}</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Estimated PCB Prototyping Cost</h4>
            
            <div className="summary-line">
              <span>Layers & Board Area:</span>
              <strong>{pcbLayers} Layers ({pcbWidth}x{pcbHeight}mm)</strong>
            </div>
            <div className="summary-line">
              <span>Quantity:</span>
              <strong>{pcbQuantity} Boards</strong>
            </div>
            <div className="summary-line">
              <span>Finish & Mask:</span>
              <strong>{pcbColor} / {pcbFinish}</strong>
            </div>
            <div className="summary-line">
              <span>E-Test Quality Inspection:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>Included (100% Fly-Probe)</strong>
            </div>

            <div className="summary-total-box">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Cost</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                {currency === 'LKR' ? `Rs. ${totalPcbCostLKR.toLocaleString()}` : `$${totalPcbCostUSD.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 3D PRINTING SERVICE */}
      {activeService === '3dprint' && (
        <div className="service-calc-grid">
          <div className="calc-form-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={20} style={{ color: 'var(--accent-orange)' }} /> On-Demand 3D Print Estimator
            </h3>
            <form onSubmit={handle3DSubmit}>
              <div className="form-group">
                <label className="form-label">Print Material</label>
                <select className="form-control" value={material} onChange={(e) => setMaterial(e.target.value)}>
                  {customServices.threeDPrint.materials.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({currency === 'LKR' ? `Rs. ${m.pricePerGramLKR}/g` : `$${(m.pricePerGramLKR/310).toFixed(2)}/g`})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Estimated Part Weight (Grams)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={weightGrams} 
                    onChange={(e) => setWeightGrams(Math.max(5, parseInt(e.target.value, 10) || 5))} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity (Units)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={printQty} 
                    onChange={(e) => setPrintQty(Math.max(1, parseInt(e.target.value, 10) || 1))} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Infill Density & Strength</label>
                <select className="form-control" value={infill} onChange={(e) => setInfill(e.target.value)}>
                  {customServices.threeDPrint.infillOptions.map(inf => (
                    <option key={inf} value={inf}>{inf}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Upload 3D CAD Model (.STL / .STEP)</label>
                <div className="upload-dropzone">
                  <UploadCloud size={28} style={{ color: 'var(--accent-orange)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>Drop 3D CAD File Here (.STL / .OBJ / .STEP)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Max file size 50MB</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} /> Request Slicing & Print Job
              </button>
            </form>
          </div>

          <div className="calc-summary-card">
            <div className="calc-badge">Lead Time: 24-48 Hours</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>3D Printing Estimate</h4>
            
            <div className="summary-line">
              <span>Material:</span>
              <strong>{selectedMatObj.name}</strong>
            </div>
            <div className="summary-line">
              <span>Weight & Quantity:</span>
              <strong>{weightGrams}g × {printQty} Part(s)</strong>
            </div>
            <div className="summary-line">
              <span>Infill Preset:</span>
              <strong>{infill}</strong>
            </div>
            <div className="summary-line">
              <span>Bed Leveling & Post-Clean:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>Included</strong>
            </div>

            <div className="summary-total-box">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Cost</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                {currency === 'LKR' ? `Rs. ${total3DCostLKR.toLocaleString()}` : `$${total3DCostUSD.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: R&D & FIRMWARE CONSULTATION */}
      {activeService === 'rd' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <Cpu size={48} style={{ color: 'var(--accent-orange)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Bespoke Embedded Systems R&D</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Work directly with Daham Karunathilake and our engineering staff to design custom telemetry nodes, wireless LoRa/ESP-NOW mesh networks, smart agriculture automation, or industrial Modbus controllers.
          </p>
          <button className="btn btn-primary" onClick={onOpenConsultation} style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
            Schedule 1-on-1 Engineering Consultation
          </button>
        </div>
      )}
    </section>
  );
}
