import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

declare global {
  // Prevent multiple Prisma Client instances in development HMR
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function connectDatabase(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established via Prisma.');
    return true;
  } catch (err: any) {
    console.warn('⚠️  Could not connect to database:', err.message);
    console.warn('   Ensure DATABASE_URL in backend/.env is valid and reachable.');
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
