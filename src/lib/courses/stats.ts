import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type CatalogStats = {
  courseCount: number;
  lessonCount: number;
  totalMinutes: number;
};

/**
 * Repli si la base est injoignable (ex. projet Supabase en pause) : la
 * landing ne doit JAMAIS planter à cause d'un compteur marketing. Valeurs
 * volontairement prudentes — la vraie source de vérité reste la base.
 */
const FALLBACK: CatalogStats = { courseCount: 7, lessonCount: 28, totalMinutes: 0 };

/**
 * Stats du catalogue calculées depuis la base (source de vérité unique pour
 * « X parcours · Y leçons »). `cache()` déduplique l'appel sur un même rendu :
 * plusieurs composants peuvent l'appeler sans multiplier les requêtes.
 */
export const getCatalogStats = cache(async (): Promise<CatalogStats> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("total_lessons, estimated_duration_min");
    if (error || !data || data.length === 0) return FALLBACK;
    return {
      courseCount: data.length,
      lessonCount: data.reduce((s, c) => s + (c.total_lessons ?? 0), 0),
      totalMinutes: data.reduce((s, c) => s + (c.estimated_duration_min ?? 0), 0),
    };
  } catch {
    return FALLBACK;
  }
});
