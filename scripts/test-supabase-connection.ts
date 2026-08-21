import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

try {
  const result = await db.$queryRaw`SELECT NOW() as now, current_database() as db`;
  console.log("✓ Connexion Supabase OK:");
  console.log(result);
  // Try to count tables
  const tables = await db.$queryRaw`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log(`\nTables in public schema: ${tables.length}`);
  for (const t of tables.slice(0, 10)) {
    console.log(`  - ${t.table_name}`);
  }
} catch (e) {
  console.log("✗ Erreur:", e.message);
} finally {
  await db.$disconnect();
}
