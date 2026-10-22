import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';

export const checkoutRouter = Router();

// POST /api/checkout/place
// Supports both structured DTO and flat frontend payloads
checkoutRouter.post('/place', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body || {};

    // Extract customer details (from nested or flat)
    const customer = {
      name: String(body.customer?.name || body.name || '').trim(),
      email: String(body.customer?.email || body.email || '').toLowerCase().trim(),
      phone: String(body.customer?.phone || body.phone || '').trim(),
      gstin: body.customer?.gstin || body.gstin || undefined,
      notes: body.customer?.notes || body.notes || undefined,
    };

    if (!customer.name || customer.name.length < 2) {
      throw new Error('Please enter a valid full name (at least 2 characters)');
    }
    if (!customer.email || !customer.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    if (!customer.phone || customer.phone.replace(/[^0-9]/g, '').length < 10) {
      throw new Error('Please enter a valid 10-digit phone number');
    }

    // Extract address details (from nested or flat)
    const address = {
      line1: String(body.address?.line1 || body.line1 || '').trim(),
      city: String(body.address?.city || body.city || '').trim(),
      state: String(body.address?.state || body.state || 'Tamil Nadu').trim(),
      postcode: String(body.address?.postcode || body.postcode || '').trim(),
      country: String(body.address?.country || body.country || 'India').trim(),
    };

    if (!address.line1 || address.line1.length < 3) {
      throw new Error('Address line 1 is required');
    }
    if (!address.city) {
      throw new Error('City is required');
    }
    if (!address.postcode || address.postcode.length < 6) {
      throw new Error('Please provide a valid 6-digit postal PIN code');
    }

    // Extract items
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) {
      throw new Error('Your cart is empty');
    }

    const items = rawItems.map((item: any) => ({
      variantId: item.variantId,
      slug: item.slug,
      sizeMl: item.sizeMl || item.size || 50,
      quantity: item.quantity || item.qty || 1,
    }));

    const paymentMethod = body.paymentMethod || (body.cod ? 'cod' : 'cashfree');

    const result = await OrderService.checkout({
      customer,
      address,
      items,
      paymentMethod,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      order_ref: result.order.orderRef,
      order_id: result.order.id,
      invoice_no: result.order.invoiceNo,
      total: result.order.total,
      cashfree: result.payment
        ? {
            enabled: true,
            payment_session_id: result.payment.paymentSessionId,
            mode: result.payment.mode,
            cf_order_id: result.payment.cfOrderId,
          }
        : undefined,
      cod: paymentMethod === 'cod',
      data: {
        order: {
          id: result.order.id,
          orderRef: result.order.orderRef,
          invoiceNo: result.order.invoiceNo,
          total: result.order.total,
          status: result.order.status,
          paymentStatus: result.order.paymentStatus,
          itemsCount: result.order.items.length,
        },
        payment: result.payment,
      },
      message: 'Order placed successfully',
    });
  } catch (error) {
    next(error);
  }
});
