export interface Fragrance {
  id: string;
  formulaNo: string;
  name: string;
  subtitle: string;
  tagline?: string;
  ingredientTitle?: string;
  family: string;
  price: number;
  currency: string;
  isBestseller?: boolean;
  badge?: string;
  sizeLabel?: string;
  image?: string;
  sizes: { ml: number; price: number }[];
  liquidColor: string;
  liquidGradient: string;
  pedestalHeight: number; // for hero composition
  description: string;
  olfactoryPyramid: {
    top: string[];
    heart: string[];
    base: string[];
  };
  labSpec: {
    ratio: string;
    maceration: string;
    volatility: string;
    ph: string;
    keyIsolate: string;
  };
  character: string;
}

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

// The 4 Core Molecule Formulations (Shown in Hero & Collection Grid)
export const FRAGRANCES: Fragrance[] = [
  {
    id: "molecule-j",
    formulaNo: "01",
    name: "Molecule J",
    subtitle: "The Beginning",
    tagline: "Night-blooming jasmine at the hour it opens.",
    ingredientTitle: "JASMINE SAMBAC",
    family: "Jasmine Sambac",
    price: 2499,
    currency: "₹",
    image: "/images/formula-01-amber.jpg",
    sizes: [
      { ml: 50, price: 2499 },
      { ml: 100, price: 3999 },
    ],
    liquidColor: "rgba(225, 185, 105, 0.45)",
    liquidGradient: "linear-gradient(180deg, rgba(250, 215, 140, 0.4) 0%, rgba(215, 160, 65, 0.55) 100%)",
    pedestalHeight: 280,
    description: "MOLECULE J — THE BEGINNING Every story has a first moment. Molecule J opens with the freshness of green grass, juniper and cypress, crisp and almost electric. At its heart, jasmine meets the unexpected green bite of betel leaf and violet, creating a floral character that feels familiar yet strangely new. Then comes the warmth — saffron, cedarwood and sandalwood settling into the skin with a smooth, quietly sensual depth. Rooted in the spirit of Madurai jasmine, Molecule J is not a recreation of a flower. It is an interpretation of the moment before everything begins. Fresh. Green. Floral. Warm. Unforgettable. The Beginning.",
    character: "Fresh. Green. Floral. Warm. Unforgettable. The Beginning.",
    olfactoryPyramid: {
      top: ["Fresh Grass", "Cyprus", "Juniper"],
      heart: ["Jasmine", "Violet", "Beetle Leaf"],
      base: ["Saffron", "Cedarwood & Sandalwood"],
    },
    labSpec: {
      ratio: "28% Pure Extrait Concentration",
      maceration: "90 Days in Dark Nitrogen Vault",
      volatility: "12–14 hr skin persistence",
      ph: "5.4 botanical balance",
      keyIsolate: "Madurai Jasmine Sambac & Betel Leaf",
    },
  },
  {
    id: "molecule-t",
    formulaNo: "02",
    name: "Molecule T",
    subtitle: "The Obsession",
    tagline: "The most carnal of the white flowers.",
    ingredientTitle: "TUBEROSE",
    family: "Tuberose",
    price: 2699,
    currency: "₹",
    image: "/images/formula-02-vetiver.jpg",
    sizes: [
      { ml: 50, price: 2699 },
      { ml: 100, price: 4299 },
    ],
    liquidColor: "rgba(135, 195, 175, 0.38)",
    liquidGradient: "linear-gradient(180deg, rgba(175, 220, 200, 0.35) 0%, rgba(105, 175, 150, 0.52) 100%)",
    pedestalHeight: 220,
    description: "MOLECULE T — THE OBSESSION It starts innocently. A splash of whiskey sets the tone — warm, intoxicating and unapologetic. Then tuberose and jasmine emerge, rich and luminous, softened by the delicate brightness of neroli. As the fragrance settles, white musk and sandalwood draw everything closer to the skin, leaving behind a smooth, addictive trail that refuses to disappear. Molecule T is the fragrance of staying a little longer than you intended. Of one more drink. One more night. One more time. Warm. Floral. Intoxicating. Addictive. The Obsession.",
    character: "Warm. Floral. Intoxicating. Addictive. The Obsession.",
    olfactoryPyramid: {
      top: ["Whiskey", "Tuberose"],
      heart: ["Jasmine", "Neroli"],
      base: ["White musk & Sandalwood"],
    },
    labSpec: {
      ratio: "30% Pure Extrait Concentration",
      maceration: "75 Days Cold Stabilization",
      volatility: "14+ hr skin persistence",
      ph: "5.5 velvety balance",
      keyIsolate: "Night-Blooming Tuberose & White Sandalwood",
    },
  },
  {
    id: "molecule-r",
    formulaNo: "03",
    name: "Molecule R",
    subtitle: "The Fire",
    tagline: "A rare golden flower, warmed with spice.",
    ingredientTitle: "RED CHAMPACA",
    family: "Red Champaca",
    price: 2799,
    currency: "₹",
    image: "/images/formula-03-myrrh.jpg",
    sizes: [
      { ml: 50, price: 2799 },
      { ml: 100, price: 4499 },
    ],
    liquidColor: "rgba(230, 135, 65, 0.44)",
    liquidGradient: "linear-gradient(180deg, rgba(245, 160, 90, 0.4) 0%, rgba(205, 100, 35, 0.58) 100%)",
    pedestalHeight: 250,
    description: "MOLECULE R — THE FIRE Some fragrances announce themselves. Molecule R makes an entrance. Lily and cherry blossom ignite the opening with a luminous, almost innocent sweetness before red champaca and frangipani take over — exotic, floral and impossible to ignore. As the heat builds, vanilla and musk bring a soft sensuality to the composition, while oud leaves a dark, unmistakably seductive trail. Beautiful at first. Dangerous once it settles. Molecule R is the tension between attraction and instinct — between something you should resist and something you absolutely won't. Floral. Sensual. Dark. Seductive. The Fire.",
    character: "Floral. Sensual. Dark. Seductive. The Fire.",
    olfactoryPyramid: {
      top: ["Lilly", "Cherry Blossom"],
      heart: ["Red Champaca", "Frangipani"],
      base: ["Vanilla", "Musk & Oud"],
    },
    labSpec: {
      ratio: "29% Pure Extrait Concentration",
      maceration: "100 Days Vault Maceration",
      volatility: "16+ hr skin persistence",
      ph: "5.2 amber balance",
      keyIsolate: "Tamil Nadu Red Champaca & Smoked Oud",
    },
  },
  {
    id: "molecule-x",
    formulaNo: "04",
    name: "Molecule X",
    subtitle: "The Anomaly",
    tagline: "An untamed aromatic anomaly, dark and intoxicating.",
    ingredientTitle: "DAVANA",
    family: "Davana",
    price: 2999,
    currency: "₹",
    isBestseller: true,
    badge: "BESTSELLER",
    image: "/images/formula-04-oak.jpg",
    sizes: [
      { ml: 50, price: 2999 },
      { ml: 100, price: 4799 },
    ],
    liquidColor: "rgba(185, 135, 115, 0.42)",
    liquidGradient: "linear-gradient(180deg, rgba(215, 165, 140, 0.38) 0%, rgba(160, 105, 85, 0.55) 100%)",
    pedestalHeight: 160,
    description: "MOLECULE X — THE ANOMALY Davana, dark rum, and crushed lime with aromatic herbs that shift and adapt dynamically on the skin. Intoxicating, daring, and unforgettable. Intimate and commanding. The Bestseller.",
    character: "Wild. Aromatic. Boozy. Addictive. The Anomaly.",
    olfactoryPyramid: {
      top: ["Davana", "Crushed Lime", "Bitter Orange"],
      heart: ["Aged Rum Cask", "Dried Fruit", "Wild Sage"],
      base: ["Dark Vetiver", "Amber", "Oakwood"],
    },
    labSpec: {
      ratio: "28% Pure Extrait Concentration",
      maceration: "80 Days Temperature-Regulated Distillation",
      volatility: "14+ hr skin persistence",
      ph: "5.6 adaptive balance",
      keyIsolate: "Davana Absolute & Aged Rum Oak Cask",
    },
  },
];

