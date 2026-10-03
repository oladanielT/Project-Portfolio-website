import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
test("editor saves drafts, blocks publishing unsaved edits, publishes, and handles conflicts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let content = JSON.parse(
    await readFile(path.join(process.cwd(), "content/site.json"), "utf8"),
  );
  let version = 1;
  let published = false;
  let conflict = false;
  await page.route("**/api/admin/content", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({
        json: {
          content,
          version,
          revisions: [],
          publishedAt: published ? new Date().toISOString() : null,
        },
      });
    const body = route.request().postDataJSON();
    if (body.action === "save") {
      if (conflict)
        return route.fulfill({
          status: 409,
          json: {
            error: "Draft changed in another session. Reload before saving.",
          },
        });
      content = body.content;
      version++;
      return route.fulfill({ json: { content, version } });
    }
    if (body.action === "publish") {
      published = true;
      return route.fulfill({ json: { published: true } });
    }
    return route.fulfill({ status: 400, json: { error: "Unexpected action" } });
  });
  await page.goto("/studio-test-fixture");
  await expect(
    page.getByRole("heading", { name: "A little progress, every day." }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/portfolio-admin.png", fullPage: true });
  await page
    .getByRole("button", { name: "Introduction", exact: false })
    .click();
  await page
    .getByLabel("Full name")
    .fill("Oluwapelumi Tiwaloluwa Ayodeji Updated");
  await expect(
    page.getByRole("button", { name: "Publish ↗", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  expect(published).toBe(false);
  await expect(
    page.getByRole("link", { name: "Preview", exact: true }),
  ).toHaveAttribute("href", "/admin/preview");
  await page.getByRole("button", { name: "Publish ↗", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Publish ↗", exact: true }).click();
  await page
    .getByRole("button", { name: "Publish now ↗", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("published");
  expect(published).toBe(true);
  await page
    .getByRole("button", { name: "Selected work", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Add project +", exact: true })
    .click();
  await expect(page.getByLabel("Project title")).toHaveCount(4);
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  expect(content.projects.length).toBe(4);
  conflict = true;
  await page.getByLabel("Project title").last().fill("Conflicting edit");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "another session" }),
  ).toContainText("another session");
  await expect(page.getByLabel("Project title").last()).toHaveValue(
    "Conflicting edit",
  );
  expect(errors).toEqual([]);
});
