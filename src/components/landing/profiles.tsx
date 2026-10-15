import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { createClient } from "@/lib/supabase/server";

// Public choisi par le fondateur le 15/10/2026 : indépendants et TPE non
// techniques (carrossier, institut, restauratrice, consultant : ce sont les
// métiers des avis réels). Une offre précise pour un public précis convertit
// mieux qu'une liste qui parle à tout le monde (Hormozi, « $100M Offers »).
//
// Chaque tâche citée correspond à un prompt ou à une leçon qui existe :
// « Email difficile à rédiger », « Séquence de relance commerciale »,
// « Compte rendu de réunion structuré », « Synthèse de document long »,
// « Procédure opérationnelle (SOP) », « Rédaction de fiche de poste »,
// « Grille de questions d'entretien », « Feedback à un collaborateur »,
// « Script vidéo courte », leçons « Personnaliser Claude » et « Claude là où
// tu travailles déjà ». Ne rien ajouter ici qui ne soit pas dans le catalogue.
const profiles = [
  {
    label: "Artisans et métiers de terrain",
    body:
      "Vos journées se passent sur le chantier ou à l'atelier, l'administratif attend le soir : le client mécontent à qui répondre, la facture à relancer, le devis à expliquer. Vous apprenez à faire écrire ces messages par Claude avec les bonnes informations, puis à les relire avant d'envoyer.",
  },
  {
    label: "Commerces, instituts, restaurants",
    body:
      "Vous répondez aux clients et publiez sur les réseaux entre deux rendez-vous ou deux services. Vous apprenez à donner une fois pour toutes à Claude le ton de votre maison, pour qu'il écrive comme vous et pas comme un robot.",
  },
  {
    label: "Consultants et indépendants",
    body:
      "Vous vendez votre temps : chaque heure passée sur un compte rendu, une synthèse de document ou un email délicat est une heure non facturée. Vous apprenez à les faire produire par Claude à partir de vos notes, y compris dans Word et Outlook.",
  },
  {
    label: "Dirigeants de petite entreprise",
    body:
      "Vous êtes à la fois patron, RH et service client. Procédure à écrire pour l'équipe, fiche de poste, entretien d'embauche, retour difficile à un salarié : Claude prépare la première version, vous gardez la décision.",
  },
];

// Le chemin le plus court vers un premier résultat (principe : réduire
// l'effort perçu). Titres et durées lus en base pour rester justes après
// un re-seed ; si une leçon manque, le bloc entier disparaît plutôt que
// d'afficher un chemin faux.
const PREMIERES_LECONS = [
  "personnaliser-claude-dites-lui-qui-vous-etes",
  "etre-clair-et-direct",
  "claude-dans-excel-powerpoint-word-et-chrome",
];

type Lecon = {
  slug: string;
  title: string;
  duration_min: number;
  is_free_preview: boolean;
  courseSlug: string;
};

async function premieresLecons(): Promise<Lecon[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("slug, title, duration_min, is_free_preview, courses(slug)")
      .in("slug", PREMIERES_LECONS);
    if (error || !data || data.length !== PREMIERES_LECONS.length) return null;
    const parSlug = new Map(
      data.map((l) => {
        const course = Array.isArray(l.courses) ? l.courses[0] : l.courses;
        return [
          l.slug as string,
          {
            slug: l.slug as string,
            title: l.title as string,
            duration_min: (l.duration_min as number) ?? 0,
            is_free_preview: Boolean(l.is_free_preview),
            courseSlug: (course as { slug?: string } | null)?.slug ?? "",
          },
        ];
      }),
    );
    return PREMIERES_LECONS.map((s) => parSlug.get(s)).filter(
      (l): l is Lecon => Boolean(l && l.courseSlug),
    );
  } catch {
    return null;
  }
}

export async function Profiles() {
  const lecons = await premieresLecons();
  const chemin = lecons && lecons.length === PREMIERES_LECONS.length ? lecons : null;
  const minutes = chemin ? chemin.reduce((s, l) => s + l.duration_min, 0) : 0;

  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-14">
          <Eyebrow align="center">Pour qui c&apos;est</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Vous faites tourner une petite entreprise.{" "}
            <span className="accent-serif">L&apos;administratif vous prend vos soirées.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[620px] mx-auto">
            La formation est écrite pour des gens qui n&apos;ont jamais codé. La
            méthode est la même dans tous les métiers : Claude écrit le premier
            jet, vous relisez et vous décidez.
          </p>
        </div>

        {/* Liste éditoriale, pas une grille de 4 cartes */}
        <dl className="divide-y divide-line border-y border-line">
          {profiles.map((p) => (
            <div
              key={p.label}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-12 py-7 md:py-8"
            >
              <dt className="font-serif text-xl md:text-[1.35rem] font-semibold text-ink leading-snug">
                {p.label}
              </dt>
              <dd className="text-[15px] md:text-base leading-relaxed text-ink-soft">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>

        {chemin ? (
          <div className="mt-14 bg-white border border-line rounded-[22px] p-8 md:p-10">
            <h3 className="font-serif text-2xl font-medium text-ink">
              Par où commencer : {chemin.length} leçons, {minutes} minutes en tout
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Inutile de tout suivre dans l&apos;ordre. Ces trois leçons vous
              apprennent à présenter votre activité à Claude, à formuler une
              demande claire, et à vous en servir dans Word, Excel ou Outlook.
            </p>
            <ol className="mt-6 space-y-4">
              {chemin.map((l, i) => (
                <li key={l.slug} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral-soft font-serif font-semibold text-coral-dark"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink-soft">
                    {l.is_free_preview ? (
                      <Link
                        href={`/courses/${l.courseSlug}/${l.slug}`}
                        className="font-semibold text-ink underline underline-offset-4 decoration-line hover:text-coral transition-colors"
                      >
                        {l.title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-ink">{l.title}</span>
                    )}
                    <span className="text-muted">
                      {" "}
                      · {l.duration_min} min
                      {l.is_free_preview ? " · en accès libre" : " · dès le Pass Starter"}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
