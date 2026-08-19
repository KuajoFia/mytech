import { test, expect } from "@playwright/test";

/**
 * Smoke tests — verify key public pages load and respond 200.
 * Run with: bun run test:e2e
 */

test.describe("Public pages smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AGBE-TECH/);
    await expect(page.locator("header").first()).toBeVisible();
  });

  test("boutique page loads", async ({ page }) => {
    await page.goto("/boutique");
    await expect(page.locator("body")).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
  });

  test("admin connexion page loads", async ({ page }) => {
    await page.goto("/admin/connexion");
    await expect(page.locator("body")).toBeVisible();
  });

  test("404 page shows for non-existent route", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).toContainText(/404|introuvable/i);
  });
});
