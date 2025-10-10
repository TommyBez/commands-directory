import { test, expect } from "@playwright/test";

test.describe("Cursor Commands Explorer", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Cursor Commands Explorer/);
    await expect(
      page.getByRole("heading", { name: /Master Your Workflow/i }),
    ).toBeVisible();
  });

  test("should navigate to commands page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "View All Commands" }).click();
    await expect(page).toHaveURL(/\/commands/);
    await expect(
      page.getByRole("heading", { name: "Search Commands" }),
    ).toBeVisible();
  });

  test("should search for commands", async ({ page }) => {
    await page.goto("/commands");
    await page.getByPlaceholder("Search commands...").fill("go to definition");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/q=go\+to\+definition/);
  });

  test("should filter commands by OS", async ({ page }) => {
    await page.goto("/commands");
    await page.getByRole("combobox", { name: /Operating System/i }).click();
    await page.getByRole("option", { name: "Mac" }).click();
    await expect(page).toHaveURL(/os=mac/);
  });

  test("should navigate to command detail page", async ({ page }) => {
    await page.goto("/commands");
    const firstCommand = page.locator('[href^="/commands/"]').first();
    await firstCommand.click();
    await expect(page).toHaveURL(/\/commands\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
