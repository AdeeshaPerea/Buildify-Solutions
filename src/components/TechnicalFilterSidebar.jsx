import React from 'react';
import { Filter, Zap, Box, Tag, CheckCircle2, RotateCcw } from 'lucide-react';

export default function TechnicalFilterSidebar({ 
  filterMeta, 
  selectedVoltage, 
  onSelectVoltage, 
  selectedBrand, 
  onSelectBrand, 
  selectedPackage, 
  onSelectPackage, 
  inStockOnly, 
  onToggleInStock,
  currency,
  onResetFilters 
}) {
  return (
    <aside className="tech-filter-sidebar">
      <div className="filter-sidebar-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem' }}>
          <Filter size={16} style={{ color: 'var(--accent-orange)' }} /> Technical Filters
        </span>
        <button className="filter-reset-btn" onClick={onResetFilters} title="Reset all filters">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* 1. Stock Status */}
      <div className="filter-group">
        <label className="filter-group-title">
          <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} /> Availability
        </label>
        <label className="filter-checkbox-label">
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(e) => onToggleInStock(e.target.checked)} 
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* 2. Operating Voltage */}
      <div className="filter-group">
        <label className="filter-group-title">
          <Zap size={14} style={{ color: 'var(--accent-orange)' }} /> Operating Voltage
        </label>
        <div className="filter-pill-grid">
          {filterMeta.voltages.map(v => (
            <button
              key={v}
              className={`filter-pill-small ${selectedVoltage === v ? 'active' : ''}`}
              onClick={() => onSelectVoltage(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Manufacturer / Brand */}
      <div className="filter-group">
        <label className="filter-group-title">
          <Tag size={14} style={{ color: 'var(--accent-gold)' }} /> Brand / Silicon
        </label>
        <div className="filter-pill-grid">
          {filterMeta.brands.map(b => (
            <button
              key={b}
              className={`filter-pill-small ${selectedBrand === b ? 'active' : ''}`}
              onClick={() => onSelectBrand(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Package Type */}
      <div className="filter-group">
        <label className="filter-group-title">
          <Box size={14} style={{ color: 'var(--accent-orange)' }} /> Package / Form Factor
        </label>
        <div className="filter-pill-grid">
          {filterMeta.packageTypes.map(p => (
            <button
              key={p}
              className={`filter-pill-small ${selectedPackage === p ? 'active' : ''}`}
              onClick={() => onSelectPackage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
