import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { PyramidTier } from '../src/types/enums.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Chem Bros database...');

  // 1. Seed Products and Variants
  const products = [
    {
      slug: 'molecule-j',
      name: 'MOLECULE J',
      formulaNo: '01',
      subtitle: 'The Beginning',
      family: 'Luminous Solar Floral',
      description: 'A luminous, nostalgic solar floral born from the jasmine fields of Madurai. Fresh morning blossoms, delicate green tea, and intimate skin warmth.',
      character: 'Radiant, nostalgic, and intimately personal; dew-touched white blossoms that melt into warm skin.',
      liquidColor: 'rgba(225, 185, 105, 0.45)',
      sortOrder: 1,
      variants: [
        { sizeMl: 50, price: 4500, stockQuantity: 250, sku: 'CB-MOL-J-50' },
        { sizeMl: 100, price: 7200, stockQuantity: 250, sku: 'CB-MOL-J-100' },
      ],
      pyramid: {
        top: ['Dewy Green Tea', 'Cold-Pressed Bergamot', 'Pink Peppercorn'],
        heart: ['Madurai Jasmine Sambac Absolute', 'Fresh White Petals', 'Water Honeysuckle'],
        base: ['Sheer Skin Musk', 'Ambroxan Molecular Isolate', 'Warm Solar Woods'],
      },
      spec: {
        ratio: '28% Pure Extrait Concentration',
        maceration: '90 Days in Dark Nitrogen Vault',
        volatility: 'Medium-Low (12–14 hr skin persistence)',
        ph: '5.4 botanical balance',
        keyIsolate: 'Benzyl Acetate & Methyl Jasmonate (99.2% Pure Madurai Malli Isolate)',
      },
    },
    {
      slug: 'molecule-t',
      name: 'MOLECULE T',
      formulaNo: '02',
      subtitle: 'The Obsession',
      family: 'Creamy Carnal Floral',
      description: 'An intoxicating, velvety bloom of night-harvested tuberose. Hypnotic carnal petals grounded in lactonic sandalwood and spiced twilight air.',
      character: 'Hypnotic, narcotic, and velvety; creamy blossoms steeped in coconut water and white woods.',
      liquidColor: 'rgba(135, 195, 175, 0.38)',
      sortOrder: 2,
      variants: [
        { sizeMl: 50, price: 4500, stockQuantity: 250, sku: 'CB-MOL-T-50' },
        { sizeMl: 100, price: 7200, stockQuantity: 250, sku: 'CB-MOL-T-100' },
      ],
      pyramid: {
        top: ['Bitter Orange Zest', 'Crushed Green Stems', 'Star Anise Spark'],
        heart: ['Night-Blooming Tuberose Absolute', 'Creamy Coconut Pulp', 'French Gardenia'],
        base: ['Lactonic Sandalwood', 'Cashmere Amber', 'Salted Vanilla Bean'],
      },
      spec: {
        ratio: '30% High-Density Oleoresin Extrait',
        maceration: '75 Days Cryogenic Cold Stabilization',
        volatility: 'Low (14+ hr hypnotic persistence)',
        ph: '5.5 velvety balance',
        keyIsolate: 'Methyl Anthranilate & Tuberose Lactones Isolate',
      },
    },
    {
      slug: 'molecule-r',
      name: 'MOLECULE R',
      formulaNo: '03',
      subtitle: 'The Fire',
      family: 'Exotic Spiced Amber Floral',
      description: 'The heat of desire captured in single-distillate Red Champaca. Honeyed exotic petals, smoldering saffron, and precious golden resin.',
      character: 'Voluptuous, fiery, and deeply magnetic; opulent golden petals wrapped in smoldering amber smoke.',
      liquidColor: 'rgba(230, 135, 65, 0.44)',
      sortOrder: 3,
      variants: [
        { sizeMl: 50, price: 4800, stockQuantity: 250, sku: 'CB-MOL-R-50' },
        { sizeMl: 100, price: 7800, stockQuantity: 250, sku: 'CB-MOL-R-100' },
      ],
      pyramid: {
        top: ['Red Mandarin', 'Crushed Cardamom Pods', 'Saffron Stigmas'],
        heart: ['Tamil Nadu Red Champaca Absolute', 'Wild Orange Blossom Honey', 'Ylang-Ylang Extra'],
        base: ['Golden Ambergris', 'Aged Patchouli Heart', 'Smoky Cistus Labdanum'],
      },
      spec: {
        ratio: '29% Supercritical CO2 Distillate',
        maceration: '100 Days in Madurai Thermal Vaults',
        volatility: 'Very Low (16+ hr aura persistence)',
        ph: '5.2 deep resin balance',
        keyIsolate: 'Phenylacetaldehyde & Supercritical Champaca CO2',
      },
    },
    {
      slug: 'molecule-x',
      name: 'MOLECULE X',
      formulaNo: '04',
      subtitle: 'The Anomaly',
      family: 'Herbaceous Boozy Aromatic',
      description: 'The wild herbaceous chameleon of perfumery. Wine-like davana, dried apricots, and oak spirits that transform uniquely on every individual’s skin.',
      character: 'Unpredictable, boozy, and seductive; adapts dynamically to the wearer’s body heat and skin chemistry.',
      liquidColor: 'rgba(185, 135, 115, 0.42)',
      sortOrder: 4,
      variants: [
        { sizeMl: 50, price: 4500, stockQuantity: 250, sku: 'CB-MOL-X-50' },
        { sizeMl: 100, price: 7200, stockQuantity: 250, sku: 'CB-MOL-X-100' },
      ],
      pyramid: {
        top: ['Davana Distillate', 'Bitter Artemisia', 'Macerated Plum Liqueur'],
        heart: ['Sun-Dried Apricot', 'Aged French Cognac Cask', 'Clary Sage'],
        base: ['Iso E Super Molecular Matrix', 'Limousin Oak Heartwood', 'Smoked Tonka Bean'],
      },
      spec: {
        ratio: '26% Pure Molecular Extrait',
        maceration: '80 Days Temperature-Regulated Distillation',
        volatility: 'Dynamic (Adapts to wearer, 12+ hrs)',
        ph: '5.6 adaptive neutral',
        keyIsolate: 'Davanone & Iso E Super Synergistic Matrix',
      },
    },
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        formulaNo: p.formulaNo,
        subtitle: p.subtitle,
        family: p.family,
        description: p.description,
        character: p.character,
        liquidColor: p.liquidColor,
        sortOrder: p.sortOrder,
      },
      create: {
        slug: p.slug,
        name: p.name,
        formulaNo: p.formulaNo,
        subtitle: p.subtitle,
        family: p.family,
        description: p.description,
        character: p.character,
        liquidColor: p.liquidColor,
        sortOrder: p.sortOrder,
        specs: {
          create: p.spec,
        },
        pyramids: {
          create: [
            { tier: PyramidTier.TOP, notes: JSON.stringify(p.pyramid.top) },
            { tier: PyramidTier.HEART, notes: JSON.stringify(p.pyramid.heart) },
            { tier: PyramidTier.BASE, notes: JSON.stringify(p.pyramid.base) },
          ],
        },
      },
    });

    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: { price: v.price, stockQuantity: v.stockQuantity },
        create: {
          productId: createdProduct.id,
          sizeMl: v.sizeMl,
          price: v.price,
          stockQuantity: v.stockQuantity,
          sku: v.sku,
        },
      });
    }
  }

  // 2. Seed Default Application Settings
  const settings = [
    { key: 'gst_enabled', value: 'true' },
    { key: 'gst_rate', value: '1800' }, // 1800 basis points = 18.00%
    { key: 'gst_inclusive', value: 'true' },
    { key: 'gst_number', value: '33AAWFC8794P1Z7' },
    { key: 'gst_legal_name', value: 'Chemical Brothers Perfumery LLP' },
    { key: 'gst_state', value: 'Tamil Nadu' },
    { key: 'gst_state_code', value: '33' },
    { key: 'gst_hsn', value: '33030050' },
    { key: 'order_prefix', value: 'CB-' },
    { key: 'invoice_prefix', value: 'CB ' },
    { key: 'invoice_next', value: '1' },
    { key: 'free_shipping_over', value: '5000' },
    { key: 'shipping_fee', value: '250' },
    { key: 'payment_enabled', value: 'false' },
    { key: 'payment_mode', value: 'sandbox' },
  ];

  for (const s of settings) {
    await prisma.appSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 3. Seed Default Administrator (using Argon2id)
  const adminEmail = 'admin@chembros.in';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await argon2.hash('admin123', {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Chem Bros Atelier Administrator',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('👤 Admin user created: admin@chembros.in');
  }

  console.log('✅ Chem Bros database seed complete.');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
