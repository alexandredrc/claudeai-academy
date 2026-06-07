import { redirect } from "next/navigation";

// Les anciens liens /programme/<slug> (footer historique) pointent vers le
// catalogue réel des parcours. Quand des pages programme dédiées existeront,
// remplacer ce redirect par le vrai contenu.
export default async function ProgrammeRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  redirect("/courses");
}
