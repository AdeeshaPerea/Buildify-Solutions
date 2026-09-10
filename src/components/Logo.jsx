import React from 'react';

export default function Logo({ size = 'medium', showTagline = true, showWordmark = true, className = '' }) {
  // Size presets
  const sizeMap = {
    small: { iconSize: 32, titleSize: '1.15rem', subSize: '0.6rem', gap: '0.5rem' },
    medium: { iconSize: 44, titleSize: '1.4rem', subSize: '0.72rem', gap: '0.75rem' },
    large: { iconSize: 72, titleSize: '2.4rem', subSize: '0.95rem', gap: '1.25rem' }
  };

  const { iconSize, titleSize, subSize, gap } = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`buildify-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap, cursor: 'pointer' }}>
      {/* Precision 3D Vector Icon of the Official Buildify House/B Emblem */}
      <svg
        width={iconSize}
        height={iconSize * 1.05}
        viewBox="0 0 200 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 107, 0, 0.45))', flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="orangeRoofGrad" x1="50" y1="10" x2="160" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF851B" />
            <stop offset="60%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#E05300" />
          </linearGradient>
          <linearGradient id="orangeBCurve" x1="100" y1="40" x2="190" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="50%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#D94800" />
          </linearGradient>
          <linearGradient id="whitePillarGrad" x1="50" y1="40" x2="120" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="80%" stopColor="#E8ECF2" />
            <stop offset="100%" stopColor="#CAD1DC" />
          </linearGradient>
          <linearGradient id="whitePillar3D" x1="50" y1="150" x2="140" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CAD1DC" />
            <stop offset="100%" stopColor="#9AA2B1" />
          </linearGradient>
          <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Orange Roof Top with 3D Bevel */}
        <path
          d="M35 55L95 18C98 16 102 16 105 18L165 42C167 43 167 46 166 49L160 62C159 64 157 65 155 64L102 40L40 67C38 68 36 67 35 65L32 58C31 56 32 54 35 55Z"
          fill="url(#orangeRoofGrad)"
          filter="url(#shadow3D)"
        />

        {/* 2. 4 Orange Windows (2x2 Grid) */}
        <rect x="90" y="58" width="11" height="11" rx="1.5" fill="#FF6B00" />
        <rect x="105" y="58" width="11" height="11" rx="1.5" fill="#FF6B00" />
        <rect x="90" y="73" width="11" height="11" rx="1.5" fill="#FF6B00" />
        <rect x="105" y="73" width="11" height="11" rx="1.5" fill="#FF6B00" />

        {/* 3. White 3D Pillar & Lower Floor Base (Isometric L-shape) */}
        <g filter="url(#shadow3D)">
          {/* Front Face */}
          <path
            d="M86 52L54 160L148 160L165 138L92 138L108 52H86Z"
            fill="url(#whitePillarGrad)"
          />
          {/* Isometric Depth Thickness */}
          <path
            d="M54 160L46 172L138 172L148 160H54Z"
            fill="url(#whitePillar3D)"
          />
        </g>

        {/* 4. Orange "B" Curved Right Loops */}
        <path
          d="M102 46H132C155 46 174 58 174 77C174 88 166 98 153 103C172 108 184 122 184 140C184 163 162 180 134 180H90L102 156H132C148 156 160 148 160 138C160 128 148 120 132 120H110L114 104H130C144 104 152 97 152 88C152 80 144 72 130 72H106L102 46Z"
          fill="url(#orangeBCurve)"
          filter="url(#shadow3D)"
        />
      </svg>

      {/* Official Typography Wordmark */}
      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{ fontSize: titleSize, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#FFFFFF' }}>BUILD</span>
            <span style={{ color: '#FF6B00' }}>IFY</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 3px' }}>
            <span style={{ height: '1.5px', background: '#FF6B00', flex: 1 }}></span>
            <span style={{ fontSize: subSize, fontWeight: 800, letterSpacing: '0.22em', color: '#FF6B00', textTransform: 'uppercase' }}>
              SOLUTIONS
            </span>
            <span style={{ height: '1.5px', background: '#FF6B00', flex: 1 }}></span>
          </div>

          {showTagline && (
            <div style={{ fontSize: `calc(${subSize} * 0.85)`, fontWeight: 700, letterSpacing: '0.14em', color: '#B0B5C2', textTransform: 'uppercase', textAlign: 'center' }}>
              WE BUILD. YOU GROW.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
