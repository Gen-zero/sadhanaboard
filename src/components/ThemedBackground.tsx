/* eslint-disable no-case-declarations */
// TODO: Wrap all case block declarations in braces (lines 1521, 1622, 1704, 2141, 2529)
import { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import React from 'react';
import { getThemeById } from '@/themes';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load heavy theme components
const MahakaliAnimatedBackground = lazy(() =>
  import('@/components/MahakaliAnimatedBackground')
);


// Function to draw the Om symbol for the Default theme
const drawOmSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, isGold: boolean = false) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  if (isGold) {
    // Create a golden gradient for accent Om symbols
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white center
    gradient.addColorStop(0.3, 'rgba(255, 223, 0, 1)'); // Bright gold
    gradient.addColorStop(0.6, 'rgba(255, 215, 0, 0.95)'); // Gold
    gradient.addColorStop(1, 'rgba(218, 165, 32, 0.8)'); // Goldenrod edge
    ctx.fillStyle = gradient;

    // Add intense golden glow effect
    ctx.shadowColor = 'rgba(255, 215, 0, 1)';
    ctx.shadowBlur = size * 0.8;

    // Make it bolder by increasing font weight and size
    ctx.font = `900 ${size * 1.3}px Arial, sans-serif`; // Increased size by 30% and made ultra-bold
  } else {
    // Enhanced purple gradient for better visual effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.8);
    gradient.addColorStop(0, 'rgba(187, 134, 252, 1)'); // Bright purple center
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.9)'); // Medium purple
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)'); // Darker purple edge
    ctx.fillStyle = gradient;

    // Add glow effect
    ctx.shadowColor = 'rgba(187, 134, 252, 0.8)';
    ctx.shadowBlur = size * 0.5;

    ctx.font = `bold ${size}px Arial`;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ॐ', 0, 0);

  if (isGold) {
    // Add secondary glow layer for more intensity
    ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
    ctx.shadowBlur = size * 0.4;
    ctx.fillText('ॐ', 0, 0);
  }

  ctx.restore();
};

// Function to draw golden accent mantras
const drawGoldMantra = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, mantra: string) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a radial golden gradient for more intense glow
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white center
  gradient.addColorStop(0.2, 'rgba(255, 223, 0, 1)'); // Bright gold
  gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.95)'); // Gold
  gradient.addColorStop(1, 'rgba(218, 165, 32, 0.8)'); // Goldenrod
  ctx.fillStyle = gradient;

  // Add intense golden glow
  ctx.shadowColor = 'rgba(255, 215, 0, 1)';
  ctx.shadowBlur = size * 1.2;

  // Adjust font size based on text length for better visibility
  const fontSize = mantra.length > 15 ? size * 0.8 : size * 1.4;

  // Make font bolder
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mantra, 0, 0);

  // Add secondary glow layer
  ctx.shadowColor = 'rgba(255, 255, 0, 0.9)';
  ctx.shadowBlur = size * 0.6;
  ctx.fillText(mantra, 0, 0);

  ctx.restore();
};

// Function to draw Sri Yantra for the Default theme
const drawSriYantra = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Draw the central triangle
  ctx.strokeStyle = '#bb86fc'; // Purple color
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
    const nextAngle = ((i + 1) * Math.PI * 2) / 3 - Math.PI / 2;
    ctx.moveTo(Math.cos(angle) * size * 0.5, Math.sin(angle) * size * 0.5);
    ctx.lineTo(Math.cos(nextAngle) * size * 0.5, Math.sin(nextAngle) * size * 0.5);
  }
  ctx.stroke();

  // Draw surrounding triangles
  ctx.strokeStyle = '#f5b042'; // Gold color
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 9; i++) {
    const angle = (i * Math.PI * 2) / 9;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw a lotus flower for the Earth theme
const drawLotus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Lotus petals (8 petals)
  const petalColors = ['#f8d7da', '#f1c2c5', '#eaa8b0', '#e38e9b'];

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const petalX = Math.cos(angle) * size * 0.3;
    const petalY = Math.sin(angle) * size * 0.3;

    ctx.fillStyle = petalColors[i % petalColors.length];
    ctx.beginPath();
    ctx.ellipse(petalX, petalY, size * 0.8, size * 1.2, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center
  ctx.fillStyle = '#d4af37'; // Gold color
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw floating particles for the Earth theme
const drawEarthParticle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#8b5a2b'; // Earth brown
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Function to draw water ripples for the Water theme
const drawWaterRipple = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Draw concentric circles to simulate ripples
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = i === 0 ? '#4d9de0' : i === 1 ? '#6bc5e7' : '#8ed6f0'; // Different shades of blue
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size * (1 - i * 0.3), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw diyas (lamps) for the Water theme
const drawDiya = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Base of diya
  ctx.fillStyle = '#d4af37'; // Gold color
  ctx.beginPath();
  ctx.ellipse(0, size * 0.3, size * 0.5, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Flame
  const gradient = ctx.createRadialGradient(0, -size * 0.3, 0, 0, -size * 0.3, size * 0.5);
  gradient.addColorStop(0, '#ffeb3b'); // Yellow center
  gradient.addColorStop(1, 'rgba(255, 152, 0, 0)'); // Orange edges, transparent
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, -size * 0.3, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw fire particles for the Fire theme
const drawFireParticle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a gradient for the fire particle
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, '#ff5722'); // Deep orange
  gradient.addColorStop(0.5, '#ff9800'); // Orange
  gradient.addColorStop(1, 'rgba(255, 152, 0, 0)'); // Transparent at edges

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw ember particles for the Fire theme
const drawEmber = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffeb3b'; // Yellow color for embers
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Function to draw luminous snowflakes for the Shiva theme
const drawSnowflake = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a simpler snowflake with white color
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

  // Draw a simple 6-pointed snowflake
  ctx.beginPath();

  // Draw main branches
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;

    // Main branch
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);

    // Add small branches
    const branchAngle1 = angle + Math.PI / 6;
    const branchAngle2 = angle - Math.PI / 6;
    const branchLength = size * 0.6;

    // First small branch
    const x1 = Math.cos(angle) * branchLength * 0.7;
    const y1 = Math.sin(angle) * branchLength * 0.7;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(branchAngle1) * size * 0.3, y1 + Math.sin(branchAngle1) * size * 0.3);

    // Second small branch
    const x2 = Math.cos(angle) * branchLength;
    const y2 = Math.sin(angle) * branchLength;
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 + Math.cos(branchAngle2) * size * 0.3, y2 + Math.sin(branchAngle2) * size * 0.3);
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
};

// Function to draw Shiva silhouette for the Shiva theme
const drawShivaSilhouette = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Draw Shiva's form (simplified for canvas)
  ctx.fillStyle = 'rgba(30, 30, 60, 0.9)'; // Dark blue-gray for silhouette

  // Body (elongated oval)
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.4, size * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head (circle)
  ctx.beginPath();
  ctx.arc(0, -size * 1.3, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Arms in meditation pose (more detailed)
  ctx.strokeStyle = 'rgba(30, 30, 60, 0.9)';
  ctx.lineWidth = size * 0.2;
  ctx.lineCap = 'round';

  // Left arm
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, -size * 0.5);
  ctx.lineTo(-size * 1.2, -size * 1.0);
  ctx.lineTo(-size * 1.0, -size * 0.7);
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(size * 0.4, -size * 0.5);
  ctx.lineTo(size * 1.2, -size * 1.0);
  ctx.lineTo(size * 1.0, -size * 0.7);
  ctx.stroke();

  ctx.restore();
};

// Function to draw tridents for the Bhairava theme
const drawTrident = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Create a gradient for the trident
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, 'rgba(220, 20, 60, 0.8)'); // Crimson
  gradient.addColorStop(1, 'rgba(139, 0, 0, 0.6)'); // Dark red

  ctx.strokeStyle = gradient;
  ctx.lineWidth = size * 0.2;
  ctx.lineCap = 'round';

  // Draw the central spear
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();

  // Draw the three prongs
  for (let i = -1; i <= 1; i++) {
    const offsetX = i * size * 0.4;
    ctx.beginPath();
    ctx.moveTo(offsetX, -size * 0.8);
    ctx.lineTo(offsetX, -size * 0.4);
    ctx.lineTo(offsetX + (i * size * 0.3), -size * 0.2);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw skulls for the Bhairava theme
const drawSkull = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Skull color with gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(220, 220, 220, 0.9)'); // Light gray
  gradient.addColorStop(1, 'rgba(105, 105, 105, 0.7)'); // Dark gray

  ctx.fillStyle = gradient;

  // Draw the skull (simplified)
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2); // Head
  ctx.fill();

  // Eye sockets
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(-size * 0.3, -size * 0.2, size * 0.2, 0, Math.PI * 2);
  ctx.arc(size * 0.3, -size * 0.2, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Nose hole
  ctx.beginPath();
  ctx.arc(0, size * 0.1, size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw sacred fire for the Bhairava theme
const drawSacredFire = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create fire gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)'); // Gold
  gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.7)'); // Red-orange
  gradient.addColorStop(1, 'rgba(139, 0, 0, 0.5)'); // Dark red, transparent

  ctx.fillStyle = gradient;

  // Draw flame shape
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.quadraticCurveTo(-size * 0.8, size * 0.2, 0, -size);
  ctx.quadraticCurveTo(size * 0.8, size * 0.2, 0, size);
  ctx.fill();

  ctx.restore();
};

