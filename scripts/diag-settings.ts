/**
 * Diagnostic: see what's in the Settings table.
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const rows = await db.$queryRawUnsafe(`SELECT id, "updatedAt" FROM "Settings";`);
  console.log("Settings rows:", rows);
  const cat = await db.$queryRawUnsafe(`SELECT id, "updatedAt", "createdAt" FROM "Category" LIMIT 1;`);
  console.log("Category row:", cat);
}

main().catch(console.error).finally(() => db.$disconnect());
