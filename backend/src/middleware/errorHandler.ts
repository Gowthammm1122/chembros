import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode = 400, code = 'APP_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`Unhandled error on ${req.method} ${req.path}`, err);

  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formatted = err.issues.map(i => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return sendError(res, 'Validation failed for request parameters', 422, 'VALIDATION_ERROR', formatted);
  }

  // 2. Custom Application Errors
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  // 3. Prisma Known Request Errors
  if (err?.code === 'P2002') {
    return sendError(res, 'A record with this unique value already exists', 409, 'DUPLICATE_ENTRY');
  }
  if (err?.code === 'P2025') {
    return sendError(res, 'Requested resource was not found', 404, 'NOT_FOUND');
  }

  // 4. Default Internal Server Error
  const message = env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred. Our engineers have been alerted.' 
    : err.message || 'Internal server error';

  sendError(res, message, 500, 'INTERNAL_SERVER_ERROR');
}
