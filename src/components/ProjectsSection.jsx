import React from 'react';
import ProjectCard from './ProjectCard';
import { Layers, Search } from 'lucide-react';

export default function ProjectsSection({ categories, projects, activeCategory, onSelectCategory, searchQuery, onExploreProject }) {
  const filtered = projects.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="view-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <Layers size={14} /> Engineering Showcase
          </div>
          <h2 className="section-title">Buildify Projects & Schematics</h2>
          <p className="section-desc">
            Complete hardware projects with Bill of Materials (BOM), difficulty ratings, firmware previews, and custom fabrication support.
          </p>
        </div>
      </div>

      {/* Category Filters */}
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

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Search size={40} style={{ color: 'var(--accent-purple)', margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--text-main)' }}>No projects found</h3>
          <p>Try searching for other project keywords like 'Robotics', 'IoT', or 'LoRa'.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map(proj => (
            <ProjectCard key={proj.id} project={proj} onExploreProject={onExploreProject} />
          ))}
        </div>
      )}
    </section>
  );
}
