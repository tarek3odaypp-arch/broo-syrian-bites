import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://vbiokafypdnxfllshasg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_MG0DmVGmuOJNTot-jIQNXw_EO-CZD9h";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
