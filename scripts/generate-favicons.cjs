const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 512x512 Master Square Favicon SVG
const svg512 = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient: Deep slate / obsidian cyber glow -->
    <radialGradient id="bgGlow" cx="50%" cy="30%" r="70%" fx="50%" fy="20%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="60%" stop-color="#0B1120" />
      <stop offset="100%" stop-color="#050811" />
    </radialGradient>

    <!-- Vibrant Brand Orange Gradients -->
    <linearGradient id="orangeRoofGrad" x1="50" y1="10" x2="160" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFA033" />
      <stop offset="50%" stop-color="#FF6B00" />
      <stop offset="100%" stop-color="#E05300" />
    </linearGradient>

    <linearGradient id="orangeBCurve" x1="100" y1="40" x2="190" y2="150" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF851B" />
      <stop offset="50%" stop-color="#FF6B00" />
      <stop offset="100%" stop-color="#D94800" />
    </linearGradient>

    <linearGradient id="whitePillarGrad" x1="50" y1="40" x2="120" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="75%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <linearGradient id="whitePillar3D" x1="50" y1="150" x2="140" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#94A3B8" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>

    <!-- Glow & 3D Depth Filters -->
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#FF6B00" flood-opacity="0.35" />
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Premium Squircle Container for Google Search & App Icons -->
  <rect width="512" height="512" rx="112" fill="url(#bgGlow)" />
  <rect x="4" y="4" width="504" height="504" rx="108" stroke="#FF6B00" stroke-width="6" stroke-opacity="0.35" />

  <!-- Buildify 3D House / B Emblem Centered -->
  <g transform="translate(256, 258) scale(2.26) translate(-107.5, -99)" filter="url(#subtleGlow)">
    <!-- 1. Orange Roof Top with 3D Bevel -->
    <path
      d="M35 55L95 18C98 16 102 16 105 18L165 42C167 43 167 46 166 49L160 62C159 64 157 65 155 64L102 40L40 67C38 68 36 67 35 65L32 58C31 56 32 54 35 55Z"
      fill="url(#orangeRoofGrad)"
    />

    <!-- 2. 4 Orange Windows (2x2 Grid) -->
    <rect x="90" y="58" width="11" height="11" rx="2" fill="#FF7A00" />
    <rect x="105" y="58" width="11" height="11" rx="2" fill="#FF7A00" />
    <rect x="90" y="73" width="11" height="11" rx="2" fill="#FF7A00" />
    <rect x="105" y="73" width="11" height="11" rx="2" fill="#FF7A00" />

    <!-- 3. White 3D Pillar & Lower Floor Base (Isometric L-shape) -->
    <g>
      <path
        d="M86 52L54 160L148 160L165 138L92 138L108 52H86Z"
        fill="url(#whitePillarGrad)"
      />
      <path
        d="M54 160L46 172L138 172L148 160H54Z"
        fill="url(#whitePillar3D)"
      />
    </g>

    <!-- 4. Orange 'B' Curved Right Loops -->
    <path
      d="M102 46H132C155 46 174 58 174 77C174 88 166 98 153 103C172 108 184 122 184 140C184 163 162 180 134 180H90L102 156H132C148 156 160 148 160 138C160 128 148 120 132 120H110L114 104H130C144 104 152 97 152 88C152 80 144 72 130 72H106L102 46Z"
      fill="url(#orangeBCurve)"
    />
  </g>
