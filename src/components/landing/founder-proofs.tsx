import Link from "next/link";
import { NOTES_DE_MISE_A_JOUR } from "@/lib/content/fraicheur";
import { MESURES_DATE, duree, mesure } from "@/lib/offre/mesures";

/**
 * Trois preuves vérifiables sur le fondateur, partagées par l'accueil et
 * /a-propos. Rien d'inventé : 20 ans de métier (déclaré par le fondateur),
 * une mesure chronométrée (lib/offre/mesures.ts), le nombre de notes datées
 * du journal public (lib/content/fraicheur.ts). Pas d'« années d'usage de
 * Claude » ni de nombre de clients : aucune source.
 */
export function FounderProofs({ className = "" }: { className?: string }) {
  const fiche = mesure("R1");
  const preuves = [
    {
      titre: "20 ans dans l'hôtellerie-restauration",
      detail:
        "Un métier de terrain, où une heure gagnée se voit dans la journée. Pas un parcours tech.",
    },
    ...(fiche
      ? [
          {
            titre: `Une fiche technique chiffrée : ${duree(fiche.sans)} avant, ${duree(fiche.avec)} avec Claude`,
            detail: `Chronométré le ${MESURES_DATE}, relecture comprise. C'est la méthode enseignée dans la formation.`,
          },
        ]
      : []),
    {
      titre: `${NOTES_DE_MISE_A_JOUR} notes de mise à jour datées, toutes publiques`,
      detail: "Chaque correction de leçon est écrite, datée et lisible par tous.",
      lien: { href: "/changelog", label: "Lire le journal" },
    },
  ];

  return (
    <ul className={`space-y-3 ${className}`}>
      {preuves.map((p) => (
        <li
          key={p.titre}
          className="rounded-[18px] border border-line bg-cream-soft px-5 py-4"
        >
          <p className="font-semibold text-ink text-[15px] leading-snug">
            {p.titre}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            {p.detail}
            {"lien" in p && p.lien ? (
              <>
                {" "}
                <Link
                  href={p.lien.href}
                  className="text-coral font-medium underline-offset-2 hover:underline"
                >
                  {p.lien.label}
                </Link>
              </>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
}
