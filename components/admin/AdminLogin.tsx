"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { browserClient } from "@/lib/supabase/browser";
export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const db = browserClient();
      const { error } = await db.auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      if (error)
        throw new Error("Unable to sign in. Check your email and password.");
      const {
        data: { user },
      } = await db.auth.getUser();
      const { data } = await db
        .from("portfolio_admins")
        .select("user_id")
        .eq("user_id", user?.id || "")
        .maybeSingle();
      if (!data) {
        await db.auth.signOut();
        throw new Error(
          "This account does not have portfolio administrator access.",
        );
      }
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to sign in. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-gate">
      <Link href="/" className="admin-wordmark">
        Portfolio studio<span>.</span>
      </Link>
      <p className="eyebrow">A SPACE TO MAKE IT YOURS</p>
      <h1>
        Welcome
        <br />
        <em>back.</em>
      </h1>
      <p>
        Sign in to update your work, tell your story, and keep your portfolio
        growing.
      </p>
      <form onSubmit={submit}>
        <label>
          Email address
          <input type="email" name="email" required autoComplete="username" />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Signing in…" : "Enter your studio ↗"}
        </button>
        <p className="admin-error" role="alert">
          {error}
        </p>
      </form>
      <Link className="text-link" href="/">
        ← Back to portfolio
      </Link>
    </main>
  );
}
