import { Container } from "@/components/site/container";

export function Guarantee() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink to-[#2D2A26] text-cream py-20 md:py-24">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-coral), transparent 70%)",
        }}
      />
      <Container size="narrow">
        <div className="text-center relative">
          <div aria-hidden="true" className="text-6xl mb-5">
            🛡️
          </div>
          <h2 className="font-serif text-3xl md:text-[2.5rem] font-medium leading-[1.2] tracking-tight">
            Garantie 14 jours <span className="accent-serif">satisfait ou remboursé</span>
          </h2>
          <p className="mt-5 text-cream/85 text-[17px] leading-[1.7] max-w-[620px] mx-auto">
            Vous testez le programme pendant 14 jours. Si vous ne sentez pas que
            le contenu est à la hauteur de vos attentes, vous nous écrivez et
            nous vous remboursons intégralement, sans demande d&apos;explication.
            Le risque est entièrement de notre côté.
          </p>
        </div>
      </Container>
    </section>
  );
}
