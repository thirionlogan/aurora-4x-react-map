const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Function to create favicon at specified size
function createFavicon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Set dark background
  ctx.fillStyle = '#111827'; // Dark gray background (similar to bg-gray-900)
  ctx.fillRect(0, 0, size, size);

  // Create radial gradient for star glow effect
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4; // 40% of canvas size

  // Create glow effect (similar to the star-glow gradient in the SVG)
  const glowGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius * 2.5
  );
  glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)'); // Reduced opacity from 0.7 to 0.3
  glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Transparent

  // Draw the glow effect
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 2.5, 0, 2 * Math.PI);
  ctx.fill();

  // Draw the gold circle (capital system)
  ctx.fillStyle = '#FFD700'; // Gold color
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Add a subtle white border for better visibility
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1, size / 32);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

// Create PNG files in different sizes
const pngSizes = [192, 512];
pngSizes.forEach((size) => {
  const pngBuffer = createFavicon(size);
  const pngPath = path.join(__dirname, '..', 'public', `logo${size}.png`);
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`PNG favicon ${size}x${size} saved to: ${pngPath}`);
});

// For ICO file, we need to create multiple sizes
// ICO files typically contain multiple sizes: 64x64 32x32 24x24 16x16
const icoSizes = [64, 32, 24, 16];
const icoCanvases = [];

icoSizes.forEach((icoSize) => {
  const icoCanvas = createCanvas(icoSize, icoSize);
  const icoCtx = icoCanvas.getContext('2d');

  // Set dark background
  icoCtx.fillStyle = '#111827';
  icoCtx.fillRect(0, 0, icoSize, icoSize);

  // Create glow effect
  const icoCenterX = icoSize / 2;
  const icoCenterY = icoSize / 2;
  const icoRadius = icoSize * 0.4;

  const icoGlowGradient = icoCtx.createRadialGradient(
    icoCenterX,
    icoCenterY,
    0,
    icoCenterX,
    icoCenterY,
    icoRadius * 2.5
  );
  icoGlowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)'); // Reduced opacity
  icoGlowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  // Draw glow
  icoCtx.fillStyle = icoGlowGradient;
  icoCtx.beginPath();
  icoCtx.arc(icoCenterX, icoCenterY, icoRadius * 2.5, 0, 2 * Math.PI);
  icoCtx.fill();

  // Draw gold circle
  icoCtx.fillStyle = '#FFD700';
  icoCtx.beginPath();
  icoCtx.arc(icoCenterX, icoCenterY, icoRadius, 0, 2 * Math.PI);
  icoCtx.fill();

  // Add border
  icoCtx.strokeStyle = '#FFFFFF';
  icoCtx.lineWidth = Math.max(1, icoSize / 32);
  icoCtx.beginPath();
  icoCtx.arc(icoCenterX, icoCenterY, icoRadius, 0, 2 * Math.PI);
  icoCtx.stroke();

  icoCanvases.push({
    size: icoSize,
    buffer: icoCanvas.toBuffer('image/png'),
  });
});

// Create ICO file header and data
// ICO format: header + directory entries + image data
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // Reserved
icoHeader.writeUInt16LE(1, 2); // Type (1 = ICO)
icoHeader.writeUInt16LE(icoSizes.length, 4); // Number of images

let icoData = icoHeader;
let offset = 6 + icoSizes.length * 16; // Header + directory entries

// Create directory entries and collect image data
const imageBuffers = [];

icoCanvases.forEach((canvas, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(canvas.size, 0); // Width
  entry.writeUInt8(canvas.size, 1); // Height
  entry.writeUInt8(0, 2); // Color count (0 = 256 colors)
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(canvas.buffer.length, 8); // Size of image data
  entry.writeUInt32LE(offset, 12); // Offset to image data

  icoData = Buffer.concat([icoData, entry]);
  imageBuffers.push(canvas.buffer);
  offset += canvas.buffer.length;
});

// Add image data
imageBuffers.forEach((buffer) => {
  icoData = Buffer.concat([icoData, buffer]);
});

// Save ICO file
const icoPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(icoPath, icoData);
console.log(`ICO favicon saved to: ${icoPath}`);

console.log('Favicon generation complete!');
