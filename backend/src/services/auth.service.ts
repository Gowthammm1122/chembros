import crypto from 'node:crypto';
import argon2 from 'argon2';
import { prisma } from '../config/db.js';
import { UserRole } from '../types/enums.js';

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: Date;
}

export class AuthService {
  /**
   * Hashes a password using Argon2id with memory-hard parameters
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * Verifies plain text password against Argon2id hash
   */
  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Generates a 32-byte cryptographic random session token
   * Returns { rawToken, tokenHash, expiresAt }
   */
  static generateSessionToken(daysValid: number = 30) {
    const rawToken = crypto.randomBytes(32).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000);
    return { rawToken, tokenHash, expiresAt };
  }

  /**
   * Registers a new customer account
   */
  static async register(dto: RegisterDTO): Promise<{ user: SafeUser; sessionToken: string }> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      const error: any = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        name: dto.name.trim(),
        phone: dto.phone?.trim() || null,
        role: UserRole.CUSTOMER,
      },
    });

    // Create initial session
    const { rawToken, tokenHash, expiresAt } = this.generateSessionToken(30);
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      sessionToken: rawToken,
    };
  }

  /**
   * Authenticates user via email and password, creates session
   */
  static async login(dto: LoginDTO): Promise<{ user: SafeUser; sessionToken: string }> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await this.verifyPassword(user.passwordHash, dto.password);
    if (!isValid) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const { rawToken, tokenHash, expiresAt } = this.generateSessionToken(30);
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: dto.ipAddress || null,
        userAgent: dto.userAgent || null,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      sessionToken: rawToken,
    };
  }

  /**
   * Validates raw session token, checks expiry, returns user
   */
  static async validateSession(rawToken: string): Promise<SafeUser | null> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session) return null;

    // Check expiry
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      phone: session.user.phone,
      role: session.user.role,
      createdAt: session.user.createdAt,
    };
  }

  /**
   * Terminates session by raw token
   */
  static async logout(rawToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }
}
