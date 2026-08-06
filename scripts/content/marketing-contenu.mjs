// =========================================
// Parcours « Contenu et marketing avec Claude »
// Contenu original au standard du Parcours. Sujet : produire du contenu et du
// marketing avec Claude sans tomber dans le générique, en gardant une voix de
// marque, et sans jamais inventer chiffres/témoignages.
// Bonnes pratiques marketing/SEO/GEO vérifiées à la rédaction.
// Mise à jour du 6 août 2026 : article 50 de l'AI Act (transparence des contenus
// générés par IA, applicable depuis le 02/08/2026), Opus 5, régime Fable 5,
// Cowork web/mobile et tâches planifiées.
// =========================================

const FOOTER = `

---

**Sources & méthode** · Contenu vérifié au **6 août 2026**. Bonnes pratiques marketing/SEO/GEO établies. Cadre réglementaire : Commission européenne, \`digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai\` (calendrier de l'AI Act et lignes directrices finales sur l'article 50, adoptées le 20/07/2026). Produit Claude : \`platform.claude.com/docs/en\`, \`support.claude.com\`, \`claude.com/pricing\` (relevés le 06/08/2026). Cette formation explique **ce que dit le règlement** ; elle ne remplace pas un avis juridique sur ta situation particulière. Contenu original pour ClaudeAI Academy.`;

