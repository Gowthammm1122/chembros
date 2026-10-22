import { Router, Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { OrderService } from '../services/order.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const paymentRouter = Router();

// POST /api/payment/verify
// Checks payment gateway status and updates order state
paymentRouter.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderRef = String(req.body.orderRef || req.body.order_ref || '').trim();

    if (!orderRef) {
      sendError(res, 'Order reference (orderRef or order_ref) is required', 400);
      return;
    }

    const check = await PaymentService.verifyPaymentStatus(orderRef);

    if (check.status === 'PAID') {
      const updatedOrder = await OrderService.markPaymentPaid(
        orderRef,
        check.cfPaymentId,
        check.paymentMethod
      );

      res.json({
        success: true,
        status: 'PAID',
        orderRef,
        order_ref: orderRef,
        invoiceNo: updatedOrder?.invoiceNo,
        invoice_no: updatedOrder?.invoiceNo,
        paymentId: check.cfPaymentId,
        message: 'Payment confirmed',
      });
      return;
    }

    res.json({
      success: true,
      status: check.status,
      orderRef,
      order_ref: orderRef,
      message: 'Payment status updated',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/payment/status/:orderRef
paymentRouter.get('/status/:orderRef', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderRef = String(req.params.orderRef);
    const order = await OrderService.getOrderByRef(orderRef);

    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    res.json({
      success: true,
      order: {
        ref: order.orderRef,
        orderRef: order.orderRef,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        cgst: order.cgst,
        sgst: order.sgst,
        igst: order.igst,
        invoice_no: order.invoiceNo,
        invoiceNo: order.invoiceNo,
        payment_status: order.paymentStatus,
        paymentStatus: order.paymentStatus,
        status: order.status,
        items_count: order.items.length,
        email: order.email,
        name: order.name,
        created_at: order.createdAt,
      },
      lines: order.items,
      address: order.addresses[0] || null,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payment/webhook
// Cashfree PG signed webhook endpoint
paymentRouter.post('/webhook', async (req: any, res: Response) => {
  try {
    const signature = (req.headers['x-webhook-signature'] || '') as string;
    const timestamp = (req.headers['x-webhook-timestamp'] || '') as string;

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const isValid = PaymentService.verifyWebhookSignature(rawBody, signature, timestamp);

    if (!isValid) {
      logger.warn('Rejected invalid Cashfree webhook signature');
      res.status(400).json({ status: 'INVALID_SIGNATURE' });
      return;
    }

    const payload = req.body;
    logger.info(`Received Cashfree Webhook: ${payload?.type || 'EVENT'}`);

    if (
      payload?.type === 'PAYMENT_SUCCESS_WEBHOOK' ||
      payload?.data?.payment?.payment_status === 'SUCCESS'
    ) {
      const orderRef = payload?.data?.order?.order_id;
      const paymentId = String(payload?.data?.payment?.cf_payment_id || '');
      const method = payload?.data?.payment?.payment_group || 'UPI';

      if (orderRef) {
        await OrderService.markPaymentPaid(orderRef, paymentId, method);
      }
    }

    res.json({ status: 'OK' });
  } catch (error: any) {
    logger.error(`Webhook processing error: ${error.message}`);
    res.status(500).json({ status: 'ERROR' });
  }
});
