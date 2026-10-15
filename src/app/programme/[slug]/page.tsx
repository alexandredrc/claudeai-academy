import { permanentRedirect } from "next/navigation";

// Les anciens liens /programme/<slug> (footer historique) pointent vers le
// catalogue réel des parcours. Redirection permanente (308) : les moteurs
// transfèrent la valeur du lien et cessent de revisiter l'ancienne adresse
// (audit SEO du 15/10/2026, point 25). Quand des pages programme dédiées
// existeront, remplacer cette redirection par le vrai contenu.
export default async function ProgrammeRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  permanentRedirect("/courses");
}
