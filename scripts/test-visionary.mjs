import { mkdir, writeFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import assert from "node:assert/strict";
import { chromium } from "playwright";

// Ephemeral route: never edits published content or requires an admin bypass.
const fixture = new URL("../app/visionary-test-fixture/", import.meta.url);
const origin = "http://localhost:4321";
let server;
let browser;
let created = false;
let logs = "";
const source = `import Portfolio from "@/components/templates/Visionary/Portfolio";
import CaseStudy from "@/components/CaseStudy";
import seed from "@/content/site.json";
import { siteSchema } from "@/lib/schema";
export default async function Fixture({searchParams}: {searchParams: Promise<Record<string,string>>}) {
const query = await searchParams;
const c = siteSchema.parse({...seed, template: "visionary", colorMode: query.theme || "light"});
for (const key of Object.keys(c.sections) as (keyof typeof c.sections)[]) c.sections[key] = true;
c.contact.formEnabled = true;
if (!c.tools.length) c.tools = [{name:"Figma",purpose:"Design and prototyping",logo:""},{name:"Notion",purpose:"Planning and documentation",logo:""},{name:"Linear",purpose:"Product delivery",logo:""}];
if (!c.organizations.length) c.organizations = [{name:"Example Studio",detail:"Product collaboration",url:""}];
if (!c.expertise.length) c.expertise = [{title:"Product strategy",description:"Taking a product from the first insight to a clear direction.",skills:["Research","Roadmapping"]}];
if (!c.process.length) c.process = [{title:"Discover",description:"Understand the problem."},{title:"Define",description:"Set a clear direction."},{title:"Deliver",description:"Build, learn and improve."}];
if (!c.testimonial.quote) c.testimonial = {quote: "A thoughtful partner from the first idea to the final result.", name: "Test reviewer", role: "Collaborator"};
if (query.sparse) {
  for (const key of Object.keys(c.sections) as (keyof typeof c.sections)[]) c.sections[key] = false;
  c.hero.name = "Alexanderthevisionarywithaverylongname Example";
  c.hero.photo = ""; c.about.photo = ""; c.contact.formEnabled = false;
}
if (query.empty) { c.projects=[]; c.organizations=[]; c.expertise=[]; c.services=[]; c.skills=[]; c.process=[]; c.tools=[]; c.testimonial.quote=""; c.about={...c.about,heading:"",photo:"",paragraphs:[],stat:{value:"",label:""}}; }
if (query.single) { c.projects=c.projects.slice(0,1).map(p=>({...p, cover:"",featured:false})); c.about.photo=""; c.tools=c.tools.map(t=>({...t,logo:""})); }
return query.case ? <CaseStudy content={c} index={0} preview={Boolean(query.preview)} /> : <Portfolio content={c} contactReady={!query.offline} preview={Boolean(query.preview)} />;
}`;
try {
  await mkdir(fixture);
  created = true;
  await writeFile(new URL("page.tsx", fixture), source, { flag: "wx" });
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--port", "4321"],
    {
      env: {
        ...process.env,
        PORTFOLIO_E2E_BUILD: "1",
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  for (const stream of [server.stdout, server.stderr])
    stream.on("data", (chunk) => {
      logs += chunk;
    });
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error(logs);
    try {
      const response = await fetch(`${origin}/visionary-test-fixture`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert(ready, `Fixture server failed: ${logs}`);
  browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${origin}/visionary-test-fixture`);
  await page.locator(".v-header").waitFor();
  await page.evaluate(() => document.fonts.ready);
  for (const id of [
    "work",
    "about",
    "expertise",
    "process",
    "tools",
    "contact",
  ])
    assert.equal(await page.locator(`#${id}`).count(), 1, `${id} rendered`);
  assert(
    (await page.locator(".v-about-copy .v-body").count()) > 0,
    "About paragraphs render",
  );
  assert((await page.locator(".v-tool h3").count()) > 0, "Tool objects render");
  assert.equal(await page.locator(".v-testimonial").count(), 1);
  assert.equal(await page.locator(".contact-form").count(), 1);
  assert.equal(
    await page.locator(".v-project").first().getAttribute("class"),
    "v-project v-project-featured",
  );
  assert.match(
    await page.locator(".v-project-link").first().getAttribute("href"),
    /^\/work\//,
  );
  await page.screenshot({ path: "/tmp/visionary-desktop.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .locator("img")
    .evaluateAll((images) =>
      images.forEach((image) => (image.loading = "eager")),
    );
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete),
  );
  await page.screenshot({ path: "/tmp/visionary-full.png", fullPage: true });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow at ${width}`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/tmp/visionary-mobile.png", fullPage: true });
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true");
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Selected work/ })
    .click();
  assert.equal(await menu.getAttribute("aria-expanded"), "false");
  await menu.click();
  await page.keyboard.press("Escape");
  assert(
    await menu.evaluate((button) => button === document.activeElement),
    "Escape restores menu focus",
  );
  assert.equal(
    await page
      .locator(".v-sculpture-spin")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.route("**/api/contact", (route) =>
    route.fulfill({ json: { ok: true } }),
  );
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("What do you have in mind?")
    .fill("A test inquiry for the Visionary template.");
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.getByRole("status").filter({ hasText: "received" }).waitFor();
  for (const query of [
    "sparse=1",
    "empty=1",
    "single=1",
    "offline=1",
    "preview=1",
  ]) {
    await page.goto(`${origin}/visionary-test-fixture?${query}`);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow: ${query}`,
    );
    if (/sparse|empty/.test(query)) {
      assert.equal(await page.locator("#work").count(), 0);
      assert.equal(
        await page.locator(".v-actions .v-button").getAttribute("href"),
        "#contact",
      );
      assert.equal(
        await page.locator(".v-desktop-nav a[href='#work']").count(),
        0,
      );
    }
    if (/offline|preview/.test(query))
      assert.equal(await page.locator(".contact-form").count(), 0);
    if (/preview/.test(query))
      assert.match(
        await page.locator(".v-project-link").first().getAttribute("href"),
        /^\/admin\/preview\/work\//,
      );
    if (/single/.test(query))
      assert.equal(await page.locator(".v-project-placeholder").count(), 1);
  }
  await page.goto(`${origin}/visionary-test-fixture?case=1`);
  assert.equal(
    await page.locator(".v-case-header h1").textContent(),
    "Exampreps360",
  );
  assert((await page.locator(".v-case-block").count()) > 1);
  assert.equal(
    await page
      .getByRole("link", { name: "← All selected work" })
      .getAttribute("href"),
    "/#work",
  );
  await page.screenshot({
    path: "/tmp/visionary-case-mobile.png",
    fullPage: true,
  });
  await page.goto(`${origin}/visionary-test-fixture?case=1&preview=1`);
  assert.equal(
    await page
      .getByRole("link", { name: "← All selected work" })
      .getAttribute("href"),
    "/admin/preview#work",
  );
  for (const theme of [
    "light",
    "dark",
    "vibrant",
    "pitch-black",
    "cream",
    "monochrome",
    "sunset",
    "ocean",
    "forest",
    "candy",
  ]) {
    await page.goto(`${origin}/visionary-test-fixture?theme=${theme}`);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow in ${theme}`,
    );
    if (theme === "dark") {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: "/tmp/visionary-dark.png" });
      await page.setViewportSize({ width: 390, height: 844 });
    }
  }
  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await noJS.goto(`${origin}/visionary-test-fixture`);
  assert(
    await noJS.locator("#work").isVisible(),
    "Projects visible without JavaScript",
  );
  assert(
    await noJS.locator("#about").isVisible(),
    "About visible without JavaScript",
  );
  assert.deepEqual(errors, [], "No runtime errors");
  console.log(
    "PASS: all sections, five viewport sizes, ten themes, mobile menu, reduced motion, form submission, sparse/empty data, image fallbacks, case studies, preview links, and no-JS content.",
  );
  console.log(
    "Screenshots: /tmp/visionary-{desktop,full,mobile,dark,case-mobile}.png",
  );
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
  if (created) await rm(fixture, { recursive: true, force: true });
}
