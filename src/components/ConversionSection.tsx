import React from 'react';
import WaterRippleImage from './WaterRippleImage';
import { Fragrance } from '../data/fragrances';

interface ConversionSectionProps {
  onSelectFragrance?: (fragrance: Fragrance) => void;
  onAddToCart?: (fragrance: Fragrance, size: number) => void;
}

export const ConversionSection: React.FC<ConversionSectionProps> = () => {
  return (
    <section 
      id="ripple-experience" 
      className="relative w-full min-h-[85vh] lg:min-h-screen bg-conversion-gradient flex items-center justify-center overflow-hidden border-b border-[#0A2533]/10"
    >
      {/* Centered Single Image with Water Ripple WebGL Shader Effect */}
      <div className="relative z-10 w-full h-full min-h-[85vh] lg:min-h-screen flex items-center justify-center">
        <WaterRippleImage
          src="/images/ripplewater.png"
          surfaceDistortion={0.022}
          waterDistortion={0.01}
          illumination={0.08}
          className="w-full h-full min-h-[85vh] lg:min-h-screen"
        />
      </div>
    </section>
  );
};
