import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AutoRefresh } from "./AutoRefresh";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = "adrc13820@gmail.com";

type SocialPost = {
  id: string;
  scheduled_date: string;
  slot: number;
  networks: string[] | null;
  formation: string | null;
  hook: string;
  status: string;
  target_url: string | null;
  visual_key: string | null;
  posted_at: string | null;
};

const STATUS: Record<string, { label: string; dot: string; chip: string }> = {
  pending: { label: "En attente", dot: "bg-[#C9A227]", chip: "bg-[#FBF3D6] text-[#7A6312]" },
  queued: { label: "En file", dot: "bg-[#3B82F6]", chip: "bg-[#E5EEFE] text-[#1D4ED8]" },
  sent: { label: "Envoyé", dot: "bg-coral", chip: "bg-coral-soft text-coral-dark" },
  posted: { label: "Publié", dot: "bg-green", chip: "bg-green-soft text-green" },
  failed: { label: "Échec", dot: "bg-[#DC2626]", chip: "bg-[#FCE4E4] text-[#B91C1C]" },
  skipped: { label: "Ignoré", dot: "bg-muted", chip: "bg-cream-dark text-muted" },
};

const NETWORK_META: Record<string, { label: string; chip: string }> = {
  instagram: { label: "IG", chip: "bg-[#FCE7F3] text-[#BE185D]" },
  facebook: { label: "FB", chip: "bg-[#E5EEFE] text-[#1D4ED8]" },
  tiktok: { label: "TikTok", chip: "bg-ink text-cream" },
  linkedin: { label: "LinkedIn", chip: "bg-[#E1EEFB] text-[#0A66C2]" },
};

const CHANNEL_STATE: Record<string, { label: string; chip: string; dot: string }> = {
  ok: { label: "Actif", chip: "bg-green-soft text-green", dot: "bg-green" },
  paused: { label: "En pause", chip: "bg-[#FBF3D6] text-[#7A6312]", dot: "bg-[#C9A227]" },
  relay: { label: "Semi-auto", chip: "bg-[#E5EEFE] text-[#1D4ED8]", dot: "bg-[#3B82F6]" },
  manual: { label: "Manuel", chip: "bg-cream-dark text-muted", dot: "bg-muted" },
};

const CHANNELS = [
  { name: "Instagram", sub: "@alex_crypto_ia", mode: "Auto", state: "paused", note: "Filtre routeur à corriger — scénario en pause" },
  { name: "Facebook", sub: "Page « Claude ai academy »", mode: "Auto", state: "paused", note: "Filtre routeur à corriger — scénario en pause" },
  { name: "TikTok", sub: "Relais e-mail Gmail", mode: "Semi-auto", state: "relay", note: "E-mail « à publier » → publication manuelle" },
  { name: "LinkedIn", sub: "Hors pipeline auto", mode: "Manuel", state: "manual", note: "Publication 100 % manuelle" },
];

const COMP_STATE: Record<string, { chip: string; dot: string; label: string }> = {
  ok: { chip: "bg-green-soft text-green", dot: "bg-green", label: "OK" },
  paused: { chip: "bg-[#FBF3D6] text-[#7A6312]", dot: "bg-[#C9A227]", label: "En pause" },
  partial: { chip: "bg-[#FBF3D6] text-[#7A6312]", dot: "bg-[#C9A227]", label: "Partiel" },
};

