# CHEM BROS — Laboratory-Inspired Luxury Perfume House

> *Scientific precision meets olfactory art. Four formulas. Four identities.*

CHEM BROS is an independent luxury fragrance laboratory blending high-purity molecular chemistry with rare botanical extractions from Tamil Nadu, India.

---

## 🔬 The Four Signatures

| Formula | Specimen | Olfactory Family | Concentration | Maceration |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **MOLECULE J** | Luminous Solar Floral | 28% Extrait | 90 Days Nitrogen Vault |
| **02** | **MOLECULE T** | Creamy Carnal Floral | 30% Extrait | 75 Days Cryogenic Cold |
| **03** | **MOLECULE R** | Spiced Amber Floral | 29% Extrait | 100 Days Madurai Thermal |
| **04** | **MOLECULE X** | Boozy Herbaceous Aromatic | 26% Extrait | 80 Days Temperature Controlled |

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Smooth Momentum Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Animation Suite**: [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Architecture

```
chembros/
├── public/                 # Static assets, branding vectors, formula photography
│   └── images/             # Ultra high-res formulation studio imagery
├── src/
│   ├── components/         # Modular presentation components
│   │   ├── common/         # Bottles, flasks, emblems, scroll helpers
│   │   ├── navigation/     # Luxury sticky Navbar, Footer, CartDrawer
│   │   ├── home/           # Cinematic Hero, Parallax Bottle Dock, Mosaic
│   │   ├── collection/     # ProductCard, Olfactory Matcher, Spotlight
│   │   └── modals/         # Specimen Dossier, Chronicle Story, Policies
│   ├── context/            # React Context (CartContext with persistence)
│   ├── data/               # Fragrance specifications, notes, formulas
│   ├── layouts/            # RootLayout (Navbar + Outlet + Footer + Modals)
│   ├── pages/              # Routed pages
│   │   ├── HomePage.tsx            # Cinematic experience & highlights
│   │   ├── CollectionPage.tsx      # Full catalog, family filters & sorting
│   │   ├── ProductDetailPage.tsx   # Molecular spec sheet & flacon ordering
│   │   ├── PhilosophyPage.tsx      # Editorial chronicle & extraction ethics
│   │   ├── ConciergePage.tsx       # Bespoke olfactory consult & samples
│   │   ├── PoliciesPage.tsx        # Shipping, compliance & care policies
│   │   └── NotFoundPage.tsx        # Branded 404 archive handler
│   ├── App.tsx             # Route definitions & router provider
│   ├── index.css           # Tailwind v4 theme, Kallisto, Cinzel & JetBrains typography
│   └── main.tsx            # Application entry point
├── vite.config.ts          # Optimized Vite build & alias configuration
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to explore the experience.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Formulations & Compliance
All CHEM BROS formulations comply with the International Fragrance Association (IFRA) 51st Amendment standards. Compounded in small 500-bottle batches in dark nitrogen-purged aging tanks.
