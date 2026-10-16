import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { getJournalMaj, type NoteMaj } from "@/lib/content/changelog";
import { CONTENU_A_JOUR_AU, SOURCES_SURVEILLEES } from "@/lib/content/fraicheur";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/page-metadata";

// Lu en base à chaque visite, comme les autres pages qui lisent les leçons :
// le journal suit un seed sans redéploiement.
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  path: "/changelog",
  title: "Journal des mises à jour des leçons | ClaudeAI Academy",
  description:
    "Chaque note de mise à jour datée des leçons de ClaudeAI Academy, de la plus récente à la plus ancienne : quelle leçon a changé, quand, dans quel parcours.",
});

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** « 2026-10-01 » → « 1er octobre 2026 ». */
function dateFr(iso: string): string {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j === 1 ? "1er" : j} ${MOIS[m - 1]} ${a}`;
}

/** « 2026-10-01 » → « Octobre 2026 ». */
function moisFr(iso: string): string {
  const [a, m] = iso.split("-").map(Number);
  const nom = MOIS[m - 1];
  return `${nom.charAt(0).toUpperCase()}${nom.slice(1)} ${a}`;
}

function pluriel(n: number, mot: string): string {
  return `${n} ${mot}${n > 1 ? "s" : ""}`;
}

/** Une ligne du journal : une leçon, et les notes qu'elle a reçues ce jour-là. */
type Ligne = {
  cle: string;
  lecon: NoteMaj["lecon"];
  parcours: NoteMaj["parcours"];
  notes: number;
  sujets: string[];
  /** Plages de dates (« 19 juillet au 6 août 2026 ») rangées à ce jour. */
  plages: string[];
};

type Jour = { iso: string; notes: number; lignes: Ligne[] };
type Mois = { cle: string; notes: number; jours: Jour[] };

/** Regroupe les notes (déjà triées) par mois, puis par jour, puis par leçon. */
function regrouper(notes: NoteMaj[]): Mois[] {
  const mois: Mois[] = [];
  for (const n of notes) {
    const cleMois = n.iso.slice(0, 7);
    let m = mois[mois.length - 1];
    if (!m || m.cle !== cleMois) {
      m = { cle: cleMois, notes: 0, jours: [] };
      mois.push(m);
    }
    let j = m.jours[m.jours.length - 1];
    if (!j || j.iso !== n.iso) {
      j = { iso: n.iso, notes: 0, lignes: [] };
      m.jours.push(j);
    }
    const cle = `${n.parcours.slug}/${n.lecon.slug}`;
    let l = j.lignes.find((x) => x.cle === cle);
    if (!l) {
      l = { cle, lecon: n.lecon, parcours: n.parcours, notes: 0, sujets: [], plages: [] };
      j.lignes.push(l);
    }
    l.notes++;
    j.notes++;
    m.notes++;
    if (n.sujet && !l.sujets.includes(n.sujet)) l.sujets.push(n.sujet);
    if (n.date !== dateFr(n.iso) && !l.plages.includes(n.date)) l.plages.push(n.date);
  }
  return mois;
}

export default async function ChangelogPage() {
  const { notes, totalLecons } = await getJournalMaj();
  const mois = regrouper(notes);
  const leconsTouchees = new Set(notes.map((n) => `${n.parcours.slug}/${n.lecon.slug}`)).size;
  const plusAncienne = notes.length > 0 ? dateFr(notes[notes.length - 1].iso) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Journal des mises à jour", path: "/changelog" },
          ]),
        )}
      />

      <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
          }}
        />
        <Container size="narrow" className="relative">
          <nav className="text-[13px] text-muted mb-5" aria-label="Fil d’Ariane">
            <Link href="/" className="hover:text-coral transition-colors">
              Accueil
            </Link>
            <span aria-hidden="true" className="mx-2 opacity-50">
              /
            </span>
            <span className="text-ink-soft">Journal des mises à jour</span>
          </nav>

          <Eyebrow>Journal des mises à jour</Eyebrow>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-ink">
            Ce qui a changé <span className="accent-serif">dans les leçons</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px]">
            Une veille relit {SOURCES_SURVEILLEES} sources de référence. Quand un
            fait change (un modèle, un tarif, une version de Claude Code, une
            règle européenne), la leçon concernée reçoit une note datée qui dit
            ce qui a changé. Voici toutes ces notes, de la plus récente à la
            plus ancienne.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted max-w-[640px]">
            Le détail de chaque note reste dans sa leçon. Les leçons marquées
            {" "}<span className="font-semibold text-ink-soft">Aperçu gratuit</span>{" "}
            se lisent sans compte.
          </p>

          <dl className="mt-10 pt-8 border-t border-line grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            <Chiffre valeur={String(notes.length)} libelle="Notes datées" />
            <Chiffre valeur={`${leconsTouchees} / ${totalLecons}`} libelle="Leçons concernées" />
            <Chiffre valeur={plusAncienne ?? "Aucune"} libelle="Première note" petit />
            <Chiffre valeur={CONTENU_A_JOUR_AU} libelle="Dernière relecture" petit />
          </dl>
        </Container>
      </section>

      <section className="bg-white py-14 md:py-20">
        <Container size="narrow">
          {mois.map((m) => (
            <div key={m.cle} className="mb-14 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink">
                  {moisFr(`${m.cle}-01`)}
                </h2>
                <p className="text-[13px] text-muted">{pluriel(m.notes, "note")}</p>
              </div>

              <ol className="mt-5">
                {m.jours.map((j) => (
                  <li
                    key={j.iso}
                    className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-line py-6 md:grid-cols-[170px_1fr]"
                  >
                    <div>
                      <time dateTime={j.iso} className="font-serif text-lg font-medium text-ink">
                        {dateFr(j.iso)}
                      </time>
                      <p className="mt-0.5 text-[13px] text-muted">{pluriel(j.notes, "note")}</p>
                    </div>
                    <ul className="space-y-4 min-w-0">
                      {j.lignes.map((l) => (
                        <LigneJournal key={l.cle} ligne={l} />
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <div className="mt-16 rounded-[22px] border border-line bg-cream-soft p-6 md:p-8">
            <p className="font-serif text-xl md:text-2xl font-medium leading-snug text-ink">
              Les mises à jour sont incluses dans chaque pass, sans supplément.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Vous payez une fois. Les notes à venir s&apos;ajouteront aux
              leçons de votre pass, sans rien racheter.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/tarifs" variant="primary">
                Voir les tarifs
              </Button>
              <Button href="/courses" variant="ghost">
                Voir les parcours
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Chiffre({ valeur, libelle, petit = false }: { valeur: string; libelle: string; petit?: boolean }) {
  return (
    <div className="flex flex-col">
      <dt className="order-2 mt-1.5 text-[13px] text-muted">{libelle}</dt>
      <dd
        className={`order-1 font-serif font-semibold text-ink leading-tight ${
          petit ? "text-lg" : "text-3xl leading-none"
        }`}
      >
        {valeur}
      </dd>
    </div>
  );
}

function LigneJournal({ ligne }: { ligne: Ligne }) {
  const { lecon, parcours } = ligne;
  return (
    <li className="min-w-0">
      <Link
        href={`/courses/${parcours.slug}/${lecon.slug}`}
        className="font-semibold text-[16px] leading-snug text-ink hover:text-coral transition-colors"
      >
        {lecon.titre}
      </Link>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
        <span>{parcours.titre}</span>
        {ligne.notes > 1 && (
          <>
            <span aria-hidden="true">·</span>
            <span>{pluriel(ligne.notes, "note")}</span>
          </>
        )}
        {lecon.libre && (
          <span className="rounded-full bg-coral-soft px-2 py-0.5 text-[11px] font-semibold text-coral-dark">
            Aperçu gratuit
          </span>
        )}
      </p>
      {(ligne.plages.length > 0 || ligne.sujets.length > 0) && (
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          {[...ligne.plages.map((p) => `Du ${p}`), ...ligne.sujets].join(" · ")}
        </p>
      )}
    </li>
  );
}
