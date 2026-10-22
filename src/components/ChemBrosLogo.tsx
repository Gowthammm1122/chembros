import React from 'react';

interface ChemBrosLogoProps {
  variant?: 'black' | 'white' | 'cyan' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const ChemBrosLogo: React.FC<ChemBrosLogoProps> = ({
  variant = 'auto',
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  // Determine color palette based on variant
  const isWhite = variant === 'white';
  const isCyan = variant === 'cyan';
  const isBlack = variant === 'black';

  const primaryColor = isWhite ? '#FFFFFF' : isCyan ? '#48B8CE' : '#0A2533';
  const accentColor = isWhite ? '#DCE3E8' : isCyan ? '#087A91' : '#087A91';
  const tagColor = isWhite ? '#A9C2CE' : '#5A7785';

  const sizeDimensions = {
    sm: { iconSize: 22, textSize: 'text-sm', gap: 'gap-2', letterSpacing: 'tracking-[0.2em]' },
    md: { iconSize: 28, textSize: 'text-base', gap: 'gap-2.5', letterSpacing: 'tracking-[0.22em]' },
    lg: { iconSize: 36, textSize: 'text-xl', gap: 'gap-3', letterSpacing: 'tracking-[0.25em]' },
    xl: { iconSize: 52, textSize: 'text-3xl', gap: 'gap-4', letterSpacing: 'tracking-[0.28em]' },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeDimensions.gap} select-none group ${className}`}>
      {/* High-Fidelity Vector Chemistry Flask / Molecular Emblem */}
      <svg
        width={sizeDimensions.iconSize}
        height={sizeDimensions.iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-500 group-hover:scale-105"
      >
        {/* Left Flask (tilted slightly right) */}
        <path
          d="M26 12 H22 V18 L12 36 C10.5 38.7 12.5 42 15.6 42 H30.4 C33.5 42 35.5 38.7 34 36 L26 21 V12"
          stroke={primaryColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Liquid level inside left flask */}
        <path
          d="M15 34 C19 32 23 35 29 33 L32 38 H14 L15 34 Z"
          fill={accentColor}
          fillOpacity="0.45"
        />

        {/* Right Flask (clinking / interlocked with left flask) */}
        <path
          d="M38 12 H42 V18 L52 36 C53.5 38.7 51.5 42 48.4 42 H33.6 C30.5 42 28.5 38.7 30 36 L38 21 V12"
          stroke={primaryColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Liquid level inside right flask */}
        <path
          d="M49 34 C45 32 41 35 35 33 L32 38 H50 L49 34 Z"
          fill={primaryColor}
          fillOpacity="0.25"
        />

        {/* Effervescent reaction bubbles rising from the union */}
        <circle cx="32" cy="18" r="2.2" fill={accentColor} />
        <circle cx="28" cy="10" r="1.6" fill={primaryColor} />
        <circle cx="36" cy="8" r="1.8" fill={accentColor} />
        <circle cx="32" cy="4" r="1.4" fill={primaryColor} />

        {/* Subtle ground reflection indicator */}
        <line x1="18" y1="46" x2="46" y2="46" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
      </svg>

      {/* Brand Typographic Wordmark */}
      <div className="flex flex-col">
        <span
          className={`font-display font-bold ${sizeDimensions.textSize} ${sizeDimensions.letterSpacing} uppercase leading-none transition-colors duration-300`}
          style={{ color: primaryColor }}
        >
          CHEM BROS
        </span>
        {showTagline && (
          <span
            className="font-mono text-[9px] tracking-[0.25em] uppercase mt-1 leading-none font-medium"
            style={{ color: tagColor }}
          >
            PARFUMS LABORATORY
          </span>
        )}
      </div>
    </div>
  );
};
