/**
 * One-shot migration helper — add updatedAt with a fixed default,
 * then backfill existing rows with their createdAt where possible.
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const TABLES = ["Brand", "Category", "Realization", "Service", "Settings", "Testimonial"];

async function main() {
  for (const table of TABLES) {
    // SQLite allows constant string defaults.
    try {
      await db.$executeRawUnsafe(
        `ALTER TABLE "${table}" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT '2024-01-01 00:00:00';`
      );
      console.log(`→ ${table}: updatedAt added (default 2024-01-01)`);
    } catch (e: any) {
      if (e.message.includes("duplicate column")) {
        console.log(`→ ${table}: already has updatedAt`);
      } else {
        console.error(`✗ ${table}:`, e.message);
      }
    }
    // Backfill from createdAt where possible
    try {
      await db.$executeRawUnsafe(
        `UPDATE "${table}" SET "updatedAt" = "createdAt" WHERE "createdAt" IS NOT NULL AND "updatedAt" = '2024-01-01 00:00:00';`
      );
    } catch (e: any) {
      // Some tables might not have createdAt
    }
  }
  console.log("✓ Migration helper done.");
}

main().catch(console.error).finally(() => db.$disconnect());
