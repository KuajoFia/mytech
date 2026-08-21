/**
 * Add SETUP_DB_TOKEN to Vercel env vars.
 */
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = "prj_BZGawfJim2tMtH0kMgkDEY9SzFZl";
const TEAM_ID = "team_9rSN6AFXwOAHBSB6yGTKLHua";
const API = "https://api.vercel.com";

const TOKEN = "setup-token-" + Date.now();

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
  if (!res.ok) throw new Error(`create ${key}/${target}: ${res.status} ${await res.text()}`);
}

async function main() {
  for (const target of ["production", "preview", "development"]) {
    await createEnv("SETUP_DB_TOKEN", TOKEN, target);
    console.log(`✓ SETUP_DB_TOKEN (${target}) = ${TOKEN}`);
  }
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
