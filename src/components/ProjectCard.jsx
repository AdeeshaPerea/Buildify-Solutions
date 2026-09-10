import React from 'react';
import { Clock, Star, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onExploreProject }) {
  return (
    <div className="project-card">
      <div className="project-image-wrap">
        <img src={project.image} alt={project.title} className="project-image" loading="lazy" />
        <span className={`project-difficulty-badge diff-${project.difficulty}`}>{project.difficulty}</span>
      </div>
      <div className="project-body">
        <div className="project-meta">
          <span><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> {project.time}</span>
          <span><Star size={14} fill="currentColor" style={{ display: 'inline', color: 'var(--accent-amber)', marginRight: '4px' }} /> {project.rating}</span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-tags">
          {project.tags.map(t => (
            <span key={t} className="tag-badge">#{t}</span>
          ))}
        </div>
        <div className="project-card-footer">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {project.bom ? `${project.bom.length} Components Required` : 'Custom Spec'}
          </span>
          <button className="view-project-btn" onClick={() => onExploreProject(project)}>
            Explore BOM & Code <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