export const contenuEtMarketing = {
  slug: "contenu-et-marketing",
  title: "Contenu et marketing avec Claude",
  description:
    "Produire du contenu et du marketing avec Claude sans sombrer dans le générique : voix de marque réutilisable, industrialisation maîtrisée, transparence AI Act depuis le 2 août 2026, SEO/GEO à l'ère des résumés IA, et mesure honnête.",
  tier_required: "mastery",
  display_order: 5,
  estimated_duration_min: 162,
  lessons: [
    {
      slug: "marketing-pourquoi-claude-est-mediocre",
      title: "Pourquoi Claude est souvent médiocre en marketing",
      description:
        "Générique, lisse, hype creuse : d'où vient le problème, et le cadrage en quelques leviers qui transforme la sortie.",
      duration_min: 18,
      is_free_preview: true,
      content_md:
        `:::objectifs
- Reconnaître en dix secondes les quatre symptômes du texte marketing générique
- Cadrer une demande pour que Claude arrête de régresser vers la moyenne
- Faire produire trois angles avant d'écrire la moindre ligne
- Savoir que ce que tu publies relève de l'article 50 de l'AI Act depuis le 2 août 2026
:::

:::flash
Le générique n'est pas un défaut du modèle : c'est ce que produit une demande sous-spécifiée. Quatre leviers renversent la sortie — donner de la matière plutôt qu'un sujet, interdire explicitement la hype, exiger du concret, nommer un lecteur réel. Et depuis le 2 août 2026, ce que tu publies avec l'IA entre dans le champ de l'article 50 de l'AI Act : la leçon 3 t'outille pour ça.
:::

## Le problème n'est pas le modèle, c'est la demande

Tu demandes à Claude « écris un post LinkedIn sur notre nouvelle fonctionnalité » et tu récupères un texte propre, grammaticalement parfait, et parfaitement oubliable. Des verbes mous (*révolutionner*, *transformer*), des promesses non tenues (*boostez votre productivité*), des transitions vides (*dans le monde d'aujourd'hui*). Ce n'est pas un défaut du modèle : c'est la réponse statistiquement la plus sûre à une demande sous-spécifiée.

Un grand modèle de langage produit, par défaut, **le centre de gravité de tout ce qu'il a lu**. Sur du marketing, ce centre de gravité est saturé de contenu médiocre : pages de vente clonées, posts d'agence, communiqués creux. Sans contrainte forte, Claude régresse vers cette moyenne. Le générique n'est pas une erreur, c'est l'absence d'instruction.

:::cle Le générique est un symptôme, pas une fatalité
Tout ce que tu ne dis pas, le modèle le remplit avec la moyenne d'Internet. La qualité d'une sortie marketing se joue donc presque entièrement **avant** la rédaction, dans ce que tu fournis.
:::

## Les quatre symptômes à reconnaître

| Symptôme | À quoi ça ressemble | Le test qui le révèle |
| --- | --- | --- |
| **Le lisse** | Aucune aspérité, aucune opinion, valable pour tout le secteur | Remplace ton nom par celui d'un concurrent : si rien ne cloche, c'est mort |
| **La hype** | *Game-changer*, *incontournable*, *boostez* | Supprime l'adjectif : s'il ne reste aucun fait, il n'y avait rien |
| **L'abstraction** | *Nous aidons les entreprises à optimiser leurs process* | Essaie de dessiner la phrase : si aucune image ne vient, c'est vide |
| **L'invention** | Un pourcentage, un témoignage, une étude fabriqués | Demande la source : si elle n'existe pas chez toi, c'est une hallucination |

Les trois premiers symptômes coûtent de l'ennui. Le quatrième coûte une réputation, et parfois un litige : c'est de loin le plus dangereux.

:::piege Claude comble les trous au lieu de laisser un blanc
Face à une demande où il manque un chiffre, un modèle ne dit pas spontanément « je ne sais pas » : il produit quelque chose de plausible. « Nos clients gagnent 30 % de temps » sort tout seul, sans que personne ne l'ait jamais mesuré. Ce qui te protège n'est pas ta vigilance, c'est une consigne explicite : quand une donnée manque, il écrit [À COMPLÉTER] au lieu de la fabriquer.
:::

## Le cadrage qui corrige

Quatre leviers, du plus rentable au plus fin.

**1. Donner de la matière, pas un sujet.** « Écris sur X » échoue. À la place, fournis les faits bruts : ce que fait réellement le produit, pour qui, le problème précis qu'il résout, une anecdote vraie, un chiffre que tu possèdes. Claude n'invente bien que ce qu'on ne lui donne pas. Nourris-le et il s'arrête d'inventer.

**2. Interdire explicitement le générique.** Une liste noire dans le prompt, plus une règle de repli quand une donnée manque.

**3. Imposer le concret.** Exige au moins un exemple précis, un verbe d'action par phrase clé, et le bannissement des adjectifs auto-évaluatifs au profit de faits. *Rapide* ne vaut rien ; *répond en moins d'une seconde* se vérifie.

**4. Définir un destinataire réel.** Pas « les PME » mais « un directeur d'agence de 8 personnes qui perd deux heures par jour à faire des devis à la main ». La spécificité du lecteur force la spécificité du texte.

:::prompt Le cadre minimal anti-générique — à coller en tête de toute demande
Avant de rédiger, applique ces règles sans exception.

MATIÈRE (les seuls faits que tu as le droit d'utiliser) :
- Produit : [ce qu'il fait, concrètement, en une phrase]
- Lecteur : [métier, taille de la structure, la contrariété précise qu'il vit]
- Preuve : [un chiffre réel OU un cas client réel, anonymisé si besoin]

INTERDITS : révolutionner, game-changer, incontournable, boostez, dans le monde d'aujourd'hui, à l'ère du numérique, solution innovante, toute statistique que je ne t'ai pas donnée, tout témoignage.

RÈGLE DE REPLI : si une donnée te manque, écris [À COMPLÉTER] entre crochets. Ne l'invente pas, ne l'arrondis pas, ne la déduis pas d'un ordre de grandeur.

CONCRET : un exemple vérifiable minimum. Remplace chaque adjectif auto-évaluatif par le fait qui le prouve.

À la fin, sous le titre « Trous », liste chaque [À COMPLÉTER] que tu as posé.
:::

La règle de repli est la ligne la plus importante du parcours. Elle transforme l'hallucination en tâche visible : au lieu d'un mensonge invisible au milieu du texte, tu récupères une liste de choses à aller chercher.

:::avant-apres Demande sous-spécifiée | Demande cadrée
Écris un post LinkedIn sur notre nouvelle fonctionnalité d'export.

Sortie : « À l'ère de la transformation digitale, nous sommes fiers d'annoncer une fonctionnalité qui va révolutionner votre productivité. Avec notre nouvel export, boostez votre efficacité et gagnez un temps précieux ! »
===
Post LinkedIn, 120 mots. Lecteur : gérant d'une agence d'architecture de 8 personnes qui refacture ses honoraires à la main. Fait : l'export génère, depuis n'importe quel devis, un fichier comptable prêt à importer, en un clic. Preuve autorisée : un cabinet de 6 personnes est passé de 3 h à 20 min de saisie mensuelle. Interdits : révolutionner, boostez, transformation digitale. Si une donnée manque, écris [À COMPLÉTER].

Sortie : « Fin de mois, cabinet de 8 personnes : trois heures à recopier des devis dans le logiciel comptable, ligne par ligne. Un cabinet de 6 personnes est passé à 20 minutes en exportant directement un fichier prêt à importer… »
:::

## Le réflexe du premier jet jetable

Le meilleur usage de Claude en marketing n'est presque jamais d'accepter la première sortie. Considère-la comme un **brouillon de négociation** : elle te donne une base, tu critiques, tu renvoies les contraintes manquantes.

Une bonne pratique : demande trois angles radicalement différents avant d'écrire quoi que ce soit. Tu choisis l'angle, puis tu fais rédiger. Tu évites ainsi le premier réflexe statistique, qui est toujours le plus banal.

:::prompt Trois angles avant toute rédaction
Sujet : [ton sujet]. Lecteur : [le lecteur, en une phrase concrète].

Ne rédige rien pour l'instant. Propose 3 angles RADICALEMENT différents pour traiter ce sujet. Pour chacun :
- l'angle en une phrase
- la promesse faite au lecteur
- ce qu'il faudrait prouver pour la tenir
- pourquoi un concurrent ne pourrait pas écrire le même texte

Contrainte : les 3 angles doivent être incompatibles entre eux. Si deux se ressemblent, remplace le second.
:::

## Ce qui a changé cet été et qui te concerne

Deux évolutions récentes changent la façon de travailler sur ce parcours : le modèle par défaut, et l'accès au meilleur modèle d'écriture.

:::maj 24 juillet 2026
**Claude Opus 5** devient le modèle Opus le plus récent — Opus 4.8 passe en « Legacy ». Il réfléchit par défaut (la réflexion étendue ne se coupe plus dans l'application pour ce modèle) et accepte **1 million de tokens de contexte** : tu peux lui donner ton brief de marque, tes anciens contenus et tes notes de recherche dans la même conversation.
:::

Côté écriture pure, la nouvelle est moins agréable, et elle est financière.

:::maj 20 juillet 2026
**Fable 5**, le modèle le plus fort d'Anthropic pour l'écriture, **n'est plus inclus dans les plans**. Free n'y a plus accès. Sur **Pro** et sur un siège **Team standard**, il passe par les *usage credits* (paiement à l'usage, avec un crédit unique offert). Sur **Max** et sur un siège **Team premium**, jusqu'à 50 % des limites hebdomadaires peuvent y passer, puis credits.
:::

:::astuce Réserve le modèle le plus cher à la dernière passe
Un plan, un brouillon et dix objets d'email n'ont pas besoin du meilleur modèle d'écriture : Sonnet 5 ou Opus 5 font le travail sans entamer tes credits. Garde Fable 5 pour la passe finale de style, sur les pièces qui portent vraiment la marque — page de vente, manifeste, email de lancement.
:::

## Ce que change ce parcours

> Claude n'est pas un rédacteur autonome. C'est un amplificateur. Il amplifie ce que tu lui donnes : du flou, il amplifie le flou ; une voix, des faits et des contraintes, il amplifie ta marque.

Les cinq leçons suivantes construisent l'outillage : un brief de voix réutilisable (leçon 2), un workflow de production qui tient à l'échelle **et qui respecte l'article 50 de l'AI Act, applicable depuis le 2 août 2026** (leçon 3), le SEO/GEO à l'ère des réponses génératives (4), des séquences email qui convertissent sans hype (5), et une mesure honnête qui ne s'appuie jamais sur des chiffres inventés (6). Le fil rouge ne bouge pas : **éviter le générique, garder la voix, ne jamais inventer**.

:::defi 20 min — Le test du concurrent sur ton propre contenu
Prends un contenu que tu as publié dans les trois derniers mois et passe-le au crible de cette leçon.
- Tu as remplacé le nom de ta marque par celui d'un concurrent et noté si quelque chose cloche
- Tu as surligné chaque mot de hype et chaque adjectif auto-évaluatif non prouvé
- Tu as listé chaque affirmation chiffrée et vérifié que tu possèdes vraiment la donnée
- Tu as réécrit le premier paragraphe avec le prompt « cadre minimal anti-générique »
- Tu as fait produire 3 angles sur le même sujet et identifié celui que tu n'aurais pas trouvé seul
:::

:::memo
Q: Pourquoi Claude produit-il du marketing générique par défaut ?
R: Parce qu'une demande sous-spécifiée le fait converger vers la moyenne de ce qu'il a lu, et cette moyenne est du contenu médiocre.
===
Q: Lequel des quatre symptômes est le plus dangereux ?
R: L'invention : un chiffre ou un témoignage plausible mais faux, qui coûte la réputation et parfois un litige.
===
Q: Quelle ligne de prompt transforme une hallucination en tâche à faire ?
R: « Si une donnée te manque, écris [À COMPLÉTER] au lieu de l'inventer. »
===
Q: Que demander avant de faire rédiger un contenu ?
R: Trois angles radicalement différents, puis en choisir un. Le premier angle d'un modèle est toujours le plus banal.
===
Q: Depuis le 20 juillet 2026, Fable 5 est-il inclus dans un abonnement Pro ?
R: Non. Sur Pro il passe par les usage credits ; Free n'y a pas accès ; Max en couvre jusqu'à 50 % des limites hebdomadaires.
:::` + FOOTER,
    },
    {
      slug: "marketing-brief-voix-de-marque",
      title: "Construire un brief de voix de marque réutilisable",
      description:
        "Un document de référence, injectable dans chaque prompt, qui fait écrire Claude comme toi et pas comme tout le monde.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Rédiger un brief de voix de marque d'une page, réutilisable dans chaque conversation
- Remplacer les adjectifs inspirants par des règles qu'un modèle peut appliquer mécaniquement
- Extraire ta voix de tes propres textes au lieu de l'inventer de zéro
- Valider un brief par trois tests objectifs, puis le faire vivre
:::

:::flash
Un brief de voix n'est pas une charte de marque : c'est un jeu de contraintes vérifiables. Sept sections, une page, dont deux font l'essentiel du résultat — les exemples annotés et la liste noire. Quand une sortie déçoit, tu corriges le brief, pas le texte.
:::

## Pourquoi un brief, pas un prompt

Redonner tes consignes de ton à chaque demande est une perte de temps et une source d'incohérence. La solution professionnelle est un **brief de voix de marque** : un document court, dense, que tu colles en tête de chaque conversation (ou que tu stockes dans un projet réutilisable). Il transforme Claude en collaborateur qui connaît déjà ta marque, au lieu d'un pigiste à qui tu réexpliques tout.

L'objectif n'est pas un PDF de 40 pages que personne ne lit. C'est une page, opérationnelle, faite d'éléments que Claude peut **appliquer mécaniquement**.

:::cle Une règle vérifiable bat toujours un adjectif inspirant
« Sois percutant » ne se contrôle pas, donc ne s'applique pas. « Phrases de 15 à 20 mots, un exemple concret par section, jamais le mot *solution* » se vérifie d'un coup d'œil — et ce qui se vérifie se respecte.
:::

## Les sept sections du brief

**1. Positionnement en une phrase.** Qui tu es, pour qui, contre quoi. Exemple structurel : « Nous aidons [audience précise] à [résultat concret] sans [douleur habituelle du secteur]. » Cette phrase ancre tout le reste.

**2. Le lecteur, en chair et en os.** Pas une cible démographique : une personne. Son métier, sa journée, le problème qui le réveille la nuit, le vocabulaire qu'il emploie et celui qui le fait fuir. Claude écrit mieux pour une personne que pour un segment.

**3. Trois adjectifs de ton — et leurs contraires.** « Direct, chaleureux, précis » ne suffit pas : tout le monde dit ça. Ajoute l'anti-ton : « Direct (pas brutal), chaleureux (pas familier), précis (pas jargonneux). » Les contraires cadrent mieux que les qualités.

**4. Liste noire lexicale.** Les mots et tournures bannis : la hype de ton secteur, les anglicismes que tu refuses, les formules creuses. C'est le garde-fou anti-générique le plus efficace, parce qu'il est vérifiable d'un coup d'œil.

**5. Règles de style mesurables.** Des consignes contrôlables objectivement : longueur de phrase visée, tutoiement ou vouvoiement, usage des chiffres, place des exemples, format des titres. Évite les consignes invérifiables.

**6. Exemples annotés — le cœur du brief.** Deux ou trois extraits de TON meilleur contenu, et un ou deux contre-exemples (« ce ton-là, jamais »). Un modèle apprend une voix infiniment mieux par l'exemple que par l'adjectif. C'est la section qui fait la différence entre un brief tiède et un brief qui fonctionne.

**7. Faits et chiffres autorisés.** La liste des données que Claude a le droit d'utiliser : tes vraies statistiques, tes vrais cas clients (anonymisés si besoin). Règle absolue inscrite ici : **tout ce qui n'est pas dans cette liste est interdit ; à défaut, écrire [À COMPLÉTER]**.

:::astuce Ne rédige pas ta voix : fais-la extraire de tes textes
La plupart des gens sèchent devant la page blanche du brief. Le raccourci consiste à donner à Claude cinq ou six de tes meilleurs textes et à lui faire décrire la voix qu'il y observe. Tu corriges ensuite ce portrait — c'est dix fois plus rapide, et beaucoup plus juste, que de partir d'adjectifs choisis à froid.
:::

:::prompt Extraire ta voix de marque de tes propres contenus
Voici 5 textes que j'ai écrits et dont je suis satisfait, séparés par ---.

[colle ici tes textes]

Analyse-les comme un directeur de création qui doit briefer un nouveau rédacteur. Rends-moi :
1. TON : 3 adjectifs, chacun avec son anti-ton sous la forme « X, pas X' ».
2. RÈGLES DE STYLE MESURABLES : longueur moyenne de phrase, personne employée, usage des chiffres, place des exemples, format des titres, ponctuation caractéristique. Uniquement des règles vérifiables — aucune formule du type « sois percutant ».
3. TICS : 5 tournures qui reviennent et que je devrais assumer comme signature.
4. LISTE NOIRE : 10 mots ou tournures que ces textes n'utilisent jamais alors que le secteur en abuse.
5. Les 3 extraits les plus représentatifs, cités mot pour mot, avec en une ligne ce que chacun démontre.

N'invente rien : si un point n'est pas observable dans les textes, écris [À COMPLÉTER].
:::

## Le squelette à copier

    # BRIEF DE VOIX — [Marque]
    POSITIONNEMENT : ...
    LECTEUR : ... (métier, douleur, vocabulaire)
    TON : X (pas X'), Y (pas Y'), Z (pas Z')
    INTERDITS : [mots], [tournures], toute donnée non listée ci-dessous
    STYLE : phrases ~15-20 mots, vouvoiement, un exemple concret par section
    EXEMPLES À IMITER :
        « extrait 1 ... »
        « extrait 2 ... »
    À NE JAMAIS FAIRE :
        « contre-exemple ... »
    FAITS AUTORISÉS : [chiffre réel 1], [cas client réel 2]
    RÈGLE : si une donnée manque, écrire [À COMPLÉTER], ne jamais inventer.
    MENTION IA : [la formule d'étiquetage que j'utilise — voir leçon 3]

La dernière ligne paraît anecdotique aujourd'hui : elle ne l'est plus depuis le 2 août 2026. Certains contenus doivent porter une mention visible indiquant qu'ils ont été générés par IA ; autant que la formule exacte vive dans le brief, au même titre que le ton.

:::avant-apres Brief mou | Brief contraignant
TON : moderne, humain, expert. On veut du contenu qui parle vraiment aux gens et qui montre notre expertise. Être percutant et authentique.
===
TON : direct (pas brutal), chaleureux (pas familier), précis (pas jargonneux).
STYLE : phrases de 15 à 20 mots ; vouvoiement ; un exemple chiffré par section ; titres en questions ; jamais deux adjectifs à la suite.
INTERDITS : solution, accompagner, écosystème, sur-mesure, game-changer, « nos experts ».
FAITS AUTORISÉS : 340 cabinets clients (chiffre au 30/06/2026) ; cas Duval — 3 h à 20 min de saisie mensuelle.
RÈGLE : toute donnée absente de cette liste → [À COMPLÉTER].
:::

## Le tester avant de l'adopter

Un brief se valide empiriquement, pas au ressenti. Donne à Claude le brief plus une tâche simple, puis pose-toi trois questions sur la sortie.

:::etapes
1. **Test du concurrent.** Remplace le nom de ta marque par celui d'un concurrent. Si le texte tient toujours debout, l'angle vient du brief, pas de toi : durcis le positionnement et le lecteur.
2. **Test de la liste noire.** Cherche mot par mot chaque terme interdit. Une seule occurrence signifie que la liste est trop longue ou trop vague pour être appliquée : raccourcis-la aux dix mots qui te gênent vraiment.
3. **Test des faits.** Surligne chaque donnée chiffrée, nom propre et affirmation de résultat. Tout ce qui n'est pas dans « faits autorisés » aurait dû être un [À COMPLÉTER] : ajoute la règle de repli en majuscules, en fin de brief.
4. **Corrige le document, pas le texte.** Reporte chaque correction dans le brief, puis relance la même tâche à froid pour vérifier que la correction tient.
:::

:::piege Ne juge jamais un brief sur une seule sortie
Un modèle est variable : une bonne sortie peut arriver malgré un brief médiocre. Fais tourner la même tâche trois fois, sur trois sujets différents. Ce que tu cherches, ce n'est pas la meilleure sortie, c'est la **plus mauvaise des trois** — c'est elle qui dit ce que ton brief laisse passer.
:::

## Où le stocker pour qu'il s'injecte tout seul

Un brief qu'on doit retrouver et recoller à la main finit par ne plus être collé du tout. Range-le une fois pour toutes à un endroit que la conversation charge sans effort : un **projet** Claude avec le brief en instructions personnalisées et tes meilleurs contenus en documents de référence, ou un fichier de référence dans ton dépôt si tu travailles avec Claude Code.

:::maj 6 août 2026
Le plan **Pro** inclut désormais les **projets illimités**, ainsi que Claude Cowork, Claude Design, Claude Science et Research. Il n'y a plus de raison de garder un seul projet fourre-tout : un projet par marque, ou par ligne éditoriale, avec son brief en instructions.
:::

## Le faire vivre

Un brief n'est pas figé. Quand un contenu performe particulièrement bien, ajoute-le aux exemples à imiter. Quand un mot t'agace de façon récurrente dans les sorties, ajoute-le à la liste noire. Au bout de quelques semaines, tu tiens un actif réutilisable qui rend chaque demande deux fois plus rapide et deux fois plus juste.

> Un bon brief de voix ne décrit pas ta marque : il **contraint** Claude. Préfère toujours une règle vérifiable à un adjectif inspirant. Ce qui ne se contrôle pas ne s'applique pas.

:::defi 45 min — Ton brief v1, testé
Construis ton brief de voix et prouve qu'il tient.
- Tu as fait extraire ta voix de 5 de tes textes avec le prompt de la leçon
- Ton brief tient sur une page et contient les 7 sections, dont la liste des faits autorisés
- Il contient au moins 2 extraits à imiter et 1 contre-exemple annoté
- Tu as fait tourner la même tâche 3 fois et jugé sur la plus mauvaise sortie
- Tu as reporté chaque correction dans le brief, pas dans le texte
- Le brief est stocké dans un projet Claude (ou un fichier) que tu n'auras plus à recoller
:::

:::memo
Q: Quelle section fait la différence entre un brief tiède et un brief qui fonctionne ?
R: Les exemples annotés : un modèle apprend une voix par l'exemple, bien mieux que par l'adjectif.
===
Q: Pourquoi ajouter un anti-ton (« direct, pas brutal ») ?
R: Parce que les contraires cadrent mieux que les qualités : tout le monde se dit direct et chaleureux.
===
Q: Une sortie échoue au test du concurrent. Que corriges-tu ?
R: Le brief, jamais la sortie. On itère sur le document, pas sur chaque texte.
===
Q: Sur combien de sorties juge-t-on un brief, et laquelle regarde-t-on ?
R: Trois sorties sur trois sujets, et on juge sur la plus mauvaise : c'est elle qui révèle ce que le brief laisse passer.
===
Q: Que dit la règle absolue de la section « faits autorisés » ?
R: Tout ce qui n'est pas dans la liste est interdit ; à défaut, écrire [À COMPLÉTER].
:::` + FOOTER,
    },
    {
      slug: "marketing-industrialiser-sans-perdre-la-voix",
      title: "Industrialiser la production sans perdre la voix (ni la conformité)",
      description:
        "Passer à l'échelle sans diluer la marque : workflow en étapes, garde-fous anti-générique, relecture humaine au bon endroit — et le régime de transparence de l'article 50 de l'AI Act, applicable depuis le 2 août 2026.",
      duration_min: 34,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Découper la production en quatre étapes dont chacune a un livrable contrôlable
- Rendre les garde-fous anti-générique mécaniques au lieu de compter sur ta vigilance
- Savoir, pour chaque contenu que tu publies, s'il doit porter une mention « généré par IA »
- Documenter une relecture éditoriale de fond, qui est aussi l'exemption prévue par le règlement
- Planifier un calendrier éditorial qui tourne sans que ta machine soit allumée
:::

:::flash
Industrialiser, c'est découper : angle, plan, rédaction par blocs, passe anti-générique. Depuis le 2 août 2026, une cinquième contrainte s'ajoute au workflow : l'article 50 de l'AI Act impose d'étiqueter certains contenus produits par IA — les visuels où figure une personne réelle, et les textes d'intérêt public non relus par un humain. La bonne nouvelle : la relecture éditoriale documentée, que tu devrais faire de toute façon, est précisément l'exemption prévue.
:::

## Le piège du volume

Dès qu'on industrialise, deux dangers apparaissent. Le premier : la **régression vers le générique**, parce qu'on relâche les contraintes pour aller vite. Le second : la **dette de contenu** — produire vite du contenu médiocre qui salit la marque et qu'il faudra réécrire. L'enjeu de cette leçon est de produire beaucoup sans tomber dans aucun des deux.

La règle de fond : **on n'industrialise jamais une étape qu'on ne maîtrise pas à la main**. Si tu ne sais pas faire un bon article à l'unité avec Claude, automatiser ne fera que multiplier les défauts.

## Le workflow en quatre étapes

Découper la production en étapes distinctes vaut infiniment mieux qu'un méga-prompt qui fait tout. Chaque étape a un livrable contrôlable.

:::etapes
1. **Angle.** Avant d'écrire, fais produire 3 à 5 angles distincts à partir du sujet et du brief, et tranche. C'est l'étape qui tue le générique : le premier angle d'un modèle est toujours le plus banal, le bon angle est souvent le troisième.
2. **Plan.** À partir de l'angle choisi, un plan détaillé : titres de sections, promesse de chaque section, exemple ou donnée prévue à chaque endroit. Tu valides le plan avant un mot de rédaction. Corriger un plan coûte une minute ; corriger un article fini en coûte trente.
3. **Rédaction section par section.** On rédige par bloc, pas tout d'un coup. Claude garde mieux la voix sur un format court, et tu repères une dérive immédiatement au lieu de la découvrir à la fin.
4. **Passe anti-générique.** Une dernière passe où Claude, puis toi, relit avec une grille précise : chasse à la liste noire, vérification que chaque affirmation est étayée, marquage [À COMPLÉTER] sur toute donnée non sourcée.
5. **Contrôle de publication.** Le nouveau venu depuis le 2 août 2026 : ce contenu doit-il porter une mention « généré par IA » ? Qui l'a relu, quand, sur quoi ? La suite de la leçon outille cette étape.
:::

## Les garde-fous mécaniques

Industrialiser, c'est rendre les contraintes systématiques plutôt que de compter sur sa vigilance.

- **Le brief en tête de chaque tâche.** Toujours injecté, jamais résumé. Dans un projet Claude ou avec Claude Code, stocke-le dans un fichier que chaque conversation charge.
- **La checklist de sortie.** Un prompt de relecture réutilisable, qui **signale sans réécrire** : séparer le diagnostic de la réécriture donne de bien meilleurs résultats.
- **Le test du concurrent, systématisé.** À chaque pièce : le nom de la marque est-il remplaçable sans que rien ne cloche ? Si oui, l'angle est trop générique.
- **Le quota d'erreur zéro sur les faits.** Aucune statistique, citation ou nom propre ne sort sans source. C'est non négociable et ça se vérifie en relecture finale.

:::prompt Passe anti-générique — diagnostic sans réécriture
Tu es relecteur. Voici mon brief de voix, puis un texte à auditer.

[BRIEF]
[TEXTE]

Ne réécris rien. Rends-moi cinq listes, chacune avec la citation exacte et le numéro de paragraphe :
1. LISTE NOIRE : chaque mot ou tournure interdite par le brief.
2. NON ÉTAYÉ : chaque affirmation de bénéfice, de résultat ou de supériorité qui n'est appuyée par aucun fait du brief.
3. SUSPECT D'INVENTION : chaque chiffre, date, nom propre, citation ou témoignage qui n'apparaît pas dans les faits autorisés.
4. ABSTRAIT : chaque phrase dont je ne peux pas me faire une image mentale.
5. TEST DU CONCURRENT : les passages qui resteraient vrais en remplaçant ma marque par celle d'un concurrent.

Termine par un verdict en une ligne : publiable en l'état, à corriger, ou à refaire.
:::

## Publier avec l'IA : ce que dit l'article 50, en vigueur depuis le 2 août 2026

Le régime de transparence de l'AI Act s'applique **depuis le 2 août 2026**. Ce n'est plus une échéance à préparer : c'est le droit en vigueur, et il vise exactement ce que fait ce parcours — publier du contenu produit avec de l'IA. Les lignes directrices finales de la Commission européenne sur cet article ont été adoptées le 20 juillet 2026 et sont publiques.

Premier point à intégrer : **tu es un « déployeur »**. Le règlement appelle ainsi toute personne physique ou morale qui utilise un système d'IA sous sa propre autorité, en dehors d'un usage strictement personnel et non professionnel. Un indépendant qui rédige ses posts avec Claude, une PME qui alimente son blog : déployeurs, tous les deux.

:::cle Déployeur, pas fournisseur
Le fournisseur du modèle, c'est Anthropic — c'est lui qui porte les obligations lourdes. Tes obligations de déployeur tiennent en quelques lignes, et elles sont beaucoup plus courtes que ce que laissent croire les articles alarmistes. Trois situations te concernent, pas une de plus.
:::

| Ce que tu publies | Mention obligatoire ? | Ce que tu fais |
| --- | --- | --- |
| Visuel, audio ou vidéo généré ou retouché par IA où figure une personne réelle | **Oui** | Divulgation claire, dès la première exposition |
| Texte qui informe le public sur un sujet d'intérêt public (politique, santé publique, environnement, sécurité des consommateurs, débat public) | **Oui, sauf revue humaine** | Soit une mention, soit une relecture éditoriale de fond, documentée |
| Post LinkedIn commercial, page produit, email client, newsletter promotionnelle | **Non** | Rien à étiqueter au titre de l'article 50 |
| Note interne, brouillon, script, code | **Non** | Rien |
| Chatbot exposé à tes clients | **Oui**, autre mécanisme | Dire dès le premier message qu'on parle à une IA |

### Les visuels où figure une personne réelle

C'est le cas le plus net. Une image, un son ou une vidéo généré ou manipulé par IA, qui ressemble à une personne réelle au point de pouvoir passer pour authentique, doit être divulgué comme tel — **de manière claire et distinguable, au plus tard lors de la première exposition**. Une mention en pied de page, sous trois clics, ne remplit pas ce critère.

Deux nuances utiles. Pour une œuvre manifestement artistique, satirique ou de fiction, le règlement prévoit une **atténuation** : la divulgation reste due, mais d'une façon qui n'entrave pas la présentation de l'œuvre. Et le contenu **physiquement impossible** — un dragon au-dessus de ton entrepôt, un humain qui vole — n'entre pas dans la définition du deepfake : personne ne risque de le prendre pour authentique.

:::piege Retoucher, c'est déjà manipuler
Beaucoup pensent que seule la génération complète est visée. Le texte parle de contenu **généré ou manipulé**. Un portrait client réel dont tu as fait « améliorer » l'expression, changer le décor ou rajeunir le visage par IA tombe dans le même régime que l'image intégralement générée.
:::

### Le texte d'intérêt public, et l'échappatoire de la relecture

Deuxième cas : le texte généré ou manipulé par IA **publié dans le but d'informer le public sur des questions d'intérêt public** — politique, santé publique, environnement, sécurité des consommateurs, débat public. Celui-là doit être étiqueté… **sauf s'il a fait l'objet d'un contrôle humain ou d'une revue éditoriale et qu'une personne assume la responsabilité éditoriale de la publication**.

C'est l'exemption la plus importante à connaître, et c'est aussi, par chance, la meilleure pratique métier. Ce qui te dispense d'étiqueter est exactement ce que tu ferais pour ne pas publier de bêtise : quelqu'un lit, vérifie, corrige, assume.

:::cle Documenter la relecture, c'est le geste professionnel
Une relecture qu'on ne peut pas prouver n'existe pas. Trois colonnes suffisent, dans un tableur ou en tête de document : **qui a relu, quand, ce qui a été vérifié et corrigé**. Ce journal est ton dossier si la question se pose, et accessoirement ton meilleur outil de qualité éditoriale.
:::

:::prompt Journal de relecture éditoriale à remplir avant publication
Prépare la fiche de relecture de ce contenu, au format tableau, avec exactement ces lignes :

- Titre du contenu et URL prévue
- Sujet : relève-t-il de l'intérêt public (politique, santé publique, environnement, sécurité des consommateurs, débat public) ? Réponds par oui/non et justifie en une ligne.
- Part produite avec l'IA : intégrale, partielle, ou assistance de forme uniquement
- Relecteur (nom) et date de relecture
- Affirmations factuelles vérifiées : liste chaque chiffre, date, nom propre et citation, avec la source acceptée
- Corrections de fond apportées lors de la relecture
- Décision : mention « généré par IA » affichée, OU relecture éditoriale assumée
- Responsable éditorial de la publication (nom)

Laisse en [À COMPLÉTER] tout ce que tu ne peux pas remplir à ma place. Ne remplis jamais un nom ou une date toi-même.
:::

### Ce qui n'est pas concerné — et pourquoi il faut le dire

Le contresens le plus fréquent depuis le 2 août n'est pas de sous-appliquer, c'est de **sur-appliquer**. Ton post LinkedIn commercial, ta page produit, ton email client, ta newsletter promotionnelle, ta note interne, ton code : ils ne relèvent pas de l'obligation d'étiquetage « intérêt public ». Coller « généré par IA » partout ne te rend pas plus conforme — ça dilue le signal là où il compte et ça abîme la lecture.

:::piege « De toute façon, l'IA marque ses sorties, non ? »
Ne construis rien sur cette idée. Côté déployeur, la seule mention qui compte pour l'article 50 est **celle que tu écris toi-même**, lisible par un humain, au bon endroit. Un éventuel marquage technique invisible relève du fournisseur du système et ne te dispense de rien.
:::

### Le chatbot exposé à tes clients

Un système d'IA qui interagit directement avec des personnes doit les informer qu'elles parlent à une machine. Cette obligation pèse d'abord sur le fournisseur du système, mais dans les faits, c'est toi qui rédiges le message d'accueil de l'agent posé sur ton site : **dis-le explicitement dès le premier message**.

L'exception prévue — quand c'est évident — est étroite. Un agent de support qui imite la conversation humaine, tutoie, s'excuse et signe d'un prénom n'en bénéficie pas. « C'était évident » n'est pas une défense que tu as envie de plaider.

### Sanctions, et sens des proportions

:::chiffres
15 M€ | ou 3 % du CA mondial annuel, le plus élevé des deux : le plafond de sanction
PME | pour une PME ou une start-up, le plafond retombe au plus bas des deux montants
:::

Les 35 M€ et 7 % qu'on voit circuler concernent les **pratiques interdites** de l'article 5 (notation sociale, manipulation…), pas l'étiquetage des contenus. Le risque réel pour une petite structure n'est d'ailleurs pas l'amende maximale : c'est le signalement d'un concurrent ou d'un lecteur, et le temps passé à justifier a posteriori une pratique qu'on n'a pas documentée.

:::piege « Tout le marquage est reporté au 2 décembre 2026 » — c'est faux
Tu vas lire cette phrase partout, et elle est dangereuse. Le report du 2 décembre 2026 ne concerne **que** le marquage lisible par machine de l'article 50(2), une obligation technique qui pèse sur les fournisseurs, et **seulement** pour les systèmes mis sur le marché avant le 2 août 2026. **Aucune obligation de déployeur n'est reportée.** Ce que tu publies aujourd'hui relève du régime en vigueur.
:::

### Ce que tu n'as pas à faire

**Rien de rétroactif.** Les contenus publiés avant le 2 août 2026 n'ont pas à être étiquetés après coup. Tu ne repasses pas sur tes archives : tu appliques la règle à partir de maintenant.

**Rien à signer.** Le **code de bonnes pratiques sur la transparence** est **volontaire**. Il comptait environ 190 signataires au 31 juillet 2026, dont Anthropic côté fournisseurs. Le mentionner peut rassurer un client grand compte ; ne pas le signer n'est pas un manquement.

:::maj 2 août 2026
L'article 50 de l'AI Act s'applique et sa mise en œuvre est supervisée par les autorités nationales. À la même date, ces autorités supervisent aussi l'article 4 sur la littératie IA : un employeur ou un indépendant qui déploie de l'IA doit **prendre des mesures pour soutenir le développement** de la littératie IA des personnes qui l'utilisent pour son compte. Une formation suivie et tracée est la preuve la plus simple.
:::

Un dernier mot de méthode : ce qui précède décrit **ce que dit le règlement**, pas ta situation particulière. Pour un cas à enjeu — campagne à forte visibilité, secteur régulé, contenu politique, visuels avec des personnes identifiables — fais vérifier par un juriste. Les lignes directrices de la Commission sont publiques sur \`digital-strategy.ec.europa.eu\`, et elles se lisent.

## Faire tourner le calendrier sans machine allumée

:::maj 7 juillet 2026
**Claude Cowork** n'est plus une application de bureau : il arrive sur le web et sur mobile iOS/Android, en beta. Les sessions tournent **dans le cloud** — une tâche lancée depuis ton téléphone continue après la fermeture du laptop — avec du travail en arrière-plan, des **tâches planifiées** et des approbations depuis le mobile. Déploiement d'abord chez les abonnés Max, puis les autres plans.
:::

Pour un calendrier éditorial, ce détail d'architecture change la donne : les étapes lentes et répétitives peuvent tourner à heure fixe, sans toi. Trois planifications qui valent leur place :

- **Lundi matin** — à partir du brief et du backlog de sujets, produire 3 angles par sujet de la semaine, à trancher en dix minutes.
- **Mercredi** — passer les brouillons de la semaine à la grille anti-générique et rendre les cinq listes de diagnostic.
- **Vendredi** — rassembler tous les [À COMPLÉTER] restants des contenus en cours en une seule liste de recherche.

:::piege Une tâche planifiée ne remplace jamais la relecture
Au contraire, elle la rend plus critique. Si la chaîne produit toute seule, le point de contrôle humain devient le seul endroit où la voix et les faits sont vérifiés — et, pour un texte d'intérêt public, c'est cette relecture documentée qui te dispense d'étiqueter. Automatiser la production sans automatiser un rendez-vous de relecture, c'est déplacer le risque, pas le supprimer.
:::

## Où mettre l'humain

L'industrialisation ne supprime pas la relecture humaine : elle la **déplace vers les points de levier**. Tu n'as pas à relire chaque phrase, mais tu dois impérativement valider quatre choses : l'angle (étape 1), les faits chiffrés et les noms propres, tout ce qui engage juridiquement la marque (promesses, comparaisons, mentions légales), et la décision de publication de l'article 50 (mention ou relecture assumée). Le reste peut tourner plus vite.

Une bonne répartition : Claude produit et fait sa propre passe critique, un humain valide angle + faits + risques + mention. Le temps gagné n'est pas sur l'écriture brute, il est sur l'absence de réécriture après coup — et sur l'absence de rattrapage après publication.

## Le modèle factory ne dispense pas du goût

> Un workflow industrialisé multiplie ce que tu y mets. S'il encode du goût, des contraintes et des faits réels, il produit du bon contenu à l'échelle. S'il encode de la paresse, il produit de la dette à l'échelle.

Le bon réflexe : commence petit, fais tourner le workflow sur dix pièces, mesure ce qui dérape, durcis les garde-fous, puis seulement accélère. On industrialise une qualité maîtrisée, jamais un espoir.

:::defi 40 min — Ta chaîne de publication, conforme et documentée
Fais passer un contenu réel dans le workflow complet, jusqu'à la décision de publication.
- Tu as produit angle, plan, rédaction par blocs et passe anti-générique, dans cet ordre
- Tu as classé le contenu : intérêt public, commercial, ou interne
- Tu as tranché entre mention « généré par IA » visible et relecture éditoriale assumée
- Ta fiche de relecture est remplie : qui a relu, quand, quelles affirmations vérifiées
- Tu as listé les visuels du contenu et vérifié si l'un d'eux montre une personne réelle
- Tu as écrit, une bonne fois, la formule d'étiquetage que tu utiliseras — et tu l'as ajoutée à ton brief de voix
:::

:::memo
Q: Au sens de l'AI Act, qu'est-ce qu'un « déployeur » ?
R: Toute personne physique ou morale qui utilise un système d'IA sous sa propre autorité, hors usage strictement personnel. Un indépendant qui rédige avec Claude en est un.
===
Q: Quels contenus doivent porter une mention « généré par IA » ?
R: Les visuels, audios et vidéos où figure une personne réelle, et les textes d'intérêt public sans revue humaine. Le commercial et l'interne sont hors champ.
===
Q: Comment se dispense-t-on d'étiqueter un texte d'intérêt public ?
R: Par une relecture éditoriale de fond, documentée — qui a relu, quand, quoi — avec un responsable éditorial identifié.
===
Q: Le marquage des contenus IA est-il reporté au 2 décembre 2026 ?
R: Non. Ce report ne vise que le marquage machine-readable de l'article 50(2), côté fournisseurs, pour les systèmes antérieurs au 2 août 2026. Aucune obligation de déployeur n'est reportée.
===
Q: Faut-il étiqueter rétroactivement les contenus publiés avant le 2 août 2026 ?
R: Non. La règle s'applique aux publications à partir de cette date.
:::` + FOOTER,
    },
    {
      slug: "marketing-seo-geo-resumes-ia",
      title: "SEO/GEO à l'ère des résumés IA",
      description:
        "Optimiser pour les AI Overviews et les réponses génératives : angles, clusters thématiques, contenu citable et E-E-A-T.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Structurer une page pour être citée par un résumé IA, pas seulement classée
- Écrire un paragraphe-réponse autonome et des titres en questions
- Cartographier un cluster thématique avec Claude sans lui demander ce qu'il ne sait pas
- Reconnaître qu'un article d'intérêt public relève aussi du régime de transparence
:::

:::flash
Le GEO, c'est du bon SEO poussé un cran plus loin : les surfaces génératives s'appuient sur les mêmes systèmes de classement. Ce qui se fait citer, c'est une réponse directe en tête, des titres en questions, des faits sourcés et des signaux d'auteur. Claude est excellent sur la structure et les angles, nul sur les volumes de recherche — ne lui demande jamais un chiffre qu'il ne peut pas connaître.
:::

## Ce qui a changé, et ce qui n'a pas changé

Les moteurs affichent désormais des **résumés générés par IA** (les AI Overviews de Google, les réponses de Perplexity, de ChatGPT et autres). Conséquence : une part des requêtes trouve sa réponse sans clic. Le nouvel objectif n'est plus seulement de classer une page, c'est d'**être la source que l'IA cite** dans sa réponse. On parle de GEO (Generative Engine Optimization) ou AEO (Answer Engine Optimization).

Le point rassurant, répété par Google lui-même : ces surfaces génératives s'appuient sur les mêmes systèmes de classement et de qualité que la recherche classique. Le GEO est, pour l'essentiel, **du bon SEO poussé un cran plus loin** — pas une discipline parallèle qui invaliderait tout ce que tu sais.

:::cle Le nouvel unité de compte n'est plus la page, c'est le passage
Un résumé IA ne cite pas « ton article » : il prélève **un passage** et l'attribue. Écrire pour être cité, c'est écrire des blocs autonomes — un paragraphe qui garde son sens sorti de son contexte, avec sa donnée et sa source dedans.
:::

## Comment l'IA choisit ce qu'elle cite

Un résumé IA agrège typiquement plusieurs sources et place des citations près du passage qu'elles appuient. Pour être extrait proprement et cité avec confiance, un contenu présente quelques caractéristiques observées de façon récurrente.

| Caractéristique | Ce que ça donne concrètement |
| --- | --- |
| **Réponse directe en tête** | Les premières centaines de mots répondent franchement à la question principale, avant tout préambule |
| **Titres en questions** | « Qu'est-ce que le GEO ? » plutôt que « Aperçu du GEO » — l'ajustement au meilleur rapport effort/résultat |
| **Faits durs, sourcés** | Des données précises et attribuées, jamais un chiffre décoratif |
| **Prose nette** | Des assertions factuelles, sans verbiage conversationnel ni transitions vides |
| **Signaux E-E-A-T** | Auteur nommé, expérience de première main, date de mise à jour visible |

Sur les requêtes sensibles au temps, le contenu récent et daté l'emporte : une page sans date de mise à jour part avec un handicap.

:::avant-apres Introduction qui tourne autour | Paragraphe-réponse citable
Le monde du marketing digital évolue à une vitesse fulgurante. Entre l'essor de l'intelligence artificielle et les nouvelles attentes des consommateurs, les entreprises doivent plus que jamais repenser leur stratégie de contenu. Dans cet article, nous allons explorer ensemble ce qu'est le GEO et pourquoi il est devenu incontournable.
===
Le GEO (Generative Engine Optimization) consiste à structurer un contenu pour qu'il soit cité comme source par les réponses générées par IA — AI Overviews de Google, Perplexity, ChatGPT — et non seulement classé dans les liens bleus. Trois leviers font l'essentiel du travail : une réponse directe placée en tête de page, des titres formulés en questions, et des affirmations factuelles attribuées à une source vérifiable.
:::

## La stratégie de clusters thématiques

Une page isolée ne suffit plus. La structure qui performe est le **cluster** : une page pilier qui traite un sujet large, entourée de pages satellites qui creusent chaque sous-question, toutes reliées entre elles. Cela démontre une profondeur de sujet que les moteurs, classiques comme génératifs, interprètent comme de l'autorité.

Claude est excellent pour cartographier un cluster : donne-lui ton sujet pilier et ton audience, demande la liste des sous-questions réelles que se pose ton lecteur, regroupées par intention. Tu obtiens l'arborescence en quelques minutes.

:::prompt Cartographier un cluster thématique
Sujet pilier : [ton sujet]. Lecteur : [métier, niveau de connaissance, ce qu'il cherche à décider].

Cartographie le cluster de contenu.

1. Liste 20 à 30 sous-questions que ce lecteur se pose RÉELLEMENT, formulées comme il les taperait ou les dirait, pas comme un rédacteur SEO les écrirait.
2. Regroupe-les par intention : comprendre, comparer, décider, mettre en œuvre, réparer.
3. Propose l'arborescence : 1 page pilier, puis les pages satellites, avec pour chacune le titre en question et la promesse en une ligne.
4. Indique les liens internes : depuis quelle page vers quelle page, et avec quelle ancre.
5. Signale les sous-questions auxquelles je ne pourrai répondre de façon crédible que si je fournis une donnée ou une expérience de terrain, et dis laquelle.

Ne donne aucun volume de recherche, aucune estimation de trafic, aucune difficulté de mot-clé : tu ne les connais pas.
:::

:::piege Ne demande jamais de volumes de recherche à Claude
Il en produira, ils seront plausibles, et ils seront faux. Claude n'a pas de données de volume fiables et à jour, ni de classement en temps réel, ni de vue sur ce que tes concurrents publient aujourd'hui. La dernière ligne du prompt ci-dessus n'est pas un détail de style : elle empêche l'invention là où elle est la plus tentante. Les volumes se valident dans un vrai outil de mots-clés.
:::

## Le rôle de Claude dans ce workflow

Claude excelle sur les tâches à forte composante langagière du SEO/GEO :

- Générer des angles non génériques et des questions réelles d'audience.
- Restructurer un contenu existant en réponse-en-tête et titres-questions.
- Rédiger une FAQ qui couvre les formulations exactes des requêtes.
- Produire un balisage de données structurées (schema) pour clarifier le contenu aux moteurs.

Il est faible — et il faut le savoir — sur tout ce qui exige des données fraîches et mesurées. Sur ces points, l'outil de référence prime, et Claude ne sert qu'à interpréter les données que TU lui fournis.

:::prompt Rendre une page existante citable
Voici une page existante. Ne change ni les faits, ni les chiffres, ni les liens.

[COLLE LA PAGE]

Restructure-la pour qu'un moteur génératif puisse en prélever un passage et le citer :

1. Écris un paragraphe-réponse de 60 à 90 mots à placer tout en haut, qui répond à la question principale de façon autonome — compréhensible sorti de son contexte.
2. Réécris chaque titre de section sous forme de question telle qu'un lecteur la poserait.
3. Sous chaque titre, place en première phrase la réponse directe, puis le développement.
4. Ajoute une FAQ de 5 questions reprenant les formulations proches non traitées dans le corps.
5. Liste les endroits où une donnée sourcée renforcerait la citabilité, et écris [À COMPLÉTER] à chacun.

Interdiction absolue d'ajouter un chiffre, une étude, une date ou une citation qui ne figure pas déjà dans la page.
:::

:::maj 24 juillet 2026
Avec le contexte de **1 million de tokens** d'Opus 5, tu peux donner en une seule conversation ton brief de voix, ta page pilier et les dix pages satellites déjà publiées, puis demander l'audit du maillage interne et les redondances. C'était impraticable il y a un an. Sur les plans payants, la fonction **Research** aide à rassembler les sources publiques — à toi de vérifier ce qu'elle rapporte avant de le citer.
:::

## Un article de fond peut relever de la transparence

Point de jonction avec la leçon 3, souvent manqué : un article de blog qui **informe le public sur un sujet d'intérêt public** — santé publique, environnement, sécurité des consommateurs, débat public — entre dans le champ de l'article 50, même s'il vit sur ton site commercial. Une page produit, non. Un dossier « ce que la nouvelle réglementation change pour votre chauffage », oui.

La bonne nouvelle est que le remède est déjà dans tes bonnes pratiques GEO : **auteur nommé, date de mise à jour, relecture de fond documentée**. Les signaux E-E-A-T que les moteurs récompensent sont exactement la trace éditoriale qui te dispense d'étiqueter.

## La discipline qui protège la marque

> En GEO, la tentation d'empiler des chiffres pour paraître « citable » est forte. Mais une donnée inventée détectée détruit l'autorité que tout le SEO cherche à bâtir. Notre règle est un avantage concurrentiel : seulement des faits vrais et sourcés, [À COMPLÉTER] partout ailleurs.

Optimiser pour l'IA et garder l'honnêteté ne s'opposent pas : la fiabilité est précisément ce que les moteurs génératifs récompensent.

:::defi 35 min — Rendre une page citable
Prends une page qui reçoit des impressions mais peu de clics, et rends-la prélevable.
- Tu as ajouté en tête un paragraphe-réponse de 60 à 90 mots qui tient sorti de son contexte
- Tous les titres de sections sont formulés en questions réelles de lecteur
- Chaque section commence par la réponse, pas par le contexte
- Une FAQ de 5 questions couvre les formulations voisines
- L'auteur est nommé et la date de mise à jour est visible sur la page
- Chaque chiffre est sourcé, ou remplacé par [À COMPLÉTER] — aucun chiffre ajouté par le modèle
- Tu as classé la page : intérêt public ou non, et tranché la question de la mention
:::

:::memo
Q: Le GEO est-il une discipline distincte du SEO ?
R: Non. Les surfaces génératives s'appuient sur les mêmes systèmes de classement : c'est du bon SEO poussé un cran plus loin.
===
Q: Quel ajustement de structure a le meilleur rapport effort/résultat ?
R: Formuler les titres en questions réelles de lecteur, et placer la réponse en première phrase de chaque section.
===
Q: Que ne faut-il jamais demander à Claude en SEO ?
R: Des volumes de recherche, des classements actuels ou ce que publient les concurrents : il ne les connaît pas et les inventera de façon plausible.
===
Q: Pourquoi un paragraphe-réponse doit-il être autonome ?
R: Parce qu'un moteur génératif prélève un passage, pas une page : il doit garder son sens hors contexte.
===
Q: Un article de blog peut-il relever de l'article 50 ?
R: Oui, s'il informe le public sur un sujet d'intérêt public. Auteur nommé, date et relecture documentée règlent la question.
:::` + FOOTER,
    },
    {
      slug: "marketing-email-copywriting-convertit",
      title: "Séquences email et copywriting qui convertit",
      description:
        "Frameworks de copy éprouvés, séquences email structurées, et une persuasion honnête qui convainc sans hype ni fausses urgences.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Choisir un framework de copy et le remplir de faits, pas de hype
- Écrire une séquence email à un objectif et un appel à l'action par message
- Faire produire dix objets d'email, puis trancher sur des critères explicites
- Faire jouer à Claude le lecteur sceptique avant d'envoyer
- Savoir ce qui, dans une séquence commerciale, relève ou non de la transparence IA
:::

:::flash
On convertit par la clarté et la preuve, pas par la pression. Les frameworks (PAS, AIDA, Avant/Après/Pont) ne sont que des charpentes : la valeur vient des faits réels que tu y mets. Un bénéfice se démontre par un fait vérifiable, jamais par un adjectif. Et l'email commercial n'a rien à étiqueter au titre de l'article 50 — le chatbot posé sur ta page de vente, si.
:::

## Convertir sans mentir

Le copywriting a mauvaise réputation parce qu'on le confond avec la manipulation : fausses urgences, faux compteurs, promesses gonflées. Ça fonctionne une fois, puis ça brûle la confiance — et la confiance est le seul actif qui compose dans le temps. La position de ce parcours : **on convertit par la clarté et la preuve, pas par la pression**. C'est aussi, accessoirement, ce qui tient sur la durée et ce que la loi tolère.

Claude est un bon assistant copywriting à une condition : il connaît les frameworks, mais il les remplit de générique si tu ne lui donnes pas de matière réelle. Tu apportes les faits, la vraie contrariété du client, les vrais bénéfices ; il structure.

:::cle La preuve est le seul carburant de la copy
Retire d'une page de vente tout ce qui n'est ni un fait vérifiable, ni une démonstration, ni un témoignage réel. Ce qui reste, c'est ta vraie copy. Si la page s'effondre, ce n'est pas un problème d'écriture : c'est un problème d'offre ou de preuve.
:::

## Trois frameworks qui tiennent

| Framework | Déroulé | Quand l'utiliser |
| --- | --- | --- |
| **PAS** | Problème → Agitation (les conséquences réelles, pas le drame inventé) → Solution | Quand le lecteur souffre d'un problème qu'il sait nommer |
| **AIDA** | Attention → Intérêt → Désir → Action unique | Page de vente, annonce, format long |
| **Avant / Après / Pont** | Situation actuelle → situation souhaitée → l'offre comme pont | Email : très visuel, très court à écrire |

Le framework n'est qu'une charpente. La qualité vient de ce qu'on y met : un bénéfice se démontre par un fait (« exporte tes devis en un clic »), jamais par un adjectif (« ultra-simple »).

:::prompt Écrire un email en PAS, sans inventer
Écris un email en structure PAS (Problème, Agitation, Solution). 180 mots maximum.

LECTEUR : [métier, taille de structure, la contrariété exacte qu'il vit, en une phrase]
PROBLÈME : [le problème, tel qu'il le décrirait lui-même]
CONSÉQUENCES RÉELLES : [ce que ça lui coûte concrètement — temps, argent, erreurs — uniquement ce que je te donne]
SOLUTION : [ce que fait le produit, factuellement]
PREUVE AUTORISÉE : [un cas réel ou un chiffre réel, rien d'autre]
ACTION : [une seule, formulée à l'infinitif]

RÈGLES :
- Une seule action demandée, une seule fois.
- Aucune statistique, aucun témoignage, aucun nom de client hors de la preuve autorisée.
- L'agitation décrit des conséquences que je t'ai données. N'en imagine aucune.
- Interdits : révolutionner, incontournable, ne ratez pas, dernière chance, places limitées.
- Si un élément te manque pour tenir la structure, écris [À COMPLÉTER] et continue.
:::

:::avant-apres Email de hype | Email de preuve
Objet : 🚀 Ne ratez pas CETTE opportunité !

Bonjour, j'espère que vous allez bien. Nous sommes ravis de vous présenter notre solution révolutionnaire qui va transformer votre quotidien. Nos clients constatent en moyenne 3x plus de productivité ! Places limitées, ne tardez plus !
===
Objet : Trois heures de saisie par mois, ou vingt minutes

Fin de mois, votre comptable vous réclame les devis. Vous les recopiez à la main, ligne par ligne. Le cabinet Duval faisait pareil : trois heures chaque mois, deux erreurs de report par trimestre. Depuis mars, il exporte un fichier prêt à importer et compte vingt minutes.

Si votre fin de mois ressemble à ça, la démo dure sept minutes : [lien]
:::

## Une séquence email qui respecte le lecteur

Une séquence de bienvenue ou de lancement honnête suit une logique de valeur croissante, pas de harcèlement.

:::etapes
1. **Accueil.** Tenir la promesse d'inscription immédiatement : livrer la valeur attendue, sans détour ni vente.
2. **Le problème.** Le raconter du point de vue du lecteur, avec ses mots à lui — pas la description que ton équipe produit en interne.
3. **La preuve.** Un cas réel, une démonstration, un résultat vérifiable. C'est l'email qui décide de tout le reste.
4. **L'offre.** Claire, avec ses limites honnêtes : ce que le produit ne fait pas, pour qui il ne convient pas.
5. **Les objections.** Répondre aux objections réelles que tu entends en vente, puis un dernier rappel sans fausse urgence.
:::

Chaque email a **un seul objectif** et **un seul appel à l'action**. Un email qui demande trois choses n'en obtient aucune.

## L'objet et la première ligne

L'objet décide de l'ouverture ; la première ligne décide de la lecture. Demande à Claude une dizaine d'objets dans des registres différents, puis tranche à la main. Bannis les majuscules criardes, les emojis en rafale et les fausses promesses : les filtres anti-spam comme les lecteurs les sanctionnent. La première ligne ne doit jamais gaspiller l'espace (« J'espère que vous allez bien ») : elle entre dans le vif.

:::prompt Dix objets d'email, quatre registres
Voici le corps de mon email :

[COLLE L'EMAIL]

Propose 10 objets, répartis ainsi : 3 en bénéfice direct, 3 en question, 2 en curiosité concrète (jamais de curiosité creuse ou de teasing), 2 reprenant une phrase exacte du corps du texte.

Contraintes : 50 caractères maximum, aucune majuscule d'insistance, aucun emoji, aucun mot de fausse urgence, aucune promesse absente du corps de l'email.

Pour chacun, ajoute en une ligne : ce qu'il promet, et ce que le lecteur trouvera qui le tient. Termine par les 2 objets que tu déconseilles et pourquoi.
:::

## Le garde-fou anti-hype, appliqué à la vente

C'est en copy que la tentation d'inventer est la plus forte. La règle, durcie pour ce contexte :

- **Aucune statistique de résultat sans source.** « 3x plus de conversions » est interdit tant que tu ne possèdes pas la mesure. À défaut : [À COMPLÉTER].
- **Aucun témoignage inventé.** Jamais. Un faux avis est un mensonge, et dans beaucoup de pays une infraction. Sans témoignage, tu écris la séquence sans, et tu marques [À COMPLÉTER — témoignage client réel].
- **Pas de fausse rareté.** Un compteur « plus que 2 places » qui ne correspond à rien se voit et se retourne. La rareté n'est légitime que si elle est réelle.
- **La promesse = ce que le produit fait, vérifiable.** Pas ce qu'on aimerait qu'il fasse.

:::piege Le témoignage « inspiré de cas réels »
La formulation qui rassure et qui ne protège de rien : composer un avis à partir de plusieurs clients, lui inventer un prénom, l'illustrer d'un portrait généré. Trois problèmes d'un coup — un avis qui n'a pas été donné, une personne qui n'existe pas, et un visuel de personne d'apparence réelle produit par IA, qui relève lui du régime de transparence vu en leçon 3. Un vrai verbatim, même court et imparfait, vaut infiniment mieux.
:::

## Ce que la transparence IA change (et ne change pas) en copy

Bonne nouvelle pour les rédacteurs commerciaux : ta séquence email, ta page de vente et tes posts promotionnels **ne relèvent pas** de l'obligation d'étiquetage « intérêt public » de l'article 50. Tu n'as pas à écrire « email généré par IA » en pied de message.

Trois réserves, quand même, et elles sont sérieuses :

- **Le chatbot de ta page de vente.** S'il parle à tes prospects, il doit dire dès le premier message qu'il est une IA. C'est une ligne à écrire dans sa configuration, pas un chantier.
- **Les visuels avec des personnes.** Portrait de témoignage, photo d'équipe, avatar client : dès qu'une personne d'apparence réelle est générée ou retouchée par IA, la mention visible s'impose.
- **Les sujets d'intérêt public.** Une séquence qui argumente sur la santé, l'environnement ou la sécurité des consommateurs bascule dans l'autre régime : mention, ou relecture éditoriale documentée.

## Faire critiquer la copy par Claude

Au-delà de la rédaction, Claude est utile en **avocat du diable**. C'est souvent son meilleur usage sur une séquence : il ne trouvera pas le bon argument à ta place, mais il trouvera ceux qui manquent.

:::prompt L'avocat du diable avant l'envoi
Voici ma séquence email. Ne la réécris pas.

[COLLE LA SÉQUENCE]

Joue trois lecteurs différents, dans cet ordre :

1. LE SCEPTIQUE : quelles promesses sonnent creuses ou non prouvées ? Cite-les et dis ce qu'il faudrait fournir pour les tenir.
2. LE PRESSÉ : que comprend-il s'il ne lit que l'objet et la première ligne de chaque email ? Écris ce qu'il en retient, mot pour mot.
3. L'ACHETEUR AVERTI : quelles objections réelles la séquence ne lève-t-elle jamais ? Classe-les par ordre de gravité.

Termine par : les 3 phrases que tu supprimerais sans rien perdre, et le seul endroit où une preuve manquante ferait le plus de différence.
:::

:::astuce Une passe de style, sur les pièces qui le méritent
Depuis le 20 juillet 2026, Fable 5 — le modèle le plus fort d'Anthropic pour l'écriture — n'est plus inclus dans les plans : sur Pro il consomme des usage credits, sur Max il puise jusqu'à 50 % des limites hebdomadaires. Structure, angles, objets et brouillons se font très bien sur Opus 5 ou Sonnet 5. Garde la passe de style finale pour la page de vente et l'email de lancement, là où la voix se joue.
:::

> Une copy honnête n'est pas une copy fade. La clarté est persuasive ; la preuve est persuasive ; un bénéfice concret est persuasif. La hype, elle, ne persuade plus personne — elle signale juste que tu n'as rien de vrai à dire.

:::defi 40 min — Une séquence de 5 emails qui tient debout
Écris ou réécris une séquence complète, avec la discipline du parcours.
- Chaque email a un seul objectif et un seul appel à l'action
- L'email de preuve s'appuie sur un cas réel, chiffré, que tu possèdes
- Aucune statistique, aucun témoignage, aucune rareté qui ne soit vérifiable
- Chaque trou est marqué [À COMPLÉTER], et tu as listé ce qu'il faut aller chercher
- Tu as fait tourner l'avocat du diable et corrigé au moins deux angles morts
- Tu as vérifié tes visuels : aucune personne d'apparence réelle générée par IA sans mention
:::

:::memo
Q: Sur quoi repose la conversion défendue par ce parcours ?
R: Sur la clarté et la preuve, pas sur la pression : les fausses urgences brûlent la confiance, seul actif qui compose.
===
Q: Comment démontre-t-on un bénéfice ?
R: Par un fait vérifiable (« exporte tes devis en un clic »), jamais par un adjectif (« ultra-simple »).
===
Q: Combien d'appels à l'action par email ?
R: Un seul. Un email qui demande trois choses n'en obtient aucune.
===
Q: Que faire sans témoignage client réel ?
R: Écrire la séquence sans, et marquer [À COMPLÉTER — témoignage client réel]. Jamais de témoignage composé ou inventé.
===
Q: Un email commercial doit-il porter une mention « généré par IA » ?
R: Non, il est hors du champ de l'étiquetage « intérêt public ». En revanche un chatbot doit s'annoncer, et un visuel de personne réelle générée par IA doit être divulgué.
:::` + FOOTER,
    },
    {
      slug: "marketing-mesurer-iterer-ne-pas-halluciner",
      title: "Mesurer, itérer, ne pas halluciner",
      description:
        "Boucler la production sur des preuves réelles : A/B testing, lecture honnête des chiffres, et marquage systématique de [À COMPLÉTER].",
      duration_min: 26,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Choisir tes indicateurs avant de publier, pas après avoir vu les résultats
- Concevoir un A/B test dont la conclusion signifie quelque chose
- Faire analyser tes données par Claude en exigeant les explications alternatives
- Distinguer ce que tu possèdes vraiment sur un texte généré, en droit
- Faire passer chaque contenu par une check-list de publication en cinq points
:::

:::flash
Claude n'a aucun accès à tes données de performance : tout chiffre qu'il avance spontanément est une hallucination. Son rôle est d'interpréter ce que tu lui donnes. Fixe la métrique avant de publier, ne teste qu'une variable à la fois, et termine par une check-list : zéro [À COMPLÉTER] restant, faits sourcés, relecture documentée, mention IA tranchée.
:::

## Pourquoi cette leçon est la plus importante

On peut produire un contenu impeccable et piloter complètement à l'aveugle. Sans mesure honnête, on optimise des impressions, on répète ce qui ne marche pas, et — pire — on se met à raconter des résultats qu'on n'a pas. Cette leçon ferme la boucle : produire, mesurer pour de vrai, itérer, sans jamais laisser Claude (ni toi) inventer un chiffre.

Rappel central, valable pour tout ce parcours : **Claude n'a pas accès à tes données de performance.** Il ne connaît ni ton taux d'ouverture, ni ton trafic, ni ta conversion. Tout chiffre qu'il avancerait spontanément est une hallucination. Son rôle ici est d'**interpréter les données que tu lui fournis**, pas de les produire.

:::piege Le chiffre plausible est plus dangereux que le chiffre absurde
Si un modèle annonce « votre taux d'ouverture est de 68 % », personne ne le croit. S'il annonce « un taux d'ouverture de 24 %, dans la moyenne de votre secteur », tout le monde le recopie — et six mois plus tard il est dans une page de vente. La parade est la même qu'ailleurs : la donnée entre par toi, ou elle n'entre pas.
:::

## Mesurer ce qui compte, pas ce qui flatte

Choisis des métriques liées à l'objectif réel, pas aux vanités.

| Objectif | Ce qu'on regarde | Ce qui trompe |
| --- | --- | --- |
| **Notoriété / SEO** | Impressions, position moyenne, part de citations dans les réponses IA | Le trafic seul, à l'ère du zéro-clic |
| **Email** | Taux de clic, et surtout la conversion en aval | Le taux d'ouverture, faussé par les protections de confidentialité qui pré-chargent les images |
| **Conversion** | Le seul chiffre qui paie | Le temps passé sur la page, les partages, les « likes » |

Définis l'indicateur AVANT de publier. Choisir la métrique après coup, c'est se raconter une histoire.

:::cle L'indicateur choisi après coup ne mesure rien
Une fois les résultats sous les yeux, il existe toujours une métrique où le contenu a « bien marché ». Écrire l'indicateur et le seuil avant publication, dans le même document que le brief, coûte trente secondes et supprime la totalité de ce biais.
:::

## L'A/B test, fait correctement

Claude génère facilement des variantes — objets d'email, titres, accroches, boutons. C'est l'un de ses meilleurs usages marketing. Mais une variante ne vaut rien sans test propre.

:::etapes
1. **Une seule variable à la fois.** Si tu changes l'objet ET l'image, tu ne sauras pas ce qui a joué.
2. **Un échantillon suffisant.** Sur de petits volumes, l'écart observé est du bruit. Déclarer un gagnant sur 40 envois n'a aucun sens statistique.
3. **Un critère de décision fixé d'avance** — quelle métrique, quel seuil, sur quelle durée. Sinon on voit ce qu'on veut voir.
4. **Une trace écrite.** Note l'hypothèse, le résultat, la conclusion. Ce journal, accumulé, devient ta vraie connaissance marketing — celle qu'aucun modèle ne peut te donner.
:::

Claude aide à concevoir le test et à interpréter le résultat une fois mesuré. Il ne le mesure pas.

:::prompt Concevoir un test dont la conclusion voudra dire quelque chose
Je veux tester : [ce que tu veux tester, en une phrase].
Volume disponible : [nombre de destinataires ou de visiteurs par semaine].
Taux actuel observé : [le chiffre réel, si tu l'as ; sinon écris « inconnu »].

Aide-moi à concevoir le test :
1. Reformule l'hypothèse sous la forme « si [changement], alors [métrique] devrait [sens de variation], parce que [raison] ».
2. Identifie LA variable unique à faire varier, et liste tout ce qui doit rester strictement identique.
3. Dis quelle métrique tranche, et à partir de quel écart je peux raisonnablement conclure quelque chose avec mon volume. Si mon volume est trop faible pour conclure, dis-le franchement et propose une alternative (test qualitatif, mesure sur plusieurs cycles).
4. Fixe la durée et le critère d'arrêt AVANT le lancement.
5. Écris les deux variantes.
6. Prépare le tableau du journal de test : hypothèse, dates, volumes, résultat, décision.

Ne produis aucun chiffre de référence sectoriel : je ne veux que ce que je t'ai donné.
:::

## Lire les chiffres sans se mentir

Trois pièges classiques, à garder en tête quand tu donnes tes données à Claude pour analyse.

- **Corrélation n'est pas causalité.** Le trafic monte le mois où tu as publié ? Peut-être la saison, une mention externe, un changement d'algorithme.
- **Le bruit des petits nombres.** Deux conversions de plus sur dix, ce n'est pas « +20 % de performance », c'est du hasard.
- **Le biais du survivant.** Analyser seulement les contenus qui ont marché masque pourquoi les autres ont échoué.

:::prompt Analyse honnête de tes propres données
Voici mes données brutes. Elles sont la seule source de vérité de cette conversation.

[COLLE TES CHIFFRES : période, volumes, valeurs]

Analyse-les en respectant ces règles :
- N'ajoute aucune donnée externe, aucune moyenne sectorielle, aucun benchmark. Tu ne les connais pas.
- Commence par dire ce que ces données NE permettent PAS de conclure.
- Pour chaque variation que tu relèves, propose au moins deux explications alternatives à celle qui m'arrange.
- Signale explicitement les effectifs trop faibles pour distinguer un effet du hasard.
- Termine par les 3 mesures que je devrais mettre en place pour trancher, et la seule décision que je peux raisonnablement prendre dès aujourd'hui.
:::

## Ce que tu possèdes vraiment sur un texte généré

Question qui revient dès qu'un contenu marche : « ce texte est-il à moi ? » Trois choses différentes sont systématiquement confondues, et les distinguer évite autant l'excès de confiance que la panique.

| Affirmation | Statut au 6 août 2026 |
| --- | --- |
| « Anthropic me cède ses droits éventuels sur les sorties » | **Vrai** — c'est une cession **contractuelle**, prévue par les conditions commerciales |
| « Donc mon texte est protégé par le droit d'auteur » | **Faux**, sauf apport créatif humain caractérisé. La protection suppose une originalité qui porte l'empreinte de la personnalité d'un auteur humain |
| « Je ne risque rien en droit d'auteur » | **Question ouverte** — la Cour de justice de l'UE l'examine (affaire C-250/25) ; les conclusions de l'avocat général sont attendues le **3 septembre 2026** |

Deux précisions utiles. La cession d'Anthropic te protège **dans ta relation avec Anthropic** ; elle ne crée pas un droit opposable à un tiers qui reprendrait ton texte si celui-ci n'est pas original. Et **il n'existe aucune loi française sur l'IA et le droit d'auteur** : les textes cités de-ci de-là comme « la loi de 2024 » n'ont jamais été adoptés.

:::cle L'apport humain n'est pas qu'une question juridique
Ce qui rend un texte défendable est exactement ce qui le rend bon : un angle que toi seul pouvais choisir, des faits que toi seul possèdes, une expérience de terrain, une structure travaillée. Le contenu sorti d'un prompt en trois mots n'est ni protégeable ni intéressant — c'est la même faiblesse vue de deux côtés.
:::

## Le marquage [À COMPLÉTER] comme méthode

C'est le fil rouge du parcours, et il culmine ici. Tout au long de la production, chaque fois qu'un chiffre, un témoignage ou une preuve manque, on écrit **[À COMPLÉTER]** au lieu d'inventer. À l'étape de mesure, ce marquage devient une **liste de tâches** : ce sont précisément les trous à combler avec des données réelles avant publication.

    Avant publication, recherche « [À COMPLÉTER] » dans le document.
    Zéro occurrence restante = chaque affirmation est étayée par un fait vrai.
    Une occurrence = soit tu trouves la vraie donnée, soit tu reformules sans elle.

C'est mécanique, vérifiable, et ça rend l'honnêteté impossible à oublier.

## La check-list de publication, en cinq points

Depuis le 2 août 2026, la vérification d'avant-publication a un point de plus. Cinq questions, deux minutes, à chaque pièce.

:::etapes
1. **Zéro [À COMPLÉTER]** restant dans le document.
2. **Chaque chiffre, date, nom propre et citation** est rattaché à une source que tu possèdes.
3. **L'indicateur de succès et son seuil** sont écrits avant la mise en ligne.
4. **Visuels** : aucune personne d'apparence réelle générée ou retouchée par IA sans mention claire, visible dès la première exposition.
5. **Nature du contenu** : s'il informe le public sur un sujet d'intérêt public, soit il porte la mention, soit la fiche de relecture est remplie et le responsable éditorial identifié.
:::

:::astuce Fais de la check-list une tâche planifiée
Avec les tâches planifiées de Cowork, un rendez-vous hebdomadaire peut rassembler tout seul les [À COMPLÉTER] restants sur les contenus en cours et te rendre une liste unique de choses à aller chercher. Le contrôle reste humain ; c'est la collecte qui n'a plus à l'être.
:::

## La boucle complète

> Cadrer (leçon 1) → voix réutilisable (2) → produire à l'échelle, et publier dans les règles (3) → optimiser pour l'IA (4) → convertir honnêtement (5) → mesurer et itérer (6). À chaque tour, tes exemples s'enrichissent, ton brief se durcit, tes garde-fous gagnent en précision.

Le marketing avec Claude, bien fait, n'est pas une machine à produire du texte : c'est un système qui apprend ta marque, refuse le générique, et ne s'appuie que sur ce qui est vrai. C'est cette discipline — pas le volume — qui finit par convertir.

:::defi 30 min — Fermer la boucle sur un contenu réel
Prends le contenu produit au fil des leçons précédentes et amène-le jusqu'à la publication.
- Tu as écrit l'indicateur de succès et son seuil AVANT de publier
- Tu as conçu un test à une seule variable, avec un critère d'arrêt fixé d'avance
- Tu as fait analyser tes chiffres réels en exigeant deux explications alternatives par variation
- La recherche de « [À COMPLÉTER] » dans le document ne retourne plus rien
- Les cinq points de la check-list de publication sont cochés, mention IA comprise
- Tu as ouvert un journal de tests : hypothèse, résultat, décision, une ligne par test
:::

:::memo
Q: Quel est le rôle de Claude vis-à-vis de tes données de performance ?
R: Interpréter celles que tu lui fournis. Il n'y a aucun accès : tout chiffre spontané est une hallucination.
===
Q: Quand fixe-t-on l'indicateur de succès ?
R: Avant de publier. Choisi après coup, il trouvera toujours une métrique où le contenu a « bien marché ».
===
Q: Deux conditions d'un A/B test dont la conclusion vaut quelque chose ?
R: Une seule variable modifiée, et un critère de décision (métrique, seuil, durée) fixé d'avance. Plus un volume suffisant.
===
Q: Ton texte généré par Claude est-il protégé par le droit d'auteur ?
R: Pas automatiquement. Anthropic te cède contractuellement ses droits, mais la protection suppose un apport créatif humain caractérisé.
===
Q: Que vérifie la check-list de publication, au-delà des faits ?
R: Les visuels de personnes réelles générés par IA, et la nature du contenu : intérêt public, donc mention ou relecture documentée.
:::` + FOOTER,
    },
  ],
};
