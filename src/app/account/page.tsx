import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { startCheckoutAction } from "../checkout/actions";
import { isValidTier } from "@/lib/stripe/plans";

type SearchParams = Promise<{ plan?: string; welcome?: string }>;

export default async function AccountPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { plan, welcome } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .single();

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, tier, amount_total, currency, status, paid_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const firstName = profile?.first_name ?? null;
  const greeting = firstName ? `Bonjour ${firstName}` : "Bonjour";
  const isWelcome = welcome === "1";

  const paidPurchases = (purchases ?? []).filter((p) => p.status === "paid");
  const hasMastery = paidPurchases.some((p) => p.tier === "mastery");
  const hasStarter = paidPurchases.some((p) => p.tier === "starter");
  const noPurchase = paidPurchases.length === 0;

  // Plan demandé dans l'URL (vient du flow signup) : on met en avant ce tier.
  const requestedTier = isValidTier(plan) ? plan : null;
  // Si l'utilisateur a déjà acheté le tier demandé, on n'affiche pas la mise en avant.
  const showRequestedCta =
    requestedTier &&
    !(requestedTier === "mastery" && hasMastery) &&
    !(requestedTier === "starter" && (hasStarter || hasMastery));

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto max-w-[860px] px-6 py-16 md:py-24">
        <span className="mb-5 inline-block text-[13px] font-semibold uppercase tracking-[0.12em] text-coral">
          Espace personnel
        </span>
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          {greeting}.
        </h1>
        <p className="mt-4 text-lg text-muted">
          {isWelcome
            ? "Ton compte est confirmé. Bienvenue."
            : "Bienvenue dans ton espace ClaudeAI Academy."}
        </p>

        {user.email === "adrc13820@gmail.com" && (
          <Link
            href="/admin/dashboard"
            className="mt-8 flex items-center justify-between gap-4 rounded-[18px] bg-ink px-6 py-5 text-cream transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(31,31,30,0.22)]"
          >
            <span>
              <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-cream/60">
                Espace admin
              </span>
              <span className="mt-1 block font-serif text-xl font-semibold">
                Dashboard pilotage — publication sociale
              </span>
              <span className="mt-1 block text-[13px] text-cream/70">
                Vue 360° : réseaux connectés, file de publications, calendrier 4 semaines.
              </span>
            </span>
            <span className="shrink-0 text-2xl" aria-hidden="true">
              →
            </span>
          </Link>
        )}

        {showRequestedCta && requestedTier && (
          <PurchasePrompt tier={requestedTier} />
        )}

        {!noPurchase && (
          <div className="mt-10 rounded-[22px] border border-line bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  Tes parcours
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {hasMastery
                    ? "Tu as accès aux 5 parcours."
                    : "Tu as accès aux 2 parcours fondamentaux."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start sm:self-auto">
                {hasMastery && (
                  <Link
                    href="/mentor"
                    className="rounded-[14px] border-[1.5px] border-ink px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 ease-out hover:bg-ink hover:text-cream"
                  >
                    Mentor IA →
                  </Link>
                )}
                <Link
                  href="/courses"
                  className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
                >
                  Aller au catalogue →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_auto]">
          <Card title="Mon compte">
            <dl className="space-y-3 text-[14px]">
              <Row label="Email" value={profile?.email ?? user.email ?? "—"} />
              {firstName && (
                <Row
                  label="Nom"
                  value={`${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()}
                />
              )}
            </dl>
            <form action="/auth/logout" method="post" className="mt-8">
              <button
                type="submit"
                className="rounded-[14px] border-[1.5px] border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-200 ease-out hover:bg-ink hover:text-cream"
              >
                Se déconnecter
              </button>
            </form>
          </Card>
        </div>

        <h2 className="mt-16 font-serif text-2xl font-semibold text-ink">
          Mes achats
        </h2>

        {noPurchase ? (
          <NoPurchaseBlock
            requestedTier={requestedTier}
            showRequestedCta={!!showRequestedCta}
          />
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {(purchases ?? []).map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 rounded-[14px] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      Pass {p.tier === "starter" ? "Starter" : "Mastery"}
                    </p>
                    <p className="text-[13px] text-muted">
                      {formatPrice(p.amount_total, p.currency)} ·{" "}
                      {p.paid_at
                        ? `Payé le ${formatDate(p.paid_at)}`
                        : `Créé le ${formatDate(p.created_at)}`}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
            {hasStarter && !hasMastery && (
              <div className="mt-8 rounded-[22px] border border-coral-soft bg-coral-soft/30 p-6">
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  Tu peux passer au{" "}
                  <strong className="font-semibold text-ink">
                    Pass Mastery
                  </strong>{" "}
                  pour accéder aux 3 parcours supplémentaires et au mentor IA.
                </p>
                <form action={startCheckoutAction} className="mt-4">
                  <input type="hidden" name="plan" value="mastery" />
                  <button
                    type="submit"
                    className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
                  >
                    Passer à Mastery · 497 €
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PurchasePrompt({ tier }: { tier: "starter" | "mastery" }) {
  const label = tier === "mastery" ? "Pass Mastery — 497 €" : "Pass Starter — 47 €";
  return (
    <div className="mt-10 rounded-[22px] border border-coral-soft bg-coral-soft/30 p-6 md:p-8">
      <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
        Dernière étape
      </span>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
        Finalise ton achat
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Tu es à un clic de débloquer le{" "}
        <strong className="font-semibold text-ink">{label}</strong>. Paiement
        sécurisé via Stripe. Garantie 14 jours.
      </p>
      <form action={startCheckoutAction} className="mt-6">
        <input type="hidden" name="plan" value={tier} />
        <button
          type="submit"
          className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
        >
          Procéder au paiement
        </button>
      </form>
    </div>
  );
}

function NoPurchaseBlock({
  requestedTier,
  showRequestedCta,
}: {
  requestedTier: "starter" | "mastery" | null;
  showRequestedCta: boolean;
}) {
  // Si on a déjà affiché le PurchasePrompt en haut, on évite de dupliquer ici.
  if (showRequestedCta && requestedTier) {
    return (
      <div className="mt-6 rounded-[22px] border border-line bg-white p-8 text-center text-[14px] text-muted">
        Tes achats apparaîtront ici une fois le paiement effectué.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[22px] border border-line bg-white p-8">
      <p className="text-[15px] leading-relaxed text-ink-soft">
        Tu n&apos;as pas encore acheté de pass. Choisis ton offre :
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <form action={startCheckoutAction}>
          <input type="hidden" name="plan" value="starter" />
          <button
            type="submit"
            className="w-full rounded-[14px] border-[1.5px] border-ink px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 ease-out hover:bg-ink hover:text-cream"
          >
            Pass Starter · 47 €
          </button>
        </form>
        <form action={startCheckoutAction}>
          <input type="hidden" name="plan" value="mastery" />
          <button
            type="submit"
            className="w-full rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
          >
            Pass Mastery · 497 €
          </button>
        </form>
      </div>
      <p className="mt-4 text-[12px] text-muted">
        Garantie 14 jours satisfait ou remboursé. Paiement sécurisé via Stripe.
      </p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[22px] border border-line bg-white p-8 shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]">
      <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-line/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Payé", cls: "bg-green-soft text-green" },
    pending: { label: "En attente", cls: "bg-cream-dark text-ink-soft" },
    refunded: { label: "Remboursé", cls: "bg-cream-dark text-ink-soft" },
    failed: { label: "Échoué", cls: "bg-coral-soft text-coral-dark" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function formatPrice(amountCents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