const COMPONENTS = [
  { name: "Webhook (entrée Make)", state: "ok", note: "Reçoit les contenus" },
  { name: "Scénario Make (routeur)", state: "paused", note: "Désactivé — correction des filtres en cours" },
  { name: "Hermès / VPS (génération)", state: "partial", note: "Tests OK — génération IA non branchée" },
  { name: "Visuels (hébergement)", state: "ok", note: "8 visuels déployés (/promotions/)" },
];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const cardShadow =
  "shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]";

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  const color =
    accent === "green" ? "text-green" : accent === "red" ? "text-[#DC2626]" : accent === "amber" ? "text-[#B58A0E]" : "text-ink";
  return (
    <div className={`rounded-[18px] border border-line bg-white p-5 ${cardShadow}`}>
      <div className={`font-serif text-[2rem] font-semibold leading-none ${color}`}>{value}</div>
      <div className="mt-1.5 text-[12px] font-medium uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

function Legend() {
  return (
    <div className="hidden flex-wrap items-center gap-3 text-[11px] text-muted sm:flex">
      {Object.values(STATUS).map((v) => (
        <span key={v.label} className="inline-flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
          {v.label}
        </span>
      ))}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Gated to the owner email in production; open on local dev for preview.
  if (process.env.NODE_ENV === "production" && (!user || user.email !== OWNER_EMAIL)) {
    redirect("/login?next=/admin/dashboard");
  }

  const { data } = await supabaseAdmin
    .from("social_posts")
    .select("id,scheduled_date,slot,networks,formation,hook,status,target_url,visual_key,posted_at")
    .order("scheduled_date", { ascending: true })
    .order("slot", { ascending: true });

  const posts = (data ?? []) as SocialPost[];

  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});
  const total = posts.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = ymd(today);
  const dow = (today.getDay() + 6) % 7; // 0 = Monday
  const start = new Date(today);
  start.setDate(today.getDate() - dow);
  const weeks: Date[][] = Array.from({ length: 4 }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + i);
      return d;
    }),
  );

  const postsByDay = posts.reduce<Record<string, SocialPost[]>>((acc, p) => {
    (acc[p.scheduled_date] ??= []).push(p);
    return acc;
  }, {});

  const queue = posts
    .filter((p) => (p.status === "pending" || p.status === "queued") && p.scheduled_date >= todayStr)
    .slice(0, 14);

  return (
    <section className="min-h-screen bg-cream-soft">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-coral"
        >
          <span aria-hidden="true">←</span> Retour à l&apos;accueil
        </a>

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-coral">Pilotage interne</p>
            <h1 className="mt-2 font-serif text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight text-ink">
              Publication sociale — vue 360°
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              Réseaux connectés, santé du pipeline et file des publications automatiques.
            </p>
          </div>
          <AutoRefresh />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Programmés" value={total} accent="ink" />
          <StatCard label="En attente" value={(counts.pending ?? 0) + (counts.queued ?? 0)} accent="amber" />
          <StatCard label="Publiés" value={counts.posted ?? 0} accent="green" />
          <StatCard label="Échecs" value={counts.failed ?? 0} accent="red" />
        </div>

        {/* Réseaux */}
        <h2 className="mt-12 font-serif text-xl font-semibold text-ink">Réseaux connectés</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => {
            const s = CHANNEL_STATE[c.state];
            return (
              <div key={c.name} className={`rounded-[18px] border border-line bg-white p-5 ${cardShadow}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink">{c.name}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.chip}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-muted">{c.sub}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">{c.note}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{c.mode}</p>
              </div>
            );
          })}
        </div>

        {/* Pipeline */}
        <h2 className="mt-12 font-serif text-xl font-semibold text-ink">Santé du pipeline</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COMPONENTS.map((c) => {
            const s = COMP_STATE[c.state];
            return (
              <div key={c.name} className={`rounded-[18px] border border-line bg-white p-5 ${cardShadow}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.chip}`}>{s.label}</span>
                </div>
                <p className="mt-2.5 text-[14px] font-semibold text-ink">{c.name}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{c.note}</p>
              </div>
            );
          })}
        </div>

        {/* Calendrier */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-ink">Calendrier — 4 semaines</h2>
          <Legend />
        </div>
        <div className={`mt-4 overflow-hidden rounded-[18px] border border-line bg-white ${cardShadow}`}>
          <div className="grid grid-cols-7 border-b border-line bg-cream/60 text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((d) => {
                const k = ymd(d);
                const dayPosts = postsByDay[k] ?? [];
                const isToday = k === todayStr;
                const isPast = k < todayStr;
                return (
                  <div
                    key={k}
                    className={`min-h-[84px] border-b border-r border-line p-2 [&:nth-child(7n)]:border-r-0 ${
                      isToday ? "bg-coral-soft/40" : isPast ? "bg-cream/40" : "bg-white"
                    }`}
                  >
                    <div className={`text-[11px] font-semibold ${isToday ? "text-coral-dark" : "text-muted"}`}>
                      {d.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayPosts.map((p) => {
                        const s = STATUS[p.status] ?? STATUS.pending;
                        return (
                          <div
                            key={p.id}
                            title={p.hook}
                            className="flex items-center gap-1 truncate rounded-[6px] bg-cream px-1.5 py-0.5 text-[10px] text-ink-soft"
                          >
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                            <span className="truncate">
                              {(p.networks ?? []).map((n) => NETWORK_META[n]?.label ?? n).join("·") || "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* File d'attente */}
        <h2 className="mt-12 font-serif text-xl font-semibold text-ink">Prochaines publications</h2>
        {queue.length === 0 ? (
          <div className="mt-4 rounded-[18px] border border-dashed border-line bg-white/60 p-8 text-center">
            <p className="text-[15px] font-medium text-ink">Aucune publication programmée pour l&apos;instant.</p>
            <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-relaxed text-muted">
              Le moteur de contenu (4 semaines × 3 visuels/jour) sera branché à l&apos;étape suivante — chaque
              publication apparaîtra ici avec son statut mis à jour automatiquement.
            </p>
          </div>
        ) : (
          <div className={`mt-4 overflow-hidden rounded-[18px] border border-line bg-white ${cardShadow}`}>
            {queue.map((p, i) => {
              const s = STATUS[p.status] ?? STATUS.pending;
              return (
                <div key={p.id} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-line" : ""}`}>
                  <div className="w-[96px] shrink-0 text-[12px] font-medium text-muted">
                    {p.scheduled_date}
                    <span className="ml-1 text-line">#{p.slot}</span>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    {(p.networks ?? []).map((n) => {
                      const nm = NETWORK_META[n];
                      return (
                        <span key={n} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${nm?.chip ?? "bg-cream-dark text-muted"}`}>
                          {nm?.label ?? n}
                        </span>
                      );
                    })}
                  </div>
                  <div className="min-w-0 flex-1 truncate text-[13px] text-ink" title={p.hook}>
                    {p.hook}
                  </div>
                  {p.formation && (
                    <span className="hidden shrink-0 rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-medium text-muted sm:inline">
                      {p.formation}
                    </span>
                  )}
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.chip}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-10 text-center text-[12px] text-muted">
          ClaudeAI Academy · Pilotage interne · accès réservé à l&apos;administrateur
        </p>
      </div>
    </section>
  );
}