</svg>`;

// Function to generate an ICO file buffer with multiple PNG images (16, 32, 48)
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.data.length, 8); // data size
    entry.writeUInt32LE(offset, 12); // data offset
    entries.push(entry);
    offset += img.data.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(img => img.data)]);
}

async function run() {
  const publicDir = path.resolve(__dirname, '..', 'public');
  
  // 1. Write the 1:1 square master SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svg512, 'utf-8');
  console.log('Created public/favicon.svg (512x512 square vector)');

  const svgBuffer = Buffer.from(svg512);

  // 2. Generate Google & PWA standard PNG sizes
  // 48x48: Google's primary multiple
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);
  console.log('Created public/favicon-48x48.png (Google search multiple of 48)');

  // 96x96: Google high-density
  const png96 = await sharp(svgBuffer).resize(96, 96).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), png96);
  console.log('Created public/favicon-96x96.png');

  // 32x32: Standard desktop browser tab
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  console.log('Created public/favicon-32x32.png');

  // 16x16: Legacy desktop tab
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  console.log('Created public/favicon-16x16.png');

  // 180x180: Apple Touch Icon
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  console.log('Created public/apple-touch-icon.png (180x180 for iOS)');

  // 192x192: Android Chrome / PWA / Google 4x
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  console.log('Created public/icon-192.png');

  // 512x512: PWA splash & HD icon
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  console.log('Created public/icon-512.png');

  // 3. Multi-resolution ICO (16x16, 32x32, 48x48)
  const icoBuffer = createIco([
    { width: 16, height: 16, data: png16 },
    { width: 32, height: 32, data: png32 },
    { width: 48, height: 48, data: png48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Created public/favicon.ico (multi-res 16, 32, 48)');

  // Also create social share OG image card (1200x630) with rich branding!
  const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ogBg" cx="50%" cy="35%" r="80%">
        <stop offset="0%" stop-color="#1E293B" />
        <stop offset="60%" stop-color="#0B1120" />
        <stop offset="100%" stop-color="#030712" />
      </radialGradient>
      <linearGradient id="ogOrange" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FFA033" />
        <stop offset="50%" stop-color="#FF6B00" />
        <stop offset="100%" stop-color="#E05300" />
      </linearGradient>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FF6B00" stop-opacity="0" />
        <stop offset="50%" stop-color="#FF6B00" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#FF6B00" stop-opacity="0" />
      </linearGradient>
      <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="25" flood-color="#FF6B00" flood-opacity="0.3" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#ogBg)" />

    <!-- Subtle Tech Grid Effect -->
    <g opacity="0.08" stroke="#FF6B00" stroke-width="1">
      <line x1="0" y1="105" x2="1200" y2="105" />
      <line x1="0" y1="210" x2="1200" y2="210" />
      <line x1="0" y1="315" x2="1200" y2="315" />
      <line x1="0" y1="420" x2="1200" y2="420" />
      <line x1="0" y1="525" x2="1200" y2="525" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Ambient Orange Flare -->
    <circle cx="600" cy="180" r="260" fill="#FF6B00" opacity="0.12" filter="blur(60px)" />

    <!-- Top Accent Bar -->
    <rect x="0" y="0" width="1200" height="5" fill="url(#ogOrange)" />

    <!-- Center Icon Container -->
    <g transform="translate(600, 180) translate(-80, -80)" filter="url(#cardGlow)">
      <rect width="160" height="160" rx="36" fill="#0F172A" stroke="#FF6B00" stroke-width="3" stroke-opacity="0.5" />
      <g transform="translate(80, 80) scale(0.7) translate(-107.5, -99)">
        <!-- Emblem -->
        <path d="M35 55L95 18C98 16 102 16 105 18L165 42C167 43 167 46 166 49L160 62C159 64 157 65 155 64L102 40L40 67C38 68 36 67 35 65L32 58C31 56 32 54 35 55Z" fill="#FF6B00" />
        <rect x="90" y="58" width="11" height="11" rx="2" fill="#FF7A00" />
        <rect x="105" y="58" width="11" height="11" rx="2" fill="#FF7A00" />
        <rect x="90" y="73" width="11" height="11" rx="2" fill="#FF7A00" />
        <rect x="105" y="73" width="11" height="11" rx="2" fill="#FF7A00" />
        <path d="M86 52L54 160L148 160L165 138L92 138L108 52H86Z" fill="#FFFFFF" />
        <path d="M54 160L46 172L138 172L148 160H54Z" fill="#94A3B8" />
        <path d="M102 46H132C155 46 174 58 174 77C174 88 166 98 153 103C172 108 184 122 184 140C184 163 162 180 134 180H90L102 156H132C148 156 160 148 160 138C160 128 148 120 132 120H110L114 104H130C144 104 152 97 152 88C152 80 144 72 130 72H106L102 46Z" fill="#FF6B00" />
      </g>
    </g>

    <!-- Main Title -->
    <text x="600" y="340" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
      BUILDIFY <tspan fill="#FF6B00">SOLUTIONS</tspan>
    </text>

    <!-- Tagline Divider -->
    <line x1="350" y1="375" x2="850" y2="375" stroke="url(#lineGrad)" stroke-width="2" />

    <!-- Subtitle / Tagline -->
    <text x="600" y="420" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#FF851B" letter-spacing="4">
      WE BUILD. YOU GROW.
    </text>

    <!-- Service Badges -->
    <text x="600" y="480" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#CBD5E1">
      Web Development  •  Custom Software  •  Smart IoT &amp; Robotics  •  ERP Systems
    </text>

    <!-- Domain Pill -->
    <g transform="translate(600, 545)">
      <rect x="-170" y="-20" width="340" height="40" rx="20" fill="#0F172A" stroke="#FF6B00" stroke-width="1.5" stroke-opacity="0.6" />
      <text x="0" y="6" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#F8FAFC" letter-spacing="1">
        www.buildifysolution.com
      </text>
    </g>
  </svg>`;

  const ogBuffer = await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuffer);
  console.log('Created public/og-image.png (1200x630 high-res social card)');

  console.log('All favicon & social assets successfully generated!');
}

run().catch(console.error);
