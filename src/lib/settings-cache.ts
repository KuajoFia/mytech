/**
 * Cached settings — avoids hitting the DB on every PDF render and admin page.
 * TTL: 5 minutes. Re-validated on PATCH via tag.
 */
import { unstable_cache } from "next/cache";
import { db } from "./db";

export type CachedSettings = Awaited<ReturnType<typeof db.settings.findFirst>>;

export const getCachedSettings = unstable_cache(
  async () => {
    return db.settings.findFirst();
  },
  ["settings-singleton"],
  {
    revalidate: 300, // 5 minutes
    tags: ["settings"],
  }
);

/**
 * Call this after settings PATCH to invalidate the cache.
 * In Next.js 16, revalidateTag requires a profile arg, so we use updateTag
 * which has a single-arg signature and triggers a refresh.
 */
export async function invalidateSettingsCache() {
  const { updateTag } = await import("next/cache");
  updateTag("settings");
}
