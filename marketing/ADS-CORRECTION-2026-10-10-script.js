/**
 * Correction Google Ads du 10 octobre 2026 : rediriger le budget vers les requêtes commerciales.
 * Diagnostic complet : marketing/AUDIT-ADS-2026-10-10.md
 *
 * Mode d'emploi (3 minutes) :
 *   1. Google Ads > Outils > Actions groupées > Scripts > « + » > Nouveau script. Nom : « Correction 10 octobre 2026 ».
 *   2. Tout sélectionner dans l'éditeur, coller ce fichier, Autoriser (une fois).
 *   3. « Aperçu » : RIEN n'est modifié. Le journal (onglet Journaux) liste chaque changement prévu.
 *   4. Si le journal finit par « 0 erreur », cliquer « Exécuter ». Puis relire le journal de l'exécution.
 *
 * Ce qu'il fait :
 *   1. Met en veille le mot clé [agent ia claude] (86 clics, 46,60 € en 7 jours, rapproché par Google de « claude ai »).
 *   2. Ajoute des exclusions en correspondance EXACTE au niveau de la campagne (claude ai, claude ia, ia claude...).
 *      Exactes : « formation claude ai » reste autorisé.
 *   3. Met le groupe « Agent IA » en veille (option PAUSER_GROUPE_AGENT).
 *   4. Ajoute au groupe Formation Claude 2 mots clés en expression exacte et 5 mots clés exacts.
 *
 * Idempotent : relancer ne crée aucun doublon. Réversible : rien n'est supprimé, tout est mis en veille.
 * Ne touche ni au budget, ni aux enchères, ni aux annonces.
 */

var CONFIG = {
  COMPTE: '537-199-3441',
  CAMPAGNE_ID: 24043755790,
  GROUPE_AGENT: 'Agent IA',

  // true : le groupe Agent IA est mis en veille (recommandé : il envoie vers un guide, pas vers la vente).
  // false : il reste actif ; les exclusions exactes ci-dessous lui retirent quand même « claude ai ».
  PAUSER_GROUPE_AGENT: true,

  // true : ajoute "formation claude" et "formation claude ai" en expression exacte (longue traîne commerciale).
  AJOUTER_EXPRESSIONS: true
};

// Mots clés à mettre en veille (texte sans crochets, comparaison insensible à la casse).
var MOTS_CLES_A_PAUSER = ['agent ia claude'];

// Exclusions au niveau de la campagne, en correspondance EXACTE (crochets).
var EXCLUSIONS_EXACTES = [
  'claude ai', 'claude ia', 'ia claude', 'claud ia',
  'claude agent', 'agent claude', 'claude agents', 'agents claude',
  'claude agent ia', 'claude ai agent', 'claude assistant ia',
  'claude ai en français', 'claude ai en francais', 'claude ai français'
];

// Mots clés à ajouter au groupe Formation Claude.
var EXPRESSIONS_EXACTES = ['formation claude', 'formation claude ai'];
var MOTS_CLES_EXACTS = [
  'formation claude ai en ligne', 'formation sur claude', 'apprendre à utiliser claude',
  'cours claude ai en ligne', 'formation claude ai débutant'
];

var APERCU = false;
var changements = 0;
var erreurs = 0;

function main() {
  APERCU = AdsApp.getExecutionInfo().isPreview();
  log(APERCU ? '=== APERÇU : rien ne sera modifié ===' : '=== EXÉCUTION RÉELLE ===');

  var compte = AdsApp.currentAccount().getCustomerId();
  if (compte !== CONFIG.COMPTE) throw new Error('Mauvais compte : ' + compte + ' (attendu ' + CONFIG.COMPTE + ')');

  var campagne = trouverCampagne();
  log('Campagne : ' + campagne.getName() + ' (' + (campagne.isPaused() ? 'en veille' : 'active') + ')');

  var groupeFormation = trouverGroupeFormation(campagne);
  var groupeAgent = trouverGroupeAgent(campagne);

  etape('1. Mise en veille des mots clés qui achètent « claude ai »', function () { pauserMotsCles(campagne); });
  etape('2. Exclusions exactes au niveau de la campagne', function () { ajouterExclusionsExactes(campagne); });
  etape('3. Groupe « ' + CONFIG.GROUPE_AGENT + ' »', function () { pauserGroupeAgent(groupeAgent); });
  etape('4a. Expressions exactes dans « ' + groupeFormation.getName() + ' »', function () {
    if (!CONFIG.AJOUTER_EXPRESSIONS) { log('désactivé par CONFIG'); return; }
    ajouterMotsCles(groupeFormation, EXPRESSIONS_EXACTES, 'PHRASE');
  });
  etape('4b. Mots clés exacts dans « ' + groupeFormation.getName() + ' »', function () {
    ajouterMotsCles(groupeFormation, MOTS_CLES_EXACTS, 'EXACT');
  });

  log('');
  log('=== ' + changements + ' changement(s), ' + erreurs + ' erreur(s) ===');
  if (erreurs > 0) throw new Error(erreurs + ' erreur(s) : lire le journal ci-dessus. Les étapes réussies sont appliquées.');
}

