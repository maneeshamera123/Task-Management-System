import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
});

// Function to get validated environment variables
function getEnv() {
  return envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  });
}

// Export validated environment variables 
export const envVars = {
  get DATABASE_URL() {
    return getEnv().DATABASE_URL;
  },
  get NODE_ENV() {
    return getEnv().NODE_ENV;
  },
  get JWT_SECRET() {
    return getEnv().JWT_SECRET;
  },
  get JWT_REFRESH_SECRET() {
    return getEnv().JWT_REFRESH_SECRET;
  },
} as const;

// Export individual variables for convenience
export const DATABASE_URL = envVars.DATABASE_URL;
export const NODE_ENV = envVars.NODE_ENV;
