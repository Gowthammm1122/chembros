import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=80',
];

function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row: number[] = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = placed++;
    if (r % 3 === 0 && placed < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = placed++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

// Clamp helper
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const PrmptExperience: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinnedStageRef = useRef<HTMLDivElement | null>(null);
  const blackPanelRef = useRef<HTMLDivElement | null>(null);
  const innerWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Cache each card's static offsetTop (read once, never per-frame)
  const cardOffsetsRef = useRef<number[]>([]);
  const cardHeightsRef = useRef<number[]>([]);
  const lastRevealRef = useRef<number[]>([]);

  const [cols, setCols] = useState<number>(4);

  const gridRows = useMemo(() => buildLayout(GALLERY_IMAGES.length, cols), [cols]);

  useEffect(() => {
    const checkViewport = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
      else setCols(4);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = pinnedStageRef.current;
    const blackPanel = blackPanelRef.current;
    const innerWrapper = innerWrapperRef.current;
    if (!root || !stage || !blackPanel || !innerWrapper) return;

    const vh = window.innerHeight;
    const wrapHeight = innerWrapper.scrollHeight || 1600;
    const maxScroll = Math.max(vh, wrapHeight - vh);
    const totalScrollDist = vh + maxScroll + vh * 0.4;
    const totalContainerHeight = totalScrollDist + vh;
    
    // Set height directly on DOM element to prevent React state re-render desync
    root.style.height = `${totalContainerHeight}px`;

    // Static measurement of wrapper top offset inside black panel (MEASURED ONCE)
    const wrapperTopInPanel = innerWrapper.offsetTop;

    // ─── One-time measurement of card positions (no per-frame DOM reads) ──────
    cardElementsRef.current.forEach((card, i) => {
      if (!card) return;
      cardOffsetsRef.current[i] = card.offsetTop;
      cardHeightsRef.current[i] = card.offsetHeight;
    });

    // Reset reveal diff cache
    lastRevealRef.current = [];

    // Set all cards to initial hidden state
    cardElementsRef.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, { opacity: 0, y: 48, scale: 0.94 });
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        invalidateOnRefresh: true,
        anticipatePin: 1,

        onEnter: () => {
          if (pinnedStageRef.current) pinnedStageRef.current.style.visibility = 'visible';
        },
        onLeave: () => {
          // Scrolled past bottom into subsequent sections: hide stage to instantly release GPU textures
          if (pinnedStageRef.current) pinnedStageRef.current.style.visibility = 'hidden';
        },
        onEnterBack: () => {
          // Scrolled back up into view
          if (pinnedStageRef.current) pinnedStageRef.current.style.visibility = 'visible';
        },
        onLeaveBack: () => {
          if (pinnedStageRef.current) pinnedStageRef.current.style.visibility = 'visible';
          if (blackPanelRef.current) gsap.set(blackPanelRef.current, { y: vh });
        },

        onUpdate: (self) => {
          // Fast boundary exits
          if (self.progress <= 0) {
            gsap.set(blackPanel, { y: vh });
            return;
          }
          if (self.progress >= 1) {
            gsap.set(blackPanel, { y: 0 });
            gsap.set(innerWrapper, { y: -maxScroll });
            return;
          }

          const scroll = self.progress * totalScrollDist;

          // ─── Phase 1: black panel slides up from below ──────────────────
          if (scroll <= vh) {
            const panelOffset = Math.max(0, vh - scroll);
            gsap.set(blackPanel, { y: panelOffset });
            return;
          }

          // ─── Phase 2: gallery translates up ─────────────────────────────
          gsap.set(blackPanel, { y: 0 });
          const galleryOffset = -(scroll - vh);
          gsap.set(innerWrapper, { y: galleryOffset });

          // ─── Card reveal: zero forced layout reflows, cached deltas ─────
          cardElementsRef.current.forEach((card, i) => {
            if (!card) return;

            const staticOffsetTop = cardOffsetsRef.current[i] ?? 0;
            const cardH = cardHeightsRef.current[i] ?? 300;

            // Absolute Y of card top relative to viewport
            const cardTop = wrapperTopInPanel + staticOffsetTop + galleryOffset;
            const cardBottom = cardTop + cardH;

            const enterProgress = clamp((vh * 0.92 - cardTop) / (vh * 0.38), 0, 1);
            const exitProgress  = clamp((cardBottom) / (vh * 0.12), 0, 1);
            const reveal = Math.min(enterProgress, exitProgress);

            // Skip redundant DOM writes if value hasn't meaningfully changed
            if (lastRevealRef.current[i] !== undefined && Math.abs(reveal - lastRevealRef.current[i]) < 0.005) {
              return;
            }
            lastRevealRef.current[i] = reveal;

            gsap.set(card, {
              opacity: reveal,
              y: 48 * (1 - reveal),
              scale: 0.94 + 0.06 * reveal,
            });
          });
        },
      });

      // Recalculate ScrollTrigger start/end coordinates now that container height is set
      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
      if (pinnedStageRef.current) pinnedStageRef.current.style.visibility = 'visible';
    };
  }, [gridRows]);

  return (
    <section
      id="scroll-spacer"
      ref={rootRef}
      className="relative w-full select-none bg-black"
      style={{ minHeight: '100vh' }}
    >
      <div
        ref={pinnedStageRef}
        className="w-full h-screen relative overflow-hidden bg-[#051118]"
      >
        {/* Phase 1: text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 sm:p-14 lg:p-20 z-0 bg-gradient-to-b from-[#040E14] via-[#061822] to-[#040E14]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block font-mono text-[11px] sm:text-xs tracking-[0.35em] text-white/50 uppercase mb-4">
              VISUAL CHRONICLES &amp; SPECIMEN ARCHIVES
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15]">
              Formulation in Motion.
            </h2>
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-white/60 font-light max-w-xl mx-auto leading-relaxed">
              Explore the raw isolates, cryogenic distillates, and harvesting rituals from the Madurai jasmine fields to the laboratory bench.
            </p>
          </div>
        </div>

        {/* Phase 2: black panel + gallery */}
        <div
          ref={blackPanelRef}
          className="absolute inset-0 bg-black z-10 w-full h-full overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.8)]"
          style={{ transform: 'translateY(100vh)', willChange: 'transform' }}
        >
          <div
            ref={innerWrapperRef}
            className="w-full pt-[min(320px,35vh)] pb-[40vh] px-4 sm:px-8 lg:px-12"
            style={{ willChange: 'transform' }}
          >
            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl mx-auto ${
                cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-4'
              }`}
            >
              {gridRows.map((row, rowIdx) =>
                row.map((itemIdx, colIdx) => {
                  if (itemIdx === -1 || !GALLERY_IMAGES[itemIdx]) {
                    return (
                      <div
                        key={`empty-${rowIdx}-${colIdx}`}
                        className="w-full aspect-[2/3] pointer-events-none"
                      />
                    );
                  }

                  const isLeftHalf = colIdx < cols / 2;
                  const transformOrigin = isLeftHalf ? 'right bottom' : 'left bottom';

                  return (
                    <div
                      key={`card-${itemIdx}`}
                      ref={(el) => {
                        cardElementsRef.current[itemIdx] = el;
                      }}
                      className="relative w-full aspect-[2/3] overflow-hidden bg-[#111111] shadow-2xl rounded-sm border border-white/5"
                      style={{
                        opacity: 0,
                        transformOrigin,
                        willChange: 'transform, opacity',
                      }}
                    >
                      <img
                        src={GALLERY_IMAGES[itemIdx]}
                        alt={`Archive Visual ${itemIdx + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