// ── Recherche des objets ─────────────────────────────────────────────────────

function trouverCampagne() {
  var it = AdsApp.campaigns().withIds([String(CONFIG.CAMPAGNE_ID)]).get();
  if (!it.hasNext()) throw new Error('Campagne ' + CONFIG.CAMPAGNE_ID + ' introuvable');
  return it.next();
}

function trouverGroupeAgent(campagne) {
  var it = campagne.adGroups().get();
  while (it.hasNext()) {
    var g = it.next();
    if (normaliser(g.getName()) === normaliser(CONFIG.GROUPE_AGENT)) return g;
  }
  return null;
}

function trouverGroupeFormation(campagne) {
  var candidats = [];
  var it = campagne.adGroups().get();
  while (it.hasNext()) {
    var g = it.next();
    if (normaliser(g.getName()) === normaliser(CONFIG.GROUPE_AGENT)) continue;
    candidats.push(g);
  }
  if (candidats.length === 1) return candidats[0];
  throw new Error('Je m\'attendais à un seul groupe hors « ' + CONFIG.GROUPE_AGENT + ' », trouvé ' + candidats.length + ' : ' +
    candidats.map(function (g) { return '« ' + g.getName() + ' »'; }).join(', ') + '. Rien n\'a été modifié.');
}

// ── Étapes ───────────────────────────────────────────────────────────────────

function pauserMotsCles(campagne) {
  var voulus = {};
  MOTS_CLES_A_PAUSER.forEach(function (t) { voulus[normaliser(t)] = true; });
  var trouves = 0;
  var it = campagne.keywords().get();
  while (it.hasNext()) {
    var kw = it.next();
    if (!voulus[normaliser(kw.getText())]) continue;
    trouves++;
    if (kw.isPaused()) { log('= [' + kw.getText() + '] déjà en veille'); continue; }
    kw.pause();
    changements++;
    log('|| [' + kw.getText() + '] (' + kw.getMatchType() + ') mis en veille');
  }
  if (trouves === 0) log('Aucun des mots clés visés n\'existe dans la campagne (déjà supprimés ?)');
}

function ajouterExclusionsExactes(campagne) {
  var deja = {};
  var it = campagne.negativeKeywords().get();
  var avant = 0;
  while (it.hasNext()) {
    var n = it.next();
    deja[normaliser(n.getText()) + '|' + n.getMatchType()] = true;
    avant++;
  }
  var nouvelles = EXCLUSIONS_EXACTES.filter(function (t) { return !deja[normaliser(t) + '|EXACT']; });
  log(avant + ' exclusions de campagne présentes, ' + nouvelles.length + ' exactes à ajouter');
  nouvelles.forEach(function (t) {
    campagne.createNegativeKeyword('[' + t + ']');
    changements++;
    log('+ exclusion exacte [' + t + ']');
  });
}

function pauserGroupeAgent(groupe) {
  if (!groupe) { log('Groupe « ' + CONFIG.GROUPE_AGENT + ' » introuvable : rien à faire'); return; }
  if (!CONFIG.PAUSER_GROUPE_AGENT) { log('Conservé actif (CONFIG.PAUSER_GROUPE_AGENT = false)'); return; }
  if (groupe.isPaused()) { log('Déjà en veille'); return; }
  groupe.pause();
  changements++;
  log('|| groupe « ' + groupe.getName() + ' » mis en veille (ses mots clés et son annonce restent intacts)');
}

function ajouterMotsCles(groupe, textes, type) {
  var presents = {};
  var it = groupe.keywords().get();
  while (it.hasNext()) {
    var kw = it.next();
    presents[normaliser(kw.getText()) + '|' + kw.getMatchType()] = true;
  }
  textes.forEach(function (t) {
    if (presents[normaliser(t) + '|' + type]) { log('= ' + type + ' « ' + t + ' » déjà présent'); return; }
    var texte = type === 'PHRASE' ? '"' + t + '"' : '[' + t + ']';
    var op = groupe.newKeywordBuilder().withText(texte).build();
    if (verifier(op, '+ ' + texte)) changements++;
  });
}

// ── Outils ───────────────────────────────────────────────────────────────────

function etape(titre, fn) {
  log('');
  log('--- ' + titre + ' ---');
  try {
    fn();
  } catch (e) {
    erreurs++;
    log('ERREUR : ' + e.message);
  }
}

function verifier(op, libelle) {
  if (op.isSuccessful()) { log(libelle); return true; }
  erreurs++;
  log('ERREUR ' + libelle + ' : ' + op.getErrors().join(' ; '));
  return false;
}

function normaliser(texte) {
  return String(texte).replace(/^[\[\"+]+|[\]\"]+$/g, '').trim().toLowerCase();
}

function log(m) { Logger.log(m); }
