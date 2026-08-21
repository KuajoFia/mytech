/**
 * Trigger a new deployment on Vercel using the latest main branch HEAD.
 */
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = "prj_BZGawfJim2tMtH0kMgkDEY9SzFZl";
const TEAM_ID = "team_9rSN6AFXwOAHBSB6yGTKLHua";
const API = "https://api.vercel.com";

async function main() {
  // Get the latest deployment sha from main branch (v6 API)
  const url = `${API}/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=1&target=production`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (!res.ok) throw new Error(`list deploys failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const lastSha = data.deployments[0]?.meta?.githubCommitSha;
  if (!lastSha) throw new Error("no latest deployment found");
  console.log("Latest production SHA:", lastSha);

  // Trigger a new deployment with the same SHA
  const createUrl = `${API}/v13/deployments?teamId=${TEAM_ID}`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "mytech",
      gitSource: {
        type: "github",
        repoId: 1338901759,
        ref: "main",
        sha: lastSha,
      },
      target: "production",
    }),
  });
  if (!createRes.ok) {
    const txt = await createRes.text();
    throw new Error(`create deployment failed: ${createRes.status} ${txt}`);
  }
  const newDep = await createRes.json();
  console.log("✅ New deployment triggered!");
  console.log("ID:", newDep.id || newDep.uid);
  console.log("URL: https://" + newDep.url);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
