import { prisma } from '../config/db.js';

export interface FormattedProduct {
  id: string;
  slug: string;
  name: string;
  formulaNo: string;
  subtitle: string | null;
  family: string;
  description: string;
  character: string | null;
  liquidColor: string | null;
  price: number; // Base price (usually 50ml)
  sizes: number[];
  inStock: boolean;
  variants: {
    id: string;
    sizeMl: number;
    price: number;
    stockQuantity: number;
    sku: string;
    inStock: boolean;
  }[];
  pyramid: {
    top: string[];
    heart: string[];
    base: string[];
  };
  spec: {
    ratio: string | null;
    maceration: string | null;
    volatility: string | null;
    ph: string | null;
    keyIsolate: string | null;
  } | null;
}

export class ProductService {
  /**
   * Helper to format Prisma Product into frontend-compatible fragrance model
   */
  private static formatProduct(raw: any): FormattedProduct {
    const variants = (raw.variants || []).map((v: any) => ({
      id: v.id,
      sizeMl: v.sizeMl,
      price: v.price,
      stockQuantity: v.stockQuantity,
      sku: v.sku,
      inStock: v.stockQuantity > 0,
    }));

    // Find base price (lowest price among variants or default 0)
    const prices = variants.map((v: any) => v.price);
    const basePrice = prices.length > 0 ? Math.min(...prices) : 0;
    const sizes = variants.map((v: any) => v.sizeMl).sort((a: number, b: number) => a - b);
    const inStock = variants.some((v: any) => v.stockQuantity > 0);

    // Format pyramid
    const pyramid: { top: string[]; heart: string[]; base: string[] } = {
      top: [],
      heart: [],
      base: [],
    };

    if (Array.isArray(raw.pyramids)) {
      for (const p of raw.pyramids) {
        try {
          const parsed = JSON.parse(p.notes);
          if (p.tier === 'TOP') pyramid.top = parsed;
          if (p.tier === 'HEART') pyramid.heart = parsed;
          if (p.tier === 'BASE') pyramid.base = parsed;
        } catch {
          // If already an array or raw string
          const fallback = typeof p.notes === 'string' ? p.notes.split(',') : [];
          if (p.tier === 'TOP') pyramid.top = fallback;
          if (p.tier === 'HEART') pyramid.heart = fallback;
          if (p.tier === 'BASE') pyramid.base = fallback;
        }
      }
    }

    return {
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      formulaNo: raw.formulaNo,
      subtitle: raw.subtitle,
      family: raw.family,
      description: raw.description,
      character: raw.character,
      liquidColor: raw.liquidColor,
      price: basePrice,
      sizes,
      inStock,
      variants,
      pyramid,
      spec: raw.specs
        ? {
            ratio: raw.specs.ratio,
            maceration: raw.specs.maceration,
            volatility: raw.specs.volatility,
            ph: raw.specs.ph,
            keyIsolate: raw.specs.keyIsolate,
          }
        : null,
    };
  }

  /**
   * Retrieves all active products ordered by sortOrder
   */
  static async getAllActiveProducts(): Promise<FormattedProduct[]> {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        variants: {
          orderBy: { sizeMl: 'asc' },
        },
        pyramids: true,
        specs: true,
      },
    });

    return products.map(p => this.formatProduct(p));
  }

  /**
   * Retrieves single product by unique slug
   */
  static async getProductBySlug(slug: string): Promise<FormattedProduct | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { sizeMl: 'asc' },
        },
        pyramids: true,
        specs: true,
      },
    });

    if (!product || !product.isActive) {
      return null;
    }

    return this.formatProduct(product);
  }
}
