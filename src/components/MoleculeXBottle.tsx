import React from 'react';
import { Fragrance } from '../data/fragrances';

interface MoleculeXBottleProps {
  fragrance?: Fragrance;
  name?: string;
  coordinates?: string;
  subname?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showPedestal?: boolean;
  pedestalHeight?: number | string;
  pedestalClassName?: string;
  extendToBottom?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  visualId?: string;
  svgId?: string;
}

export const MoleculeXBottle: React.FC<MoleculeXBottleProps> = ({
  fragrance,
  name,
  coordinates = `10°09'34.1"N 77°54'11.3"E`,
  subname = 'CHEMICAL BROTHERS',
  size = 'hero',
  className = '',
  showPedestal = false,
  pedestalHeight = 65,
  pedestalClassName = '',
  extendToBottom = false,
  interactive = true,
  onClick,
  visualId,
  svgId,
}) => {
  const bottleName = name || (fragrance ? fragrance.name : 'MOLECULE X');
  const liquidGradId = fragrance ? `liquid-grad-${fragrance.id}` : 'perfumeLiquid';

  // Scaling factors calibrated for multi-bottle and single-bottle layouts
  const scale = size === 'sm' ? 0.45 : size === 'md' ? 0.58 : size === 'hero' ? 0.68 : 0.95;
  const width = 380 * scale;
  const height = 500 * scale;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none ${
        interactive ? 'group cursor-pointer' : ''
      } ${className}`}
    >
      {/* The Conical Flacon SVG — All gradient glow stays strictly inside the glass flacon */}
      <div
        id={visualId}
        className="bottle-visual relative transition-transform duration-500 ease-out group-hover:-translate-y-2"
      >
        <svg
          id={svgId}
          width={width}
          height={height}
          viewBox="0 0 400 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
        >
          <defs>
            {/* 1. Wood Grain Texture Pattern for Flared Cap */}
            <pattern id="woodGrain" width="40" height="120" patternUnits="userSpaceOnUse">
              <rect width="40" height="120" fill="#151719" />
              {/* Organic wood grain lines */}
              <path d="M5 0 Q8 60 4 120" stroke="#252A2E" strokeWidth="1.2" fill="none" opacity="0.8" />
              <path d="M12 0 Q10 40 14 120" stroke="#0D0E10" strokeWidth="1.5" fill="none" opacity="0.9" />
              <path d="M22 0 Q26 70 20 120" stroke="#2D3338" strokeWidth="1.3" fill="none" opacity="0.75" />
              <path d="M32 0 Q30 50 35 120" stroke="#0B0C0E" strokeWidth="1.8" fill="none" opacity="0.9" />
              <path d="M18 0 Q15 65 19 120" stroke="#3A4248" strokeWidth="0.8" fill="none" opacity="0.6" />
              <path d="M38 0 Q42 55 37 120" stroke="#22262A" strokeWidth="1.1" fill="none" opacity="0.7" />
            </pattern>

            {/* Cap Gradient to give 3D cylindrical lighting */}
            <linearGradient id="cap3DLighting" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0A0B0D" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#2A3036" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#4A525A" stopOpacity="0.15" />
              <stop offset="75%" stopColor="#1E2226" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#070809" stopOpacity="0.9" />
            </linearGradient>

            {/* Cap Top Chamfer */}
            <radialGradient id="capTopSheen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#32383F" />
              <stop offset="70%" stopColor="#181B1E" />
              <stop offset="100%" stopColor="#0B0C0E" />
            </radialGradient>

            {/* Chrome Collar Neck */}
            <linearGradient id="silverNeck" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4F5D66" />
              <stop offset="25%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#7E939E" />
              <stop offset="80%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#3A444B" />
            </linearGradient>

            {/* Crystal Glass Wall Fill */}
            <linearGradient id="conicalGlass" x1="50" y1="200" x2="350" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#E6F2F5" stopOpacity="0.04" />
              <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>

            {/* Liquid Fill Inside Glass — Unique Per Fragrance */}
            <linearGradient id={liquidGradId} x1="200" y1="230" x2="200" y2="475" gradientUnits="userSpaceOnUse">
              {fragrance?.id === 'molecule-j' ? (
                <>
                  <stop offset="0%" stopColor="#FFF4D0" stopOpacity="0.32" />
                  <stop offset="35%" stopColor="#FBD77E" stopOpacity="0.48" />
                  <stop offset="75%" stopColor="#E2A632" stopOpacity="0.62" />
                  <stop offset="100%" stopColor="#BA7B14" stopOpacity="0.78" />
                </>
              ) : fragrance?.id === 'molecule-t' ? (
                <>
                  <stop offset="0%" stopColor="#E6F7F0" stopOpacity="0.28" />
                  <stop offset="35%" stopColor="#B3E5D3" stopOpacity="0.45" />
                  <stop offset="75%" stopColor="#70B89C" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#459475" stopOpacity="0.75" />
                </>
              ) : fragrance?.id === 'molecule-r' ? (
                <>
                  <stop offset="0%" stopColor="#FFEADA" stopOpacity="0.35" />
                  <stop offset="35%" stopColor="#F99F55" stopOpacity="0.52" />
                  <stop offset="75%" stopColor="#DE6422" stopOpacity="0.66" />
                  <stop offset="100%" stopColor="#AC420C" stopOpacity="0.8" />
                </>
              ) : fragrance?.id === 'molecule-x' ? (
                <>
                  <stop offset="0%" stopColor="#F7ECE5" stopOpacity="0.32" />
                  <stop offset="35%" stopColor="#DBA995" stopOpacity="0.5" />
                  <stop offset="75%" stopColor="#AF6E54" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#7E4731" stopOpacity="0.78" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#F5F3EC" stopOpacity="0.25" />
                  <stop offset="40%" stopColor="#EBE7DC" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#DDD6C4" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#C8BEA7" stopOpacity="0.7" />
                </>
              )}
            </linearGradient>

            {/* Heavy Solid Glass Base Block Gradient */}
            <linearGradient id="solidBaseGlass" x1="200" y1="440" x2="200" y2="485" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="45%" stopColor="#BACDD6" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#87A0AD" stopOpacity="0.4" />
            </linearGradient>

            {/* Internal Luminous Glow strictly inside the liquid cavity */}
            <radialGradient id={`innerGlow-${liquidGradId}`} cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. SCULPTED BLACK WOODEN CAP (Inverted Flared Cone from Layer 7 copy.png) */}
          <g id="wooden-cap">
            {/* Main Flared Body */}
            <path
              d="
                M 116 58
                C 118 115, 142 188, 148 198
                C 165 204, 235 204, 252 198
                C 258 188, 282 115, 284 58
                Z
              "
              fill="url(#woodGrain)"
            />
            {/* 3D Cylindrical Shadow Overlay */}
            <path
              d="
                M 116 58
                C 118 115, 142 188, 148 198
                C 165 204, 235 204, 252 198
                C 258 188, 282 115, 284 58
                Z
              "
              fill="url(#cap3DLighting)"
            />

            {/* Elliptical Domed Top of Wooden Cap */}
            <ellipse cx="200" cy="58" rx="84" ry="16" fill="url(#capTopSheen)" stroke="#22272B" strokeWidth="1" />
            {/* Top concentric wood growth rings */}
            <ellipse cx="200" cy="58" rx="60" ry="11" fill="none" stroke="#2B3137" strokeWidth="1" opacity="0.6" />
            <ellipse cx="200" cy="58" rx="35" ry="6" fill="none" stroke="#373E45" strokeWidth="0.8" opacity="0.7" />

            {/* Specular Glare on left curvature of wooden cap */}
            <path
              d="M 126 62 Q 138 120 156 195"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 2. CHROME COLLAR & SPRAYER ASSEMBLY */}
          <g id="neck-collar">
            {/* Silver Neck Ring */}
            <ellipse cx="200" cy="202" rx="52" ry="7" fill="url(#silverNeck)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            
            {/* Internal Clear Sprayer Pump Stem */}
            <rect x="194" y="206" width="12" height="32" rx="1.5" fill="#E8F1F5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.85" />
            
            {/* Dip Tube descending through fragrance */}
            <line x1="200" y1="238" x2="204" y2="455" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="201" y1="238" x2="205" y2="455" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
          </g>

          {/* 3. LIQUID BODY INSIDE CONICAL FLACON */}
          <g id="liquid-body">
            <path
              d="
                M 148 214
                L 62 450
                C 60 458, 68 464, 82 466
                C 140 472, 260 472, 318 466
                C 332 464, 340 458, 338 450
                L 252 214
                Z
              "
              fill={`url(#${liquidGradId})`}
            />
            {/* Internal Luminous Glow strictly inside the liquid cavity */}
            <path
              d="
                M 148 214
                L 62 450
                C 60 458, 68 464, 82 466
                C 140 472, 260 472, 318 466
                C 332 464, 340 458, 338 450
                L 252 214
                Z
              "
              fill={`url(#innerGlow-${liquidGradId})`}
              opacity="0.8"
            />
            {/* Liquid Meniscus at top of conical cavity */}
            <ellipse cx="200" cy="214" rx="52" ry="6" fill="#FFFFFF" fillOpacity="0.5" />
            <path d="M 148 214 Q 200 219 252 214" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
          </g>

          {/* 4. SOLID THICK GLASS BASE (Heavy Glass Block from Layer 7 copy.png) */}
          <g id="glass-base">
            <path
              d="
                M 60 448
                C 56 462, 70 476, 92 480
                C 150 487, 250 487, 308 480
                C 330 476, 344 462, 340 448
                C 330 460, 290 468, 200 468
                C 110 468, 70 460, 60 448
                Z
              "
              fill="url(#solidBaseGlass)"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.2"
            />
            {/* Bottom Horizon Specular Reflection Curve */}
            <path
              d="M 85 476 Q 200 488 315 476"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 98 480 Q 200 491 302 480"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          {/* 5. OUTER CONICAL CRYSTAL GLASS PROFILE */}
          <g id="glass-walls">
            <path
              d="
                M 146 204
                L 52 454
                C 44 472, 65 486, 90 490
                C 150 497, 250 497, 310 490
                C 335 486, 356 472, 348 454
                L 254 204
                C 248 198, 152 198, 146 204
                Z
              "
              fill="url(#conicalGlass)"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="2.2"
            />

            {/* Left Glass Bevel Thick Reflection (Matches Layer 7 copy.png) */}
            <path
              d="M 148 206 L 56 454"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 153 208 L 66 450"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* Right Glass Bevel Reflection */}
            <path
              d="M 252 206 L 344 454"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 247 208 L 334 450"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.35"
            />
          </g>

          {/* 6. Screenprinted Haute Parfumerie Label on Glass */}
          <g id="glass-screenprint" opacity="0.9">
            <text
              x="200"
              y="348"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontFamily="Inter, sans-serif"
              letterSpacing="3.5"
              fontWeight="500"
              opacity="0.8"
            >
              CHEM BROS
            </text>
            <text
              x="200"
              y="370"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14.5"
              fontFamily="Cinzel, Georgia, serif"
              letterSpacing="2.8"
              fontWeight="600"
            >
              {bottleName}
            </text>
            <text
              x="200"
              y="388"
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="7"
              fontFamily="Inter, monospace"
              letterSpacing="2.5"
              fontWeight="400"
            >
              EXTRAIT DE PARFUM
            </text>
            <text
              x="200"
              y="404"
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="6.5"
              fontFamily="Inter, monospace"
              letterSpacing="2"
              fontWeight="400"
            >
              MADURAI // 50 ML
            </text>
          </g>

          {/* Diagonal Glass Sheen Sweep */}
          <path
            d="M 130 205 L 170 205 L 120 470 L 80 470 Z"
            fill="url(#glassSheen)"
            opacity="0.3"
            pointerEvents="none"
          />
        </svg>

        {/* Contact Shadow on Floor / Plinth */}
        <div className="w-[85%] h-5 mx-auto -mt-3 rounded-[100%] bg-black/60 blur-[6px]" />
        <div className="w-[110%] h-8 mx-auto -mt-4 rounded-[100%] bg-[#03151D]/40 blur-[12px]" />
      </div>

      {/* Optional Brushed Stainless Steel Plinth (Matches image.png lab plinth) */}
      {showPedestal && (
        <div
          className={`relative z-0 flex flex-col items-center mt-[-10px] transition-all duration-300 ${pedestalClassName}`}
          style={{ width: `${width * 0.9}px` }}
        >
          {/* Top Surface of the Metal Plinth with bottle reflection */}
          <div className="w-full h-5 rounded-t-sm border-t border-x border-white/60 metal-plinth-top relative overflow-hidden shrink-0">
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-[70%] h-4 bg-white/40 blur-[2px] opacity-75" />
          </div>

          {/* Front Face of Brushed Plinth */}
          <div
            className={`w-full metal-plinth border-x ${extendToBottom ? 'border-b-0' : 'border-b'} border-[#5A6D78] relative overflow-hidden flex items-end justify-center pb-3`}
            style={{
              height: typeof pedestalHeight === 'number' ? `${pedestalHeight}px` : pedestalHeight,
            }}
          >
            {/* Vertical Anisotropic Light Strips */}
            <div className="absolute inset-y-0 left-[18%] w-[16%] bg-white/25 blur-[1px]" />
            <div className="absolute inset-y-0 left-[48%] w-[22%] bg-white/30 blur-[2px]" />
            <div className="absolute inset-y-0 right-[15%] w-[12%] bg-black/15" />

            {/* Plinth Inscription */}
            <span className="font-mono text-[9px] tracking-[0.22em] text-[#073849]/80 uppercase font-semibold pb-1">
              SPECIMEN // {bottleName}
            </span>
          </div>

          {/* Base Shadow (hidden when extending directly to the bottom of the screen) */}
          {!extendToBottom && (
            <div className="w-[125%] h-6 -mt-2 rounded-[100%] bg-[#03151D]/70 blur-[10px]" />
          )}
        </div>
      )}
    </div>
  );
};
