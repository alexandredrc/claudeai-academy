import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { CheckoutButton } from "@/components/site/checkout-button";
import { PROMPT_COUNT } from "@/lib/prompts/library";

const rows = [
  { label: "💬 Parcours Prompt Engineering", value: "197 €" },
  { label: "⌨️ Parcours Claude Code", value: "197 €" },
  { label: "📊 Parcours IA & Business", value: "147 €" },
  { label: "🚀 Parcours IA & Marketing", value: "147 €" },
  { label: "📈 Parcours Data & IA", value: "147 €" },
  { label: `📚 Bibliothèque de ${PROMPT_COUNT} prompts`, value: "97 €" },
  { label: "🛠️ Templates et cheat sheets", value: "67 €" },
  { label: "🤖 Mentor IA Claude 24/7", value: "Inclus", muted: true },
  { label: "♾️ Mises à jour à vie", value: "Inclus", muted: true },
];

export function ValueStack() {
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
                <td className="py-4 text-right font-semibold text-ink">999 €</td>
              </tr>
              <tr>
                <td className="py-5 font-bold font-serif text-xl text-ink">
                  Votre prix aujourd&apos;hui
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
