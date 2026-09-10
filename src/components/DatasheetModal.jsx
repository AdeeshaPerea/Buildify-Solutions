import React from 'react';
import { X, FileText, Download, ExternalLink } from 'lucide-react';

export default function DatasheetModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <FileText size={26} style={{ color: 'var(--accent-orange)' }} />
            <div>
              <span className="product-category">Official Technical Datasheet</span>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{product.name}</h2>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', margin: '1.25rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>SKU Number: <strong style={{ color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>{product.sku}</strong></div>
              <div>Brand / Silicon: <strong>{product.brand}</strong></div>
              <div>Operating Voltage: <strong>{product.operatingVoltage}</strong></div>
              <div>Package Type: <strong>{product.packageType}</strong></div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Verified Hardware Specifications
          </h4>
          <table className="tech-table">
            <tbody>
              {Object.entries(product.specs || {}).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {product.datasheetUrl ? (
            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem' }}>
              <a 
                href={product.datasheetUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                <Download size={16} /> Open Official Manufacturer PDF <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
              Datasheet document is available on request from Buildify Engineering Lab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
