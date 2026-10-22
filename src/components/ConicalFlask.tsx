import React from 'react';

interface ConicalFlaskProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  bubbles?: boolean;
}

export const ConicalFlask: React.FC<ConicalFlaskProps> = ({
  className = '',
  size = 'md',
  bubbles = true,
}) => {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.25 : 1;
  const width = 240 * scale;
  const height = 340 * scale;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Volumetric Glowing Aura */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#48B8CE]/15 blur-3xl pointer-events-none"
      />

      <svg
        width={width}
        height={height}
        viewBox="0 0 240 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-[0_25px_35px_rgba(3,21,29,0.6)]"
      >
        <defs>
          {/* Glass Gradient */}
          <linearGradient id="glassWall" x1="20" y1="20" x2="220" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#A9C2CE" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#48B8CE" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>

          {/* Liquid Gradient */}
          <linearGradient id="liquidGrad" x1="120" y1="160" x2="120" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#48B8CE" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#087A91" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#073849" stopOpacity="0.6" />
          </linearGradient>

          {/* Cap Metal Gradient */}
          <linearGradient id="chromeCap" x1="90" y1="10" x2="150" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#556570" />
            <stop offset="30%" stopColor="#E2EDF2" />
            <stop offset="55%" stopColor="#8297A4" />
            <stop offset="85%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#3F4D56" />
          </linearGradient>

          {/* Collar Metal */}
          <linearGradient id="chromeRing" x1="85" y1="45" x2="155" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#44515A" />
            <stop offset="40%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#7E93A0" />
            <stop offset="100%" stopColor="#2E3940" />
          </linearGradient>

          {/* Meniscus curvature */}
          <radialGradient id="meniscusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#48B8CE" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* 1. Chrome Cap */}
        <rect x="98" y="12" width="44" height="34" rx="2" fill="url(#chromeCap)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <line x1="108" y1="14" x2="108" y2="44" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <line x1="132" y1="14" x2="132" y2="44" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

        {/* 2. Glass Flange / Ring */}
        <ellipse cx="120" cy="50" rx="26" ry="6" fill="url(#chromeRing)" />
        <ellipse cx="120" cy="50" rx="26" ry="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

        {/* 3. Liquid Body Fill */}
        <path
          d="M96 160 Q120 166 144 160 L208 300 Q205 318 185 320 L55 320 Q35 318 32 300 Z"
          fill="url(#liquidGrad)"
        />

        {/* Meniscus surface line */}
        <ellipse cx="120" cy="160" rx="24" ry="4" fill="url(#meniscusGlow)" />
        <path d="M96 160 Q120 164 144 160" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />

        {/* Bubbles in liquid */}
        {bubbles && (
          <g opacity="0.75">
            <circle cx="105" cy="270" r="3.5" fill="#FFFFFF" fillOpacity="0.6" stroke="#48B8CE" strokeWidth="0.5" />
            <circle cx="140" cy="285" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="125" cy="235" r="2.5" fill="#FFFFFF" fillOpacity="0.7" />
            <circle cx="85" cy="295" r="1.5" fill="#FFFFFF" fillOpacity="0.5" />
            <circle cx="160" cy="260" r="4" fill="#FFFFFF" fillOpacity="0.6" stroke="#48B8CE" strokeWidth="0.5" />
            <circle cx="115" cy="195" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        )}

        {/* 4. Flask Outer Glass Outline (Erlenmeyer Form) */}
        <path
          d="M102 54 L102 120 L30 300 C24 316 38 326 56 326 L184 326 C202 326 216 316 210 300 L138 120 L138 54 Z"
          fill="url(#glassWall)"
          stroke="rgba(255, 255, 255, 0.65)"
          strokeWidth="2.5"
        />

        {/* Heavy Glass Base Wall */}
        <path
          d="M34 304 C40 322 55 326 70 326 L170 326 C185 326 200 322 206 304 C190 314 175 318 160 318 L80 318 C65 318 50 314 34 304 Z"
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* 5. Etched Volumetric Laboratory Markings */}
        <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1">
          <line x1="88" y1="180" x2="105" y2="180" />
          <text x="110" y="183" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="JetBrains Mono">200 ML</text>

          <line x1="79" y1="215" x2="98" y2="215" />
          <text x="103" y="218" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="JetBrains Mono">150 ML</text>

          <line x1="70" y1="250" x2="92" y2="250" />
          <text x="97" y="253" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="JetBrains Mono">100 ML</text>

          <line x1="60" y1="285" x2="85" y2="285" />
          <text x="90" y="288" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="JetBrains Mono">50 ML</text>
        </g>

        {/* 6. CHEM BROS Bio-Propeller Clover Emblem (Reference Logo) */}
        <g transform="translate(120, 260) scale(0.4)" opacity="0.85">
          <path
            d="M0 -30 C12 -30 20 -15 15 0 C25 -5 40 0 38 18 C35 32 15 35 0 20 C-15 35 -35 32 -38 18 C-40 0 -25 -5 -15 0 C-20 -15 -12 -30 0 -30 Z"
            fill="#FFFFFF"
          />
          <circle cx="0" cy="0" r="4" fill="#087A91" />
        </g>
        <text x="120" y="280" fill="rgba(255,255,255,0.85)" fontSize="9" fontWeight="600" letterSpacing="2" textAnchor="middle" fontFamily="Kallisto, Manrope, sans-serif">
          CHEM BROS
        </text>

        {/* 7. Glass Specular Highlights */}
        <path d="M104 56 L104 122 L36 295" stroke="rgba(255,255,255,0.75)" strokeWidth="3" strokeLinecap="round" />
        <path d="M109 60 L109 118 L44 285" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <path d="M136 56 L136 122 L204 295" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Surface Reflection Line */}
      <div className="w-56 h-1.5 -mt-2 bg-gradient-to-r from-transparent via-[#48B8CE]/50 to-transparent blur-[2px]" />
    </div>
  );
};
