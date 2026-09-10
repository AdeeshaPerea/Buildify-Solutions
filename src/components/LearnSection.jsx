import React from 'react';
import { BookOpen, User, Clock, Code, Lightbulb, Cpu } from 'lucide-react';

export default function LearnSection({ categories, content, ideas, activeCategory, onSelectCategory, onOpenTutorial }) {
  const filtered = content.filter(item => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  return (
    <section className="view-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <BookOpen size={14} /> Maker Knowledge Base
          </div>
          <h2 className="section-title">Tutorials, Guides & Project Ideas</h2>
          <p className="section-desc">
            Master embedded systems, IoT networking protocols, sensor calibration, and robotics control theory with hands-on guides.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Tutorials Grid */}
      <div className="learn-grid">
        {filtered.map(item => (
          <div key={item.id} className="learn-card">
            <img src={item.thumbnail} alt={item.title} className="learn-thumb" loading="lazy" />
            <div className="learn-card-body">
              <div className="learn-card-meta">
                <span><User size={13} style={{ display: 'inline', marginRight: '4px' }} /> {item.author}</span>
                <span><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} /> {item.readTime}</span>
              </div>
              <h3 className="learn-card-title">{item.title}</h3>
              <p className="learn-card-desc">{item.summary}</p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.85rem' }} 
                  onClick={() => onOpenTutorial(item)}
                >
                  <Code size={16} /> Open Tutorial & Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Ideas Matrix */}
      <div className="ideas-section-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-eyebrow">
              <Lightbulb size={14} style={{ color: 'var(--accent-amber)' }} /> Inspiration Vault
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Curated STEM & Engineering Project Ideas</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Ready-to-build ideas for student capstone projects and smart IoT inventions.
            </p>
          </div>
        </div>
        <div className="ideas-grid">
          {ideas.map((idea, idx) => (
            <div key={idx} className="idea-card">
              <div className="idea-domain">
                {idea.domain} • <span className={`tag-badge diff-${idea.difficulty}`}>{idea.difficulty}</span>
              </div>
              <h4 className="idea-title">{idea.title}</h4>
              <p className="idea-desc">{idea.description}</p>
              <div className="idea-components">
                {idea.components.map((c, i) => (
                  <span key={i} className="tag-badge">
                    <Cpu size={12} style={{ display: 'inline', marginRight: '4px' }} /> {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
