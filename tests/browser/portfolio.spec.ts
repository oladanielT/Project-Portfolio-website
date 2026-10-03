import { test, expect } from "@playwright/test";

test("homepage and case studies preserve the supplied work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Oluwapelumi",
  );
  await expect(
    page.getByRole("heading", { name: "The person behind the process." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore the project" }).first().click();
  await expect(page).toHaveURL(/\/work\/exampreps360$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Exampreps360",
  );
  await expect(
    page.getByText("6 major exam categories supported:", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "All selected work", exact: false })
    .click();
  await expect(page).toHaveURL(/\/#work$/);
  expect(errors).toEqual([]);
});

test("mobile navigation and layout work without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: /Menu \+|Close −/ });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "The work", exact: true }).click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});

test("reduced motion keeps all content visible and disables smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-name")).toHaveCSS("opacity", "1");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "Have a role or project in mind?" }),
  ).toBeVisible();
});

test("disconnected admin provides setup, never an editing bypass", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ready whenyou are.",
  );
  await page.goto("/admin/preview");
  await expect(page).toHaveURL(/\/admin$/);
  for (const endpoint of ["content", "upload", "inquiries"]) {
    expect((await request.get(`/api/admin/${endpoint}`)).status()).toBe(401);
    expect(
      (
        await request.post(`/api/admin/${endpoint}`, {
          headers: { origin: "http://localhost:4317" },
          data: { action: "save", version: 0 },
        })
      ).status(),
    ).toBe(401);
  }
  expect(
    (
      await request.post("/api/admin/content", {
        headers: { origin: "https://attacker.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.get("/api/media/11111111-1111-1111-1111-111111111111")
    ).status(),
  ).toBe(404);
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: "http://localhost:4317" },
        data: {},
      })
    ).status(),
  ).toBe(503);
});

test("missing projects have a useful not-found page", async ({ page }) => {
  await page.goto("/work/not-a-project");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "This page hasn’t",
  );
  await expect(
    page.getByRole("link", { name: "Back to portfolio" }),
  ).toHaveAttribute("href", "/");
});

test("desktop and mobile portraits load and layouts remain contained", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect
    .poll(
      () =>
        page
          .locator(".portrait-frame img")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      { timeout: 20000 },
    )
    .toBe(true);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "/tmp/portfolio-desktop.png" });
  async function prepareFullScreenshot() {
    await page.locator("img").evaluateAll((images) => {
      images.forEach((image) => {
        image.loading = "eager";
      });
    });
    await expect
      .poll(
        () =>
          page
            .locator("img")
            .evaluateAll((images) =>
              images.every((image) => image.complete && image.naturalWidth > 0),
            ),
        { timeout: 20000 },
      )
      .toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await prepareFullScreenshot();
  await page.screenshot({ path: "/tmp/portfolio-full.png", fullPage: true });
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        { message: `overflow at ${width}px` },
      )
      .toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await prepareFullScreenshot();
  await page.screenshot({ path: "/tmp/portfolio-mobile.png", fullPage: true });
});
