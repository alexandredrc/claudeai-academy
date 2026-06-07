// Bandeau d'avertissement affiché en haut des pages légales (modèles à
// faire valider par un professionnel et à compléter). À retirer une fois les
// documents finalisés et vérifiés.
export function LegalNotice() {
  return (
    <div className="mt-8 rounded-[14px] border border-coral-soft bg-coral-soft/30 px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
      <strong className="text-ink">⚠️ Modèle à finaliser.</strong> Ce document
      est un modèle de travail. Les champs marqués{" "}
      <code className="rounded bg-cream-dark px-1.5 py-0.5 text-[13px]">
        [À COMPLÉTER]
      </code>{" "}
      doivent être renseignés, et l’ensemble doit être validé par un
      professionnel du droit avant la mise en production.
    </div>
  );
}
