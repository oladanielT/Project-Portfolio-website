import Link from "next/link";
import { configured } from "@/lib/supabase/config";
import { adminSession } from "@/lib/supabase/server";
import AdminLogin from "@/components/admin/AdminLogin";
import Editor from "@/components/admin/Editor";
import "./admin.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Portfolio studio",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (!configured())
    return (
      <main className="admin-gate">
        <Link href="/" className="admin-wordmark">
          Portfolio studio<span>.</span>
        </Link>
        <p className="eyebrow">YOUR CONTENT, YOUR SPACE</p>
        <h1>
          Ready when
          <br />
          <em>you are.</em>
        </h1>
        <p>
          The portfolio is live with your existing content. Connect Supabase to
          unlock editing, private drafts, media uploads, and publishing.
        </p>
        <ol>
          <li>Create a Supabase project.</li>
          <li>
            Run the SQL migration in <code>supabase/migrations</code>.
          </li>
          <li>
            Add the project URL, publishable key, and server-only service key to{" "}
            <code>.env.local</code>.
          </li>
          <li>
            Create your admin user and grant membership as described in the
            README.
          </li>
          <li>Restart the app and return here to sign in.</li>
        </ol>
        <Link className="button button-primary" href="/">
          Back to portfolio ↗
        </Link>
      </main>
    );
  const session = await adminSession();
  return session ? (
    <Editor
      email={session.user.email || "Administrator"}
      mediaReady={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
    />
  ) : (
    <AdminLogin />
  );
}
