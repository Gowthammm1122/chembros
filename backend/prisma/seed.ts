import argon2 from 'argon2';
import { prisma } from '../src/config/db.js';
import { PyramidTier } from '../src/types/enums.js';

async function main() {
  console.log('🌱 Seeding Chem Bros database with authentic formulas & pricing...');

  // 1. Seed Products and Variants (Matching authentic Chemical Brothers catalog)
  const products = [
    {
      slug: 'molecule-j',
      name: 'Molecule J',
      formulaNo: '01',
      subtitle: 'The Beginning',
      family: 'Jasmine Sambac',
      description: 'MOLECULE J — THE BEGINNING Every story has a first moment. Molecule J opens with the freshness of green grass, juniper and cypress, crisp and almost electric. At its heart, jasmine meets the unexpected green bite of betel leaf and violet, creating a floral character that feels familiar yet strangely new. Then comes the warmth — saffron, cedarwood and sandalwood settling into the skin with a smooth, quietly sensual depth. Rooted in the spirit of Madurai jasmine, Molecule J is not a recreation of a flower. It is an interpretation of the moment before everything begins. Fresh. Green. Floral. Warm. Unforgettable. The Beginning.',
      character: 'Fresh. Green. Floral. Warm. Unforgettable. The Beginning.',
      liquidColor: 'rgba(225, 185, 105, 0.45)',
      sortOrder: 1,
      variants: [
        { sizeMl: 50, price: 2499, stockQuantity: 250, sku: 'CB-MOL-J-50' },
        { sizeMl: 100, price: 3999, stockQuantity: 250, sku: 'CB-MOL-J-100' },
      ],
      pyramid: {
        top: ['Fresh Grass', 'Cyprus', 'Juniper'],
        heart: ['Jasmine', 'Violet', 'Beetle Leaf'],
        base: ['Saffron', 'Cedarwood & Sandalwood'],
      },
      spec: {
        ratio: '28% Pure Extrait Concentration',
        maceration: '90 Days in Dark Nitrogen Vault',
        volatility: '12–14 hr skin persistence',
        ph: '5.4 botanical balance',
        keyIsolate: 'Madurai Jasmine Sambac & Betel Leaf',
      },
    },
    {
      slug: 'molecule-t',
      name: 'Molecule T',
      formulaNo: '02',
      subtitle: 'The Obsession',
      family: 'Tuberose',
      description: 'MOLECULE T — THE OBSESSION It starts innocently. A splash of whiskey sets the tone — warm, intoxicating and unapologetic. Then tuberose and jasmine emerge, rich and luminous, softened by the delicate brightness of neroli. As the fragrance settles, white musk and sandalwood draw everything closer to the skin, leaving behind a smooth, addictive trail that refuses to disappear. Molecule T is the fragrance of staying a little longer than you intended. Of one more drink. One more night. One more time. Warm. Floral. Intoxicating. Addictive. The Obsession.',
      character: 'Warm. Floral. Intoxicating. Addictive. The Obsession.',
      liquidColor: 'rgba(135, 195, 175, 0.38)',
      sortOrder: 2,
      variants: [
        { sizeMl: 50, price: 2699, stockQuantity: 250, sku: 'CB-MOL-T-50' },
        { sizeMl: 100, price: 4299, stockQuantity: 250, sku: 'CB-MOL-T-100' },
      ],
      pyramid: {
        top: ['Whiskey', 'Tuberose'],
        heart: ['Jasmine', 'Neroli'],
        base: ['White musk & Sandalwood'],
      },
      spec: {
        ratio: '30% Pure Extrait Concentration',
        maceration: '75 Days Cold Stabilization',
        volatility: '14+ hr skin persistence',
        ph: '5.5 velvety balance',
        keyIsolate: 'Night-Blooming Tuberose & White Sandalwood',
      },
    },
    {
      slug: 'molecule-r',
      name: 'Molecule R',
      formulaNo: '03',
      subtitle: 'The Fire',
      family: 'Red Champaca',
      description: 'MOLECULE R — THE FIRE Some fragrances announce themselves. Molecule R makes an entrance. Lily and cherry blossom ignite the opening with a luminous, almost innocent sweetness before red champaca and frangipani take over — exotic, floral and impossible to ignore. As the heat builds, vanilla and musk bring a soft sensuality to the composition, while oud leaves a dark, unmistakably seductive trail. Beautiful at first. Dangerous once it settles. Molecule R is the tension between attraction and instinct — between something you should resist and something you absolutely won\'t. Floral. Sensual. Dark. Seductive. The Fire.',
      character: 'Floral. Sensual. Dark. Seductive. The Fire.',
      liquidColor: 'rgba(230, 135, 65, 0.44)',
      sortOrder: 3,
      variants: [
        { sizeMl: 50, price: 2799, stockQuantity: 250, sku: 'CB-MOL-R-50' },
        { sizeMl: 100, price: 4499, stockQuantity: 250, sku: 'CB-MOL-R-100' },
      ],
      pyramid: {
        top: ['Lilly', 'Cherry Blossom'],
        heart: ['Red Champaca', 'Frangipani'],
        base: ['Vanilla', 'Musk & Oud'],
      },
      spec: {
        ratio: '29% Pure Extrait Concentration',
        maceration: '100 Days Vault Maceration',
        volatility: '16+ hr skin persistence',
        ph: '5.2 amber balance',
        keyIsolate: 'Tamil Nadu Red Champaca & Smoked Oud',
      },
    },
    {
      slug: 'molecule-x',
      name: 'Molecule X',
      formulaNo: '04',
      subtitle: 'The Anomaly',
      family: 'Davana',
      description: 'MOLECULE X — THE ANOMALY Davana, dark rum, and crushed lime with aromatic herbs that shift and adapt dynamically on the skin. Intoxicating, daring, and unforgettable. Intimate and commanding. The Bestseller.',
      character: 'Wild. Aromatic. Boozy. Addictive. The Anomaly.',
      liquidColor: 'rgba(185, 135, 115, 0.42)',
      sortOrder: 4,
      variants: [
        { sizeMl: 50, price: 2999, stockQuantity: 250, sku: 'CB-MOL-X-50' },
        { sizeMl: 100, price: 4799, stockQuantity: 250, sku: 'CB-MOL-X-100' },
      ],
      pyramid: {
        top: ['Davana', 'Crushed Lime', 'Bitter Orange'],
        heart: ['Aged Rum Cask', 'Dried Fruit', 'Wild Sage'],
        base: ['Dark Vetiver', 'Amber', 'Oakwood'],
      },
      spec: {
        ratio: '28% Pure Extrait Concentration',
        maceration: '80 Days Temperature-Regulated Distillation',
        volatility: '14+ hr skin persistence',
        ph: '5.6 adaptive balance',
        keyIsolate: 'Davana Absolute & Aged Rum Oak Cask',
      },
    },
    {
      slug: 'discovery-archive',
      name: 'Discovery Archive',
      formulaNo: 'DA',
      subtitle: 'The Miniature Coffret',
      family: 'The Molecule Series',
      description: 'The Discovery Archive gathers all four signatures of the Molecule Series into a single hand-numbered coffret — four 3ml extraits, hand-poured and boxed in our embossed molecule case. Find your molecule before committing to a full bottle.',
      character: 'The complete Molecule Series, in miniature.',
      liquidColor: 'rgba(215, 175, 110, 0.45)',
      sortOrder: 5,
      variants: [
        { sizeMl: 12, price: 1299, stockQuantity: 500, sku: 'CB-DISC-ARCH-12' },
      ],
      pyramid: {
        top: ['Bergamot', 'Green Leaf', 'Saffron'],
        heart: ['Jasmine Sambac', 'Tuberose', 'Red Champaca'],
        base: ['White Musk', 'Sandalwood', 'Amber'],
      },
      spec: {
        ratio: '4 × 3ml Extrait Coffret',
        maceration: 'Complete 4-Piece Miniature Set',
        volatility: 'Discovery Experience',
        ph: 'Botanical Standard',
        keyIsolate: 'All 4 Signature Extraits',
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

  // 2. Seed Application Settings (Free shipping threshold = ₹1,500)
  const settings = [
    { key: 'gst_enabled', value: 'true' },
    { key: 'gst_rate', value: '1800' }, // 18.00%
    { key: 'gst_inclusive', value: 'true' },
    { key: 'gst_number', value: '33AAWFC8794P1Z7' },
    { key: 'gst_legal_name', value: 'Chemical Brothers Perfumery LLP' },
    { key: 'gst_state', value: 'Tamil Nadu' },
    { key: 'gst_state_code', value: '33' },
    { key: 'gst_hsn', value: '33030050' },
    { key: 'order_prefix', value: 'CB-' },
    { key: 'invoice_prefix', value: 'CB ' },
    { key: 'invoice_next', value: '1' },
    { key: 'free_shipping_over', value: '1500' },
    { key: 'shipping_fee', value: '150' },
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

  // 3. Seed Default Administrator
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

  console.log('✅ Chem Bros database seed complete with authentic prices & notes.');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
