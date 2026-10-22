import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/response.js';

export const app = express();

// 1. Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// 2. Strict CORS Configuration
app.use(cors({
  origin: [env.CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-webhook-signature', 'x-webhook-timestamp'],
}));

// 3. Cookie Parser with Secret
app.use(cookieParser(env.SESSION_SECRET));

// 4. Rate Limiting for Abuse Prevention
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP address. Please try again after 15 minutes.',
    },
  },
});
app.use(globalLimiter);

// 5. Body Parsing with raw body preservation for Cashfree webhook signature checks
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true }));

import { authenticate } from './middleware/auth.js';
import { authRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';

// 6. Optional Authentication Context
app.use(authenticate);

// 7. Health Check Endpoints
app.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    service: 'CHEM BROS E-Commerce Core API',
  });
});

app.get('/api/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    database: 'Prisma ORM Online',
    timestamp: new Date().toISOString(),
  });
});

import { cartRouter } from './routes/cart.routes.js';
import { checkoutRouter } from './routes/checkout.routes.js';
import { paymentRouter } from './routes/payment.routes.js';
import { contactRouter } from './routes/contact.routes.js';
import { adminRouter } from './routes/admin.routes.js';

// 8. Mount Domain API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

// 9. Centralized Error Handler (must be last)
app.use(errorHandler);
