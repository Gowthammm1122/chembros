import { Request, Response, NextFunction } from 'express';
import { AuthService, SafeUser } from '../services/auth.service.js';
import { UserRole } from '../types/enums.js';
import { sendError } from '../utils/response.js';

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
      sessionToken?: string;
    }
  }
}

/**
 * Extracts session token from signed cookies, standard cookies, or Bearer auth header
 */
function extractToken(req: Request): string | null {
  if (req.signedCookies && req.signedCookies.chembros_session) {
    return req.signedCookies.chembros_session;
  }
  if (req.cookies && req.cookies.chembros_session) {
    return req.cookies.chembros_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

/**
 * Optional authentication middleware: identifies user if session exists
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    const user = await AuthService.validateSession(token);
    if (user) {
      req.user = user;
      req.sessionToken = token;
    }
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Enforces authenticated session
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    sendError(res, 'Authentication required. Please log in.', 401);
    return;
  }
  next();
}

/**
 * Enforces administrator role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    sendError(res, 'Authentication required. Please log in.', 401);
    return;
  }
  if (req.user.role !== UserRole.ADMIN) {
    sendError(res, 'Access denied. Administrator privileges required.', 403);
    return;
  }
  next();
}
