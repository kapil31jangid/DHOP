import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z
    .string()
    .min(1)
    .transform((val) => val.replace(/\\n/g, '\n')),
});

export type Env = z.infer<typeof envSchema>;

export function validate(config: Record<string, any>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Environment validation failed');
  }

  return result.data;
}
