import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _prismaPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _prismaClient: PrismaClient | undefined;
}

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 3,                      // stay within Supabase free tier limits
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

function createClient() {
  const pool = (globalThis._prismaPool ??= createPool());
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db = (globalThis._prismaClient ??= createClient());
