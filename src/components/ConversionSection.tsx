import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      className="relative w-full min-h-[85vh] lg:min-h-screen bg-transparent flex items-center justify-center overflow-hidden border-b border-[#0A2533]/10"
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

        <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-6 text-center sm:bottom-12">
          <p className="font-display text-2xl text-white drop-shadow-md sm:text-3xl">
            Find your molecule now
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 border border-white/50 bg-[#0A2533]/80 px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-[#48B8CE] hover:bg-[#087A91]"
          >
            <span>Explore fragrances</span>
            <ArrowRight className="h-4 w-4 text-[#48B8CE] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
