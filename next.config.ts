import type { NextConfig } from "next";
import { envVars } from "./src/lib/env";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: envVars.DATABASE_URL,
  },
};

export default nextConfig;
