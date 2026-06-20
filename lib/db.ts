import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

let dbClient: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  dbClient ??= drizzle(neon(process.env.DATABASE_URL), { schema });
  return dbClient;
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
