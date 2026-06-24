import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { CheckoutButton } from "@/components/site/checkout-button";
import { createClient } from "@/lib/supabase/server";
import { PROMPT_COUNT } from "@/lib/prompts/library";

type Row = { label: string; value: string; muted?: boolean };

// Valeur notionnelle d'un parcours selon son tier — sert d'ancrage de prix,
// ce n'est pas un tarif de vente à l'unité. Le détail reste synchronisé avec
// le vrai catalogue en base (comme la section Programme).
const PARCOURS_VALUE: Record<string, number> = {
  free: 0,
  starter: 197,
  mastery: 147,
};

function eur(n: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(n)} €`;
}

export async function ValueStack() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("title, tier_required, display_order")
    .order("display_order");

  const courses = (data ?? []) as {
    title: string;
    tier_required: "free" | "starter" | "mastery";
  }[];

  const courseRows: Row[] = courses.map((c) => ({
    label: `📘 Parcours ${c.title}`,
    value: eur(PARCOURS_VALUE[c.tier_required] ?? 147),
  }));

  const extraPriced: Row[] = [
    { label: `📚 Bibliothèque de ${PROMPT_COUNT} prompts`, value: eur(97) },
    { label: "🛠️ Templates et cheat sheets téléchargeables", value: eur(67) },
  ];

  const included: Row[] = [
    { label: "🤖 Mentor IA Claude 24/7", value: "Inclus", muted: true },
    { label: "♾️ Mises à jour à vie", value: "Inclus", muted: true },
  ];

  const priced = [...courseRows, ...extraPriced];
  const total = priced.reduce((sum, r) => sum + parseInt(r.value, 10), 0);
  const rows = [...priced, ...included];

  return (
    <section className="bg-white py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center">
          <Eyebrow align="center">Détail de la valeur</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Ce que contient <span className="accent-serif">le Pass Mastery</span>
          </h2>
        </div>

        <div className="mt-12 bg-cream-soft border border-line rounded-[22px] p-8 md:p-10">
          <table className="w-full text-[15px]">
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <td className="py-4 text-ink-soft">{r.label}</td>
                  <td
                    className={`py-4 text-right ${
                      r.muted ? "text-muted" : "text-muted line-through"
                    }`}
                  >
                    {r.value}
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-ink">
                <td className="py-4 font-semibold text-ink-soft">Valeur totale</td>
                <td className="py-4 text-right font-semibold text-ink">
                  {eur(total)}
                </td>
              </tr>
              <tr>
                <td className="py-5 font-bold font-serif text-xl text-ink">
                  Votre prix
                </td>
                <td className="py-5 text-right font-bold font-serif text-2xl text-coral">
                  497 €
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-7 text-center">
            <CheckoutButton tier="mastery" variant="primary" size="lg">
              Rejoindre Mastery, 497 €
            </CheckoutButton>
            <p className="mt-3 text-[13px] text-muted">
              ou 3 × 179 € sans frais · Garantie 14 jours
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
