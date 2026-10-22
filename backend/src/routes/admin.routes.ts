import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthService } from '../services/auth.service.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { env } from '../config/env.js';

export const adminRouter = Router();

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  signed: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

// POST /api/admin/auth/login
// Dedicated admin authentication endpoint
adminRouter.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    const result = await AuthService.login({
      email,
      password,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    if (result.user.role !== 'ADMIN') {
      sendError(res, 'Access denied. Administrator privileges required.', 403);
      return;
    }

    res.cookie('chembros_session', result.sessionToken, cookieOptions);

    res.json({
      success: true,
      token: result.sessionToken,
      user: result.user,
      message: 'Admin login successful',
    });
  } catch (error) {
    next(error);
  }
});

// Protect all following admin endpoints with requireAdmin
adminRouter.use(requireAdmin);

// GET /api/admin/dashboard
// Aggregated atelier metrics matching both modern and legacy UI specs
adminRouter.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalOrders, paidOrders, recentOrders, lowStockVariants, unreadMessages] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.findMany({
          where: { paymentStatus: 'PAID' },
          select: { total: true },
        }),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
            addresses: true,
          },
        }),
        prisma.productVariant.findMany({
          where: { stockQuantity: { lte: 25 } },
          include: { product: true },
        }),
        prisma.contactMessage.count({
          where: { isRead: false },
        }),
      ]);

    const totalRevenue = paidOrders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);
    const pendingOrders = recentOrders.filter(
      (o: any) => o.status === 'PROCESSING' || o.status === 'PENDING'
    ).length;

    const statsObj = {
      totalRevenue,
      totalOrders,
      pendingOrders,
      paidOrdersCount: paidOrders.length,
      lowStockCount: lowStockVariants.length,
      unreadMessages,
    };

    const formattedOrders = recentOrders.map((o: any) => ({
      id: o.id,
      ref: o.orderRef,
      orderRef: o.orderRef,
      invoice_no: o.invoiceNo,
      invoiceNo: o.invoiceNo,
      customerName: o.name,
      customerEmail: o.email,
      name: o.name,
      email: o.email,
      city: o.addresses[0]?.city || '',
      state: o.addresses[0]?.state || '',
      total: o.total,
      status: o.status,
      payment_status: o.paymentStatus.toLowerCase(),
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
      created_at: o.createdAt,
      itemsCount: o.items.length,
    }));

    res.json({
      success: true,
      stats: statsObj,
      metrics: statsObj,
      recentOrders: formattedOrders,
      lowStockVariants: lowStockVariants.map((v: any) => ({
        id: v.id,
        name: v.product.name,
        formulaNo: v.product.formulaNo,
        sizeMl: v.sizeMl,
        sku: v.sku,
        stockQuantity: v.stockQuantity,
      })),
      data: {
        stats: statsObj,
        recentOrders: formattedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders
adminRouter.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        addresses: true,
        paymentAttempts: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const formatted = orders.map((o: any) => ({
      id: o.id,
      ref: o.orderRef,
      orderRef: o.orderRef,
      invoice_no: o.invoiceNo,
      invoiceNo: o.invoiceNo,
      name: o.name,
      email: o.email,
      phone: o.phone,
      city: o.addresses[0]?.city || '',
      state: o.addresses[0]?.state || '',
      line1: o.addresses[0]?.line1 || '',
      postcode: o.addresses[0]?.postcode || '',
      subtotal: o.subtotal,
      shipping: o.shipping,
      tax: o.tax,
      cgst: o.cgst,
      sgst: o.sgst,
      igst: o.igst,
      total: o.total,
      status: o.status,
      payment_status: o.paymentStatus.toLowerCase(),
      paymentStatus: o.paymentStatus,
      created_at: o.createdAt,
      createdAt: o.createdAt,
      items: o.items,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
});

// Update order status: Support both POST & PATCH, and both :id and :orderRef
const handleStatusUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idOrRef = String(req.params.id || req.params.orderRef);
    const { status, paymentStatus } = req.body;

    const updated = await prisma.order.update({
      where: idOrRef.startsWith('CB-') ? { orderRef: idOrRef } : { id: idOrRef },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorType: 'ADMIN',
        actorId: req.user?.id,
        action: 'ORDER_STATUS_UPDATED',
        entity: 'Order',
        entityId: updated.id,
        details: `Updated status: ${status || 'unchanged'}, payment: ${paymentStatus || 'unchanged'}`,
      },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Order status updated',
    });
  } catch (error) {
    next(error);
  }
};

adminRouter.post('/orders/:id/status', handleStatusUpdate);
adminRouter.patch('/orders/:id/status', handleStatusUpdate);
adminRouter.post('/orders/:orderRef/status', handleStatusUpdate);
adminRouter.patch('/orders/:orderRef/status', handleStatusUpdate);

// GET /api/admin/products
adminRouter.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        variants: {
          orderBy: { sizeMl: 'asc' },
        },
        specs: true,
        pyramids: true,
      },
    });

    const formatted = products.map((p: any) => {
      const pyramidObj: { top: string[]; heart: string[]; base: string[] } = {
        top: [],
        heart: [],
        base: [],
      };
      for (const pyr of p.pyramids) {
        try {
          const parsed = JSON.parse(pyr.notes);
          if (pyr.tier === 'TOP') pyramidObj.top = parsed;
          if (pyr.tier === 'HEART') pyramidObj.heart = parsed;
          if (pyr.tier === 'BASE') pyramidObj.base = parsed;
        } catch {
          const fallback = pyr.notes ? pyr.notes.split(',') : [];
          if (pyr.tier === 'TOP') pyramidObj.top = fallback;
          if (pyr.tier === 'HEART') pyramidObj.heart = fallback;
          if (pyr.tier === 'BASE') pyramidObj.base = fallback;
        }
      }

      const basePrice = p.variants.length > 0 ? Math.min(...p.variants.map((v: any) => v.price)) : 0;
      const totalStock = p.variants.reduce((sum: number, v: any) => sum + v.stockQuantity, 0);

      return {
        ...p,
        price: basePrice,
        totalStock,
        pyramid: pyramidObj,
      };
    });

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products - Create a new fragrance formulation
adminRouter.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      slug,
      formulaNo,
      subtitle,
      family,
      description,
      character,
      liquidColor,
      sortOrder,
      isActive,
      variants,
      pyramid,
      spec,
    } = req.body;

    if (!name || !family || !description) {
      sendError(res, 'Name, family, and description are required', 400);
      return;
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const product = await prisma.$transaction(async (tx: any) => {
      const created = await tx.product.create({
        data: {
          name: name.trim(),
          slug: generatedSlug,
          formulaNo: formulaNo || '00',
          subtitle: subtitle || null,
          family: family.trim(),
          description: description.trim(),
          character: character || null,
          liquidColor: liquidColor || 'rgba(225, 185, 105, 0.45)',
          sortOrder: typeof sortOrder === 'number' ? sortOrder : 99,
          isActive: isActive !== false,
          specs: spec
            ? {
                create: {
                  ratio: spec.ratio || null,
                  maceration: spec.maceration || null,
                  volatility: spec.volatility || null,
                  ph: spec.ph || null,
                  keyIsolate: spec.keyIsolate || null,
                },
              }
            : undefined,
          pyramids: pyramid
            ? {
                create: [
                  { tier: 'TOP', notes: JSON.stringify(pyramid.top || []) },
                  { tier: 'HEART', notes: JSON.stringify(pyramid.heart || []) },
                  { tier: 'BASE', notes: JSON.stringify(pyramid.base || []) },
                ],
              }
            : undefined,
        },
      });

      const variantList =
        Array.isArray(variants) && variants.length > 0
          ? variants
          : [
              { sizeMl: 50, price: 4500, stockQuantity: 100 },
              { sizeMl: 100, price: 7200, stockQuantity: 100 },
            ];

      for (const v of variantList) {
        const sku = v.sku || `CB-${generatedSlug.toUpperCase()}-${v.sizeMl}`;
        await tx.productVariant.create({
          data: {
            productId: created.id,
            sizeMl: Number(v.sizeMl),
            price: Number(v.price),
            stockQuantity: Number(v.stockQuantity ?? 100),
            sku,
          },
        });
      }

      return created;
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Fragrance formulation created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - Update product details, variants, prices, and specs
adminRouter.put('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const {
      name,
      slug,
      formulaNo,
      subtitle,
      family,
      description,
      character,
      liquidColor,
      isActive,
      variants,
      pyramid,
      spec,
    } = req.body;

    const updated = await prisma.$transaction(async (tx: any) => {
      const prod = await tx.product.update({
        where: { id },
        data: {
          ...(name ? { name: name.trim() } : {}),
          ...(slug ? { slug: slug.trim() } : {}),
          ...(formulaNo ? { formulaNo: formulaNo.trim() } : {}),
          ...(subtitle !== undefined ? { subtitle } : {}),
          ...(family ? { family: family.trim() } : {}),
          ...(description ? { description: description.trim() } : {}),
          ...(character !== undefined ? { character } : {}),
          ...(liquidColor !== undefined ? { liquidColor } : {}),
          ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        },
      });

      if (Array.isArray(variants)) {
        for (const v of variants) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                ...(v.price !== undefined ? { price: Number(v.price) } : {}),
                ...(v.stockQuantity !== undefined
                  ? { stockQuantity: Number(v.stockQuantity) }
                  : {}),
                ...(v.sku ? { sku: v.sku } : {}),
              },
            });
          } else if (v.sizeMl && v.price) {
            const sku = v.sku || `CB-${prod.slug.toUpperCase()}-${v.sizeMl}`;
            await tx.productVariant.upsert({
              where: { sku },
              update: {
                price: Number(v.price),
                stockQuantity: Number(v.stockQuantity ?? 100),
              },
              create: {
                productId: id,
                sizeMl: Number(v.sizeMl),
                price: Number(v.price),
                stockQuantity: Number(v.stockQuantity ?? 100),
                sku,
              },
            });
          }
        }
      }

      if (spec) {
        await tx.productSpec.upsert({
          where: { productId: id },
          update: {
            ratio: spec.ratio || null,
            maceration: spec.maceration || null,
            volatility: spec.volatility || null,
            ph: spec.ph || null,
            keyIsolate: spec.keyIsolate || null,
          },
          create: {
            productId: id,
            ratio: spec.ratio || null,
            maceration: spec.maceration || null,
            volatility: spec.volatility || null,
            ph: spec.ph || null,
            keyIsolate: spec.keyIsolate || null,
          },
        });
      }

      if (pyramid) {
        if (pyramid.top) {
          await tx.productPyramid.upsert({
            where: { productId_tier: { productId: id, tier: 'TOP' } },
            update: { notes: JSON.stringify(pyramid.top) },
            create: { productId: id, tier: 'TOP', notes: JSON.stringify(pyramid.top) },
          });
        }
        if (pyramid.heart) {
          await tx.productPyramid.upsert({
            where: { productId_tier: { productId: id, tier: 'HEART' } },
            update: { notes: JSON.stringify(pyramid.heart) },
            create: { productId: id, tier: 'HEART', notes: JSON.stringify(pyramid.heart) },
          });
        }
        if (pyramid.base) {
          await tx.productPyramid.upsert({
            where: { productId_tier: { productId: id, tier: 'BASE' } },
            update: { notes: JSON.stringify(pyramid.base) },
            create: { productId: id, tier: 'BASE', notes: JSON.stringify(pyramid.base) },
          });
        }
      }

      return prod;
    });

    res.json({
      success: true,
      data: updated,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/products/:id/toggle - Toggle active status in storefront
adminRouter.patch('/products/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, 'Product not found', 404);
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    res.json({
      success: true,
      data: updated,
      message: `Product is now ${updated.isActive ? 'Active' : 'Archived (Hidden from Storefront)'}`,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id - Delete or archive product
adminRouter.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) {
      sendError(res, 'Product not found', 404);
      return;
    }

    const variantIds = product.variants.map((v: any) => v.id);
    const orderItemsCount = await prisma.orderItem.count({
      where: { variantId: { in: variantIds } },
    });

    if (orderItemsCount > 0) {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      res.json({
        success: true,
        archived: true,
        message: 'Product has historical orders. It has been safely archived and hidden from the storefront.',
      });
      return;
    }

    await prisma.product.delete({ where: { id } });
    res.json({
      success: true,
      deleted: true,
      message: 'Product deleted permanently from database.',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/variants/:variantId
adminRouter.patch('/variants/:variantId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variantId = String(req.params.variantId);
    const { price, stockQuantity } = req.body;

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        ...(typeof price === 'number' ? { price } : {}),
        ...(typeof stockQuantity === 'number' ? { stockQuantity } : {}),
      },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Variant updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/settings
adminRouter.get('/settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.appSetting.findMany();
    const map = Object.fromEntries(settings.map((s: any) => [s.key, s.value]));
    res.json({
      success: true,
      data: map,
    });
  } catch (error) {
    next(error);
  }
});

// POST & PATCH /api/admin/settings
const handleSettingsSave = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body;
    if (typeof updates !== 'object' || updates === null) {
      sendError(res, 'Invalid settings payload', 400);
      return;
    }

    for (const [key, value] of Object.entries(updates)) {
      await prisma.appSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    res.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

adminRouter.post('/settings', handleSettingsSave);
adminRouter.patch('/settings', handleSettingsSave);

// GET /api/admin/messages
adminRouter.get('/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/messages/:id/read
adminRouter.patch('/messages/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    res.json({
      success: true,
      data: updated,
      message: 'Message marked as read',
    });
  } catch (error) {
    next(error);
  }
});
