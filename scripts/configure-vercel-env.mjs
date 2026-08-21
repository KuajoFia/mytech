#!/usr/bin/env node
/**
 * Configure Vercel env vars via REST API.
 * Updates DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_BOOTSTRAP_PASSWORD.
 *
 * Usage:
 *   VERCEL_TOKEN="your-token" bun run scripts/configure-vercel-env.mjs
 *   # OR pass values via env:
 *   VERCEL_TOKEN="..." DATABASE_URL="..." NEXTAUTH_SECRET="..." \
 *     NEXTAUTH_URL="..." ADMIN_BOOTSTRAP_PASSWORD="..." \
 *     bun run scripts/configure-vercel-env.mjs
 *
 * Required env:
 *   - VERCEL_TOKEN (https://vercel.com/account/tokens)
 * Optional env (defaults to known project):
 *   - VERCEL_PROJECT_ID (default: prj_BZGawfJim2tMtH0kMgkDEY9SzFZl)
 *   - VERCEL_TEAM_ID   (default: team_9rSN6AFXwOAHBSB6yGTKLHua)
 *   - DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_BOOTSTRAP_PASSWORD
 */
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "prj_BZGawfJim2tMtH0kMgkDEY9SzFZl";
const TEAM_ID = process.env.VERCEL_TEAM_ID || "team_9rSN6AFXwOAHBSB6yGTKLHua";
const API = "https://api.vercel.com";

if (!VERCEL_TOKEN) {
  console.error("❌ VERCEL_TOKEN not set. Get one at https://vercel.com/account/tokens");
  process.exit(1);
}

const VARS = [
  {
    key: "DATABASE_URL",
    value: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  },
  {
    key: "NEXTAUTH_SECRET",
    value: process.env.NEXTAUTH_SECRET,
  },
  {
    key: "NEXTAUTH_URL",
    value: process.env.NEXTAUTH_URL || "https://mytech-my-des.vercel.app",
  },
  {
    key: "ADMIN_BOOTSTRAP_PASSWORD",
    value: process.env.ADMIN_BOOTSTRAP_PASSWORD || "agbe-admin-2026",
  },
].filter((v) => v.value);

async function getExistingEnvs() {
  const url = `${API}/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (!res.ok) throw new Error(`get envs failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.envs || [];
}

async function deleteEnv(envId, key) {
  const url = `${API}/v9/projects/${PROJECT_ID}/env/${envId}?teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (!res.ok) {
    console.log(`    ⚠️  Could not delete ${key}: ${res.status}`);
  } else {
    console.log(`    ✓ deleted old ${key}`);
  }
}

async function createEnv(key, value, target) {
  const url = `${API}/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: [target],
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`create ${key}/${target} failed: ${res.status} ${txt}`);
  }
}

async function main() {
  console.log("🚀 Configuration des variables d'environnement Vercel");
  console.log("===================================================");
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Team:    ${TEAM_ID}`);
  console.log(`Vars:   ${VARS.map((v) => v.key).join(", ")}`);

  const existing = await getExistingEnvs();
  console.log(`\n📋 Existing envs: ${existing.length}`);

  for (const { key, value } of VARS) {
    console.log(`\n⚙️  Setting ${key}...`);
    const matches = existing.filter((e) => e.key === key);
    for (const m of matches) {
      await deleteEnv(m.id, key);
    }
    for (const target of ["production", "preview", "development"]) {
      await createEnv(key, value, target);
      console.log(`    ✓ created ${key} (${target})`);
    }
  }

  console.log("\n✅ All variables configured !");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
