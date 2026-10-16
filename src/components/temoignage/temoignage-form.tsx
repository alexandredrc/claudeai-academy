"use client";

import { useState } from "react";

const CHAMP =
  "w-full rounded-[12px] border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-colors";
const LIBELLE = "block text-[14px] font-semibold text-ink mb-1.5";
const AIDE = "mt-1 text-[13px] text-muted";

type Publication = "prenom_metier_ville" | "metier_seul" | "non";

const CHOIX: { value: Publication; label: string }[] = [
  { value: "prenom_metier_ville", label: "Oui, avec mon prénom, mon métier et ma ville" },
  { value: "metier_seul", label: "Oui, avec mon métier seulement (anonyme)" },
  { value: "non", label: "Non, c'est pour Alexandre seulement" },
];

/**
 * Formulaire de témoignage (octobre 2026). Une alternative à la réponse par
 * email : les mêmes trois questions, mais avec des temps en minutes, pour
 * que chaque résultat publié soit une mesure et pas une impression.
 */
export function TemoignageForm({ source }: { source?: string }) {
  const [f, setF] = useState({
    prenom: "",
    email: "",
    metier: "",
    ville: "",
    tache: "",
    minutes_avant: "",
    minutes_apres: "",
    citation: "",
    company: "", // pot de miel
  });
  const [publication, setPublication] = useState<Publication>("prenom_metier_ville");
  const [accord, setAccord] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const maj = (cle: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((v) => ({ ...v, [cle]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/temoignage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, publication, accord: publication === "non" ? false : accord, source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Une erreur est survenue. Réessaie.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setError("Connexion impossible. Réessaie dans un instant.");
    }
  }

  if (status === "ok") {
    return (
      <div role="status" className="rounded-[22px] border border-line bg-white p-8 shadow-card">
        <p className="font-serif text-2xl text-ink">Merci, c&apos;est bien reçu.</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Je lis chaque retour moi-même. Si je le publie, ce sera exactement
          comme tu l&apos;as choisi, corrigé à l&apos;orthographe seulement. Tu
          peux me demander de le retirer à tout moment :
          contact@claudeai-academy.com.
        </p>
      </div>
    );
  }

  const publie = publication !== "non";

  return (
    <form onSubmit={onSubmit} className="rounded-[22px] border border-line bg-white p-6 md:p-8 shadow-card">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="t-prenom" className={LIBELLE}>Prénom</label>
          <input id="t-prenom" className={CHAMP} value={f.prenom} onChange={maj("prenom")} autoComplete="given-name" maxLength={80} />
          <p className={AIDE}>Jamais le nom de famille.</p>
        </div>
        <div>
          <label htmlFor="t-email" className={LIBELLE}>Email *</label>
          <input id="t-email" type="email" required className={CHAMP} value={f.email} onChange={maj("email")} autoComplete="email" />
          <p className={AIDE}>Jamais publié. Il sert à vérifier si tu as acheté ou reçu le kit.</p>
        </div>
        <div>
          <label htmlFor="t-metier" className={LIBELLE}>Métier *</label>
          <input id="t-metier" required className={CHAMP} value={f.metier} onChange={maj("metier")} placeholder="Ex. plombier, gérante de boutique" maxLength={120} />
        </div>
        <div>
          <label htmlFor="t-ville" className={LIBELLE}>Ville</label>
          <input id="t-ville" className={CHAMP} value={f.ville} onChange={maj("ville")} autoComplete="address-level2" maxLength={120} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="t-tache" className={LIBELLE}>La tâche que tu fais avec Claude *</label>
          <input id="t-tache" required className={CHAMP} value={f.tache} onChange={maj("tache")} placeholder="Ex. relancer une facture impayée" maxLength={300} />
        </div>
        <div>
          <label htmlFor="t-avant" className={LIBELLE}>Temps avant, en minutes</label>
          <input id="t-avant" type="number" inputMode="numeric" min={0} max={6000} className={CHAMP} value={f.minutes_avant} onChange={maj("minutes_avant")} />
        </div>
        <div>
          <label htmlFor="t-apres" className={LIBELLE}>Temps avec Claude, en minutes</label>
          <input id="t-apres" type="number" inputMode="numeric" min={0} max={6000} className={CHAMP} value={f.minutes_apres} onChange={maj("minutes_apres")} />
          <p className={AIDE}>Relecture comprise. Une estimation honnête vaut mieux qu&apos;un chiffre rond.</p>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="t-citation" className={LIBELLE}>Ton retour, avec tes mots *</label>
          <textarea id="t-citation" required rows={5} className={CHAMP} value={f.citation} onChange={maj("citation")} maxLength={1500} placeholder="Ce qui a changé dans ta semaine. Si rien n'a changé, dis-le aussi." />
        </div>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Société
          <input type="text" tabIndex={-1} autoComplete="off" value={f.company} onChange={maj("company")} />
        </label>
      </div>

      <fieldset className="mt-7">
        <legend className={LIBELLE}>Puis-je publier ton retour ? *</legend>
        <div className="mt-2 flex flex-col gap-2.5">
          {CHOIX.map((c) => (
            <label key={c.value} className="flex items-start gap-3 text-[15px] text-ink">
              <input
                type="radio"
                name="publication"
                value={c.value}
                checked={publication === c.value}
                onChange={() => setPublication(c.value)}
                className="mt-1 h-4 w-4 accent-coral"
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {publie && (
        <label className="mt-5 flex items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            required
            checked={accord}
            onChange={(e) => setAccord(e.target.checked)}
            className="mt-1 h-4 w-4 accent-coral"
          />
          <span>
            J&apos;accepte que mon retour soit publié sur claudeai-academy.com
            sous la forme choisie ci-dessus, avec la mention de mon statut
            (acheteur ou kit gratuit). Je peux retirer cet accord à tout moment
            en écrivant à contact@claudeai-academy.com.
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-7 inline-flex w-full items-center justify-center rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {status === "loading" ? "Envoi…" : "Envoyer mon retour"}
      </button>

      {status === "error" && (
        <p role="alert" className="mt-3 text-[14px] text-[#C0392B]">{error}</p>
      )}

      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Aucune contrepartie : rien n&apos;est offert en échange d&apos;un avis.
        Un retour négatif est lu et gardé comme les autres. Détails dans la{" "}
        <a href="/confidentialite" className="underline underline-offset-4 hover:text-coral">politique de confidentialité</a>.
      </p>
    </form>
  );
}
