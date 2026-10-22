import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(val => parseInt(val, 10)).default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long for security'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CASHFREE_APP_ID: z.string().default('TEST_APP_ID'),
  CASHFREE_SECRET_KEY: z.string().default('TEST_SECRET_KEY'),
  CASHFREE_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  SANITY_PROJECT_ID: z.string().default('chembros_editorial'),
  SANITY_DATASET: z.string().default('production'),
  SANITY_API_VERSION: z.string().default('2024-03-01'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid or missing environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
  }
  // Provide helpful diagnostic instead of crashing blindly in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : {
  NODE_ENV: 'development' as const,
  PORT: 5000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/chembros_db?schema=public',
  SESSION_SECRET: process.env.SESSION_SECRET || 'chembros_dev_session_secret_min_32_characters_random_key_12345',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || 'TEST_APP_ID',
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || 'TEST_SECRET_KEY',
  CASHFREE_ENVIRONMENT: 'sandbox' as const,
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || 'chembros_editorial',
  SANITY_DATASET: 'production',
  SANITY_API_VERSION: '2024-03-01',
};
