/**
 * Mark all /admin, /compte, /blog, /boutique, /realisations, /services pages
 * as force-dynamic so they don't try to prerender at build time on Vercel
 * (where the SQLite file isn't available).
 *
 * These pages require DB access and should be rendered on-demand.
 */
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const PAGES = [
  ...globSync("src/app/admin/**/page.tsx"),
  ...globSync("src/app/compte/**/page.tsx"),
  ...globSync("src/app/blog/**/page.tsx"),
  ...globSync("src/app/boutique/**/page.tsx"),
  ...globSync("src/app/realisations/**/page.tsx"),
  ...globSync("src/app/services/**/page.tsx"),
];

const MARKER = 'export const dynamic = "force-dynamic";';

let modified = 0;
for (const path of PAGES) {
  const content = readFileSync(path, "utf8");
  if (content.includes(MARKER)) continue;
  const lines = content.split("\n");
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImportIdx = i;
  }
  if (lastImportIdx === -1) continue;
  lines.splice(lastImportIdx + 1, 0, "", MARKER, "");
  writeFileSync(path, lines.join("\n"));
  console.log(`  → ${path}`);
  modified++;
}
console.log(`✓ ${modified} pages marked as force-dynamic.`);
