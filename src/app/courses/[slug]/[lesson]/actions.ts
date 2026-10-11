"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markLessonCompleteAction(formData: FormData) {
  const lessonId = String(formData.get("lesson_id") ?? "").trim();
  const nextHref = String(formData.get("next_href") ?? "").trim();

  if (!lessonId) redirect("/courses");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/courses")}`);
  }

  // Ré-appui sans planter (unique sur user_id, lesson_id). ignoreDuplicates :
  // un upsert classique tente un UPDATE au second clic, refusé par la RLS
  // (aucune règle UPDATE sur lesson_progress, et il n'en faut pas).
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      { user_id: user.id, lesson_id: lessonId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error("[mark complete] insert failed:", error.message);
  }

  revalidatePath("/courses", "layout");

  if (nextHref) {
    redirect(nextHref);
  }
  // Reste sur la page courante (la revalidation rafraîchit le rendu)
  redirect(formData.get("current_path")?.toString() ?? "/courses");
}
