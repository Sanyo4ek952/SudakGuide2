import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url(),
  NEXTAUTH_URL: z.url(),
  NEXTAUTH_SECRET: z.string().min(16),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(8),
  HOST_EMAIL: z.email().optional(),
  HOST_PASSWORD: z.string().min(8).optional(),
  HOST_TELEGRAM_CHAT_ID: z.string().optional()
});

export const serverEnv = serverEnvSchema.parse(process.env);
