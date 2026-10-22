import { prisma } from '../config/db.js';
import { TaxService, GstBreakdown } from './tax.service.js';

export interface CartInputItem {
  variantId?: string;
  slug?: string;
  sizeMl?: number;
  quantity: number;
}

export interface VerifiedCartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  formulaNo: string;
  sizeMl: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  inStock: boolean;
  availableStock: number;
}

export interface CartCalculationResult {
  items: VerifiedCartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  tax: GstBreakdown;
  grandTotal: number;
}

export class CartService {
  /**
   * Authoritative server-side price & tax calculation.
   * Completely immune to client-side price tampering.
   */
  static async calculateCart(
    rawItems: CartInputItem[],
    shippingState: string = 'Tamil Nadu'
  ): Promise<CartCalculationResult> {
    const commerceSettings = await TaxService.getCommerceSettings();
    const verifiedItems: VerifiedCartItem[] = [];

    for (const raw of rawItems) {
      if (!raw || raw.quantity <= 0) continue;

      let variant = null;

      if (raw.variantId) {
        variant = await prisma.productVariant.findUnique({
          where: { id: raw.variantId },
          include: { product: true },
        });
      } else if (raw.slug && raw.sizeMl) {
        const product = await prisma.product.findUnique({
          where: { slug: raw.slug },
          include: {
            variants: {
              where: { sizeMl: raw.sizeMl },
            },
          },
        });

        if (product && product.variants.length > 0) {
          variant = {
            ...product.variants[0],
            product,
          };
        }
      }

      if (!variant || !variant.product || !variant.product.isActive) {
        continue;
      }

      const qty = Math.max(1, Math.min(raw.quantity, 10)); // Safe upper limit per item
      const unitPrice = variant.price;
      const lineTotal = unitPrice * qty;
      const inStock = variant.stockQuantity >= qty;

      verifiedItems.push({
        variantId: variant.id,
        productId: variant.productId,
        slug: variant.product.slug,
        name: variant.product.name,
        formulaNo: variant.product.formulaNo,
        sizeMl: variant.sizeMl,
        unitPrice,
        quantity: qty,
        lineTotal,
        inStock,
        availableStock: variant.stockQuantity,
      });
    }

    const subtotal = verifiedItems.reduce((acc, item) => acc + item.lineTotal, 0);
    const itemCount = verifiedItems.reduce((acc, item) => acc + item.quantity, 0);

    // Free shipping threshold check (default ₹5,000)
    const isFreeShipping = subtotal >= commerceSettings.freeShippingThreshold || subtotal === 0;
    const shipping = isFreeShipping ? 0 : commerceSettings.standardShippingFee;
    const amountNeededForFreeShipping = isFreeShipping
      ? 0
      : Math.max(0, commerceSettings.freeShippingThreshold - subtotal);

    // GST computation on product subtotal
    const tax = TaxService.calculate(
      subtotal,
      shippingState,
      commerceSettings.gstRateBps
    );

    const grandTotal = subtotal + shipping;

    return {
      items: verifiedItems,
      itemCount,
      subtotal,
      shipping,
      isFreeShipping,
      freeShippingThreshold: commerceSettings.freeShippingThreshold,
      amountNeededForFreeShipping,
      tax,
      grandTotal,
    };
  }

  /**
   * Retrieves or initializes a database cart for user or guest session
   */
  static async getOrCreateCart(userId?: string, sessionToken?: string) {
    if (userId) {
      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                variant: {
                  include: { product: true },
                },
              },
            },
          },
        });
      }
      return cart;
    }

    if (sessionToken) {
      let cart = await prisma.cart.findUnique({
        where: { sessionToken },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { sessionToken },
          include: {
            items: {
              include: {
                variant: {
                  include: { product: true },
                },
              },
            },
          },
        });
      }
      return cart;
    }

    throw new Error('Either userId or sessionToken is required to access cart');
  }
}
