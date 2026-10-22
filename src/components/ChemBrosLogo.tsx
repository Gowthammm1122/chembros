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
  const isDark = variant === 'black';

  // Dimension scaling for the official Chem Bros logo mark (303x189 ~ 1.6:1 aspect ratio)
  const sizeClasses = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-10 sm:h-12 w-auto',
    lg: 'h-14 sm:h-16 w-auto',
    xl: 'h-20 sm:h-24 w-auto',
  }[size];

  const logoSrc = isDark ? '/logo/logo-chembros-dark.png' : '/logo/logo-chembros-white.png';

  return (
    <div className={`inline-flex items-center select-none group ${className}`}>
      <img
        src={logoSrc}
        alt="CHEM BROS"
        className={`${sizeClasses} object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
};
