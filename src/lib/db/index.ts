import { createClient } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "./schema";

interface D1Database {
  prepare: (query: string) => any;
  dump: () => Promise<ArrayBuffer>;
  batch: (queries: any[]) => Promise<any[]>;
  exec: (query: string) => Promise<any>;
}

// This function returns the appropriate database instance based on the environment
export function getDb(env?: any) {
  // 1. Check for Cloudflare D1 (Production mode)
  if (env?.DB) {
    return drizzleD1(env.DB, { schema });
  }

  // 2. Check for D1 in process.env (Alternative for some Cloudflare setups)
  if (process.env.DB) {
    return drizzleD1(process.env.DB as unknown as D1Database, { schema });
  }

  // 3. Fallback to SQLite/LibSQL (Test/Local mode)
  const client = createClient({
    url: process.env.DATABASE_URL || "file:local.db",
  });

  return drizzleLibsql(client, { schema });
}

// Default export for backward compatibility, will use SQLite by default in Node environments
export const db = getDb();
