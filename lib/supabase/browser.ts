"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./config";
export const browserClient = () =>
  createBrowserClient(supabaseUrl(), supabaseKey());