// Separate Standalone Card: The Discovery Archive (4x3ml Miniature Set)
export const DISCOVERY_ARCHIVE: Fragrance = {
  id: "discovery-archive",
  formulaNo: "DA",
  name: "Discovery Archive",
  subtitle: "The Miniature Coffret",
  tagline: "The complete Molecule Series, in miniature.",
  ingredientTitle: "THE MOLECULE SERIES",
  family: "The Molecule Series",
  price: 1299,
  currency: "₹",
  image: "/images/discovery-archive-coffret.png",
  sizes: [
    { ml: 12, price: 1299 },
  ],
  sizeLabel: "4 × 3ml Extrait",
  liquidColor: "rgba(215, 175, 110, 0.45)",
  liquidGradient: "linear-gradient(180deg, rgba(235, 195, 130, 0.4) 0%, rgba(195, 145, 65, 0.55) 100%)",
  pedestalHeight: 200,
  description: "The Discovery Archive gathers all four signatures of the Molecule Series into a single hand-numbered coffret — four 3ml extraits, hand-poured and boxed in our embossed molecule case. Find your molecule before committing to a full bottle.",
  character: "The complete Molecule Series, in miniature.",
  olfactoryPyramid: {
    top: ["Bergamot", "Green leaf", "Saffron"],
    heart: ["Jasmine sambac", "Tuberose", "Red champaca"],
    base: ["White musk", "Sandalwood", "Amber"],
  },
  labSpec: {
    ratio: "4 × 3ml Extrait Coffret",
    maceration: "25% Natural Oil Concentration",
    volatility: "Unisex • 8+ Hours",
    ph: "Botanical Standard",
    keyIsolate: "All 4 Extrait Formulations",
  },
};

export const ALL_PRODUCTS: Fragrance[] = [...FRAGRANCES, DISCOVERY_ARCHIVE];
