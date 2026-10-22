import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CartService } from '../services/cart.service.js';
import { sendSuccess } from '../utils/response.js';

export const cartRouter = Router();

const calculateSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().optional(),
      slug: z.string().optional(),
      sizeMl: z.number().optional(),
      size: z.number().optional(),
      quantity: z.number().int().min(1).optional(),
      qty: z.number().int().min(1).optional(),
    })
  ),
  shippingState: z.string().optional(),
  state: z.string().optional(),
});

// POST /api/cart/calculate
// Calculates authoritative prices, shipping, and 18% GST (CGST/SGST/IGST)
cartRouter.post('/calculate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = calculateSchema.parse(req.body);

    const normalizedItems = validated.items.map(item => ({
      variantId: item.variantId,
      slug: item.slug,
      sizeMl: item.sizeMl || item.size || 50,
      quantity: item.quantity || item.qty || 1,
    }));

    const destinationState = validated.shippingState || validated.state || 'Tamil Nadu';
    const result = await CartService.calculateCart(normalizedItems, destinationState);

    // Formatted summary matching both new and legacy frontend expectations
    const summary = {
      lines: result.items.map(item => ({
        product_id: null,
        slug: item.slug,
        name: item.name,
        accord: null,
        size: item.sizeMl,
        img: null,
        unit: item.unitPrice,
        qty: item.quantity,
        line_total: item.lineTotal,
      })),
      subtotal: result.subtotal,
      shipping: result.shipping,
      tax: result.tax.taxAmount,
      cgst: result.tax.cgst,
      sgst: result.tax.sgst,
      igst: result.tax.igst,
      rate: result.tax.taxRateBps,
      inclusive: result.tax.isInclusive,
      interstate: !result.tax.isHomeState,
      total: result.grandTotal,
      items: result.itemCount,
    };

    res.json({
      success: true,
      data: result,
      summary,
    });
  } catch (error) {
    next(error);
  }
});
