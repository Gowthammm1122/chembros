import { Router, Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const productRouter = Router();

// GET /api/products
productRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductService.getAllActiveProducts();
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:slug
productRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug);
    const product = await ProductService.getProductBySlug(slug);

    if (!product) {
      sendError(res, `Formula '${slug}' was not found in the laboratory catalog`, 404);
      return;
    }

    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
});
