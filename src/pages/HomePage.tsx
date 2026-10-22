import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { ScrollBottleTransition } from '../components/ScrollBottleTransition';
import { ProductCollection } from '../components/ProductCollection';
import { PrmptExperience } from '../components/PrmptExperience';
import { Manifesto } from '../components/Manifesto';
import { DetailMosaic } from '../components/DetailMosaic';
import { BrandPhilosophy } from '../components/BrandPhilosophy';
import { ConversionSection } from '../components/ConversionSection';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const [isHeroIntroComplete, setIsHeroIntroComplete] = useState(false);
  const { openSpecimenModal, addToCart, openStory } = useCart();

  return (
    <div className="relative overflow-x-clip">
      {/* SECTION 01 — Cinematic Hero with Opening Sequence */}
      <Hero
        onSelectFragrance={openSpecimenModal}
        onOpenStory={openStory}
        onIntroCompleteChange={setIsHeroIntroComplete}
      />

      {/* Dynamic GSAP Scroll Transition: Hero 4th Bottle floats and docks into Collection Formula 001 card */}
      <ScrollBottleTransition isIntroComplete={isHeroIntroComplete} />

      {/* SECTION 02 — Product Introduction / The Four Formulas */}
      <ProductCollection
        onSelectFragrance={openSpecimenModal}
        onAddToCart={addToCart}
      />

      {/* SECTION 03 — Interactive Olfactory Alignment Matcher */}
      <ConversionSection
        onSelectFragrance={openSpecimenModal}
        onAddToCart={addToCart}
      />

      {/* SECTION 04 — Scroll-Driven Fashion/Archive Experience */}
      <PrmptExperience />

      {/* SECTION 05 — Landscape Scroll Zoom Showcase */}
      <Manifesto
        onSelectFragrance={openSpecimenModal}
        onAddToCart={addToCart}
      />

      {/* SECTION 06 — Asymmetrical Editorial Mosaic */}
      <DetailMosaic
        onSelectFragrance={openSpecimenModal}
      />

      {/* SECTION 07 — Brand Philosophy */}
      <BrandPhilosophy
        onOpenStory={openStory}
      />
    </div>
  );
};
