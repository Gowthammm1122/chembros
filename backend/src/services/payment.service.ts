import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';

export interface CashfreeOrderParams {
  orderRef: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl?: string;
}

export interface CashfreeOrderResponse {
  success: boolean;
  paymentSessionId?: string;
  cfOrderId?: string;
  mode: 'sandbox' | 'production' | 'mock';
  message?: string;
}

export class PaymentService {
  private static getBaseUrl(): string {
    return env.CASHFREE_ENVIRONMENT === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';
  }

  /**
   * Generates a Cashfree PG payment order session
   */
  static async createOrderSession(params: CashfreeOrderParams): Promise<CashfreeOrderResponse> {
    const isMock =
      !env.CASHFREE_APP_ID ||
      env.CASHFREE_APP_ID.includes('PLACEHOLDER') ||
      env.CASHFREE_SECRET_KEY.includes('PLACEHOLDER');

    if (isMock) {
      logger.info(
        `[Cashfree Mock Mode] Generated mock payment session for Order ${params.orderRef} (Amount: ₹${params.amount})`
      );
      return {
        success: true,
        paymentSessionId: `mock_session_${crypto.randomBytes(16).toString('hex')}`,
        cfOrderId: `cf_${params.orderRef}`,
        mode: 'mock',
        message: 'Mock payment gateway active for local testing. Supply live/sandbox keys in .env for real gateway.',
      };
    }

    try {
      const url = `${this.getBaseUrl()}/orders`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-client-id': env.CASHFREE_APP_ID,
          'x-client-secret': env.CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: params.orderRef,
          order_amount: params.amount,
          order_currency: 'INR',
          customer_details: {
            customer_id: params.customerPhone.replace(/[^0-9]/g, '') || `cust_${Date.now()}`,
            customer_name: params.customerName,
            customer_email: params.customerEmail,
            customer_phone: params.customerPhone.replace(/[^0-9]/g, '').slice(-10),
          },
          order_meta: {
            return_url:
              params.returnUrl ||
              `${env.CORS_ORIGIN}/order-confirmed?order_id=${params.orderRef}`,
            notify_url: `http://localhost:5000/api/payment/webhook`,
          },
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        logger.error(`Cashfree API Error: ${JSON.stringify(data)}`);
        throw new Error(data.message || 'Payment gateway initialization failed');
      }

      return {
        success: true,
        paymentSessionId: data.payment_session_id,
        cfOrderId: data.cf_order_id || data.order_id,
        mode: env.CASHFREE_ENVIRONMENT as 'sandbox' | 'production',
      };
    } catch (err: any) {
      logger.error(`Failed to initiate Cashfree payment: ${err.message}`);
      throw err;
    }
  }

  /**
   * Verifies Cashfree Webhook cryptographic signature (HMAC-SHA256)
   */
  static verifyWebhookSignature(
    rawBody: Buffer,
    signature: string,
    timestamp: string
  ): boolean {
    if (env.CASHFREE_SECRET_KEY.includes('PLACEHOLDER')) {
      return true; // Allow local mock testing
    }

    try {
      const signatureData = `${timestamp}${rawBody.toString('utf8')}`;
      const expectedSignature = crypto
        .createHmac('sha256', env.CASHFREE_SECRET_KEY)
        .update(signatureData)
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }

  /**
   * Fetches latest payment status from Cashfree for an order
   */
  static async verifyPaymentStatus(orderRef: string): Promise<{
    status: 'PAID' | 'PENDING' | 'FAILED' | 'USER_DROPPED';
    cfPaymentId?: string;
    paymentMethod?: string;
    amount?: number;
  }> {
    const isMock =
      !env.CASHFREE_APP_ID ||
      env.CASHFREE_APP_ID.includes('PLACEHOLDER') ||
      env.CASHFREE_SECRET_KEY.includes('PLACEHOLDER');

    if (isMock) {
      return {
        status: 'PAID',
        cfPaymentId: `mock_pay_${Date.now()}`,
        paymentMethod: 'UPI',
      };
    }

    try {
      const url = `${this.getBaseUrl()}/orders/${orderRef}/payments`;
      const response = await fetch(url, {
        headers: {
          'x-client-id': env.CASHFREE_APP_ID,
          'x-client-secret': env.CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01',
        },
      });

      const payments: any = await response.json();
      if (!Array.isArray(payments) || payments.length === 0) {
        return { status: 'PENDING' };
      }

      const successful = payments.find((p: any) => p.payment_status === 'SUCCESS');
      if (successful) {
        return {
          status: 'PAID',
          cfPaymentId: String(successful.cf_payment_id),
          paymentMethod: successful.payment_group || successful.payment_method,
          amount: successful.payment_amount,
        };
      }

      const failed = payments.find((p: any) => p.payment_status === 'FAILED');
      if (failed) {
        return { status: 'FAILED' };
      }

      return { status: 'PENDING' };
    } catch (err: any) {
      logger.error(`Cashfree verify status failed: ${err.message}`);
      return { status: 'PENDING' };
    }
  }
}
