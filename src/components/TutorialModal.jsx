import React from 'react';
import { X, CheckCircle2, FileCode, Clipboard } from 'lucide-react';

export default function TutorialModal({ tutorial, onClose, onCopyCode }) {
  if (!tutorial) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-content-inner">
          <span className="product-category">{tutorial.category} • {tutorial.level}</span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '0.4rem', marginBottom: '0.5rem' }}>{tutorial.title}</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
            By {tutorial.author} • {tutorial.readTime}
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>Required Hardware</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tutorial.hardware.map((h, i) => (
                <span key={i} className="tag-badge">
                  <CheckCircle2 size={13} style={{ display: 'inline', color: 'var(--accent-emerald)', marginRight: '4px' }} /> {h}
                </span>
              ))}
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Pinout & Wiring Scheme</h4>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Pin Identifier</th>
                <th>Function</th>
                <th>Wiring Note</th>
              </tr>
            </thead>
            <tbody>
              {(tutorial.pinoutGuide || []).map((pin, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{pin.pin}</td>
                  <td>{pin.function}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{pin.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            <h3 style={{ color: 'var(--text-main)', margin: '1.5rem 0 0.5rem', fontSize: '1.15rem' }}>
              Step-by-Step Instructions & Setup
            </h3>
            <p style={{ whiteSpace: 'pre-line' }}>{tutorial.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
