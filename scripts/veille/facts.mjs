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
//
// canon (optionnel) : ramène chaque valeur capturée à une forme unique avant
//   la comparaison — « 1 497 », « 1&nbsp;497 » et « 1497 » disent le même prix.
// =========================================

// ── Prix : outils de capture ──────────────────────────────────────────────
// Les prix sont tapés à la main dans une trentaine de fichiers, avec trois
// façons d'écrire l'espace avant « € » (simple, insécable, entité HTML) et
// deux façons d'écrire les milliers (« 1 497 », « 1497 »). Ces briques
// évitent de répéter trente fois le même motif fragile.

/** L'espace avant « € » : simple ou insécable (couvertes par \s), ou l'entité HTML des TSX. */
const ESP = String.raw`(?:\s|&nbsp;)`;
/** Un montant tel que le site l'écrit : « 47 », « 497 », « 1 497 », « 1&nbsp;497 ». */
const MONTANT = String.raw`(\d{1,3}(?:${ESP}\d{3})?)`;
/** « <contexte>497 € ». Le contexte ancre le motif sur UN pass : un motif
 *  générique « N € » lirait aussi « 450 € » (Mastery moins Starter) ou
 *  « 1 500 € » (le CPF cité par la FAQ). */
const prixApres = (contexte) => new RegExp(`(?:${contexte})${MONTANT}${ESP}€`);
/** Le prix d'une offre dans le JSON-LD de la page tarifs, ancré sur son nom. */
const prixJsonLd = (nom) => new RegExp(String.raw`name: "${nom}",\s*price: "(\d+)"`);
/** « 3 × 165,67 € » — et « 3 versements de 179 € », la forme qu'a prise l'erreur
 *  des CGV : un motif qui ne lit que la bonne formulation ne l'aurait pas vue. */
const MOTIF_KLARNA = new RegExp(String.raw`3${ESP}*(?:×|versements de)${ESP}*(\d+(?:,\d+)?)${ESP}*€`);
/** « 1 497 », « 1&nbsp;497 » et « 1497 » sont le même prix : on compare sans espaces. */
const canonMontant = (v) => v.replace(/&nbsp;|\s/g, "");
/** Un nombre écrit en lettres (« six », « neuf ») ou en chiffres, ramené aux chiffres.
 *  Les emails écrivent les compteurs en toutes lettres : sans ça, aucun motif ne les lit. */
const NOMBRES_FR = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"];
const canonNombre = (v) => {
  const i = NOMBRES_FR.indexOf(String(v).toLowerCase());
  return i >= 0 ? String(i) : String(v);
};
/** « Pass Starter · 47 € », « Pass Starter (47 €) », « Pass Starter : 47 € », et l'ancienne
 *  forme « Pass Starter — 47 € ». Le tiret cadratin a été retiré du copy à l'automne 2026 :
 *  les motifs qui ne lisaient que lui sont devenus muets dans sept fichiers, sans alerte. */
const passPrix = (nom) => prixApres(`Pass ${nom}${ESP}*(?:—|·|:|\\()${ESP}*`);
/** « 4 octobre 2026 » → 20261004, pour comparer deux dates affichées. 0 si illisible. */
const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const dateCle = (v) => {
  const m = String(v || "").match(/(\d{1,2})(?:er)?\s+(\p{L}+)\s+(\d{4})/u);
  if (!m) return 0;
  const mois = MOIS_FR.indexOf(m[2].toLowerCase());
  return mois < 0 ? 0 : Number(m[3]) * 10000 + (mois + 1) * 100 + Number(m[1]);
};
/** Le gros prix d'une carte de la vitrine : « <h3>Pass Mastery</h3> … 497</span><span>€ une fois ».
 *  Ancré sur le titre de la carte : les trois cartes partagent la même structure, et le
 *  « 47 » de la carte Starter ressemble trait pour trait au « 497 » de la carte Mastery. */
const prixCarte = (pass) =>
  new RegExp(String.raw`Pass ${pass}\s*</h3>[\s\S]{0,400}?>\s*${MONTANT}\s*</span>\s*<span[^>]*>€ une fois`);

// ── Prix daté du Pass Mastery (décision du 16/10/2026) ───────────────────────
// 497 € jusqu'au 31/10/2026 inclus, 697 € dès le 01/11/2026 (heure de Paris).
// La plupart des copies ne sont plus tapées à la main : elles appellent
// src/lib/offre/prix.ts à l'instant du rendu. Leur motif littéral ne lit alors
// plus rien. Sans `dynamique`, elles ressortiraient « muettes » à chaque passe ;
// avec, l'emplacement est compté comme branché sur le module. Un littéral qui
// reste (ou qui revient) est toujours lu et comparé au prix du jour : le 01/11,
// un « 497 € » oublié ressort FAUX. Limite connue : le contrôle « dynamique »
// porte sur le fichier, pas sur la phrase.
/** Le fichier calcule le prix du Mastery avec le module, ou interpole le prix
 *  reçu en props d'un parent serveur qui l'a calculé (`${prixMastery}`). */
