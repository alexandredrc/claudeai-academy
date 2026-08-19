import Link from "next/link";
import { requestAccessLinkAction } from "./actions";
import { safeNext } from "@/lib/auth/access-link";

type SearchParams = Promise<{
  email?: string;
  next?: string;
  raison?: string;
  renvoye?: string;
  erreur?: string;
}>;

export const metadata = {
  title: "Retrouver mon accès — ClaudeAI Academy",
  description:
    "Ton lien de connexion ne fonctionne plus ? Reçois-en un nouveau en quelques secondes.",
  robots: { index: false, follow: false },
};

export default async function AccesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const email = (sp.email ?? "").trim().toLowerCase();
  const next = safeNext(sp.next, "/courses");
  const renvoye = sp.renvoye === "1";
  const raison = sp.raison;
  const erreur = sp.erreur;

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[520px] flex-col justify-center px-6 py-16">
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Retrouver mon{" "}
          <span className="font-serif font-medium italic text-coral">
            accès
          </span>
          .
        </h1>

        <div className="mt-10 rounded-[22px] border border-line bg-white p-8 shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]">
          {erreur && (
            <div
              role="alert"
              className="mb-6 rounded-[14px] border border-coral-dark/30 bg-coral-soft/40 px-4 py-3 text-[14px] text-ink"
            >
              {decodeURIComponent(erreur)}
            </div>
          )}

          {renvoye ? (
            <div
              role="status"
              className="rounded-[14px] border border-line bg-cream-soft px-5 py-4 text-[15px] leading-relaxed text-ink"
            >
              <p className="font-semibold">Un nouveau lien vient de partir.</p>
              <p className="mt-2 text-ink-soft">
                Regarde la boîte de réception de
                {email ? (
                  <>
                    {" "}
                    <strong className="text-ink">{email}</strong>
                  </>
                ) : (
                  " ton adresse"
                )}
                . Il arrive en moins de deux minutes — pense à vérifier tes
                courriers indésirables.
              </p>
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed text-ink-soft">
              {raison === "expire"
                ? "Ce lien a expiré ou avait déjà été utilisé. C'est fréquent : certaines messageries d'entreprise ouvrent automatiquement les liens des emails avant toi. Demande-en un neuf, il sera valable tout de suite."
                : "Entre l'adresse email utilisée lors de ton achat : on t'envoie un lien de connexion en un clic, sans mot de passe."}
            </p>
          )}

          <form action={requestAccessLinkAction} className="mt-7 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={email}
                className="w-full rounded-[10px] border border-line bg-cream-soft px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-coral focus:bg-white focus:ring-2 focus:ring-coral/20"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-[14px] bg-coral px-6 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
            >
              {renvoye ? "Renvoyer un lien" : "Recevoir mon lien d'accès"}
            </button>
          </form>

          <p className="mt-7 border-t border-line pt-6 text-[14px] leading-relaxed text-muted">
            Tu as déjà un mot de passe ?{" "}
            <Link
              href="/login"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Se connecter
            </Link>
            .
          </p>
        </div>

        <p className="mt-8 text-center text-[13px] leading-relaxed text-muted">
          Toujours bloqué ? Écris à{" "}
          <a
            href="mailto:contact@claudeai-academy.com"
            className="underline hover:text-ink"
          >
            contact@claudeai-academy.com
          </a>{" "}
          et on t&apos;ouvre l&apos;accès à la main.
        </p>
      </div>
    </section>
  );
}
