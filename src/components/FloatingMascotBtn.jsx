import React, { useState } from 'react';
import { HelpCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function FloatingMascotBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="floating-mascot-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Speech prompt popup bubble on hover or initial hint */}
      <div className={`floating-mascot-tooltip ${hovered ? 'visible' : ''}`}>
        <div className="tooltip-header">
          <Sparkles size={12} style={{ color: 'var(--accent-orange)' }} />
          <span>Need Guidance?</span>
        </div>
        <p className="tooltip-text">Ask Buildy: IoT Products or Web Solutions?</p>
      </div>

      <button 
        className="floating-mascot-btn" 
        onClick={onClick}
        aria-label="Open Buildify Mascot Guide"
        title="Open Mascot Guide"
      >
        <div className="floating-mascot-pulse"></div>
        <div className="floating-mascot-avatar-wrap">
          <img 
            src="/mascot.png" 
            alt="Buildy Mascot" 
            className="floating-mascot-img" 
          />
        </div>
        <span className="floating-mascot-status-dot" />
      </button>
    </div>
  );
}
