import { mkdir, writeFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
const fixture = new URL("../app/studio-test-fixture/", import.meta.url);
const env = {
  ...process.env,
  PORTFOLIO_E2E_BUILD: "1",
  SITE_URL: "http://localhost:4317",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
  SUPABASE_SERVICE_ROLE_KEY: "",
};
function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} exited with ${code}`)),
    );
  });
}
try {
  await mkdir(fixture, { recursive: true });
  await writeFile(
    new URL("page.tsx", fixture),
    'import Editor from "@/components/admin/Editor"; import "../admin/admin.css"; export default function Fixture(){return <Editor email="owner@example.com" mediaReady/>;}',
    { flag: "wx" },
  );
  try {
    await run("npm", ["run", "build"]);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
  await run("npx", ["playwright", "test", ...process.argv.slice(2)]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
