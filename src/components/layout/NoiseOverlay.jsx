import React from 'react';
import { createPortal } from 'react-dom';

export default function NoiseOverlay() {
  // A clean, mathematically generated SVG fractal noise texture
  const noiseSvg = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.85" 
          numOctaves="3" 
          stitchTiles="stitch" 
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  `;

  // Encode as a data URI so we can use it as a background image
  // We use btoa for base64 encoding to ensure valid URL formatting
  const encodedNoise = `data:image/svg+xml;base64,${btoa(noiseSvg)}`;

  const content = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999, // Sits above absolutely everything (alerts are 99999)
        backgroundImage: `url(${encodedNoise})`,
        opacity: 0.05, // Extremely subtle so it doesn't distract
        mixBlendMode: 'multiply' // Blends organically into underlying colors
      }}
      aria-hidden="true"
    />
  );

  // Fallback if document.body isn't ready (e.g. during SSR if ever added)
  if (typeof document === 'undefined') return null;
  
  return createPortal(content, document.body);
}
