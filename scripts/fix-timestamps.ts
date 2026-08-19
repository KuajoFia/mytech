/**
 * Fix timestamps using Prisma's raw query API (bypasses model parsing).
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const tables = ["Settings", "Brand", "Category", "Realization", "Service", "Testimonial"];
  for (const t of tables) {
    try {
      // $executeRawUnsafe bypasses Prisma model parsing
      await db.$executeRawUnsafe(
        `UPDATE "${t}" SET "updatedAt" = '2024-01-01T00:00:00.000Z' WHERE "updatedAt" = '2024-01-01 00:00:00';`
      );
      console.log(`✓ ${t} fixed`);
    } catch (e: any) {
      console.error(`${t}:`, e.message);
    }
  }
  console.log("Done.");
}

main().catch(console.error).finally(() => db.$disconnect());
