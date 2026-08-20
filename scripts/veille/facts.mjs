// =========================================
// ClaudeAI Academy — Registre des faits périssables
//
// Le détecteur de veille (run.mjs) répond « cette page a bougé ».
// Ce registre répond « …et voici les phrases exactes qui peuvent être
// devenues fausses, dans ces fichiers-là ». C'est ce qui permet un
// correctif chirurgical au lieu d'une réécriture.
//
// Chaque fait déclare OÙ il est affirmé (avec un motif qui CAPTURE la valeur
// affirmée). Le registre ne stocke donc aucune valeur en dur : il lit ce que
// le contenu dit aujourd'hui. Il ne peut pas se désynchroniser tout seul.
//
// gravite :
//   "critique" — devient FAUX (tarif, réglementation, promesse commerciale)
//   "date"     — devient DATÉ, pas faux, parce que la phrase est horodatée
//                (« Au 6 août 2026, la version courante est… »). À rafraîchir
//                sans urgence.
// =========================================

export const FAITS = [
  // ── Produit : ce qu'on promet doit correspondre à ce qu'on livre ─────────
  {
    id: "nombre-prompts",
    libelle: "Nombre de prompts de la bibliothèque",
    gravite: "critique",
    pourquoi: "Chiffre commercial affiché 11 fois. S'il dépasse la réalité, c'est une promesse non tenue.",
    ou: [
      { fichier: "src/components/landing/prompt-teaser.tsx", motif: /(\d+)\s+prompts/ },
      { fichier: "src/lib/email/welcome.ts", motif: /(\d+)\s+prompts/ },
    ],
    verif: { kind: "local", fn: "compterPrompts" },
  },
  {
    id: "nombre-lecons",
    libelle: "Nombre de leçons",
    gravite: "critique",
    pourquoi: "Chiffre commercial. Doit correspondre aux leçons réellement publiées en base.",
    ou: [{ fichier: "src/components/landing/programme.tsx", motif: /(\d+)\s+leçons/ }],
    verif: { kind: "local", fn: "compterLecons" },
  },
  {
    id: "nombre-parcours",
    libelle: "Nombre de parcours",
    gravite: "critique",
    pourquoi: "Chiffre commercial, et il détermine ce que débloque chaque pass.",
    ou: [{ fichier: "src/components/landing/programme.tsx", motif: /(\d+)\s+parcours/ }],
    verif: { kind: "local", fn: "compterParcours" },
  },

  // ── Écosystème Anthropic ─────────────────────────────────────────────────
  {
    id: "claude-code-version",
    libelle: "Version courante de Claude Code",
    gravite: "date",
    pourquoi: "La phrase est horodatée : elle vieillit sans devenir fausse. À rafraîchir lors d'une passe, jamais en urgence.",
    ou: [
      { fichier: "scripts/content/claude-code.mjs", motif: /la version courante est \*\*([\d.]+)\*\*/ },
    ],
    verif: {
      kind: "http-regex",
      url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md",
      motif: /^##\s*\[?v?([\d]+\.[\d]+\.[\d]+)/m,
    },
  },

  // ── Faits sous revue humaine : la source bouge, on relit ─────────────────
  // Pas d'extraction automatique : ces pages sont rendues en JavaScript ou
  // rédigées en prose. Un regex y serait fragile et produirait de fausses
  // alertes — pire que pas d'alerte du tout.
  {
    id: "tarifs-api-anthropic",
    libelle: "Tarifs API par million de tokens (Sonnet, Opus, Haiku)",
    gravite: "critique",
    pourquoi:
      "Un tarif périmé rend le contenu FAUX, et peut rendre fausse la bonne réponse d'un quiz — c'est arrivé le 11/08/2026 avec la baisse de Sonnet 5 rendue permanente.",
    ou: [
      { fichier: "scripts/content/bien-demarrer.mjs", motif: null },
      { fichier: "scripts/content/data-sql.mjs", motif: null },
    ],
    verif: { kind: "revue", sources: ["anthropic-release-notes", "claude-blog"] },
  },
  {
    id: "abonnement-anthropic",
    libelle: "Tarif des abonnements Claude (Pro, Max, Team)",
    gravite: "critique",
    pourquoi: "Cité dans le calcul de coût du parcours Stratégie.",
    ou: [{ fichier: "scripts/content/strategie-ia.mjs", motif: /\*\*(\d+) \$ par mois en engagement annuel\*\*/ }],
    verif: { kind: "revue", sources: ["anthropic-release-notes", "claude-blog"] },
  },
  {
    id: "ai-act-calendrier",
    libelle: "Calendrier d'application de l'AI Act (art. 50, haut risque)",
    gravite: "critique",
    pourquoi:
      "Enseigner une échéance réglementaire fausse expose le lecteur. Le Digital Omnibus a déjà décalé le haut risque une fois.",
    ou: [{ fichier: "scripts/content/strategie-ia.mjs", motif: null }],
    verif: { kind: "revue", sources: ["eu-ai-act", "eu-ai-act-implementation"] },
  },
  {
    id: "cnil-doctrine-ia",
    libelle: "Doctrine CNIL sur l'IA et le RGPD",
    gravite: "critique",
    pourquoi: "Même raison : c'est du droit applicable, enseigné à des professionnels.",
    ou: [{ fichier: "scripts/content/strategie-ia.mjs", motif: null }],
    verif: { kind: "revue", sources: ["cnil-ia"] },
  },
];