// PRIX_MASTERY_APRES : la barre de prix choisit entre le prix reçu du layout et
// le prix d'après la hausse (horloge du navigateur), sans appeler prixMastery().
const DYN_MASTERY = /\bprixMastery(?:ApresCreditStarter)?\(|\$\{prixMastery\}|\bPRIX_MASTERY_APRES\b/;
/** Le fichier calcule la mensualité Klarna avec le module. */
const DYN_KLARNA = /\bmensualiteKlarna3x\(/;
/** Un emplacement du prix Mastery : littéral lu s'il existe, module sinon. */
const mastery = (fichier, motif) => ({ fichier, motif, dynamique: DYN_MASTERY });
/** Un emplacement de la mensualité Klarna du Mastery : idem. */
const klarna = (fichier) => ({ fichier, motif: MOTIF_KLARNA, dynamique: DYN_KLARNA });

export const FAITS = [
  // ── Produit : ce qu'on promet doit correspondre à ce qu'on livre ─────────
  {
    id: "nombre-prompts",
    libelle: "Nombre de prompts de la bibliothèque",
    gravite: "critique",
    pourquoi: "Chiffre commercial affiché 11 fois. S'il dépasse la réalité, c'est une promesse non tenue.",
    // Seules les copies ÉCRITES À LA MAIN sont suivies : la vitrine affiche
    // PROMPT_COUNT, calculé. Un motif générique « N prompts » a crié FAUX le
    // 16/10/2026 sur « réponds avec 3 prompts que tu utilises » (bonus de
    // l'email de bienvenue) : on ancre sur la bibliothèque, pas sur le mot.
    ou: [
      { fichier: "src/lib/email/welcome.ts", motif: /bibliothèque de (\d+) prompts/ },
      { fichier: "src/lib/email/nurture.ts", motif: /bibliothèque (?:complète )?de (\d+) prompts/ },
      { fichier: "src/lib/email/lead-magnet.ts", motif: /leçons, (\d+) prompts/ },
      { fichier: "src/lib/email/lead-magnet-en.ts", motif: /lessons, (\d+) prompts/ },
    ],
    verif: { kind: "local", fn: "compterPrompts" },
  },
  {
    id: "nombre-lecons",
    libelle: "Nombre de leçons",
    gravite: "critique",
    pourquoi:
      "Chiffre commercial répété dans les métadonnées, la FAQ, la page tarifs et trois emails. " +
      "Il ne suffit pas de le suivre là où il est calculé : \`programme.tsx\` l'affiche depuis la base " +
      "et ne contient aucun chiffre en dur, donc le motif n'y accrochait rien et le fait passait " +
      "« aligné » quoi qu'il arrive. Ce sont les copies ÉCRITES À LA MAIN qu'il faut surveiller : " +
      "le jour où on ajoute une leçon, ce sont elles qui restent en arrière.",
    ou: [
      { fichier: "src/app/layout.tsx", motif: /[0-9]+ parcours, (\d+) leçons/ },
      { fichier: "src/app/faq/page.tsx", motif: /[0-9]+ parcours et (\d+) leçons/ },
      { fichier: "src/app/tarifs/page.tsx", motif: /[0-9]+ parcours, (\d+) leçons/ },
      { fichier: "src/app/formation-claude-ai/page.tsx", motif: /[0-9]+ parcours, (\d+) leçons/ },
      { fichier: "src/app/account/page.tsx", motif: /[0-9]+ parcours, soit (\d+) leçons/ },
      { fichier: "src/components/landing/faq.tsx", motif: /les (\d+) leçons des [0-9]+ parcours/ },
      { fichier: "src/components/landing/founder.tsx", motif: /les (\d+) leçons/ },
      { fichier: "src/lib/email/welcome.ts", motif: /parcours complets \((\d+) leçons\)/ },
      // Depuis le 16/10/2026, l'email J+21 calcule le prix par leçon avec ce nombre
      // (« moins de 9 € », puis « environ 12 € » à 697 €) : c'est lui qu'on suit.
      { fichier: "src/lib/email/nurture.ts", motif: /NB_LECONS_MASTERY = (\d+);/ },
    ],
    verif: { kind: "local", fn: "compterLecons" },
  },
  {
    id: "nombre-lecons-starter",
    libelle: "Nombre de leçons du Pass Starter",
    gravite: "critique",
    pourquoi:
      "Ce qu'un acheteur à 47 € croit acheter. Le piège s'est produit le 21/09/2026 : " +
      "une leçon ajoutée au parcours Claude Code, et les deux pages qui annonçaient " +
      "« 21 leçons » sont restées en arrière. Le total du catalogue était suivi, ce " +
      "sous-total ne l'était pas.",
    ou: [
      { fichier: "src/app/account/page.tsx", motif: /fondamentaux, soit (\d+) leçons/ },
      { fichier: "src/components/landing/pricing-teaser.tsx", motif: /Claude Code \((\d+) leçons\)/ },
    ],
    verif: { kind: "local", fn: "compterLeconsStarter" },
  },
  {
    id: "nombre-parcours",
    libelle: "Nombre de parcours",
    gravite: "critique",
    pourquoi: "Chiffre commercial, et il détermine ce que débloque chaque pass.",
    // programme.tsx affiche stats.courseCount, calculé depuis la base : son
    // motif n'accrochait plus rien. Les copies tapées à la main, elles,
    // écrivent le nombre en chiffres ou en lettres (« pour les neuf »).
    ou: [
      { fichier: "src/components/landing/faq.tsx", motif: /leçons des ([0-9]+) parcours/ },
      // « … € pour les neuf${parentheseHausseMastery(at)}. Garantie » depuis le 16/10/2026.
      { fichier: "src/lib/email/activation.ts", motif: /€ pour les (\p{L}+)(?:\$\{[^}]*\})?\. Garantie/u },
      { fichier: "src/lib/email/lead-magnet.ts", motif: /couvre les (\d+) parcours/ },
      { fichier: "src/lib/email/lead-magnet.ts", motif: /les (\d+) parcours, \d+ leçons, \d+ prompts/ },
      { fichier: "src/lib/email/lead-magnet-en.ts", motif: /\((\d+) tracks/ },
    ],
    canon: canonNombre,
    verif: { kind: "local", fn: "compterParcours" },
  },
  {
    id: "parcours-hors-starter",
    libelle: "Nombre de parcours réservés au Pass Mastery",
    gravite: "critique",
    pourquoi:
      "Ce que l'upgrade Starter → Mastery promet d'ouvrir. Écrit en lettres dans les emails " +
      "(« les cinq autres »), il a échappé à tous les motifs en chiffres : jusqu'au 16/10/2026, " +
      "la séquence nurture annonçait cinq parcours de plus pour six réels, et la liste oubliait " +
      "« Construire ton agent IA ».",
    ou: [
      { fichier: "src/lib/email/nurture.ts", motif: /[Ll]es (\p{L}+) autres/u },
      { fichier: "src/app/checkout/success/page.tsx", motif: /Il te reste (\d+) parcours/ },
      { fichier: "src/app/checkout/success/page.tsx", motif: /Les (\d+) autres \(/ },
      { fichier: "src/app/account/page.tsx", motif: /aux (\d+) parcours supplémentaires/ },
      { fichier: "src/app/formation-claude-code/page.tsx", motif: /ajoute les (\p{L}+) autres parcours/u },
    ],
    canon: canonNombre,
    verif: { kind: "local", fn: "compterParcoursMastery" },
  },

  // ── Prix : ce que le contrat promet doit être ce que Stripe encaisse ─────
  // Aucun prix n'était suivi. Résultat : de juin à septembre 2026, les CGV ont
  // annoncé « 3 versements de 179 € » (537 €) pour un pass vendu 497 €, et
  // aucun contrôle ne l'a vu. La source de vérité est `amountEur` dans
  // `src/lib/stripe/plans.ts` pour le Starter et l'Accompagnement, et, depuis
  // le 16/10/2026, le module daté `src/lib/offre/prix.ts` pour le Mastery
  // (PRIX_MASTERY_AVANT, PRIX_MASTERY_APRES, MASTERY_HAUSSE_LE) : 497 € jusqu'au
  // 31/10/2026, 697 € ensuite. Avant la bascule, 697 € (et 3 × 232,34 €) est
  // accepté : c'est la hausse annoncée. Après, seul 697 € l'est.
  // Tout le reste est une copie : c'est elle qu'on surveille.
  // Les commentaires de code qui racontent un incident passé (« un Pass
  // Mastery à 497 € a échoué le 19/08 ») restent volontairement hors registre :
  // un fait d'histoire ne devient pas faux quand le prix change.
  {
    id: "mensualite-klarna-mastery",
    libelle: "Mensualité Klarna du Pass Mastery (3 × … €)",
    gravite: "critique",
    pourquoi:
      "Promesse commerciale sur la vitrine, la page de vente, le reçu, llms.txt et les CGV, " +
      "calculée de tête à partir du prix Mastery. Si le prix bouge, ou si quelqu'un retape la " +
      "mensualité (179 € au lieu de 165,67 € dans les CGV, quatre mois durant), le site annonce " +
      "un total faux — dans un document contractuel. Le 01/11/2026, elle passe à 232,34 €.",
    ou: [
      // Clause FIXE des CGV depuis le 16/10/2026 : « 3 × 165,67 € … jusqu'au 31 octobre
      // 2026 inclus ; … 3 × 232,34 € … à partir du 1er novembre ». Exacte avant comme
      // après la bascule : elle doit citer les deux mensualités (`periodes`).
      { fichier: "src/app/cgv/page.tsx", motif: MOTIF_KLARNA, periodes: true },
      klarna("src/components/landing/pricing-teaser.tsx"),
      klarna("src/components/landing/value-stack.tsx"),
      klarna("src/app/formation-claude-ai/page.tsx"),
      klarna("src/app/checkout/success/page.tsx"),
      klarna("src/app/llms.txt/route.ts"),
      klarna("src/app/tarifs/page.tsx"),
      klarna("src/app/faq/page.tsx"),
      // Emails aux leads (A5, B8) : « 497 €, ou 3 × 165,67 € sans frais », non suivi avant le 16/10/2026.
      klarna("src/lib/email/lead-magnet.ts"),
    ],
    canon: canonMontant,
    verif: { kind: "local", fn: "mensualiteKlarnaMastery" },
    // Les mêmes fichiers portent la mensualité de l'Accompagnement (3 × 499 €) :
    // ce n'est pas une contradiction, c'est un autre pass. Sans cette
    // exclusion, le vérificateur a crié « FAUX » tous les deux jours à partir
    // du 04/10/2026, le jour où le 3 × 499 € a été affiché.
    exclureValeurs: { kind: "local", fn: "mensualiteKlarnaAccompagnement" },
  },
  {
    id: "prix-pass-starter",
    libelle: "Prix du Pass Starter",
    gravite: "critique",
    pourquoi:
      "Le prix d'appel, répété dans les métadonnées, le JSON-LD, les CGV, l'espace membre et " +
      "trois emails. Stripe facture `amountEur` de plans.ts : tout le reste doit le répéter.",
    ou: [
      { fichier: "src/app/cgv/page.tsx", motif: prixApres(`Pass Starter</strong>${ESP}*(?:—|:)${ESP}*`) },
      { fichier: "src/app/tarifs/page.tsx", motif: prixApres("Claude AI : |Starter à ") },
      { fichier: "src/app/tarifs/page.tsx", motif: prixJsonLd("Pass Starter") },
      { fichier: "src/app/layout.tsx", motif: prixApres("[Dd]ès ") },
      { fichier: "src/components/landing/hero.tsx", motif: prixApres("à partir de ") },
      { fichier: "src/components/landing/pricing-teaser.tsx", motif: prixCarte("Starter") },
      { fichier: "src/components/landing/pricing-teaser.tsx", motif: prixApres("Commencer (?:—|·) |Vos ") },
      { fichier: "src/components/landing/final-cta.tsx", motif: prixApres("Starter, ") },
      { fichier: "src/components/site/price-bar.tsx", motif: prixApres("[Dd]ès ") },
      { fichier: "src/components/site/footer.tsx", motif: prixApres("Pass Starter, ") },
      { fichier: "src/app/formation-claude-ai/page.tsx", motif: prixApres("[Dd]ès |commencer à |Vous payez |Starter à ") },
      { fichier: "src/app/formation-intelligence-artificielle/page.tsx", motif: prixApres("[Dd]ès ") },
      { fichier: "src/app/certification-claude-ai/page.tsx", motif: prixApres("à partir de |[Dd]ès ") },
      { fichier: "src/app/certification/examen/page.tsx", motif: prixApres("à partir de ") },
      { fichier: "src/app/faq/page.tsx", motif: prixApres(String.raw`[Dd]ès |Pass Starter \(|c'est `) },
      { fichier: "src/app/checkout/success/page.tsx", motif: /Les (\d+) € que tu viens de/ },
      { fichier: "src/app/checkout/cancel/page.tsx", motif: passPrix("Starter") },
      { fichier: "src/app/signup/page.tsx", motif: passPrix("Starter") },
      { fichier: "src/app/account/page.tsx", motif: prixApres("Pass Starter (?:—|·) ") },
      { fichier: "src/app/courses/[slug]/page.tsx", motif: passPrix("Starter") },
      // JSON-LD du parcours : « mastery ? "497" : "47" », puis « mastery ? String(prixMastery(at)) : "47" ».
      { fichier: "src/app/courses/[slug]/page.tsx", motif: /(?:"mastery"|mastery) \? (?:"\d+"|String\(prixMastery\(\w*\)\)) : "(\d+)"/ },
      { fichier: "src/app/courses/[slug]/[lesson]/page.tsx", motif: passPrix("Starter") },
      { fichier: "src/app/llms.txt/route.ts", motif: passPrix("Starter") },
      { fichier: "src/lib/email/activation.ts", motif: /(\d+) € pour les trois parcours/ },
      // Séquence réécrite le 04/10/2026 : le prix suit toujours « Pass Starter, ».
      { fichier: "src/lib/email/lead-magnet.ts", motif: /Pass Starter, (\d+) €/ },
      { fichier: "src/lib/email/nurture.ts", motif: /tes (\d+) € sont déduits/ },
      // Le crédit déduit du Mastery (450 € puis 650 €) part de cette constante.
      { fichier: "src/lib/offre/prix.ts", motif: /PRIX_STARTER = (\d+);/ },
    ],
    canon: canonMontant,
    verif: { kind: "local", fn: "prixPassStarter" },
  },
  {
    id: "prix-pass-mastery",
    libelle: "Prix du Pass Mastery",
    gravite: "critique",
    pourquoi:
      "Le pass qui fait l'essentiel du chiffre d'affaires, et la base de la mensualité Klarna. " +
      "Écrit à la main dans une vingtaine d'endroits jusqu'au 16/10/2026 ; depuis, lu dans " +
      "src/lib/offre/prix.ts presque partout. 497 € jusqu'au 31/10/2026, 697 € ensuite : tout " +
      "littéral « 497 » encore présent le 01/11 ressort ici.",
    ou: [
      // Clause FIXE et datée des CGV (« 497 € … jusqu'au 31 octobre 2026 inclus ;
      // 697 € … à partir du 1er novembre ») : elle doit citer les deux prix,
      // avant comme après la bascule, jamais le seul prix du jour.
      {
        fichier: "src/app/cgv/page.tsx",
        // « … rouverte ensuite par un lien de reprise ; 697 € … » depuis le
        // 16/10/2026 (date ancrée sur l'ouverture de la page de paiement).
        motif: prixApres(String.raw`Pass Mastery</strong>${ESP}*(?:—|:)${ESP}*|(?:inclus|reprise)${ESP}*;\s*`),
        periodes: true,
      },
      mastery("src/app/tarifs/page.tsx", prixApres(String.raw`Claude AI : \d+ €(?:,| ou) |Mastery à `)),
      mastery("src/app/tarifs/page.tsx", prixJsonLd("Pass Mastery")),
      mastery("src/components/landing/pricing-teaser.tsx", prixCarte("Mastery")),
      mastery("src/components/landing/pricing-teaser.tsx", prixApres("Rejoindre Mastery (?:—|·) ")),
      // value-stack.tsx affichait PRIX_MASTERY de lib/offre/mesures.ts. La constante
      // a été retirée le 16/10/2026 (un prix daté ne vit pas dans une constante de
      // module) : on suit désormais le composant lui-même.
      mastery("src/components/landing/value-stack.tsx", prixApres("Rejoindre Mastery, ")),
      mastery("src/components/landing/final-cta.tsx", prixApres("Rejoindre Mastery, ")),
      mastery("src/components/site/price-bar.tsx", prixApres("Pass complet ")),
      // footer.tsx : plus de prix Mastery depuis le 16/10/2026 (layout racine
      // non re-rendu en navigation interne, le montant y serait resté périmé).
      mastery("src/app/formation-claude-ai/page.tsx", prixApres(String.raw`Mastery · |parcours · |\d+ € ou |coûte `)),
      mastery("src/app/faq/page.tsx", prixApres(String.raw`Pass Mastery \(|\(ou `)),
      mastery("src/app/checkout/success/page.tsx", prixApres("Mastery · ")),
      mastery("src/app/checkout/cancel/page.tsx", passPrix("Mastery")),
      mastery("src/app/signup/page.tsx", passPrix("Mastery")),
      mastery("src/app/account/page.tsx", prixApres("Mastery (?:—|·) ")),
      mastery("src/app/mentor/page.tsx", prixApres("Pass Mastery · ")),
      mastery("src/app/courses/page.tsx", prixApres("Pass Mastery à ")),
      mastery("src/app/courses/[slug]/page.tsx", passPrix("Mastery")),
      mastery("src/app/courses/[slug]/page.tsx", /"mastery" \? "(\d+)"/),
      mastery("src/app/courses/[slug]/[lesson]/page.tsx", passPrix("Mastery")),
      mastery("src/app/llms.txt/route.ts", passPrix("Mastery")),
      // Emails : montants calculés à l'envoi depuis le 16/10/2026 (lib/offre/prix.ts).
      mastery("src/lib/email/activation.ts", /(\d+) € pour les \p{L}+(?:\$\{[^}]*\})?\. Garantie/u),
      mastery("src/lib/email/nurture.ts", prixApres(String.raw`« |au lieu de |"`)),
      mastery("src/lib/email/lead-magnet.ts", prixApres("Mentor IA : |Pass Mastery, ")),
    ],
    canon: canonMontant,
    verif: { kind: "local", fn: "prixPassMastery" },
  },
  {
    id: "montant-facture-mastery",
    libelle: "Montant du Pass Mastery dans le checkout (plans.ts)",
    gravite: "critique",
    pourquoi:
      "Ce que getPlan(\"mastery\") déclare facturer. Il doit appeler prixMastery() du module daté : " +
      "un littéral n'est exact qu'un seul jour sur deux périodes. 697 avant le 01/11/2026 ferait " +
      "payer la hausse trop tôt ; 497 après la ferait oublier.",
    ou: [
      { fichier: "src/lib/stripe/plans.ts", motif: /case "mastery":(?:(?!case ")[\s\S])*?amountEur: (\d+|prixMastery\(\w*\))/ },
    ],
    canon: (v) => (/^prixMastery\(/.test(v) ? "prixMastery()" : v),
    verif: { kind: "local", fn: "montantFactureMastery" },
  },
  {
    id: "date-hausse-mastery",
    libelle: "Date de la hausse du Mastery écrite en toutes lettres (« 1er novembre »)",
    gravite: "critique",
    pourquoi:
      "Le libellé affiché partout (« 697 € à partir du 1er novembre ») est une chaîne à part de " +
      "la date réelle de bascule (MASTERY_HAUSSE_LE). Si l'une bouge sans l'autre, le site annonce " +
      "une hausse à une date où elle n'a pas lieu.",
    ou: [{ fichier: "src/lib/offre/prix.ts", motif: /MASTERY_HAUSSE_LIBELLE = "([^"]+)"/ }],
    verif: { kind: "local", fn: "libelleHausseMastery" },
  },
  {
    id: "dernier-jour-prix-mastery",
    libelle: "Dernier jour du Mastery à l'ancien prix (« 31 octobre »)",
    gravite: "critique",
    pourquoi:
      "« 497 € jusqu'au 31 octobre inclus » : même risque, la veille de MASTERY_HAUSSE_LE à Paris.",
    ou: [{ fichier: "src/lib/offre/prix.ts", motif: /MASTERY_DERNIER_JOUR_LIBELLE = "([^"]+)"/ }],
    verif: { kind: "local", fn: "dernierJourPrixMastery" },
  },
  {
    id: "prix-pass-accompagnement",
    libelle: "Prix du Pass Accompagnement",
    gravite: "critique",
    pourquoi:
      "Vendu sous drapeau NEXT_PUBLIC_ELITE_ENABLED : peu de copies, rarement relues, et le prix " +
      "le plus élevé du catalogue. Écrit « 1 497 » en prose et « 1497 » dans le JSON-LD, d'où `canon`.",
    ou: [
      { fichier: "src/app/cgv/page.tsx", motif: prixApres(`Pass Accompagnement</strong>${ESP}*:${ESP}*`) },
      // « 47 €, ${prix} € ou 1 497 € » et « Accompagnement 1 497 € » depuis le 16/10/2026
      // (le prix du Mastery au milieu est devenu dynamique, le motif était muet).
      { fichier: "src/app/tarifs/page.tsx", motif: prixApres(String.raw`\d+ €, (?:\d+|\$\{\w+\}) € ou |Accompagnement(?: à)? `) },
      { fichier: "src/app/tarifs/page.tsx", motif: prixJsonLd("Pass Accompagnement") },
      { fichier: "src/components/landing/pricing-teaser.tsx", motif: prixCarte("Accompagnement") },
      { fichier: "src/components/landing/pricing-teaser.tsx", motif: prixApres("Réserver ma place (?:—|·) ") },
      { fichier: "src/app/checkout/cancel/page.tsx", motif: passPrix("Accompagnement") },
    ],
    canon: canonMontant,
    verif: { kind: "local", fn: "prixPassAccompagnement" },
  },

  // ── Fraîcheur : la preuve qu'on affiche au visiteur qui hésite ───────────
  // Ces trois valeurs sont écrites à la main dans `fraicheur.ts` et reprises
  // par la FAQ et la page de vente. Le 29/09/2026, la page de vente annonçait
  // encore « dernière mise à jour : juillet 2026 » : deux mois de veille
  // invisibles. D'où une seule copie, et un contrôle contre le dépôt.
  {
    id: "date-fraicheur",
    libelle: "Date de dernière mise à jour affichée",
    gravite: "critique",
    pourquoi:
      "Affichée sur la page de vente et la FAQ, et affirmée au Mentor IA. Si une passe de veille " +
      "ajoute un bloc :::maj plus récent sans toucher à la constante, le site sous-vend le produit " +
      "et le Mentor croit sa connaissance plus vieille qu'elle ne l'est.",
    ou: [{ fichier: "src/lib/content/fraicheur.ts", motif: /CONTENU_A_JOUR_AU = "([^"]+)"/ }],
    verif: { kind: "local", fn: "dernierBlocMaj" },
    // La constante doit être AU MOINS aussi récente que le dernier bloc :::maj,
    // pas égale : une passe qui ajoute un parcours entier (le 04/10/2026) ne
    // laisse aucun bloc :::maj et date pourtant le contenu. Comparer en
    // égalité stricte faisait ressortir « FAUX » pour un contenu plus à jour
    // que ce que le vérificateur savait mesurer.
    accepte: (contenu, source) => dateCle(contenu) >= dateCle(source),
  },
  {
    id: "notes-de-mise-a-jour",
    libelle: "Nombre de notes de mise à jour datées",
    gravite: "critique",
    pourquoi: "Chiffre de preuve affiché dans la FAQ. Il doit correspondre aux blocs :::maj réellement présents dans les leçons.",
    ou: [{ fichier: "src/lib/content/fraicheur.ts", motif: /NOTES_DE_MISE_A_JOUR = (\d+)/ }],
    verif: { kind: "local", fn: "compterBlocsMaj" },
  },
  {
    id: "sources-surveillees",
    libelle: "Nombre de sources surveillées par la veille",
    gravite: "critique",
    pourquoi: "Chiffre de preuve affiché dans la FAQ. Il doit correspondre aux sources déclarées dans sources.mjs.",
    ou: [{ fichier: "src/lib/content/fraicheur.ts", motif: /SOURCES_SURVEILLEES = (\d+)/ }],
    verif: { kind: "local", fn: "compterSources" },
  },

  // ── Écosystème Anthropic ─────────────────────────────────────────────────
  {
    id: "claude-code-version",
    libelle: "Version courante de Claude Code",
    gravite: "date",
    pourquoi: "La phrase est horodatée : elle vieillit sans devenir fausse. À rafraîchir lors d'une passe, jamais en urgence.",
    // Les pages de vente du parcours répètent la version « vérifiée » : jusqu'au
    // 16/10/2026 seule la leçon était suivie, et la description de
    // /formation-claude-code annonçait encore 2.1.288 quand la page disait 2.1.295.
    ou: [
      { fichier: "scripts/content/claude-code.mjs", motif: /la version courante est \*\*([\d.]+)\*\*/ },
      // La description du parcours (table courses, affichée sur sa page) : réécrite
      // par la passe SEO du 16/10/2026, écrasée par un seed parti d'une branche plus ancienne.
      { fichier: "scripts/content/claude-code.mjs", motif: /À jour de Claude Code (\d+\.\d+\.\d+)/ },
      { fichier: "src/app/formation-claude-code/page.tsx", motif: /[Vv]érifiée?s? sur Claude Code (\d+\.\d+\.\d+)/ },
      { fichier: "src/app/claude-code-skills/page.tsx", motif: /vérifié sur Claude Code (\d+\.\d+\.\d+)/ },
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
    verif: { kind: "revue", sources: ["anthropic-release-notes", "claude-blog", "platform-pricing"] },
  },
  {
    id: "abonnement-anthropic",
    libelle: "Tarif des abonnements Claude (Pro, Max, Team)",
    gravite: "critique",
    pourquoi: "Cité dans le calcul de coût du parcours Stratégie.",
    ou: [{ fichier: "scripts/content/strategie-ia.mjs", motif: /\*\*(\d+) \$ par mois en engagement annuel\*\*/ }],
    verif: { kind: "revue", sources: ["anthropic-release-notes", "claude-blog", "claude-pricing"] },
  },
  {
    id: "ai-act-calendrier",
    libelle: "Calendrier d'application de l'AI Act (art. 50, haut risque)",
    gravite: "critique",
    pourquoi:
      "Enseigner une échéance réglementaire fausse expose le lecteur. Le Digital Omnibus a déjà décalé le haut risque une fois.",
    ou: [{ fichier: "scripts/content/strategie-ia.mjs", motif: null }],
    verif: { kind: "revue", sources: ["eu-ai-act-framework", "eu-ai-act-implementation"] },
  },
  // ── Pages piliers SEO : des chiffres sourcés, donc des chiffres qui périment ──
  {
    id: "insee-adoption-ia",
    libelle: "Taux d'adoption de l'IA par les entreprises françaises (Insee, enquête TIC)",
    gravite: "date",
    pourquoi:
      "Affiché en gros sur la page pilier /formation-intelligence-artificielle avec l'année de référence. L'Insee publie une nouvelle vague chaque été : la phrase devient datée, pas fausse.",
    ou: [
      {
        fichier: "src/app/formation-intelligence-artificielle/page.tsx",
        motif: /value="(\d+) %"[\s\S]{0,40}?des entreprises françaises/,
      },
    ],
    verif: { kind: "revue", sources: [] },
  },
  {
    id: "ai-act-article-4",
    libelle: "Obligation de maîtrise de l'IA (AI Act, art. 4) et sa date d'application",
    gravite: "critique",
    pourquoi:
      "Argument commercial ET affirmation juridique, répété sur la page pilier et dans son FAQPage structuré. Le Digital Omnibus a déjà décalé d'autres échéances de l'AI Act : si celle-ci bouge, la page induit le lecteur en erreur.",
    ou: [
      { fichier: "src/app/formation-intelligence-artificielle/page.tsx", motif: null },
    ],
    verif: { kind: "revue", sources: ["eu-ai-act-framework", "eu-ai-act-implementation"] },
  },
  {
    id: "comparatif-claude-chatgpt",
    libelle: "Différences structurelles Claude / ChatGPT",
    gravite: "date",
    pourquoi:
      "La page /claude-vs-chatgpt évite volontairement versions et benchmarks, mais les écarts structurels (écosystème, documents longs, suivi de consigne) peuvent se refermer. À relire une fois par trimestre.",
    ou: [{ fichier: "src/app/claude-vs-chatgpt/page.tsx", motif: null }],
    verif: { kind: "revue", sources: ["anthropic-release-notes", "claude-blog"] },
  },
  {
    id: "cnil-doctrine-ia",
    libelle: "Doctrine CNIL sur l'IA et le RGPD",
    gravite: "critique",
    pourquoi: "Même raison : c'est du droit applicable, enseigné à des professionnels.",
    ou: [{ fichier: "scripts/content/strategie-ia.mjs", motif: null }],
    verif: { kind: "revue", sources: ["cnil-ia"] },
  },

  // ── Ajoutés le 16/10/2026, après deux erreurs que rien ne surveillait ────
  {
    id: "contenu-des-plans",
    libelle: "Fonctions incluses dans chaque plan Claude (Free, Pro, Max)",
    gravite: "critique",
    pourquoi:
      "Le 16/10/2026, Bien démarrer et un QCM affirmaient que Claude Code est inclus dans le plan " +
      "Free, alors que le comparatif de claude.com/pricing le réserve à Pro et au-dessus (et que " +
      "/formation-claude-code disait déjà le contraire). Aucune source ne surveillait cette page : " +
      "le fait des abonnements n'était relu que sur un mouvement des notes de version de l'API.",
    ou: [
      { fichier: "scripts/content/bien-demarrer.mjs", motif: null },
      { fichier: "src/lib/quizzes/data.json", motif: null },
      { fichier: "src/app/claude-ai-gratuit/page.tsx", motif: null },
      { fichier: "src/app/formation-claude-code/page.tsx", motif: null },
    ],
    verif: { kind: "revue", sources: ["claude-pricing"] },
  },
  {
    id: "statuts-apercu-et-beta",
    libelle: "Statuts « aperçu de recherche » et « bêta » (mode rapide, agents gérés, routines)",
    gravite: "critique",
    pourquoi:
      "Un statut se périme sans qu'aucun chiffre ne bouge. Le 15/10/2026, le mode rapide d'Opus 5.5 " +
      "est sorti de l'aperçu de recherche et arrivé sur Foundry : deux leçons disaient encore « aperçu " +
      "de recherche » et « ni Foundry ».",
    ou: [
      { fichier: "scripts/content/prompt-engineering.mjs", motif: null },
      { fichier: "scripts/content/claude-code.mjs", motif: null },
      { fichier: "scripts/content/agent-ia.mjs", motif: null },
    ],
    verif: { kind: "revue", sources: ["anthropic-release-notes"] },
  },
];
