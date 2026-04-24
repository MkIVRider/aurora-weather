// Run with: node create-icons.js
// Generates icon-192.png and icon-512.png

const { createCanvas } = require('canvas');
const fs = require('fs');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size;

  // Background rounded rect
  const bg = ctx.createLinearGradient(0, 0, s, s);
  bg.addColorStop(0, '#0a0e27');
  bg.addColorStop(0.5, '#1e1b4b');
  bg.addColorStop(1, '#312e81');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, s, s, s * 0.18);
  ctx.fill();

  // Sun glow
  const glow = ctx.createRadialGradient(s*0.5, s*0.42, 0, s*0.5, s*0.42, s*0.35);
  glow.addColorStop(0, 'rgba(251,191,36,0.3)');
  glow.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, s, s);

  // Sun circle
  const sunGrad = ctx.createRadialGradient(s*0.5, s*0.42, 0, s*0.5, s*0.42, s*0.14);
  sunGrad.addColorStop(0, '#fde68a');
  sunGrad.addColorStop(0.6, '#fbbf24');
  sunGrad.addColorStop(1, '#f59e0b');
  ctx.beginPath();
  ctx.arc(s*0.5, s*0.42, s*0.13, 0, Math.PI*2);
  ctx.fillStyle = sunGrad;
  ctx.fill();

  // Sun rays
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = s * 0.02;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const inner = s * 0.17;
    const outer = s * 0.22;
    ctx.beginPath();
    ctx.moveTo(s*0.5 + Math.cos(angle)*inner, s*0.42 + Math.sin(angle)*inner);
    ctx.lineTo(s*0.5 + Math.cos(angle)*outer, s*0.42 + Math.sin(angle)*outer);
    ctx.stroke();
  }

  // Letter "A"
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${s*0.22}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', s*0.5, s*0.75);

  return canvas;
}

// Check if canvas package is available
try {
  require('canvas');
} catch {
  console.log('The "canvas" npm package is not installed.');
  console.log('');
  console.log('Easier option: Open generate-icons.html in your browser,');
  console.log('right-click each image, and "Save image as..." to this folder:');
  console.log('  icon-192.png');
  console.log('  icon-512.png');
  process.exit(0);
}

[192, 512].forEach(size => {
  const canvas = drawIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filename = `icon-${size}.png`;
  fs.writeFileSync(filename, buffer);
  console.log(`Created ${filename}`);
});
