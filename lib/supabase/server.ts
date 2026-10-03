import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { configured, supabaseKey, supabaseUrl } from "./config";
export async function serverClient() {
  if (!configured()) throw new Error("Supabase is not configured");
  const store = await cookies();
  return createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Server components use refreshed middleware cookies. */
        }
      },
    },
  });
}
export async function adminSession() {
  if (!configured()) return null;
  const db = await serverClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) return null;
  const { data: admin } = await db
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return admin ? { db, user } : null;
}
