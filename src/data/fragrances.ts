export interface Fragrance {
  id: string;
  formulaNo: string;
  name: string;
  subtitle: string;
  family: string;
  price: number;
  currency: string;
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

export const FRAGRANCES: Fragrance[] = [
  {
    id: "molecule-j",
    formulaNo: "01",
    name: "MOLECULE J",
    subtitle: "The Beginning",
    family: "Luminous Solar Floral",
    price: 4500,
    currency: "₹",
    sizes: [
      { ml: 50, price: 4500 },
      { ml: 100, price: 7200 },
    ],
    liquidColor: "rgba(225, 185, 105, 0.45)",
    liquidGradient: "linear-gradient(180deg, rgba(250, 215, 140, 0.4) 0%, rgba(215, 160, 65, 0.55) 100%)",
    pedestalHeight: 280,
    description: "A luminous, nostalgic solar floral born from the jasmine fields of Madurai. Fresh morning blossoms, delicate green tea, and intimate skin warmth.",
    character: "Radiant, nostalgic, and intimately personal; dew-touched white blossoms that melt into warm skin.",
    olfactoryPyramid: {
      top: ["Dewy Green Tea", "Cold-Pressed Bergamot", "Pink Peppercorn"],
      heart: ["Madurai Jasmine Sambac Absolute", "Fresh White Petals", "Water Honeysuckle"],
      base: ["Sheer Skin Musk", "Ambroxan Molecular Isolate", "Warm Solar Woods"],
    },
    labSpec: {
      ratio: "28% Pure Extrait Concentration",
      maceration: "90 Days in Dark Nitrogen Vault",
      volatility: "Medium-Low (12–14 hr skin persistence)",
      ph: "5.4 botanical balance",
      keyIsolate: "Benzyl Acetate & Methyl Jasmonate (99.2% Pure Madurai Malli Isolate)",
    },
  },
  {
    id: "molecule-t",
    formulaNo: "02",
    name: "MOLECULE T",
    subtitle: "The Obsession",
    family: "Creamy Carnal Floral",
    price: 4500,
    currency: "₹",
    sizes: [
      { ml: 50, price: 4500 },
      { ml: 100, price: 7200 },
    ],
    liquidColor: "rgba(135, 195, 175, 0.38)",
    liquidGradient: "linear-gradient(180deg, rgba(175, 220, 200, 0.35) 0%, rgba(105, 175, 150, 0.52) 100%)",
    pedestalHeight: 220,
    description: "An intoxicating, velvety bloom of night-harvested tuberose. Hypnotic carnal petals grounded in lactonic sandalwood and spiced twilight air.",
    character: "Hypnotic, narcotic, and velvety; creamy blossoms steeped in coconut water and white woods.",
    olfactoryPyramid: {
      top: ["Bitter Orange Zest", "Crushed Green Stems", "Star Anise Spark"],
      heart: ["Night-Blooming Tuberose Absolute", "Creamy Coconut Pulp", "French Gardenia"],
      base: ["Lactonic Sandalwood", "Cashmere Amber", "Salted Vanilla Bean"],
    },
    labSpec: {
      ratio: "30% High-Density Oleoresin Extrait",
      maceration: "75 Days Cryogenic Cold Stabilization",
      volatility: "Low (14+ hr hypnotic persistence)",
      ph: "5.5 velvety balance",
      keyIsolate: "Methyl Anthranilate & Tuberose Lactones Isolate",
    },
  },
  {
    id: "molecule-r",
    formulaNo: "03",
    name: "MOLECULE R",
    subtitle: "The Fire",
    family: "Exotic Spiced Amber Floral",
    price: 4800,
    currency: "₹",
    sizes: [
      { ml: 50, price: 4800 },
      { ml: 100, price: 7800 },
    ],
    liquidColor: "rgba(230, 135, 65, 0.44)",
    liquidGradient: "linear-gradient(180deg, rgba(245, 160, 90, 0.4) 0%, rgba(205, 100, 35, 0.58) 100%)",
    pedestalHeight: 250,
    description: "The heat of desire captured in single-distillate Red Champaca. Honeyed exotic petals, smoldering saffron, and precious golden resin.",
    character: "Voluptuous, fiery, and deeply magnetic; opulent golden petals wrapped in smoldering amber smoke.",
    olfactoryPyramid: {
      top: ["Red Mandarin", "Crushed Cardamom Pods", "Saffron Stigmas"],
      heart: ["Tamil Nadu Red Champaca Absolute", "Wild Orange Blossom Honey", "Ylang-Ylang Extra"],
      base: ["Golden Ambergris", "Aged Patchouli Heart", "Smoky Cistus Labdanum"],
    },
    labSpec: {
      ratio: "29% Supercritical CO2 Distillate",
      maceration: "100 Days in Madurai Thermal Vaults",
      volatility: "Very Low (16+ hr aura persistence)",
      ph: "5.2 deep resin balance",
      keyIsolate: "Phenylacetaldehyde & Supercritical Champaca CO2",
    },
  },
  {
    id: "molecule-x",
    formulaNo: "04",
    name: "MOLECULE X",
    subtitle: "The Anomaly",
    family: "Herbaceous Boozy Aromatic",
    price: 4500,
    currency: "₹",
    sizes: [
      { ml: 50, price: 4500 },
      { ml: 100, price: 7200 },
    ],
    liquidColor: "rgba(185, 135, 115, 0.42)",
    liquidGradient: "linear-gradient(180deg, rgba(215, 165, 140, 0.38) 0%, rgba(160, 105, 85, 0.55) 100%)",
    pedestalHeight: 160,
    description: "The wild herbaceous chameleon of perfumery. Wine-like davana, dried apricots, and oak spirits that transform uniquely on every individual's skin.",
    character: "Unpredictable, boozy, and seductive; adapts dynamically to the wearer's body heat and skin chemistry.",
    olfactoryPyramid: {
      top: ["Davana Distillate", "Bitter Artemisia", "Macerated Plum Liqueur"],
      heart: ["Sun-Dried Apricot", "Aged French Cognac Cask", "Clary Sage"],
      base: ["Iso E Super Molecular Matrix", "Limousin Oak Heartwood", "Smoked Tonka Bean"],
    },
    labSpec: {
      ratio: "26% Pure Molecular Extrait",
      maceration: "80 Days Temperature-Regulated Distillation",
      volatility: "Dynamic (Adapts to wearer, 12+ hrs)",
      ph: "5.6 adaptive neutral",
      keyIsolate: "Davanone & Iso E Super Synergistic Matrix",
    },
  },
];
