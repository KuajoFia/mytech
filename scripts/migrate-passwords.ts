/**
 * One-shot: migrate existing plaintext admin password to bcrypt hash.
 * Run once: bun run scripts/migrate-passwords.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const users = await db.user.findMany({ where: { passwordHash: { not: null } } });
  let migrated = 0;
  for (const u of users) {
    const hash = u.passwordHash!;
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) continue;
    // Plaintext → bcrypt
    const newHash = await bcrypt.hash(hash, 10);
    await db.user.update({ where: { id: u.id }, data: { passwordHash: newHash } });
    migrated++;
    console.log(`  → ${u.email ?? u.phone} migrated`);
  }
  console.log(`✓ ${migrated} user(s) migrated to bcrypt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
