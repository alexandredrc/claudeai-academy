import { redirect } from "next/navigation";
import { confirmAccessAction } from "./actions";
import { safeNext } from "@/lib/auth/access-link";

type SearchParams = Promise<{
  token_hash?: string;
  type?: string;
  next?: string;
  email?: string;
}>;

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activer mon accès — ClaudeAI Academy",
  robots: { index: false, follow: false },
};

/**
 * Écran d'activation du lien d'accès.
 *
 * Le token n'est PAS consommé au chargement : il faut un clic (POST). Les
 * filtres anti-phishing des messageries professionnelles (Microsoft Safe
 * Links, Proofpoint…) ouvrent les liens en GET avant le destinataire ; avec
 * une vérification au chargement, ils consommaient le token à usage unique et
 * le membre tombait sur « lien expiré ». Ils ne soumettent pas de formulaire.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const tokenHash = sp.token_hash ?? "";
  const type = sp.type ?? "magiclink";
  const next = safeNext(sp.next, "/account");
  const email = (sp.email ?? "").trim().toLowerCase();

  if (!tokenHash) {
    redirect(`/acces?raison=lien-incomplet${email ? `&email=${encodeURIComponent(email)}` : ""}`);
  }

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[520px] flex-col justify-center px-6 py-16">
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Un dernier{" "}
          <span className="font-serif font-medium italic text-coral">clic</span>
          .
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Pour ta sécurité, on active ton accès seulement quand c&apos;est bien
          toi qui cliques.
        </p>

        <div className="mt-10 rounded-[22px] border border-line bg-white p-8 text-center shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]">
          {email && (
            <p className="mb-6 text-[14px] leading-relaxed text-ink-soft">
              Compte&nbsp;: <strong className="text-ink">{email}</strong>
            </p>
          )}
          <form action={confirmAccessAction}>
            <input type="hidden" name="token_hash" value={tokenHash} />
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              className="w-full rounded-[14px] bg-coral px-6 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
            >
              Activer mon accès
            </button>
          </form>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            Le lien ne fonctionne plus ? Pas de panique — on t&apos;en renvoie
            un neuf automatiquement.
          </p>
        </div>
      </div>
    </section>
  );
}
