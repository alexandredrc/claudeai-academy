import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CourseTier = "free" | "starter" | "mastery";

/**
 * Vérifie si l'utilisateur connecté a accès au tier requis.
 * Respecte la hiérarchie : mastery > starter > free.
 * Utilise la fonction SQL public.user_has_tier() côté Supabase.
 */
export async function userHasTier(
  supabase: SupabaseClient,
  required: CourseTier,
): Promise<boolean> {
  if (required === "free") return true;
  const { data, error } = await supabase.rpc("user_has_tier", { required });
  if (error) {
    console.error("[access] user_has_tier RPC failed:", error.message);
    return false;
  }
  return Boolean(data);
}