// Function to draw Bhairava's silhouette for the Bhairava theme
const drawBhairavaSilhouette = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a dark gradient for the silhouette
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, 'rgba(30, 30, 60, 0.9)'); // Dark blue-gray
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)'); // Black

  ctx.fillStyle = gradient;

  // Draw simplified Bhairava form
  // Head (circle with third eye)
  ctx.beginPath();
  ctx.arc(0, -size * 0.8, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Third eye
  ctx.fillStyle = 'rgba(255, 69, 0, 0.9)'; // Red-orange
  ctx.beginPath();
  ctx.arc(0, -size * 0.9, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Body (elongated oval)
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.3, size * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Arms
  ctx.strokeStyle = gradient;
  ctx.lineWidth = size * 0.15;
  ctx.lineCap = 'round';

  // Left arm
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, -size * 0.3);
  ctx.lineTo(-size * 0.8, size * 0.2);
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(size * 0.3, -size * 0.3);
  ctx.lineTo(size * 0.8, size * 0.2);
  ctx.stroke();

  // Weapon in hand (trident)
  ctx.strokeStyle = 'rgba(220, 20, 60, 0.9)'; // Crimson
  ctx.beginPath();
  ctx.moveTo(size * 0.8, size * 0.2);
  ctx.lineTo(size * 1.2, -size * 0.3);
  ctx.stroke();

  ctx.restore();
};

// Function to draw glowing eyes for the Bhairava theme
const drawGlowingEyes = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a bright red gradient for the eyes
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 1)'); // Bright gold center
  gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.8)'); // Orange
  gradient.addColorStop(1, 'rgba(139, 0, 0, 0.4)'); // Dark red, transparent

  ctx.fillStyle = gradient;

  // Draw circular eyes
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw tantric yantras for the Bhairava theme
const drawTantricYantra = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Create a crimson gradient
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, 'rgba(220, 20, 60, 0.7)'); // Crimson
  gradient.addColorStop(1, 'rgba(139, 0, 0, 0.5)'); // Dark red

  ctx.strokeStyle = gradient;
  ctx.lineWidth = size * 0.1;

  // Draw a complex yantra pattern
  // Outer square
  ctx.beginPath();
  ctx.rect(-size, -size, size * 2, size * 2);
  ctx.stroke();

  // Inner circles
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, (size * i) / 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Diagonal lines
  ctx.beginPath();
  ctx.moveTo(-size * 0.8, -size * 0.8);
  ctx.lineTo(size * 0.8, size * 0.8);
  ctx.moveTo(size * 0.8, -size * 0.8);
  ctx.lineTo(-size * 0.8, size * 0.8);
  ctx.stroke();

  // Central point (bindu)
  ctx.fillStyle = 'rgba(255, 215, 0, 0.9)'; // Gold
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw calming lotus flowers for the Serenity theme
const drawCalmingLotus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Soft pastel colors for a calming effect
  const petalColors = ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292'];

  // Draw lotus petals
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const petalX = Math.cos(angle) * size * 0.3;
    const petalY = Math.sin(angle) * size * 0.3;

    ctx.fillStyle = petalColors[i % petalColors.length];
    ctx.beginPath();
    ctx.ellipse(petalX, petalY, size * 0.6, size * 1.0, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center with a soft yellow
  const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4);
  centerGradient.addColorStop(0, 'rgba(255, 241, 118, 0.9)'); // Soft yellow
  centerGradient.addColorStop(1, 'rgba(255, 202, 40, 0.7)'); // Golden yellow
  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw gentle waves for the Serenity theme
