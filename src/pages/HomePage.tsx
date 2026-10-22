import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ScrollBottleTransition } from '../components/ScrollBottleTransition';
import { ProductCollection } from '../components/ProductCollection';
import { PrmptExperience } from '../components/PrmptExperience';
import { DetailMosaic } from '../components/DetailMosaic';
import { BrandPhilosophy } from '../components/BrandPhilosophy';
import { ConversionSection } from '../components/ConversionSection';
import { useCart } from '../context/CartContext';
import { Fragrance } from '../data/fragrances';

export const HomePage: React.FC = () => {
  const [isHeroIntroComplete, setIsHeroIntroComplete] = useState(false);
  const navigate = useNavigate();
  const { addToCart, openStory } = useCart();

  const handleSelectFragrance = (fragrance: Fragrance) => {
    navigate(`/product/${fragrance.id}`);
  };

  return (
    <div className="relative overflow-x-clip">
      {/* SECTION 01 — Cinematic Hero with Opening Sequence */}
      <Hero
        onSelectFragrance={handleSelectFragrance}
        onOpenStory={openStory}
        onIntroCompleteChange={setIsHeroIntroComplete}
      />

      {/* Dynamic GSAP Scroll Transition: Hero 4th Bottle floats and docks into Collection Formula 001 card */}
      <ScrollBottleTransition isIntroComplete={isHeroIntroComplete} />

      {/* SECTION 02 — Product Introduction / The Four Formulas */}
      <ProductCollection
        onSelectFragrance={handleSelectFragrance}
        onAddToCart={addToCart}
      />

      {/* SECTION 03 — Interactive Olfactory Alignment Matcher */}
      <ConversionSection
        onSelectFragrance={handleSelectFragrance}
        onAddToCart={addToCart}
      />

      {/* SECTION 04 — Scroll-Driven Fashion/Archive Experience */}
      <PrmptExperience />

      {/* SECTION 05 — Asymmetrical Editorial Mosaic */}
      <DetailMosaic
        onSelectFragrance={handleSelectFragrance}
      />

      {/* SECTION 06 — Brand Philosophy */}
      <BrandPhilosophy
        onOpenStory={openStory}
      />
    </div>
  );
};

