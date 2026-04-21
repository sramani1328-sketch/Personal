import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  // Delay the crash until the first query is attempted so local tooling doesn't fail on import.
  console.warn("DATABASE_URL not set — DB calls will fail until it is configured.");
}

const sql = neon(process.env.DATABASE_URL ?? "postgres://invalid");
export const db = drizzle(sql, { schema });
export { schema };