const drawGentleWave = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a soft blue gradient
  const gradient = ctx.createLinearGradient(-size, 0, size, 0);
  gradient.addColorStop(0, 'rgba(179, 229, 252, 0.6)'); // Light blue
  gradient.addColorStop(0.5, 'rgba(79, 195, 247, 0.4)'); // Medium blue
  gradient.addColorStop(1, 'rgba(41, 182, 246, 0.2)'); // Darker blue

  ctx.fillStyle = gradient;

  // Draw a gentle wave shape
  ctx.beginPath();
  ctx.moveTo(-size, size * 0.2);
  ctx.bezierCurveTo(-size * 0.5, 0, size * 0.5, size * 0.4, size, 0);
  ctx.bezierCurveTo(size * 0.5, size * 0.4, -size * 0.5, size * 0.8, -size, size * 0.2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

// Function to draw soft light particles for the Serenity theme
const drawSoftLight = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a soft glow gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // White center
  gradient.addColorStop(0.7, 'rgba(179, 229, 252, 0.5)'); // Light blue
  gradient.addColorStop(1, 'rgba(79, 195, 247, 0)'); // Transparent

  ctx.fillStyle = gradient;

  // Draw a soft circle
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw peaceful mountains for the Serenity theme
const drawPeacefulMountain = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a soft gradient for mountains
  const gradient = ctx.createLinearGradient(0, -size, 0, size);
  gradient.addColorStop(0, 'rgba(144, 202, 249, 0.4)'); // Light blue-gray
  gradient.addColorStop(1, 'rgba(92, 107, 192, 0.2)'); // Soft indigo

  ctx.fillStyle = gradient;

  // Draw a simple mountain shape
  ctx.beginPath();
  ctx.moveTo(-size, size);
  ctx.lineTo(0, -size * 0.8);
  ctx.lineTo(size, size);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

// Function to draw tranquil water ripples for the Serenity theme
const drawTranquilRipple = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Draw concentric circles with soft blue colors
  for (let i = 0; i < 3; i++) {
    const rippleSize = size * (1 - i * 0.3);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rippleSize);
    gradient.addColorStop(0, `rgba(179, 229, 252, ${0.3 - i * 0.1})`);
    gradient.addColorStop(1, `rgba(79, 195, 247, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, rippleSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

// Function to draw Ganesha head for the Ganesha theme
const drawGaneshaHead = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create gradients for Ganesha's head
  const skinGradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
  skinGradient.addColorStop(0, 'rgba(255, 220, 177, 0.9)'); // Light skin tone
  skinGradient.addColorStop(1, 'rgba(210, 180, 140, 0.7)'); // Darker skin tone

  // Draw head (large circle)
  ctx.fillStyle = skinGradient;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Draw ears (large)
  ctx.fillStyle = skinGradient;
  ctx.beginPath();
  ctx.arc(-size * 0.8, -size * 0.3, size * 0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.8, -size * 0.3, size * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Draw eyes
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.beginPath();
  ctx.arc(-size * 0.3, -size * 0.1, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.3, -size * 0.1, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Draw trunk
  ctx.strokeStyle = skinGradient;
  ctx.lineWidth = size * 0.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.2);
  ctx.lineTo(0, size * 0.7);
  ctx.lineTo(-size * 0.3, size * 0.9);
  ctx.stroke();

  // Draw tusk
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(size * 0.1, size * 0.3);
  ctx.lineTo(size * 0.4, size * 0.5);
  ctx.stroke();

  ctx.restore();
};

// Function to draw modak (sweet) for the Ganesha theme
const drawModak = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create gradient for modak
  const modakGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  modakGradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)'); // Gold
  modakGradient.addColorStop(1, 'rgba(218, 165, 32, 0.7)'); // Goldenrod

  // Draw modak base (round)
  ctx.fillStyle = modakGradient;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Draw modak top (conical)
  const topGradient = ctx.createLinearGradient(0, -size * 0.5, 0, -size * 1.2);
  topGradient.addColorStop(0, 'rgba(218, 165, 32, 0.9)');
  topGradient.addColorStop(1, 'rgba(184, 134, 11, 0.7)');

  ctx.fillStyle = topGradient;
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, -size * 0.2);
  ctx.lineTo(0, -size * 1.2);
  ctx.lineTo(size * 0.6, -size * 0.2);
  ctx.closePath();
  ctx.fill();

  // Draw decorative lines on modak
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
  ctx.lineWidth = size * 0.05;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * size * 0.3, Math.sin(angle) * size * 0.3);
    ctx.lineTo(Math.cos(angle) * size * 0.8, Math.sin(angle) * size * 0.8);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw golden particles for the Ganesha theme
const drawGoldenParticle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a golden gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)'); // Gold
  gradient.addColorStop(0.7, 'rgba(218, 165, 32, 0.7)'); // Goldenrod
  gradient.addColorStop(1, 'rgba(184, 134, 11, 0)'); // Transparent

  ctx.fillStyle = gradient;

  // Draw a soft circle
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw Om symbol for the Ganesha theme
const drawGaneshaOm = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create a golden gradient
  const gradient = ctx.createLinearGradient(-size * 0.5, 0, size * 0.5, 0);
  gradient.addColorStop(0, 'rgba(218, 165, 32, 0.9)');
  gradient.addColorStop(1, 'rgba(255, 215, 0, 0.9)');

  ctx.fillStyle = gradient;
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ॐ', 0, 0);

  ctx.restore();
};

// Function to draw Ganesha's trident (trishula) for the Ganesha theme
const drawGaneshaTrident = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Create a golden gradient for the trident
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)'); // Gold
  gradient.addColorStop(1, 'rgba(218, 165, 32, 0.7)'); // Goldenrod

  ctx.strokeStyle = gradient;
  ctx.lineWidth = size * 0.15;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw the central spear
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.8);
  ctx.lineTo(0, size * 0.8);
  ctx.stroke();

  // Draw the three prongs
  for (let i = -1; i <= 1; i++) {
    const offsetX = i * size * 0.3;
    ctx.beginPath();
    ctx.moveTo(offsetX, -size * 0.6);
    ctx.lineTo(offsetX, -size * 0.3);
    ctx.lineTo(offsetX + (i * size * 0.2), -size * 0.1);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw bamboo stalks for zen theme
const drawBamboo = (ctx: CanvasRenderingContext2D, x: number, y: number, height: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create bamboo gradient
  const gradient = ctx.createLinearGradient(0, -height / 2, 0, height / 2);
  gradient.addColorStop(0, 'rgba(34, 139, 34, 0.8)'); // Forest green
  gradient.addColorStop(0.5, 'rgba(50, 205, 50, 0.6)'); // Lime green
  gradient.addColorStop(1, 'rgba(34, 139, 34, 0.8)'); // Forest green

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';

  // Draw main bamboo stalk
  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(0, height / 2);
  ctx.stroke();

  // Draw bamboo segments
  const segments = 5;
  ctx.strokeStyle = 'rgba(0, 100, 0, 0.8)';
  ctx.lineWidth = 2;
  for (let i = 1; i < segments; i++) {
    const segmentY = (-height / 2) + (height * i / segments);
    ctx.beginPath();
    ctx.moveTo(-15, segmentY);
    ctx.lineTo(15, segmentY);
    ctx.stroke();
  }

  // Draw bamboo leaves
  const leafGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
  leafGradient.addColorStop(0, 'rgba(124, 252, 0, 0.8)'); // Lawn green
  leafGradient.addColorStop(1, 'rgba(34, 139, 34, 0.4)'); // Forest green

  ctx.fillStyle = leafGradient;

  for (let i = 0; i < 6; i++) {
    const leafY = (-height / 2) + (height * i / 6) + Math.random() * 20 - 10;
    const leafX = (i % 2 === 0 ? 1 : -1) * (15 + Math.random() * 10);

    ctx.save();
    ctx.translate(leafX, leafY);
    ctx.rotate((i * 0.3) + Math.random() * 0.4 - 0.2);

    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
};

// Function to draw zen circles (enso) for meditation theme
const drawZenCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create brush-like gradient
  const gradient = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
  gradient.addColorStop(0, 'rgba(0, 100, 0, 0.9)'); // Dark green
  gradient.addColorStop(0.7, 'rgba(34, 139, 34, 0.6)'); // Forest green
  gradient.addColorStop(1, 'rgba(0, 100, 0, 0.1)'); // Very light green

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';

  // Draw incomplete circle (enso style)
  const startAngle = Math.random() * 0.5;
  const endAngle = Math.PI * 2 - (Math.random() * 0.8 + 0.2);

  ctx.beginPath();
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.stroke();

  ctx.restore();
};

// Function to draw water ripples for zen theme
const drawZenRipple = (ctx: CanvasRenderingContext2D, x: number, y: number, maxRadius: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Draw multiple concentric ripples
  for (let i = 0; i < 4; i++) {
    const radius = maxRadius * (0.2 + i * 0.25);
    const opacity = 0.8 - (i * 0.15);

    ctx.strokeStyle = `rgba(0, 128, 128, ${opacity * alpha})`; // Teal
    ctx.lineWidth = 2 - (i * 0.3);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw floating zen stones
const drawZenStone = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create stone gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(105, 105, 105, 0.9)'); // Dim gray
  gradient.addColorStop(0.6, 'rgba(128, 128, 128, 0.7)'); // Gray
  gradient.addColorStop(1, 'rgba(169, 169, 169, 0.3)'); // Dark gray

  ctx.fillStyle = gradient;

  // Draw smooth stone shape
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
  ctx.fill();

  // Add texture
  ctx.strokeStyle = 'rgba(105, 105, 105, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.8, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
};

// Function to draw neon grid pattern for the Neon theme
const drawNeonGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create neon cyan glow effect
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
  ctx.shadowColor = 'rgba(0, 255, 255, 0.9)';
  ctx.shadowBlur = 15;
  ctx.lineWidth = 2;

  // Draw grid pattern
  const gridSize = size / 4;
  for (let i = -2; i <= 2; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * gridSize, -size);
    ctx.lineTo(i * gridSize, size);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(-size, i * gridSize);
    ctx.lineTo(size, i * gridSize);
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw neon circuit patterns for the Neon theme
const drawNeonCircuit = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create neon magenta glow effect
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
  ctx.shadowColor = 'rgba(255, 0, 255, 0.9)';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 3;

  // Draw circuit-like patterns
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(-size * 0.5, 0);
  ctx.lineTo(-size * 0.3, -size * 0.3);
  ctx.lineTo(size * 0.3, -size * 0.3);
  ctx.lineTo(size * 0.5, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(0, -size * 0.5);
  ctx.lineTo(size * 0.3, -size * 0.3);
  ctx.lineTo(size * 0.3, size * 0.3);
  ctx.lineTo(0, size * 0.5);
  ctx.lineTo(0, size);
  ctx.stroke();

  // Draw connection nodes
  ctx.fillStyle = 'rgba(0, 255, 127, 0.9)';
  ctx.shadowColor = 'rgba(0, 255, 127, 1)';
  ctx.shadowBlur = 8;

  const nodes = [
    [-size * 0.3, -size * 0.3],
    [size * 0.3, -size * 0.3],
    [size * 0.3, size * 0.3],
    [-size * 0.3, size * 0.3]
  ];

  nodes.forEach(([nx, ny]) => {
    ctx.beginPath();
    ctx.arc(nx, ny, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};

// Function to draw neon holographic symbols for the Neon theme
const drawNeonHolo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Create shifting neon colors
  const colors = [
    'rgba(0, 255, 255, 0.8)',   // Cyan
    'rgba(255, 0, 255, 0.8)',   // Magenta
    'rgba(0, 255, 127, 0.8)'    // Spring green
  ];

  const time = Date.now() * 0.002;
  const colorIndex = Math.floor(time) % colors.length;

  ctx.strokeStyle = colors[colorIndex];
  ctx.shadowColor = colors[colorIndex];
  ctx.shadowBlur = 20;
  ctx.lineWidth = 2;

  // Draw holographic triangle pattern
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const innerRadius = size * 0.3;
    const outerRadius = size * 0.8;

    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
    ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
    ctx.stroke();
  }

  // Draw central glowing core
  ctx.fillStyle = colors[(colorIndex + 1) % colors.length];
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw neon data streams for the Neon theme
const drawNeonDataStream = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  // Create flowing data effect
  const time = Date.now() * 0.001;
  ctx.strokeStyle = 'rgba(0, 255, 127, 0.7)';
  ctx.shadowColor = 'rgba(0, 255, 127, 0.8)';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 1;

  // Draw flowing lines
  for (let i = 0; i < 5; i++) {
    const offset = (time + i * 0.5) % 1;
    const startY = -size + (offset * size * 2);

    ctx.beginPath();
    ctx.moveTo(-size * 0.8, startY);
    ctx.bezierCurveTo(
      -size * 0.4, startY + size * 0.3,
      size * 0.4, startY + size * 0.7,
      size * 0.8, startY + size
    );
    ctx.stroke();
  }

  ctx.restore();
};

// Function to draw lotus petals for zen theme
const drawZenLotus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  // Draw lotus petals in soft green tones
  const petalCount = 8;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount;
    const petalX = Math.cos(angle) * size * 0.3;
    const petalY = Math.sin(angle) * size * 0.3;

    ctx.save();
    ctx.translate(petalX, petalY);
    ctx.rotate(angle + Math.PI / 2);

    // Petal gradient
    const petalGradient = ctx.createLinearGradient(0, -size * 0.8, 0, size * 0.8);
    petalGradient.addColorStop(0, 'rgba(144, 238, 144, 0.8)'); // Light green
    petalGradient.addColorStop(0.5, 'rgba(152, 251, 152, 0.6)'); // Pale green
    petalGradient.addColorStop(1, 'rgba(144, 238, 144, 0.4)'); // Light green

    ctx.fillStyle = petalGradient;

    // Draw petal shape
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.3, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw center
  const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
  centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // White center
  centerGradient.addColorStop(1, 'rgba(240, 248, 255, 0.5)'); // Alice blue

  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Function to draw mandala patterns based on theme
const drawMandalaPattern = (ctx: CanvasRenderingContext2D, theme: string, width: number, height: number) => {
  ctx.save();

  // Set colors based on theme
  let primaryColor, secondaryColor, accentColor;

  switch (theme) {
    case 'earth':
      primaryColor = 'rgba(139, 69, 19, 0.1)';    // Brown
      secondaryColor = 'rgba(34, 139, 34, 0.1)'; // Green
      accentColor = 'rgba(210, 105, 30, 0.1)';   // Chocolate
      break;
    case 'water':
      primaryColor = 'rgba(30, 144, 255, 0.1)';  // DodgerBlue
      secondaryColor = 'rgba(0, 191, 255, 0.1)'; // DeepSkyBlue
      accentColor = 'rgba(135, 206, 250, 0.1)';  // LightSkyBlue
      break;
    case 'fire':
      primaryColor = 'rgba(255, 69, 0, 0.1)';    // Red-Orange
      secondaryColor = 'rgba(255, 140, 0, 0.1)'; // DarkOrange
      accentColor = 'rgba(255, 215, 0, 0.1)';    // Gold
      break;
    case 'shiva':
      primaryColor = 'rgba(75, 0, 130, 0.1)';    // Indigo
      secondaryColor = 'rgba(138, 43, 226, 0.1)'; // BlueViolet
      accentColor = 'rgba(147, 112, 219, 0.1)';  // MediumPurple
      break;
    case 'bhairava':
      primaryColor = 'rgba(139, 0, 0, 0.2)';     // Dark red
      secondaryColor = 'rgba(220, 20, 60, 0.2)'; // Crimson
      accentColor = 'rgba(255, 215, 0, 0.2)';    // Gold
      break;
    case 'serenity':
      primaryColor = 'rgba(179, 229, 252, 0.1)'; // Light blue
      secondaryColor = 'rgba(79, 195, 247, 0.1)'; // Medium blue
      accentColor = 'rgba(41, 182, 246, 0.1)';   // Darker blue
      break;
    case 'ganesha':
      primaryColor = 'rgba(147, 112, 219, 0.1)';  // Purple
      secondaryColor = 'rgba(255, 215, 0, 0.1)';  // Gold
      accentColor = 'rgba(150, 200, 150, 0.1)';   // Muted teal
      break;
    case 'mystery':
      primaryColor = 'rgba(34, 139, 34, 0.15)';   // Forest green
      secondaryColor = 'rgba(0, 128, 128, 0.1)';  // Teal
      accentColor = 'rgba(144, 238, 144, 0.08)';  // Light green
      break;
    case 'neon':
      primaryColor = 'rgba(0, 255, 255, 0.15)';   // Neon cyan
      secondaryColor = 'rgba(255, 0, 255, 0.12)'; // Neon magenta
      accentColor = 'rgba(0, 255, 127, 0.1)';     // Neon green
      break;
    case 'tara':
      primaryColor = 'rgba(0, 102, 255, 0.15)';   // Deep sapphire blue
      secondaryColor = 'rgba(0, 153, 255, 0.12)'; // Medium blue
      accentColor = 'rgba(204, 0, 102, 0.1)';     // Crimson accent
      break;
    default: // default/cosmic
      primaryColor = 'rgba(139, 0, 139, 0.1)';   // DarkMagenta
      secondaryColor = 'rgba(75, 0, 130, 0.1)';  // Indigo
      accentColor = 'rgba(147, 112, 219, 0.1)';  // MediumPurple
  }

  // Draw multiple concentric mandala circles
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.4;

  // Outer mandala circle
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);

  ctx.stroke();

  // Middle mandala circle
  ctx.strokeStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  // Inner mandala circle
  ctx.strokeStyle = accentColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 0.4, 0, Math.PI * 2);
  ctx.stroke();

  // Draw geometric patterns within mandala
  const layers = 3;
  for (let layer = 0; layer < layers; layer++) {
    const radius = maxRadius * (0.4 + (layer * 0.2));
    const points = 8 + layer * 4;

    ctx.strokeStyle = layer === 0 ? primaryColor : layer === 1 ? secondaryColor : accentColor;
    ctx.lineWidth = 0.5;

    // Draw polygon
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i * Math.PI * 2) / points;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw connecting lines for more intricate pattern
    if (layer > 0) {
      const innerPoints = 8 + (layer - 1) * 4;
      const innerRadius = maxRadius * (0.4 + (layer - 1) * 0.2);

      for (let i = 0; i < points; i++) {
        const angle1 = (i * Math.PI * 2) / points;
        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;

        // Connect to corresponding point in inner layer
        const innerIndex = Math.floor((i / points) * innerPoints);
        const angle2 = (innerIndex * Math.PI * 2) / innerPoints;
        const x2 = centerX + Math.cos(angle2) * innerRadius;
        const y2 = centerY + Math.sin(angle2) * innerRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
};

interface ThemedBackgroundProps {
  className?: string;
  theme: 'default' | 'earth' | 'water' | 'fire' | 'shiva' | 'bhairava' | 'serenity' | 'ganesha' | 'mahakali' | 'mystery' | 'neon' | 'lakshmi' | 'tara' | 'swamiji' | 'durga' | 'cosmos' | 'vishnu' | 'krishna';
  paused?: boolean; // NEW: Add pause prop for navigation/visibility
  slowMode?: boolean; // NEW: Reduce animation speed for meditative pages like beads
}

const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ theme: initialTheme, className, paused = false, slowMode = false }) => {
  // Speed multiplier ref: 0.25 for slow mode (4x slower), 1 for normal
  // Using ref so particle update closures can access current value
  const speedMultiplierRef = useRef(slowMode ? 0.25 : 1);
  speedMultiplierRef.current = slowMode ? 0.25 : 1;

  const defaultClasses = "fixed inset-0 pointer-events-none z-[-1]";
  const finalClasses = className || defaultClasses;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<string>(initialTheme);

  // Load Bhagwan_Krishna.png image for earth theme
  const thakurImageRef = useRef<HTMLImageElement>(null);
  const thakurImageLoadedRef = useRef(false);

  // Visibility detection and animation control
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const isAnimatingRef = useRef(true);

  // Listen for theme changes from settings
  useEffect(() => {
    const handleSettingsChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { settings, changedPath } = customEvent.detail;

      // Check if colorScheme changed
      if (changedPath && changedPath[0] === 'appearance' && changedPath[1] === 'colorScheme') {
        const newTheme = settings.appearance?.colorScheme;
        if (newTheme) {
          console.log('[ThemedBackground] Theme changed to:', newTheme);
          setTheme(newTheme);
        }
      }
    };

    window.addEventListener('sadhanaSettingsChanged', handleSettingsChanged as EventListener);
    return () => window.removeEventListener('sadhanaSettingsChanged', handleSettingsChanged as EventListener);
  }, []);

  // Also update when prop changes (for initial load)
  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  const isMobileEnvironment = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const adjustParticleCount = (count: number) => isMobileEnvironment ? Math.max(8, Math.floor(count * 0.4)) : count;
  const adjustElementCount = (count: number) => isMobileEnvironment ? Math.max(2, Math.floor(count * 0.5)) : count;

  // Add visibility change detection to pause animations when page hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      setShouldAnimate(visible && !paused);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [paused]);

  // Update shouldAnimate when paused prop changes
  useEffect(() => {
    setShouldAnimate(!paused && isVisible);
  }, [paused, isVisible]);

  useEffect(() => {
    if (theme === 'earth') {
      const img = new Image();
      img.src = '/themes/earth/assets/Bhagwan_Krishna.png';
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        thakurImageLoadedRef.current = true;
      };
      thakurImageRef.current = img;
    }
  }, [theme]);

  console.log('ThemedBackground: Rendering with theme:', theme, 'shouldAnimate:', shouldAnimate);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeConfig = getThemeById(theme);
    if (!themeConfig) return;

    // If the theme has a BackgroundComponent, we don't need to draw on canvas
    if (themeConfig.BackgroundComponent) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mandala pattern
      drawMandalaPattern(ctx, theme, canvas.width, canvas.height);

      // Draw additional elements based on theme
      if (theme === 'default') {
        drawOmSymbol(ctx, canvas.width / 2, canvas.height / 2, 100, 1);
        drawSriYantra(ctx, canvas.width / 2, canvas.height / 2, 150, 0, 1);
      } else if (theme === 'earth') {
        drawLotus(ctx, canvas.width / 2, canvas.height / 2, 150, 0, 1);
        drawEarthParticle(ctx, canvas.width / 4, canvas.height / 4, 10, 0.8);
        drawEarthParticle(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 10, 0.8);
      } else if (theme === 'water') {
        drawWaterRipple(ctx, canvas.width / 2, canvas.height / 2, 150, 1);
        drawDiya(ctx, canvas.width / 4, canvas.height / 4, 20, 1);
        drawDiya(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 20, 1);
      } else if (theme === 'fire') {
        drawFireParticle(ctx, canvas.width / 2, canvas.height / 2, 150, 1);
        drawEmber(ctx, canvas.width / 4, canvas.height / 4, 10, 0.8);
        drawEmber(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 10, 0.8);
      } else if (theme === 'shiva') {
        drawSnowflake(ctx, canvas.width / 2, canvas.height / 2, 150, 1);
        drawShivaSilhouette(ctx, canvas.width / 4, canvas.height / 4, 100, 0.8);
        drawShivaSilhouette(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 100, 0.8);
      } else if (theme === 'bhairava') {
        drawTrident(ctx, canvas.width / 2, canvas.height / 2, 150, 0, 1);
        drawSkull(ctx, canvas.width / 4, canvas.height / 4, 20, 1);
        drawSkull(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 20, 1);
        drawSacredFire(ctx, canvas.width / 2, canvas.height / 2, 150, 1);
        drawBhairavaSilhouette(ctx, canvas.width / 4, canvas.height / 4, 100, 0.8);
        drawBhairavaSilhouette(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 100, 0.8);
        drawGlowingEyes(ctx, canvas.width / 2, canvas.height / 2, 20, 1);
        drawTantricYantra(ctx, canvas.width / 4, canvas.height / 4, 100, 0, 1);
        drawTantricYantra(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 100, 0, 1);
      } else if (theme === 'serenity') {
        drawCalmingLotus(ctx, canvas.width / 2, canvas.height / 2, 150, 0, 1);
        drawGentleWave(ctx, canvas.width / 4, canvas.height / 4, 100, 0.8);
        drawGentleWave(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 100, 0.8);
        drawSoftLight(ctx, canvas.width / 2, canvas.height / 2, 100, 0.8);
        drawPeacefulMountain(ctx, canvas.width / 4, canvas.height / 4, 100, 0.8);
        drawPeacefulMountain(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 100, 0.8);
        drawTranquilRipple(ctx, canvas.width / 2, canvas.height / 2, 100, 0.8);
      } else if (theme === 'ganesha') {
        drawGaneshaHead(ctx, canvas.width / 2, canvas.height / 2, 150, 1);
        drawModak(ctx, canvas.width / 4, canvas.height / 4, 20, 1);
        drawModak(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 20, 1);
        drawGoldenParticle(ctx, canvas.width / 2, canvas.height / 2, 100, 1);
        drawGaneshaOm(ctx, canvas.width / 4, canvas.height / 4, 20, 1);
        drawGaneshaOm(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 20, 1);
        drawGaneshaTrident(ctx, canvas.width / 2, canvas.height / 2, 150, 0, 1);
      } else if (theme === 'mystery') {
        // Zen theme elements
        drawZenLotus(ctx, canvas.width / 2, canvas.height / 2, 120, 0, 0.6);
        drawBamboo(ctx, canvas.width / 6, canvas.height / 2, 200, 0.7);
        drawBamboo(ctx, (canvas.width * 5) / 6, canvas.height / 2, 180, 0.6);
        drawZenCircle(ctx, canvas.width / 3, canvas.height / 3, 80, 0.5);
        drawZenCircle(ctx, (canvas.width * 2) / 3, (canvas.height * 2) / 3, 70, 0.4);
        drawZenRipple(ctx, canvas.width / 4, (canvas.height * 3) / 4, 100, 0.6);
        drawZenRipple(ctx, (canvas.width * 3) / 4, canvas.height / 4, 80, 0.5);
        drawZenStone(ctx, canvas.width / 5, canvas.height / 5, 15, 0.8);
        drawZenStone(ctx, (canvas.width * 4) / 5, (canvas.height * 4) / 5, 12, 0.7);
      } else if (theme === 'neon') {
        // Neon cyber-tech elements
        drawNeonGrid(ctx, canvas.width / 4, canvas.height / 4, 100, 0.8);
        drawNeonGrid(ctx, (canvas.width * 3) / 4, (canvas.height * 3) / 4, 120, 0.7);
        drawNeonCircuit(ctx, canvas.width / 2, canvas.height / 2, 80, 0.9);
        drawNeonHolo(ctx, canvas.width / 3, canvas.height / 3, 60, 0, 0.8);
        drawNeonHolo(ctx, (canvas.width * 2) / 3, (canvas.height * 2) / 3, 70, Math.PI / 4, 0.7);
        drawNeonDataStream(ctx, canvas.width / 6, canvas.height / 2, 50, 0.6);
        drawNeonDataStream(ctx, (canvas.width * 5) / 6, canvas.height / 2, 60, 0.5);
      }
    };

    draw();
  }, [theme]);

  useEffect(() => {
    // If the active theme provides a BackgroundComponent in the registry, skip canvas init
    const themeDef = getThemeById(theme);
    if (themeDef && themeDef.BackgroundComponent) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle systems for each theme
    let particles: any[] = [];
    let spiritualElements: any[] = [];
    let particleCount = adjustParticleCount(100);
    let spiritualElementCount = adjustElementCount(5);

    // Initialize based on theme
    const initParticles = () => {
      particles = [];
      spiritualElements = [];

      switch (theme) {
        case 'default':
          particleCount = adjustParticleCount(150);
          spiritualElementCount = adjustElementCount(12); // Increased to include more gold elements
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 0.5,
              speedX: Math.random() * 1 - 0.5,
              speedY: Math.random() * 1 - 0.5,
              color: Math.random() > 0.5 ? '#bb86fc' : '#f5b042', // Purple and gold
              alpha: Math.random() * 0.5 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                this.alpha += 0.01 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.6) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
              }
            });
          }

          // Define mantras for golden accent elements
          {
            const sacredMantras = ['ॐ', 'ॐ नमः शिवाय', 'सत्यम्', 'शान्ति', 'आनन्द', 'प्रेम'];

            for (let i = 0; i < spiritualElementCount; i++) {
              const isGoldAccent = Math.random() > 0.65; // 35% chance for gold accent
              const elementType = Math.random() > 0.6 ? 'mantra' : (Math.random() > 0.5 ? 'om' : 'sriyantra');

              spiritualElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                speedX: (Math.random() * 0.5 - 0.25) * (isGoldAccent ? 0.3 : 0.5), // 40% slower for gold
                speedY: (Math.random() * 0.5 - 0.25) * (isGoldAccent ? 0.3 : 0.5), // 40% slower for gold
                type: elementType,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() * 0.02 - 0.01) * (isGoldAccent ? 0.5 : 1), // 50% slower rotation for gold
                alpha: Math.random() * 0.3 + 0.1,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                isGold: isGoldAccent,
                mantraText: sacredMantras[Math.floor(Math.random() * sacredMantras.length)],
                update: function () {
                  this.x += this.speedX;
                  this.y += this.speedY;
                  this.rotation += this.rotationSpeed;

                  if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                  if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                  this.alpha += 0.005 * this.pulseDirection * (this.isGold ? 0.7 : 1); // Slower pulse for gold
                  if (this.alpha <= 0.1 || this.alpha >= 0.4) {
                    this.pulseDirection *= -1;
                  }
                },
                draw: function () {
                  if (!ctx) return;

                  switch (this.type) {
                    case 'om':
                      drawOmSymbol(ctx, this.x, this.y, this.size, this.alpha, this.isGold);
                      break;
                    case 'mantra':
                      if (this.isGold) {
                        drawGoldMantra(ctx, this.x, this.y, this.size * 0.6, this.alpha, this.mantraText);
                      } else {
                        // Draw regular mantra
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.globalAlpha = this.alpha;
                        ctx.fillStyle = '#bb86fc';
                        ctx.font = `bold ${this.size * 0.6}px Arial`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(this.mantraText, 0, 0);
                        ctx.restore();
                      }
                      break;
                    case 'sriyantra':
                      drawSriYantra(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
                      break;
                  }
                }
              });
            }
          }
          break;

        case 'earth':
          particleCount = adjustParticleCount(120);
          spiritualElementCount = adjustElementCount(12); // Increased for more gold mantras

          // Load Bhagwan_Krishna.png image for earth theme
          // Image loading is handled at the component level to ensure proper scope
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 0.5 - 0.25,
              speedY: Math.random() * 0.5 - 0.25,
              alpha: Math.random() * 0.4 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;

                this.alpha += 0.005 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.5) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawEarthParticle(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }

          // Earth-themed mantras
          {
            const earthMantras = ['ॐ', 'पृथ्वी', 'भूमि', 'माता', 'प्रकृति', 'श्री राधा मदन मोहन', 'श्री राधा गोविंद देव', 'श्री राधा गोपीनाथ', 'श्री बांके बिहारी', 'श्री राधा रमण', 'श्री राधा श्यामसुंदर', 'श्री राधा दामोदर', 'श्री राधा गोखुलानंद', 'श्री राधा वल्लभ', 'श्री गोपीनाथ लाल जी'];

            for (let i = 0; i < spiritualElementCount; i++) {
              const isMantra = Math.random() > 0.4; // 60% chance for mantras
              const isGoldAccent = true; // Always use gold for mantras

              spiritualElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 40 + 30,
                speedX: (Math.random() * 0.3 - 0.15) * (isGoldAccent ? 0.3 : 1), // 70% slower for gold
                speedY: (Math.random() * 0.3 - 0.15) * (isGoldAccent ? 0.3 : 1), // 70% slower for gold
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() * 0.01 - 0.005) * (isGoldAccent ? 0.2 : 1), // 80% slower rotation
                alpha: Math.random() * 0.5 + 0.3,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                type: isMantra ? 'mantra' : 'lotus',
                isGold: isGoldAccent,
                mantraText: earthMantras[Math.floor(Math.random() * earthMantras.length)],
                update: function () {
                  this.x += this.speedX;
                  this.y += this.speedY;
                  this.rotation += this.rotationSpeed;

                  if (this.x < -50) this.x = canvas.width + 50;
                  if (this.x > canvas.width + 50) this.x = -50;
                  if (this.y < -50) this.y = canvas.height + 50;
                  if (this.y > canvas.height + 50) this.y = -50;

                  this.alpha += 0.003 * this.pulseDirection;
                  if (this.alpha <= 0.2 || this.alpha >= 0.6) {
                    this.pulseDirection *= -1;
                  }
                },
                draw: function () {
                  if (!ctx) return;

                  if (this.type === 'mantra') {
                    // Always draw mantras in gold
                    drawGoldMantra(ctx, this.x, this.y, this.size * 0.6, this.alpha, this.mantraText);
                  } else {
                    drawLotus(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
                  }
                }
              });
            }
          }
          break;

        case 'water':
          particleCount = adjustParticleCount(100);
          spiritualElementCount = adjustElementCount(10);
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              speedX: Math.random() * 0.8 - 0.4,
              speedY: Math.random() * 0.8 - 0.4,
              alpha: Math.random() * 0.5 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;

                this.alpha += 0.01 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.6) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawWaterRipple(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }

          // Water-themed mantras
          {
            const waterMantras = ['ॐ', 'वायु', 'जल', 'अमृतम्', 'प्राण'];

            for (let i = 0; i < spiritualElementCount; i++) {
              const isMantra = Math.random() > 0.5; // 50% chance for mantras
              const isGoldAccent = Math.random() > 0.75; // 25% chance for gold

              spiritualElements.push({
                x: Math.random() * canvas.width,
                y: canvas.height + 50, // Start from bottom
                size: Math.random() * 15 + 10,
                speedX: (Math.random() * 0.5 - 0.25) * (isGoldAccent ? 0.5 : 1), // 50% slower horizontal for gold
                speedY: -(Math.random() * 1 + 0.5) * (isGoldAccent ? 0.6 : 1), // 40% slower upward for gold
                alpha: Math.random() * 0.6 + 0.2,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                type: isMantra ? 'mantra' : 'diya',
                isGold: isGoldAccent,
                mantraText: waterMantras[Math.floor(Math.random() * waterMantras.length)],
                update: function () {
                  this.x += this.speedX;
                  this.y += this.speedY;

                  // Reset position when off screen
                  if (this.y < -50) {
                    this.y = canvas.height + 50;
                    this.x = Math.random() * canvas.width;
                  }

                  this.alpha += 0.005 * this.pulseDirection;
                  if (this.alpha <= 0.2 || this.alpha >= 0.8) {
                    this.pulseDirection *= -1;
                  }
                },
                draw: function () {
                  if (!ctx) return;

                  if (this.type === 'mantra') {
                    if (this.isGold) {
                      drawGoldMantra(ctx, this.x, this.y, this.size * 0.6, this.alpha, this.mantraText);
                    } else {
                      // Draw water-themed mantra
                      ctx.save();
                      ctx.translate(this.x, this.y);
                      ctx.globalAlpha = this.alpha;
                      ctx.fillStyle = '#4d9de0'; // Blue color
                      ctx.font = `bold ${this.size * 0.6}px Arial`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillText(this.mantraText, 0, 0);
                      ctx.restore();
                    }
                  } else {
                    drawDiya(ctx, this.x, this.y, this.size, this.alpha);
                  }
                }
              });
            }
          }
          break;

        case 'fire':
          particleCount = adjustParticleCount(150);
          spiritualElementCount = adjustElementCount(10);
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: canvas.height, // Start from bottom
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 2 - 1,
              speedY: -(Math.random() * 3 + 1), // Move upward
              alpha: Math.random() * 0.7 + 0.1,
              life: Math.random() * 100 + 50,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;

                // Reset particle when life ends or off screen
                if (this.life <= 0 || this.y < -20) {
                  this.x = Math.random() * canvas.width;
                  this.y = canvas.height;
                  this.life = Math.random() * 100 + 50;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawFireParticle(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }

          for (let i = 0; i < spiritualElementCount; i++) {
            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: canvas.height * 0.7 + Math.random() * canvas.height * 0.3, // Bottom third of screen
              size: Math.random() * 4 + 2,
              speedX: Math.random() * 1 - 0.5,
              speedY: -(Math.random() * 0.5 + 0.1),
              alpha: Math.random() * 0.8 + 0.2,
              life: Math.random() * 200 + 100,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;

                // Reset ember when life ends or off screen
                if (this.life <= 0 || this.y < -10) {
                  this.x = Math.random() * canvas.width;
                  this.y = canvas.height * 0.7 + Math.random() * canvas.height * 0.3;
                  this.life = Math.random() * 200 + 100;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawEmber(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }
          break;

        case 'shiva':
          particleCount = adjustParticleCount(150);
          spiritualElementCount = adjustElementCount(10);
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 1 - 0.5,
              speedY: Math.random() * 1 - 0.5,
              alpha: Math.random() * 0.5 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                this.alpha += 0.01 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.6) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                // Draw luminous snowflakes
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
              }
            });
          }

          // Add divine blizzard effect
          for (let i = 0; i < spiritualElementCount; i++) {
            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 20 + 10,
              speedX: (Math.random() * 0.5 - 0.25) * 0.5,
              speedY: (Math.random() * 0.5 - 0.25) * 0.5,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.02 - 0.01),
              alpha: Math.random() * 0.3 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              type: 'shiva-symbol',
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                this.alpha += 0.005 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.4) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawShivaSilhouette(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }
          break;

        case 'neon':
          particleCount = adjustParticleCount(100);
          spiritualElementCount = adjustElementCount(12);

          // Create neon particles (cyber grid points)
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              speedX: (Math.random() - 0.5) * 0.2,
              speedY: (Math.random() - 0.5) * 0.2,
              color: i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#FF00FF' : '#00FF80', // Cyan, Magenta, Green
              alpha: Math.random() * 0.8 + 0.2,
              pulseSpeed: Math.random() * 0.05 + 0.01,
              pulsePhase: Math.random() * Math.PI * 2,
              update: function () {
                // Slow floating motion
                this.x += this.speedX;
                this.y += this.speedY;

                // Pulse effect
                this.pulsePhase += this.pulseSpeed;

                // Reset particles that go off screen
                if (
                  this.x < -10 || this.x > canvas.width + 10 ||
                  this.y < -10 || this.y > canvas.height + 10
                ) {
                  this.x = Math.random() * canvas.width;
                  this.y = Math.random() * canvas.height;
                }
              },
              draw: function () {
                if (!ctx) return;

                // Pulsing effect
                const pulse = (Math.sin(this.pulsePhase) + 1) / 2;
                const size = this.size * (0.8 + pulse * 0.4);
                const opacity = this.alpha * (0.7 + pulse * 0.3);

                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fill();

                // Add glow effect
                const gradient = ctx.createRadialGradient(
                  this.x, this.y, 0,
                  this.x, this.y, size * 3
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.globalAlpha = opacity * 0.3;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            });
          }

          // Create data streams for the cyber theme
          for (let i = 0; i < spiritualElementCount; i++) {
            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 30 + 20,
              alpha: Math.random() * 0.3 + 0.1,
              speed: Math.random() * 2 + 1,
              symbols: [],
              update: function () {
                // Move downward like data stream
                this.y += this.speed;

                // Reset when off screen
                if (this.y > canvas.height + 50) {
                  this.y = -50;
                  this.x = Math.random() * canvas.width;
                }

                // Update symbols occasionally
                if (Math.random() < 0.05) {
                  this.symbols = Array(Math.floor(Math.random() * 5) + 3)
                    .fill(0)
                    .map(() => String.fromCharCode(0x25A0 + Math.floor(Math.random() * 6))); // Unicode box drawing chars
                }
              },
              draw: function () {
                if (!ctx) return;

                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.font = `${this.size}px monospace`;
                ctx.fillStyle = '#00FFFF';

                // Draw symbols vertically
                this.symbols.forEach((symbol, index) => {
                  ctx.fillText(symbol, this.x, this.y - index * this.size);
                });

                ctx.restore();
              }
            });
          }
          break;

        case 'bhairava':
          particleCount = adjustParticleCount(150);  // Increased from 120
          spiritualElementCount = adjustElementCount(25);  // Increased from 15

          // Create dark particles for the background
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 4 + 1,  // Slightly larger particles
              speedX: Math.random() * 1.5 - 0.75,  // Faster movement
              speedY: Math.random() * 1.5 - 0.75,
              alpha: Math.random() * 0.6 + 0.2,  // More visible particles
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              type: Math.random() > 0.7 ? 'spirit' : 'particle',  // 30% chance of being a spirit particle
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen edges
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;

                this.alpha += 0.015 * this.pulseDirection;
                if (this.alpha <= 0.2 || this.alpha >= 0.8) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;

                if (this.type === 'spirit') {
                  // Draw ethereal spirit particles
                  ctx.save();
                  ctx.translate(this.x, this.y);
                  ctx.globalAlpha = this.alpha;

                  // Create a gradient for the spirit particle
                  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // White center
                  gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.7)'); // Gold middle
                  gradient.addColorStop(1, 'rgba(139, 0, 0, 0.5)'); // Dark red, transparent

                  ctx.fillStyle = gradient;

                  // Add a subtle glow
                  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                  ctx.shadowBlur = 10;

                  ctx.beginPath();
                  ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.restore();
                } else {
                  // Draw regular dark mystical particles
                  ctx.fillStyle = 'rgba(139, 0, 0, 0.4)'; // Dark red
                  ctx.globalAlpha = this.alpha;
                  ctx.beginPath();
                  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.globalAlpha = 1;
                }
              }
            });
          }

          // Create spiritual elements for Bhairava theme
          for (let i = 0; i < spiritualElementCount; i++) {
            // Increase the probability of skulls appearing
            const elementType = Math.floor(Math.random() * 8); // 0-7 for different elements (increased from 6)

            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 25 + 15,  // Slightly larger elements
              speedX: (Math.random() * 0.5 - 0.25) * 0.7,  // Slightly faster movement
              speedY: (Math.random() * 0.5 - 0.25) * 0.7,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.03 - 0.015),  // Faster rotation
              alpha: Math.random() * 0.5 + 0.2,  // More visible elements
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              type: elementType,
              life: Math.random() * 400 + 200, // Longer life duration
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.life--;

                if (this.x < -50 || this.x > canvas.width + 50) this.speedX *= -1;
                if (this.y < -50 || this.y > canvas.height + 50) this.speedY *= -1;

                this.alpha += 0.008 * this.pulseDirection;
                if (this.alpha <= 0.2 || this.alpha >= 0.7) {
                  this.pulseDirection *= -1;
                }

                // Reset element when life ends
                if (this.life <= 0) {
                  this.x = Math.random() * canvas.width;
                  this.y = Math.random() * canvas.height;
                  this.life = Math.random() * 400 + 200;
                }
              },
              draw: function () {
                if (!ctx) return;

                switch (this.type) {
                  case 0: // Trident
                    drawTrident(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
                    break;
                  case 1: // Skull
                    drawSkull(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 2: // Sacred fire
                    drawSacredFire(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 3: // Bhairava silhouette
                    drawBhairavaSilhouette(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 4: // Glowing eyes
                    drawGlowingEyes(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 5: // Tantric yantra
                    drawTantricYantra(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
                    break;
                  case 6: // Additional skull for more frequency
                    drawSkull(ctx, this.x, this.y, this.size * 1.2, this.alpha);  // Slightly larger skull
                    break;
                  case 7: // Spirit particles
                    // Draw ethereal spirit particles
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.globalAlpha = this.alpha;

                    // Create a gradient for the spirit particle
                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // White center
                    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.6)'); // Gold middle
                    gradient.addColorStop(1, 'rgba(139, 0, 0, 0.4)'); // Dark red, transparent

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add a subtle glow
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
                    ctx.shadowBlur = 15;
                    ctx.fill();

                    ctx.restore();
                    break;
                }
              }
            });
          }
          break;

        case 'serenity':
          particleCount = adjustParticleCount(100);
          spiritualElementCount = adjustElementCount(8);

          // Create soft light particles for the background
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 0.5 - 0.25,
              speedY: Math.random() * 0.5 - 0.25,
              alpha: Math.random() * 0.4 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;

                this.alpha += 0.005 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.5) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawSoftLight(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }

          // Create calming spiritual elements
          for (let i = 0; i < spiritualElementCount; i++) {
            const elementType = Math.floor(Math.random() * 5); // 0-4 for different elements

            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 25 + 15,
              speedX: (Math.random() * 0.3 - 0.15) * 0.5,
              speedY: (Math.random() * 0.3 - 0.15) * 0.5,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.01 - 0.005),
              alpha: Math.random() * 0.3 + 0.2,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              type: elementType,
              life: Math.random() * 500 + 300, // Longer life duration
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.life--;

                if (this.x < -50 || this.x > canvas.width + 50) this.speedX *= -1;
                if (this.y < -50 || this.y > canvas.height + 50) this.speedY *= -1;

                this.alpha += 0.003 * this.pulseDirection;
                if (this.alpha <= 0.2 || this.alpha >= 0.5) {
                  this.pulseDirection *= -1;
                }

                // Reset element when life ends
                if (this.life <= 0) {
                  this.x = Math.random() * canvas.width;
                  this.y = Math.random() * canvas.height;
                  this.life = Math.random() * 500 + 300;
                }
              },
              draw: function () {
                if (!ctx) return;

                switch (this.type) {
                  case 0: // Calming lotus
                    drawCalmingLotus(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
                    break;
                  case 1: // Gentle wave
                    drawGentleWave(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 2: // Peaceful mountain
                    drawPeacefulMountain(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 3: // Tranquil ripple
                    drawTranquilRipple(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 4: // Soft light
                    drawSoftLight(ctx, this.x, this.y, this.size * 1.5, this.alpha);
                    break;
                }
              }
            });
          }
          break;

        case 'ganesha':
          particleCount = adjustParticleCount(120);
          spiritualElementCount = adjustElementCount(10);

          // Create golden particles for the background
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 0.8 - 0.4,
              speedY: Math.random() * 0.8 - 0.4,
              alpha: Math.random() * 0.6 + 0.2,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;

                this.alpha += 0.01 * this.pulseDirection;
                if (this.alpha <= 0.2 || this.alpha >= 0.8) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                drawGoldenParticle(ctx, this.x, this.y, this.size, this.alpha);
              }
            });
          }

          // Create Ganesha spiritual elements
          for (let i = 0; i < spiritualElementCount; i++) {
            const elementType = Math.floor(Math.random() * 5); // 0-4 for different elements (increased from 4)

            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 30 + 20,
              speedX: (Math.random() * 0.4 - 0.2) * 0.5,
              speedY: (Math.random() * 0.4 - 0.2) * 0.5,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.02 - 0.01),
              alpha: Math.random() * 0.5 + 0.3,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              type: elementType,
              life: Math.random() * 600 + 400, // Longer life duration
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.life--;

                if (this.x < -50 || this.x > canvas.width + 50) this.speedX *= -1;
                if (this.y < -50 || this.y > canvas.height + 50) this.speedY *= -1;

                this.alpha += 0.005 * this.pulseDirection;
                if (this.alpha <= 0.3 || this.alpha >= 0.8) {
                  this.pulseDirection *= -1;
                }

                // Reset element when life ends
                if (this.life <= 0) {
                  this.x = Math.random() * canvas.width;
                  this.y = Math.random() * canvas.height;
                  this.life = Math.random() * 600 + 400;
                }
              },
              draw: function () {
                if (!ctx) return;

                switch (this.type) {
                  case 0: // Ganesha head
                    drawGaneshaHead(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 1: // Modak
                    drawModak(ctx, this.x, this.y, this.size * 0.8, this.alpha);
                    break;
                  case 2: // Om symbol
                    drawGaneshaOm(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 3: // Golden particle cluster
                    for (let j = 0; j < 5; j++) {
                      const angle = (j * Math.PI * 2) / 5;
                      const distance = this.size * 0.5;
                      drawGoldenParticle(
                        ctx,
                        this.x + Math.cos(angle) * distance,
                        this.y + Math.sin(angle) * distance,
                        this.size * 0.3,
                        this.alpha * 0.7
                      );
                    }
                    break;
                  case 4: // Ganesha trident
                    drawGaneshaTrident(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
                    break;
                }
              }
            });
          }
          break;

        case 'mystery':
          particleCount = adjustParticleCount(80);
          spiritualElementCount = adjustElementCount(8);

          // Create gentle floating particles for zen atmosphere
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 0.4 - 0.2,
              speedY: Math.random() * 0.4 - 0.2,
              alpha: Math.random() * 0.3 + 0.1,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              color: Math.random() > 0.6 ? 'rgba(34, 139, 34, 0.6)' : Math.random() > 0.5 ? 'rgba(0, 128, 128, 0.5)' : 'rgba(144, 238, 144, 0.4)',
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;

                this.alpha += 0.003 * this.pulseDirection;
                if (this.alpha <= 0.1 || this.alpha >= 0.4) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
              }
            });
          }

          // Create zen spiritual elements
          for (let i = 0; i < spiritualElementCount; i++) {
            const elementType = Math.floor(Math.random() * 6); // 0-5 for different zen elements

            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 40 + 20,
              speedX: (Math.random() * 0.2 - 0.1) * 0.3,
              speedY: (Math.random() * 0.2 - 0.1) * 0.3,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.005 - 0.0025),
              alpha: Math.random() * 0.4 + 0.2,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              type: elementType,
              life: Math.random() * 800 + 600, // Long life for peaceful elements
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.life--;

                if (this.x < -100 || this.x > canvas.width + 100) this.speedX *= -1;
                if (this.y < -100 || this.y > canvas.height + 100) this.speedY *= -1;

                this.alpha += 0.002 * this.pulseDirection;
                if (this.alpha <= 0.2 || this.alpha >= 0.6) {
                  this.pulseDirection *= -1;
                }

                // Reset element when life ends
                if (this.life <= 0) {
                  this.x = Math.random() * canvas.width;
                  this.y = Math.random() * canvas.height;
                  this.life = Math.random() * 800 + 600;
                }
              },
              draw: function () {
                if (!ctx) return;

                switch (this.type) {
                  case 0: // Zen lotus
                    drawZenLotus(ctx, this.x, this.y, this.size * 0.8, this.rotation, this.alpha);
                    break;
                  case 1: // Bamboo stalk
                    drawBamboo(ctx, this.x, this.y, this.size * 3, this.alpha * 0.6);
                    break;
                  case 2: // Zen circle (enso)
                    drawZenCircle(ctx, this.x, this.y, this.size * 0.6, this.alpha);
                    break;
                  case 3: // Water ripples
                    drawZenRipple(ctx, this.x, this.y, this.size, this.alpha);
                    break;
                  case 4: // Zen stone
                    drawZenStone(ctx, this.x, this.y, this.size * 0.4, this.alpha);
                    break;
                  case 5: // Cluster of small ripples
                    for (let j = 0; j < 3; j++) {
                      const angle = (j * Math.PI * 2) / 3;
                      const distance = this.size * 0.3;
                      drawZenRipple(
                        ctx,
                        this.x + Math.cos(angle) * distance,
                        this.y + Math.sin(angle) * distance,
                        this.size * 0.4,
                        this.alpha * 0.7
                      );
                    }
                    break;
                }
              }
            });
          }
          break;


        case 'durga':
          particleCount = adjustParticleCount(100);
          spiritualElementCount = adjustElementCount(8);

          // Create Durga-themed particles
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: Math.random() * 1 - 0.5,
              speedY: Math.random() * 1 - 0.5,
              color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.random() * 0.5 + 0.3})`,
              alpha: Math.random() * 0.5 + 0.2,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.alpha += 0.005 * this.pulseDirection;

                if (this.alpha <= 0.2 || this.alpha >= 0.7) {
                  this.pulseDirection *= -1;
                }

                // Reset particles that go off screen
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
              },
              draw: function () {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            });
          }

          // Create Durga-themed spiritual elements with animated Sanskrit text
          const durgaMantras = ['शक्ति', 'महिषासुरमर्दिनी', 'अम्बा', 'दुर्गा', 'भवानी'];

          for (let i = 0; i < spiritualElementCount; i++) {
            spiritualElements.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 20 + 15,
              speedX: (Math.random() * 0.5 - 0.25),
              speedY: (Math.random() * 0.5 - 0.25),
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.02 - 0.01),
              alpha: Math.random() * 0.4 + 0.3,
              pulseDirection: Math.random() > 0.5 ? 1 : -1,
              mantraText: durgaMantras[Math.floor(Math.random() * durgaMantras.length)],
              update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                this.alpha += 0.005 * this.pulseDirection;
                if (this.alpha <= 0.3 || this.alpha >= 0.7) {
                  this.pulseDirection *= -1;
                }
              },
              draw: function () {
                if (!ctx) return;

                // Draw animated Sanskrit text with giggling effect
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = '#ff6347'; // Tomato red color
                ctx.font = `bold ${this.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Apply giggling animation effect
                const time = Date.now() / 1000;
                const offsetX = Math.sin(time * 2 + this.x) * 2;
                const offsetY = Math.cos(time * 1.5 + this.y) * 2;
                const scale = 1 + Math.sin(time * 3 + this.rotation) * 0.05;

                ctx.translate(offsetX, offsetY);
                ctx.scale(scale, scale);

                ctx.fillText(this.mantraText, 0, 0);
                ctx.restore();
              }
            });
          }
          break;
      }
    };

    initParticles();

    // Nebula effect based on theme
    const drawNebula = () => {
      if (!ctx) return;

      let gradient;

      switch (theme) {
        case 'default':
          // Cosmic nebula with deep space colors
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(26, 17, 56, 0.2)'); // Deep indigo
          gradient.addColorStop(0.5, 'rgba(139, 0, 139, 0.1)'); // Deep purple
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;

        case 'earth':
          // Earthy tones nebula
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(46, 30, 14, 0.2)'); // Dark brown
          gradient.addColorStop(0.5, 'rgba(76, 51, 26, 0.1)'); // Earth brown
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;

        case 'water':
          // Water tones nebula
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(13, 47, 92, 0.2)'); // Deep blue
          gradient.addColorStop(0.5, 'rgba(30, 100, 180, 0.1)'); // Water blue
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;

        case 'fire':
          // Fire tones nebula
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(139, 0, 0, 0.2)'); // Deep red
          gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.1)'); // Red-orange
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;

        case 'shiva':
          // Cosmic nebula with deep space colors for Shiva theme
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(26, 17, 56, 0.2)'); // Deep indigo
          gradient.addColorStop(0.5, 'rgba(139, 0, 139, 0.1)'); // Deep purple
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;

        case 'bhairava':
          // Dark, mystical nebula with deep crimson and indigo tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(139, 0, 0, 0.4)'); // Dark red - increased opacity
          gradient.addColorStop(0.3, 'rgba(75, 0, 130, 0.3)'); // Indigo
          gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)'); // Darker black
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;
        case 'serenity':
          // Calming nebula with soft blue and teal tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(179, 229, 252, 0.2)'); // Light blue
          gradient.addColorStop(0.5, 'rgba(79, 195, 247, 0.1)'); // Medium blue
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent
          break;
        case 'ganesha':
          // Divine nebula with deep purple and gold tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(147, 112, 219, 0.3)'); // Purple
          gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)'); // Gold
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent
          break;
        case 'mystery':
          // Zen nebula with soft green and teal tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(34, 139, 34, 0.15)'); // Forest green
          gradient.addColorStop(0.5, 'rgba(0, 128, 128, 0.1)'); // Teal
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent
          break;
        case 'neon':
          // Neon cyber nebula with electric tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(0, 255, 255, 0.18)'); // Neon cyan
          gradient.addColorStop(0.4, 'rgba(255, 0, 255, 0.12)'); // Neon magenta
          gradient.addColorStop(0.8, 'rgba(0, 255, 127, 0.08)'); // Neon green
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent
          break;

        case 'tara':
          // Tara nebula with deep blue-black cremation ground tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(0, 26, 102, 0.25)'); // Deep sapphire blue
          gradient.addColorStop(0.5, 'rgba(0, 13, 51, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black void
          break;
        case 'durga':
          // Durga nebula with deep red and orange tones
          gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
          );
          gradient.addColorStop(0, 'rgba(139, 0, 0, 0.3)'); // Deep red
          gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.2)'); // Red-orange
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Black
          break;
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;

      // Only update and draw if shouldAnimate is true
      // Continue requesting animation frame regardless to avoid losing it
      if (!shouldAnimate) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Clear with a dark background appropriate to theme
      let bgColor = 'rgba(10, 5, 20, 0.1)'; // Default dark cosmic
      switch (theme) {
        case 'earth':
          bgColor = 'rgba(15, 10, 5, 0.1)'; // Dark earth
          break;
        case 'water':
          bgColor = 'rgba(5, 10, 20, 0.1)'; // Dark water
          break;
        case 'fire':
          bgColor = 'rgba(20, 5, 5, 0.1)'; // Dark fire
          break;
        case 'shiva':
          bgColor = 'rgba(10, 5, 20, 0.1)'; // Same as default for Shiva
          break;
        case 'bhairava':
          bgColor = 'rgba(5, 0, 0, 0.3)'; // Very dark red for Bhairava - increased opacity
          break;
        case 'serenity':
          bgColor = 'rgba(5, 10, 20, 0.05)'; // Very light dark blue for Serenity
          break;
        case 'ganesha':
          bgColor = 'rgba(20, 5, 30, 0.1)'; // Deep purple for Ganesha
          break;
        case 'mystery':
          bgColor = 'rgba(5, 20, 10, 0.08)'; // Dark green for zen mystery
          break;
        case 'neon':
          bgColor = 'rgba(2, 8, 12, 0.15)'; // Very dark cyber background with cyan tint
          break;

        case 'tara':
          bgColor = 'rgba(0, 5, 20, 0.15)'; // Deep blue-black cremation ground
          break;
        case 'durga':
          bgColor = 'rgba(40, 0, 0, 0.1)'; // Dark red for Durga
          break;
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula
      drawNebula();

      // Draw mandala pattern
      drawMandalaPattern(ctx, theme, canvas.width, canvas.height);

      // Update and draw particles (apply speed multiplier)
      const speedMult = speedMultiplierRef.current;
      particles.forEach(particle => {
        // Scale movement by speed multiplier
        const origUpdate = particle.update;
        particle.x += particle.speedX * speedMult;
        particle.y += particle.speedY * speedMult;
        if (particle.rotation !== undefined) {
          particle.rotation += (particle.rotationSpeed || 0) * speedMult;
        }
        if (particle.alpha !== undefined && particle.pulseDirection !== undefined) {
          particle.alpha += 0.01 * particle.pulseDirection * speedMult;
          if (particle.alpha <= 0.1 || particle.alpha >= 0.6) {
            particle.pulseDirection *= -1;
          }
        }
        // Boundary checks
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        particle.draw();
      });

      // Update and draw spiritual elements (apply speed multiplier)
      spiritualElements.forEach(element => {
        element.x += element.speedX * speedMult;
        element.y += element.speedY * speedMult;
        if (element.rotation !== undefined) {
          element.rotation += (element.rotationSpeed || 0) * speedMult;
        }
        if (element.alpha !== undefined && element.pulseDirection !== undefined) {
          const pulseSpeed = element.isGold ? 0.005 * 0.7 : 0.005;
          element.alpha += pulseSpeed * element.pulseDirection * speedMult;
          if (element.alpha <= 0.1 || element.alpha >= 0.4) {
            element.pulseDirection *= -1;
          }
        }
        // Boundary checks
        if (element.x < 0 || element.x > canvas.width) element.speedX *= -1;
        if (element.y < 0 || element.y > canvas.height) element.speedY *= -1;
        element.draw();
      });

      // Draw Bhagwan_Krishna.png image in the right bottom corner for earth theme
      if (theme === 'earth' && thakurImageLoadedRef.current && thakurImageRef.current) {
        const canvas = canvasRef.current;
        if (canvas) {
          const imageSize = Math.min(canvas.width * 0.6, canvas.height * 0.6); // Max 60% of canvas dimensions (much bigger)
          const x = canvas.width - imageSize - 20; // Position in the right corner with some margin
          const y = canvas.height - imageSize; // Position at the very bottom (no margin)

          ctx.save();
          ctx.globalAlpha = 0.5; // More transparent
          ctx.drawImage(thakurImageRef.current, x, y, imageSize, imageSize);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      // Clear particles on cleanup
      particles = [];
      spiritualElements = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(`[ThemedBackground] Cleaned up animation for theme: ${theme}`);
    };
  }, [theme, shouldAnimate]);

  // If the theme registered a BackgroundComponent, render it
  const registered = getThemeById(theme);
  console.log('ThemedBackground: Looking for theme:', theme);
  console.log('ThemedBackground: Found registered theme:', registered);

  if (registered && registered.BackgroundComponent) {
    const BackgroundComp = registered.BackgroundComponent;
    console.log('ThemedBackground: Using registered BackgroundComponent for theme:', theme, BackgroundComp);
    return (
      <ErrorBoundary fallback={<canvas ref={canvasRef} className={finalClasses} />}>
        <React.Suspense fallback={<canvas ref={canvasRef} className={finalClasses} />}>
          <BackgroundComp className={finalClasses} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  console.log('ThemedBackground: Using fallback canvas background for theme:', theme);

  return (
    <canvas
      ref={canvasRef}
      className={finalClasses}
    />
  );
};

export default React.memo(ThemedBackground);
