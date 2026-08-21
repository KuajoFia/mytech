/**
 * Update only DATABASE_URL on Vercel to use the IPv4 pooler.
 */
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = "prj_BZGawfJim2tMtH0kMgkDEY9SzFZl";
const TEAM_ID = "team_9rSN6AFXwOAHBSB6yGTKLHua";
const API = "https://api.vercel.com";

const NEW_DATABASE_URL = "postgresql://postgres.fkjomoctlukymwrzkcqj:Lapaix%401311@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";

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
  return res.ok;
}

async function createEnv(key, value, target) {
  const url = `${API}/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, value, type: "encrypted", target: [target] }),
  });
  if (!res.ok) throw new Error(`create ${key}/${target} failed: ${res.status} ${await res.text()}`);
}

async function main() {
  console.log("🔄 Update DATABASE_URL to use Supabase IPv4 pooler...");
  const existing = await getExistingEnvs();
  const matches = existing.filter((e) => e.key === "DATABASE_URL");
  console.log(`Found ${matches.length} existing DATABASE_URL entries`);
  for (const m of matches) {
    await deleteEnv(m.id, "DATABASE_URL");
    console.log(`  ✓ deleted old DATABASE_URL (${m.target.join(",")})`);
  }
  for (const target of ["production", "preview", "development"]) {
    await createEnv("DATABASE_URL", NEW_DATABASE_URL, target);
    console.log(`  ✓ created DATABASE_URL (${target})`);
  }
  console.log("\n✅ DATABASE_URL updated with IPv4 pooler URL");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
