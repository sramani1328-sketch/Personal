import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set — DB calls will fail until it is configured.");
}

const url = process.env.DATABASE_URL ?? "postgres://invalid";

// When running locally against a standard Postgres (no "neon.tech" host, and not wss/https)
// use node-postgres. In production on Vercel/Neon, keep the serverless HTTP driver.
const isNeon = /neon\.(tech|build)/i.test(url) || process.env.USE_NEON_HTTP === "1";

// Lazy-create the drizzle instance so importing this file from tooling without a DB doesn't crash.
let _db: any;

if (isNeon) {
  const { neon } = require("@neondatabase/serverless");
  const { drizzle } = require("drizzle-orm/neon-http");
  const sql = neon(url);
  _db = drizzle(sql, { schema });
} else {
  const { Pool } = require("pg");
  const { drizzle } = require("drizzle-orm/node-postgres");
  const pool = new Pool({ connectionString: url });
  _db = drizzle(pool, { schema });
}

export const db = _db;
export { schema };
