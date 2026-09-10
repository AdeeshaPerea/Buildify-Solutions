import React from 'react';
import { X, CheckSquare, Sparkles, FileCode, Clipboard, Wrench } from 'lucide-react';

export default function ProjectModal({ project, onClose, onRequestQuote, onCopyCode }) {
  if (!project) return null;

  const totalBomCost = (project.bom || []).reduce((acc, curr) => acc + (curr.cost * curr.qty), 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-content-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className={`tag-badge diff-${project.difficulty}`}>{project.difficulty}</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '0.4rem' }}>{project.title}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. Build Time</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{project.time}</div>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {project.summary}
          </p>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={18} style={{ color: 'var(--accent-cyan)' }} /> Bill of Materials (BOM)
          </h3>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Quantity</th>
                <th>Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {(project.bom || []).map((b, idx) => (
                <tr key={idx}>
                  <td>{b.name}</td>
                  <td>{b.qty}x</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    ${(b.cost * b.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{ fontWeight: 700, textAlign: 'right' }}>Total Kit Estimate:</td>
                <td style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                  ${totalBomCost.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style={{ margin: '1.5rem 0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} /> Key Project Highlights
            </h3>
            <ul style={{ listStyle: 'square', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {(project.features || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {project.codeSnippet && (
            <div className="code-box-wrap">
              <div className="code-box-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCode size={14} /> Main Firmware Preview
                </span>
                <button className="copy-code-btn" onClick={() => onCopyCode(project.codeSnippet)}>
                  <Clipboard size={14} /> Copy Code
                </button>
              </div>
              <pre className="code-snippet">{project.codeSnippet}</pre>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onRequestQuote(project.title)}>
              <Wrench size={16} /> Request Assembled Kit / Custom Build
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
