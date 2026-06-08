// =========================================
// Parcours « Contenu et marketing avec Claude »
// Contenu original au standard du Parcours. Sujet : produire du contenu et du
// marketing avec Claude sans tomber dans le générique, en gardant une voix de
// marque, et sans jamais inventer chiffres/témoignages.
// Bonnes pratiques marketing/SEO/GEO vérifiées à la rédaction (juin 2026).
// =========================================

const FOOTER = `

---

**Sources & méthode** · Bonnes pratiques marketing/SEO établies, vérifiées à la rédaction. Contenu original pour ClaudeAI Academy.`;

export const contenuEtMarketing = {
  slug: "contenu-et-marketing",
  title: "Contenu et marketing avec Claude",
  description:
    "Produire du contenu et du marketing avec Claude sans sombrer dans le générique : voix de marque réutilisable, industrialisation maîtrisée, SEO/GEO à l'ère des résumés IA, et mesure honnête.",
  tier_required: "mastery",
  display_order: 4,
  estimated_duration_min: 130,
  lessons: [
    {
      slug: "marketing-pourquoi-claude-est-mediocre",
      title: "Pourquoi Claude est souvent médiocre en marketing",
      description:
        "Générique, lisse, hype creuse : d'où vient le problème, et le cadrage en quelques leviers qui transforme la sortie.",
      duration_min: 14,
      is_free_preview: true,
      content_md:
        `## Le problème n'est pas le modèle, c'est la demande

Vous demandez à Claude « écris un post LinkedIn sur notre nouvelle fonctionnalité » et vous récupérez un texte propre, grammaticalement parfait, et parfaitement oubliable. Des verbes mous (*révolutionner*, *transformer*), des promesses non tenues (*boostez votre productivité*), des transitions vides (*dans le monde d'aujourd'hui*). Ce n'est pas un défaut du modèle : c'est la réponse statistiquement la plus sûre à une demande sous-spécifiée.

Un grand modèle de langage produit, par défaut, **le centre de gravité de tout ce qu'il a lu**. Sur du marketing, ce centre de gravité est saturé de contenu médiocre : pages de vente clonées, posts d'agence, communiqués creux. Sans contrainte forte, Claude régresse vers cette moyenne. Le générique n'est pas une erreur, c'est l'absence d'instruction.

## Les quatre symptômes à reconnaître

- **Le lisse.** Aucune aspérité, aucune opinion. Le texte pourrait décrire n'importe quel produit du secteur. Test : si vous remplacez votre nom par celui d'un concurrent et que rien ne cloche, c'est mort.
- **La hype.** *Game-changer*, *incontournable*, *boostez*. Des adjectifs qui affirment la valeur au lieu de la démontrer. Le lecteur a appris à les ignorer.
- **L'abstraction.** *Nous aidons les entreprises à optimiser leurs process.* Zéro image mentale. Aucun exemple, aucun chiffre, aucun verbe d'action concret.
- **L'invention.** Le plus dangereux : Claude comble les trous. Il inventera un pourcentage, un témoignage client, une étude. Plausible, faux, et juridiquement risqué.

## Le cadrage qui corrige

Quatre leviers, du plus rentable au plus fin.

**1. Donner de la matière, pas un sujet.** « Écris sur X » échoue. À la place, fournissez les faits bruts : ce que fait réellement le produit, pour qui, le problème précis qu'il résout, une anecdote vraie, un chiffre que vous possédez. Claude n'invente bien que ce qu'on ne lui donne pas. Nourrissez-le et il s'arrête d'inventer.

**2. Interdire explicitement le générique.** Ajoutez une liste noire dans le prompt :

    Interdits : « révolutionner », « game-changer », « dans le monde d'aujourd'hui »,
    « boostez », toute statistique non fournie par moi, tout témoignage inventé.
    Si une donnée te manque, écris [À COMPLÉTER] au lieu de l'inventer.

Cette dernière ligne est la plus importante du parcours. Elle transforme l'hallucination en TODO visible.

**3. Imposer le concret.** Exigez au moins un exemple précis, un verbe d'action par phrase clé, et le bannissement des adjectifs auto-évaluatifs au profit de faits. *Rapide* ne vaut rien ; *répond en moins d'une seconde* se vérifie.

**4. Définir un destinataire réel.** Pas « les PME » mais « un directeur d'agence de 8 personnes qui perd deux heures par jour à faire des devis à la main ». La spécificité du lecteur force la spécificité du texte.

## Le réflexe du premier jet jetable

Le meilleur usage de Claude en marketing n'est presque jamais d'accepter la première sortie. Considérez-la comme un **brouillon de négociation** : il vous donne une base, vous critiquez, vous renvoyez les contraintes manquantes. Une bonne pratique : demandez à Claude de produire trois angles radicalement différents avant d'écrire quoi que ce soit. Vous choisissez l'angle, puis vous faites rédiger. Vous évitez ainsi le premier réflexe statistique, qui est toujours le plus banal.

## Ce que change ce parcours

> Claude n'est pas un rédacteur autonome. C'est un amplificateur. Il amplifie ce que vous lui donnez : si vous lui donnez du flou, il amplifie le flou ; si vous lui donnez une voix, des faits et des contraintes, il amplifie votre marque.

Les cinq leçons suivantes construisent l'outillage : un brief de voix réutilisable (leçon 2), un workflow de production qui tient à l'échelle (3), le SEO/GEO à l'ère des réponses génératives (4), des séquences email qui convertissent sans hype (5), et une mesure honnête qui ne s'appuie jamais sur des chiffres inventés (6). Le fil rouge ne bouge pas : **éviter le générique, garder la voix, ne jamais inventer**.` + FOOTER,
    },
    {
      slug: "marketing-brief-voix-de-marque",
      title: "Construire un brief de voix de marque réutilisable",
      description:
        "Un document de référence, injectable dans chaque prompt, qui fait écrire Claude comme vous et pas comme tout le monde.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Pourquoi un brief, pas un prompt

Redonner vos consignes de ton à chaque demande est une perte de temps et une source d'incohérence. La solution professionnelle est un **brief de voix de marque** : un document court, dense, que vous collez en tête de chaque conversation (ou que vous stockez dans un fichier projet réutilisable). Il transforme Claude en collaborateur qui connaît déjà votre marque, au lieu d'un pigiste à qui vous réexpliquez tout.

L'objectif n'est pas un PDF de 40 pages que personne ne lit. C'est une page, opérationnelle, faite d'éléments que Claude peut **appliquer mécaniquement**.

## Les sept sections du brief

**1. Positionnement en une phrase.** Qui vous êtes, pour qui, contre quoi. Exemple structurel : « Nous aidons [audience précise] à [résultat concret] sans [douleur habituelle du secteur]. » Cette phrase ancre tout le reste.

**2. Le lecteur, en chair et en os.** Pas une cible démographique : une personne. Son métier, sa journée, le problème qui le réveille la nuit, le vocabulaire qu'il emploie et celui qui le fait fuir. Claude écrit mieux pour une personne que pour un segment.

**3. Trois adjectifs de ton — et leurs contraires.** « Direct, chaleureux, précis » ne suffit pas : tout le monde dit ça. Ajoutez l'anti-ton : « Direct (pas brutal), chaleureux (pas familier), précis (pas jargonneux). » Les contraires cadrent mieux que les qualités.

**4. Liste noire lexicale.** Les mots et tournures bannis : la hype de votre secteur, les anglicismes que vous refusez, les formules creuses. C'est le garde-fou anti-générique le plus efficace, parce qu'il est vérifiable d'un coup d'œil.

**5. Règles de style mesurables.** Des consignes qu'on peut contrôler objectivement : longueur de phrase visée, tutoiement ou vouvoiement, usage des chiffres, place des exemples, format des titres. Évitez les consignes invérifiables (« sois percutant »).

**6. Exemples annotés — le cœur du brief.** Deux ou trois extraits de VOTRE meilleur contenu, et un ou deux contre-exemples (« ce ton-là, jamais »). Un modèle apprend une voix infiniment mieux par l'exemple que par l'adjectif. C'est la section qui fait la différence entre un brief tiède et un brief qui fonctionne.

**7. Faits et chiffres autorisés.** La liste des données que Claude a le droit d'utiliser : vos vraies statistiques, vos vrais cas clients (anonymisés si besoin). Règle absolue inscrite ici : **tout ce qui n'est pas dans cette liste est interdit ; à défaut, écrire [À COMPLÉTER]**.

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

## Le tester avant de l'adopter

Un brief se valide empiriquement. Donnez à Claude le brief plus une tâche simple, puis posez-vous trois questions sur la sortie : passe-t-elle le **test du concurrent** (impossible de remplacer votre nom par un autre) ? Contient-elle un seul mot de la liste noire ? Y a-t-il une donnée non autorisée ? Si un test échoue, ce n'est pas la sortie qu'on corrige : c'est le brief. Vous itérez sur le document, pas sur chaque texte.

## Le faire vivre

Un brief n'est pas figé. Quand un contenu performe particulièrement bien, ajoutez-le aux exemples à imiter. Quand un mot vous agace de façon récurrente dans les sorties, ajoutez-le à la liste noire. Au bout de quelques semaines, vous tenez un actif réutilisable qui rend chaque demande deux fois plus rapide et deux fois plus juste.

> Un bon brief de voix ne décrit pas votre marque : il **contraint** Claude. Préférez toujours une règle vérifiable à un adjectif inspirant. Ce qui ne se contrôle pas ne s'applique pas.` + FOOTER,
    },
    {
      slug: "marketing-industrialiser-sans-perdre-la-voix",
      title: "Industrialiser la production sans perdre la voix",
      description:
        "Passer à l'échelle sans diluer la marque : workflow en étapes, garde-fous anti-générique, et relecture humaine au bon endroit.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Le piège du volume

Dès qu'on industrialise, deux dangers apparaissent. Le premier : la **régression vers le générique**, parce qu'on relâche les contraintes pour aller vite. Le second : la **dette de contenu** — produire vite du contenu médiocre qui salit la marque et qu'il faudra réécrire. L'enjeu de cette leçon est de produire beaucoup sans tomber dans aucun des deux.

La règle de fond : **on n'industrialise jamais une étape qu'on ne maîtrise pas à la main**. Si vous ne savez pas faire un bon article à l'unité avec Claude, automatiser ne fera que multiplier les défauts.

## Le workflow en quatre étapes

Découper la production en étapes distinctes vaut infiniment mieux qu'un méga-prompt qui fait tout. Chaque étape a un livrable contrôlable.

**Étape 1 — Angle.** Avant d'écrire, faites produire 3 à 5 angles distincts à partir du sujet et du brief. Vous tranchez. C'est l'étape qui tue le générique : le premier angle d'un modèle est toujours le plus banal, le bon angle est souvent le troisième.

**Étape 2 — Plan.** À partir de l'angle choisi, un plan détaillé : titres de sections, promesse de chaque section, exemple ou donnée prévue à chaque endroit. Vous validez le plan avant un mot de rédaction. Corriger un plan coûte une minute ; corriger un article fini en coûte trente.

**Étape 3 — Rédaction section par section.** On rédige par bloc, pas tout d'un coup. Claude garde mieux la voix sur un format court, et vous repérez une dérive immédiatement au lieu de la découvrir à la fin.

**Étape 4 — Passe anti-générique.** Une dernière passe où Claude (puis vous) relit avec une grille précise : chasse à la liste noire, vérification que chaque affirmation est étayée, marquage [À COMPLÉTER] sur toute donnée non sourcée.

## Les garde-fous mécaniques

Industrialiser, c'est rendre les contraintes systématiques plutôt que de compter sur sa vigilance.

- **Le brief en tête de chaque tâche.** Toujours injecté, jamais résumé. Dans un outil comme Claude Code ou un projet, stockez-le dans un fichier que chaque conversation charge.
- **La checklist de sortie.** Un prompt de relecture réutilisable : *« Relis ce texte. Liste chaque mot de la liste noire trouvé, chaque affirmation non étayée, et chaque endroit où une donnée semble inventée. Ne réécris pas, signale. »* Séparer le diagnostic de la réécriture donne de bien meilleurs résultats.
- **Le test du concurrent, systématisé.** À chaque pièce : le nom de la marque est-il remplaçable sans que rien ne cloche ? Si oui, l'angle est trop générique.
- **Le quota d'erreur zéro sur les faits.** Aucune statistique, citation ou nom propre ne sort sans source. C'est non négociable et ça se vérifie en relecture finale.

## Où mettre l'humain

L'industrialisation ne supprime pas la relecture humaine : elle la **déplace vers les points de levier**. Vous n'avez pas à relire chaque phrase, mais vous devez impérativement valider : l'angle (étape 1), les faits chiffrés et les noms propres, et tout ce qui engage juridiquement la marque (promesses, comparaisons, mentions légales). Le reste peut tourner plus vite.

Une bonne répartition : Claude produit et fait sa propre passe critique, un humain valide angle + faits + risques. Le temps gagné n'est pas sur l'écriture brute, il est sur l'absence de réécriture après coup.

## Le modèle factory ne dispense pas du goût

> Un workflow industrialisé multiplie ce que vous y mettez. S'il encode du goût, des contraintes et des faits réels, il produit du bon contenu à l'échelle. S'il encode de la paresse, il produit de la dette à l'échelle.

Le bon réflexe : commencez petit, faites tourner le workflow sur dix pièces, mesurez ce qui dérape, durcissez les garde-fous, puis seulement accélérez. On industrialise une qualité maîtrisée, jamais un espoir.` + FOOTER,
    },
    {
      slug: "marketing-seo-geo-resumes-ia",
      title: "SEO/GEO à l'ère des résumés IA",
      description:
        "Optimiser pour les AI Overviews et les réponses génératives : angles, clusters thématiques, contenu citable et E-E-A-T.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Ce qui a changé, et ce qui n'a pas changé

Les moteurs affichent désormais des **résumés générés par IA** (les AI Overviews de Google, les réponses de Perplexity, de ChatGPT et autres). Conséquence : une part des requêtes trouve sa réponse sans clic. Le nouvel objectif n'est plus seulement de classer une page, c'est d'**être la source que l'IA cite** dans sa réponse. On parle de GEO (Generative Engine Optimization) ou AEO (Answer Engine Optimization).

Le point rassurant, répété par Google lui-même : ces surfaces génératives s'appuient sur les mêmes systèmes de classement et de qualité que la recherche classique. Le GEO est, pour l'essentiel, **du bon SEO poussé un cran plus loin** — pas une discipline parallèle qui invaliderait tout ce que vous savez.

## Comment l'IA choisit ce qu'elle cite

Un résumé IA agrège typiquement plusieurs sources (de l'ordre d'une demi-douzaine) et place des citations près du passage qu'elles appuient. Pour être extrait proprement et cité avec confiance, un contenu doit présenter quelques caractéristiques observées de façon récurrente :

- **Une réponse directe en tête.** Les premières centaines de mots répondent franchement à la question principale, avant tout préambule. Un paragraphe-réponse clair et autonome est ce que l'IA prélève le plus volontiers.
- **Des titres formulés en questions.** « Qu'est-ce que le GEO ? » se fait citer plus volontiers que « Aperçu du GEO ». C'est l'un des ajustements au meilleur rapport effort/résultat.
- **Des faits durs, sourcés.** Les moteurs génératifs privilégient le contenu qui avance des données précises et attribuées. À noter pour notre fil rouge : vous ne citez QUE vos vrais chiffres, et vous marquez [À COMPLÉTER] sinon — jamais d'invention pour faire « data-driven ».
- **Une prose nette, sans remplissage.** Les phrases qui posent des assertions factuelles précises, débarrassées du verbiage conversationnel, sont préférées.
- **Des signaux E-E-A-T.** Expérience, expertise, autorité, fiabilité : auteur nommé, expérience de première main, mise à jour datée visible. Sur les requêtes sensibles au temps, le contenu récent et daté l'emporte.

## La stratégie de clusters thématiques

Une page isolée ne suffit plus. La structure qui performe est le **cluster** : une page pilier qui traite un sujet large, entourée de pages satellites qui creusent chaque sous-question, toutes reliées entre elles. Cela démontre une profondeur de sujet que les moteurs (classiques comme génératifs) interprètent comme de l'autorité.

Claude est excellent pour cartographier un cluster : donnez-lui votre sujet pilier et votre audience, demandez-lui la liste des sous-questions réelles que se pose votre lecteur, regroupées par intention. Vous obtenez l'arborescence du cluster en quelques minutes. **Attention** : Claude n'a pas de données de volume de recherche fiables et à jour. Il sert à générer des angles et une structure ; la validation des volumes passe par un outil de mots-clés réel.

## Le rôle de Claude dans ce workflow

Claude excelle sur les tâches à forte composante langagière du SEO/GEO :

- Générer des angles non génériques et des questions réelles d'audience.
- Restructurer un contenu existant en réponse-en-tête + titres-questions.
- Rédiger une FAQ qui couvre les formulations exactes des requêtes.
- Produire un balisage de données structurées (schema) pour clarifier le contenu aux moteurs.

Il est faible — et il faut le savoir — sur tout ce qui exige des données fraîches et mesurées : volumes de recherche, classements actuels, ce que vos concurrents publient *aujourd'hui*. Sur ces points, l'outil de référence prime, et Claude ne sert qu'à interpréter les données que VOUS lui fournissez.

## La discipline qui protège la marque

> En GEO, la tentation d'empiler des chiffres pour paraître « citable » est forte. Mais une donnée inventée détectée détruit l'autorité que tout le SEO cherche à bâtir. Notre règle est un avantage concurrentiel : seulement des faits vrais et sourcés, [À COMPLÉTER] partout ailleurs.

Optimiser pour l'IA et garder l'honnêteté ne s'opposent pas : la fiabilité est précisément ce que les moteurs génératifs récompensent.` + FOOTER,
    },
    {
      slug: "marketing-email-copywriting-convertit",
      title: "Séquences email et copywriting qui convertit",
      description:
        "Frameworks de copy éprouvés, séquences email structurées, et une persuasion honnête qui convainc sans hype ni fausses urgences.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Convertir sans mentir

Le copywriting a mauvaise réputation parce qu'on le confond avec la manipulation : fausses urgences, faux compteurs, promesses gonflées. Ça fonctionne une fois, puis ça brûle la confiance — et la confiance est le seul actif qui compose dans le temps. La position de ce parcours : **on convertit par la clarté et la preuve, pas par la pression**. C'est aussi, accessoirement, ce qui tient sur la durée et ce que la loi tolère.

Claude est un bon assistant copywriting à une condition : il connaît les frameworks, mais il les remplit de générique si vous ne lui donnez pas de matière réelle. Vous apportez les faits, la vraie douleur du client, les vrais bénéfices ; il structure.

## Trois frameworks qui tiennent

**PAS — Problème, Agitation, Solution.** Nommez le problème du lecteur ; montrez ce qu'il coûte concrètement (l'agitation, pas le drama inventé : des conséquences réelles) ; présentez la solution. Efficace parce qu'il part du lecteur, pas du produit.

**AIDA — Attention, Intérêt, Désir, Action.** Le classique : accrocher, intéresser par la pertinence, faire désirer par le bénéfice concret, demander une action unique et claire.

**Avant / Après / Pont.** Décrivez la situation actuelle du lecteur (avant), la situation souhaitée (après), puis positionnez votre offre comme le pont entre les deux. Très visuel, idéal en email.

Le framework n'est qu'une charpente. La qualité vient de ce qu'on y met : un bénéfice se démontre par un fait (« exporte vos devis en un clic »), jamais par un adjectif (« ultra-simple »).

## Une séquence email qui respecte le lecteur

Une séquence de bienvenue ou de lancement honnête suit une logique de valeur croissante, pas de harcèlement. Structure type :

    Email 1 — Accueil + tenir la promesse d'inscription (livrer la valeur attendue)
    Email 2 — Le problème, raconté du point de vue du lecteur
    Email 3 — La preuve : cas réel, démonstration, résultat vérifiable
    Email 4 — L'offre, claire, avec ses limites honnêtes
    Email 5 — Réponse aux objections réelles + dernier rappel sans fausse urgence

Chaque email a **un seul objectif** et **un seul appel à l'action**. Un email qui demande trois choses n'en obtient aucune.

## L'objet et la première ligne

L'objet décide de l'ouverture ; la première ligne décide de la lecture. Demandez à Claude une dizaine d'objets dans des registres différents (curiosité, bénéfice direct, question), puis tranchez à la main. Bannissez les majuscules criardes, les emojis en rafale et les fausses promesses : les filtres anti-spam comme les lecteurs les sanctionnent. La première ligne ne doit jamais gaspiller l'espace (« J'espère que vous allez bien ») : elle entre dans le vif.

## Le garde-fou anti-hype, appliqué à la vente

C'est en copy que la tentation d'inventer est la plus forte. La règle, durcie pour ce contexte :

- **Aucune statistique de résultat sans source.** « 3x plus de conversions » est interdit tant que vous ne possédez pas la mesure. À défaut : [À COMPLÉTER].
- **Aucun témoignage inventé.** Jamais. Un faux avis est un mensonge, et dans beaucoup de pays une infraction. Si vous n'avez pas de témoignage, vous écrivez la séquence sans, et vous marquez [À COMPLÉTER — témoignage client réel].
- **Pas de fausse rareté.** Un compteur « plus que 2 places » qui ne correspond à rien se voit et se retourne. La rareté n'est légitime que si elle est réelle.
- **La promesse = ce que le produit fait, vérifiable.** Pas ce qu'on aimerait qu'il fasse.

## Faire critiquer la copy par Claude

Au-delà de la rédaction, Claude est utile en **avocat du diable**. Demandez-lui : *« Joue le lecteur sceptique. Quelles objections cette séquence ne lève-t-elle pas ? Quelles promesses sonnent creux ou non prouvées ? »* Vous obtenez une liste d'angles morts à combler avec des faits réels.

> Une copy honnête n'est pas une copy fade. La clarté est persuasive ; la preuve est persuasive ; un bénéfice concret est persuasif. La hype, elle, ne persuade plus personne — elle signale juste que vous n'avez rien de vrai à dire.` + FOOTER,
    },
    {
      slug: "marketing-mesurer-iterer-ne-pas-halluciner",
      title: "Mesurer, itérer, ne pas halluciner",
      description:
        "Boucler la production sur des preuves réelles : A/B testing, lecture honnête des chiffres, et marquage systématique de [À COMPLÉTER].",
      duration_min: 20,
      is_free_preview: false,
      content_md:
        `## Pourquoi cette leçon est la plus importante

On peut produire un contenu impeccable et piloter complètement à l'aveugle. Sans mesure honnête, on optimise des impressions, on répète ce qui ne marche pas, et — pire — on se met à raconter des résultats qu'on n'a pas. Cette leçon ferme la boucle : produire, mesurer pour de vrai, itérer, sans jamais laisser Claude (ni vous) inventer un chiffre.

Rappel central, valable pour tout ce parcours : **Claude n'a pas accès à vos données de performance.** Il ne connaît ni votre taux d'ouverture, ni votre trafic, ni votre conversion. Tout chiffre qu'il avancerait spontanément est une hallucination. Son rôle ici est d'**interpréter les données que vous lui fournissez**, pas de les produire.

## Mesurer ce qui compte, pas ce qui flatte

Choisissez des métriques liées à l'objectif réel, pas aux vanités.

- **Notoriété/SEO :** impressions, position moyenne, et désormais part de citations dans les réponses IA. Le trafic seul devient trompeur à l'ère du zéro-clic.
- **Email :** taux d'ouverture (à manier avec prudence depuis les protections de confidentialité qui pré-chargent les images), taux de clic, et surtout la conversion en aval.
- **Conversion :** le seul chiffre qui paie. Une page très lue qui ne convertit pas est un problème, pas un succès.

Définissez l'indicateur AVANT de publier. Choisir la métrique après coup, c'est se raconter une histoire.

## L'A/B test, fait correctement

Claude génère facilement des variantes (objets d'email, titres, accroches, CTA) — c'est l'un de ses meilleurs usages marketing. Mais une variante ne vaut rien sans test propre :

- **Une seule variable à la fois.** Si vous changez l'objet ET l'image, vous ne saurez pas ce qui a joué.
- **Un échantillon suffisant.** Sur de petits volumes, l'écart observé est souvent du bruit. Déclarer un gagnant sur 40 envois n'a pas de sens statistique.
- **Un critère de décision fixé d'avance** (quelle métrique, quel seuil). Sinon on voit ce qu'on veut voir.
- **Garder la trace.** Notez l'hypothèse, le résultat, la conclusion. C'est ce journal qui, accumulé, devient votre vraie connaissance marketing.

Claude aide à concevoir le test et à interpréter le résultat une fois mesuré — il ne le mesure pas.

## Lire les chiffres sans se mentir

Quelques pièges classiques, à garder en tête quand vous donnez vos données à Claude pour analyse :

- **Corrélation n'est pas causalité.** Le trafic monte le mois où vous avez publié ? Peut-être la saison, une mention externe, un changement d'algorithme. Restez prudent.
- **Le bruit des petits nombres.** Deux conversions de plus sur dix, ce n'est pas « +20 % de performance », c'est du hasard.
- **Le biais du survivant.** Analyser seulement les contenus qui ont marché masque pourquoi les autres ont échoué.

Quand vous demandez une analyse à Claude, fournissez les chiffres bruts et exigez de la nuance : *« Quelles explications alternatives à cette hausse ? Quelles limites de ces données ? »*

## Le marquage [À COMPLÉTER] comme méthode

C'est le fil rouge du parcours, et il culmine ici. Tout au long de la production, chaque fois qu'un chiffre, un témoignage ou une preuve manque, on écrit **[À COMPLÉTER]** au lieu d'inventer. À l'étape de mesure, ce marquage devient une **liste de tâches** : ce sont précisément les trous à combler avec des données réelles avant publication.

    Avant publication, recherchez « [À COMPLÉTER] » dans le document.
    Zéro occurrence restante = chaque affirmation est étayée par un fait vrai.
    Une occurrence = soit vous trouvez la vraie donnée, soit vous reformulez sans elle.

C'est mécanique, vérifiable, et ça rend l'honnêteté impossible à oublier.

## La boucle complète

> Cadrer (leçon 1) → voix réutilisable (2) → produire à l'échelle (3) → optimiser pour l'IA (4) → convertir honnêtement (5) → mesurer et itérer (6). À chaque tour, vos exemples s'enrichissent, votre brief se durcit, vos garde-fous gagnent en précision.

Le marketing avec Claude, bien fait, n'est pas une machine à produire du texte : c'est un système qui apprend votre marque, refuse le générique, et ne s'appuie que sur ce qui est vrai. C'est cette discipline — pas le volume — qui finit par convertir.` + FOOTER,
    },
  ],
};
