import crypto from 'node:crypto';
import { prisma } from '../config/db.js';
import { CartService, CartInputItem } from './cart.service.js';
import { PaymentService } from './payment.service.js';
import { OrderStatus, PaymentStatus } from '../types/enums.js';
import { logger } from '../utils/logger.js';

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  notes?: string;
}

export interface CheckoutAddress {
  line1: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
}

export interface CheckoutDTO {
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  items: CartInputItem[];
  paymentMethod?: 'cashfree' | 'cod';
  userId?: string;
}

export class OrderService {
  /**
   * Generates a unique, elegant order reference e.g. CB-7E2A91D3
   */
  private static generateOrderRef(): string {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `CB-${randomHex}`;
  }

  /**
   * Atomically allocates the next continuous invoice number (CB 01, CB 02...)
   */
  private static async allocateInvoiceNumber(tx: any): Promise<{ invoiceNo: string; seq: number }> {
    const setting = await tx.appSetting.findUnique({
      where: { key: 'invoice_next' },
    });

    const prefixSetting = await tx.appSetting.findUnique({
      where: { key: 'invoice_prefix' },
    });

    const prefix = prefixSetting?.value || 'CB ';
    const currentSeq = setting ? parseInt(setting.value, 10) : 1;
    const nextSeq = currentSeq + 1;

    // Atomically increment the sequence
    await tx.appSetting.upsert({
      where: { key: 'invoice_next' },
      update: { value: String(nextSeq) },
      create: { key: 'invoice_next', value: String(nextSeq) },
    });

    // Zero-pad to 2 digits for early numbers (e.g. CB 01, CB 02)
    const formattedNum = currentSeq < 10 ? `0${currentSeq}` : `${currentSeq}`;
    const invoiceNo = `${prefix}${formattedNum}`;

    return { invoiceNo, seq: currentSeq };
  }

  /**
   * Creates order with full financial recalculation, stock reservation, and invoice allocation
   */
  static async checkout(dto: CheckoutDTO) {
    if (!dto.items || dto.items.length === 0) {
      throw new Error('Your shopping cart is empty');
    }

    // 1. Authoritative price & tax recalculation
    const calculation = await CartService.calculateCart(dto.items, dto.address.state);

    if (calculation.items.length === 0) {
      throw new Error('No valid items found in checkout request');
    }

    // Verify stock availability
    for (const item of calculation.items) {
      if (!item.inStock) {
        throw new Error(
          `Insufficient stock for ${item.name} (${item.sizeMl}ml). Only ${item.availableStock} remaining in atelier vault.`
        );
      }
    }

    const orderRef = this.generateOrderRef();
    const paymentMethod = dto.paymentMethod || 'cashfree';

    // 2. Execute transactional order creation & inventory decrement
    const result = await prisma.$transaction(async tx => {
      // Allocate continuous invoice number
      const { invoiceNo, seq } = await this.allocateInvoiceNumber(tx);

      // Decrement inventory stock
      for (const item of calculation.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          orderRef,
          invoiceNo,
          invoiceSeq: seq,
          userId: dto.userId || null,
          email: dto.customer.email.toLowerCase().trim(),
          name: dto.customer.name.trim(),
          phone: dto.customer.phone.trim(),
          subtotal: calculation.subtotal,
          shipping: calculation.shipping,
          tax: calculation.tax.taxAmount,
          cgst: calculation.tax.cgst,
          sgst: calculation.tax.sgst,
          igst: calculation.tax.igst,
          taxRate: calculation.tax.taxRateBps,
          taxInclusive: calculation.tax.isInclusive,
          gstin: dto.customer.gstin?.trim() || null,
          total: calculation.grandTotal,
          status: OrderStatus.PROCESSING,
          paymentStatus: paymentMethod === 'cod' ? PaymentStatus.COD : PaymentStatus.PENDING,
          notes: dto.customer.notes || null,
          items: {
            create: calculation.items.map(item => ({
              variantId: item.variantId,
              slug: item.slug,
              name: item.name,
              sizeMl: item.sizeMl,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
          addresses: {
            create: {
              userId: dto.userId || null,
              line1: dto.address.line1.trim(),
              city: dto.address.city.trim(),
              state: dto.address.state.trim(),
              postcode: dto.address.postcode.trim(),
              country: dto.address.country?.trim() || 'India',
              type: 'SHIPPING',
            },
          },
        },
        include: {
          items: true,
          addresses: true,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorType: 'CUSTOMER',
          actorId: dto.userId || null,
          action: 'ORDER_CREATED',
          entity: 'Order',
          entityId: order.id,
          details: `Order ${orderRef} placed for ₹${calculation.grandTotal} with invoice ${invoiceNo}`,
        },
      });

      return order;
    });

    logger.info(`Order placed: ${result.orderRef} (Invoice: ${result.invoiceNo}) - Amount: ₹${result.total}`);

    // 3. Initialize Payment Gateway if Cashfree selected
    let paymentData: any = null;
    if (paymentMethod === 'cashfree') {
      paymentData = await PaymentService.createOrderSession({
        orderRef: result.orderRef,
        amount: result.total,
        customerName: result.name,
        customerEmail: result.email,
        customerPhone: result.phone,
      });

      await prisma.paymentAttempt.create({
        data: {
          orderId: result.id,
          orderRef: result.orderRef,
          cfOrderId: paymentData.cfOrderId,
          amount: result.total,
          status: 'ACTIVE',
        },
      });
    }

    return {
      order: result,
      payment: paymentData,
    };
  }

  /**
   * Retrieves order by reference with items and addresses
   */
  static async getOrderByRef(orderRef: string) {
    return prisma.order.findUnique({
      where: { orderRef },
      include: {
        items: true,
        addresses: true,
        paymentAttempts: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });
  }

  /**
   * Confirms payment success and marks order as paid
   */
  static async markPaymentPaid(orderRef: string, cfPaymentId?: string, paymentMethod?: string) {
    const order = await prisma.order.findUnique({ where: { orderRef } });
    if (!order) return null;

    if (order.paymentStatus === PaymentStatus.PAID) {
      return order; // Already paid
    }

    const updated = await prisma.order.update({
      where: { orderRef },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PROCESSING,
      },
    });

    if (cfPaymentId) {
      await prisma.paymentAttempt.create({
        data: {
          orderId: order.id,
          orderRef,
          cfPaymentId,
          amount: order.total,
          status: 'PAID',
          paymentMethod: paymentMethod || 'ONLINE',
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        actorType: 'GATEWAY',
        action: 'PAYMENT_VERIFIED',
        entity: 'Order',
        entityId: order.id,
        details: `Payment confirmed for ${orderRef} via ${paymentMethod || 'Cashfree'}`,
      },
    });

    logger.info(`Payment verified for order ${orderRef}`);
    return updated;
  }
}
