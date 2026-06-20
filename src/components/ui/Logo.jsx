import React from 'react';

export default function Logo({ 
  iconSize = 40, 
  showWordmark = true, 
  variant = 'dark', // 'dark' (navy) or 'light' (white)
  className = ''
}) {
  const primaryColor = variant === 'dark' ? 'var(--color-primary)' : 'var(--color-white)';
  const secondaryColor = variant === 'dark' ? 'var(--color-secondary)' : 'var(--color-white)';

  // Reconstructed bird icon from potrace SVG, ignoring the traced text paths 
  // to render crisp, clean text instead.
  const BirdPaths = (
    <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
      <path d="M1854 3869 c-52 -64 -94 -204 -94 -312 0 -106 15 -168 65 -273 114 -238 411 -434 655 -434 33 0 60 3 60 8 -1 4 -33 30 -72 57 -39 28 -112 89 -163 137 -246 233 -395 489 -428 740 -10 70 -15 87 -23 77z"/>
      <path d="M3682 3365 c-211 -87 -274 -119 -306 -154 l-19 -21 109 0 109 0 55 50 c55 50 90 64 90 34 0 -9 -29 -46 -66 -84 l-65 -68 6 -78 c11 -136 11 -137 51 -74 39 61 247 470 242 475 -2 2 -94 -34 -206 -80z"/>
      <path d="M1660 3259 c0 -59 37 -186 77 -261 102 -196 328 -318 561 -306 48 3 101 11 117 17 l30 13 -45 15 c-84 27 -291 132 -390 197 -124 82 -224 176 -294 279 -55 80 -56 81 -56 46z"/>
      <path d="M2516 3190 c-71 -28 -74 -36 -19 -49 73 -19 111 -47 157 -120 80 -125 158 -172 283 -172 93 0 117 16 38 24 -108 11 -204 92 -251 210 -45 114 -110 147 -208 107z"/>
      <path d="M3378 3006 c-54 -52 -98 -99 -98 -104 0 -5 6 -15 14 -21 21 -18 39 -5 139 97 61 63 85 95 81 106 -12 31 -40 15 -136 -78z"/>
      <path d="M3109 2774 c-181 -183 -370 -311 -584 -396 -27 -11 -70 -39 -96 -63 -25 -23 -60 -50 -78 -60 -55 -28 -28 -27 60 3 294 100 595 292 722 461 39 52 74 127 64 138 -2 1 -41 -36 -88 -83z"/>
      <path d="M1840 2699 c0 -27 156 -165 225 -199 68 -34 73 -35 190 -35 110 0 124 2 175 27 31 15 71 42 89 60 l34 33 -159 6 c-178 8 -301 30 -454 85 -110 39 -100 37 -100 23z"/>
      <path d="M2720 2301 c-105 -82 -269 -254 -329 -345 -87 -134 -114 -236 -87 -328 8 -30 24 -62 33 -71 17 -15 24 -3 122 215 119 262 179 371 259 476 68 88 86 112 81 111 -2 0 -38 -26 -79 -58z"/>
      <path d="M2317 2123 c-134 -59 -299 -116 -505 -172 -165 -45 -172 -49 -150 -63 55 -36 123 -53 203 -52 94 1 166 24 264 83 105 64 305 232 290 244 -2 2 -48 -16 -102 -40z"/>
    </g>
  );

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      {/* Icon */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 500 500" 
        style={{ color: secondaryColor }}
      >
        {BirdPaths}
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="d-flex flex-column justify-content-center mt-2">
          <span 
            style={{ 
              fontFamily: 'var(--font-family-body)', 
              fontWeight: 800, 
              fontSize: `${iconSize * 0.32}px`, 
              color: primaryColor,
              lineHeight: 1,
              letterSpacing: '3px'
            }}
          >
            FREEDO·M
          </span>
          <span 
            style={{ 
              fontFamily: 'var(--font-family-body)', 
              fontWeight: 700, 
              fontSize: `${iconSize * 0.20}px`, 
              color: primaryColor,
              lineHeight: 1,
              letterSpacing: '5px',
              textAlign: 'center',
              marginTop: '4px'
            }}
          >
            HAUTE
          </span>
        </div>
      )}
    </div>
  );
}
