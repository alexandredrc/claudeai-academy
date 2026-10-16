import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";

export const metadata: Metadata = pageMetadata({
  path: "/confidentialite",
  title: "Politique de confidentialité | ClaudeAI Academy",
  description:
    "Comment ClaudeAI Academy collecte, utilise et protège vos données personnelles (compte, paiement, emails), conformément au RGPD, et vos droits.",
});

export default function ConfidentialitePage() {
  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Vos données</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
          Politique de confidentialité
        </h1>

        <div className="prose-lesson mt-10">
          <p>
            Dernière mise à jour&nbsp;: 16 octobre 2026 (ajout du kit gratuit,
            des emails qui le suivent, des témoignages et des outils de mesure
            d&apos;audience). La présente politique
            explique comment <strong>ADRC Group</strong> (éditeur de
            claudeai-academy.com) traite vos données personnelles, conformément
            au Règlement Général sur la Protection des Données (RGPD).
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            ADRC Group, Alexandre Dos Reis Caetano, entrepreneur individuel,
            SIREN 892&nbsp;303&nbsp;082, 99 avenue Achille Peretti, 92200
            Neuilly-sur-Seine. Contact&nbsp;:{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
            . Aucun délégué à la protection des données (DPO) n’a été désigné.
          </p>

          <h2>2. Données collectées</h2>
          <ul>
            <li>
              <strong>Compte</strong>&nbsp;: adresse email, mot de passe (chiffré).
            </li>
            <li>
              <strong>Achat</strong>&nbsp;: données de facturation et historique de
              commande (le paiement est traité par Stripe&nbsp;; nous ne stockons
              aucune donnée bancaire).
            </li>
            <li>
              <strong>Progression</strong>&nbsp;: leçons consultées, avancement.
            </li>
            <li>
              <strong>Mentor IA</strong>&nbsp;: contenu des messages que vous
              envoyez au Mentor, pour fournir et limiter le service.
            </li>
            <li>
              <strong>Kit gratuit</strong>&nbsp;: adresse email, prénom
              (facultatif), page sur laquelle vous vous êtes inscrit, et liste
              des emails qui vous ont été envoyés.
            </li>
            <li>
              <strong>Témoignages</strong>&nbsp;: adresse email, prénom
              (facultatif), métier, ville (facultative), tâche décrite, temps
              avant et après, texte de votre retour, votre choix de publication,
              et votre statut (acheteur ou lecteur du kit), calculé à partir de
              votre adresse email.
            </li>
            <li>
              <strong>Emails</strong>&nbsp;: les clics sur les liens de nos
              emails sont comptés par notre prestataire d’envoi, pour savoir
              quels contenus servent.
            </li>
            <li>
              <strong>Données techniques</strong>&nbsp;: logs, statistiques d’usage
              agrégées.
            </li>
          </ul>

          <h2>3. Finalités et bases légales</h2>
          <ul>
            <li>
              Fournir l’accès aux formations et gérer votre compte :{" "}
              <em>exécution du contrat</em>.
            </li>
            <li>
              Traiter les paiements et la facturation :{" "}
              <em>obligation légale et contractuelle</em>.
            </li>
            <li>
              Améliorer le service et le contenu : <em>intérêt légitime</em>.
            </li>
            <li>
              Communications liées à votre compte : <em>exécution du contrat</em>.
            </li>
            <li>
              Envoyer le kit gratuit puis les emails qui le suivent (cinq emails
              les dix premiers jours, puis un cas concret par semaine pendant
              deux mois, et ponctuellement une demande de retour)&nbsp;:{" "}
              <em>consentement</em>, donné en remplissant le formulaire du kit
              et retirable en un clic par le lien présent dans chaque email.
            </li>
            <li>
              Recueillir et publier des témoignages : <em>consentement</em>{" "}
              explicite, donné dans le formulaire ou par écrit, et retirable à
              tout moment. Un retour marqué «&nbsp;ne pas publier&nbsp;» ne
              l’est jamais.
            </li>
            <li>
              Mesure d’audience et X              Analytics, Microsoft Clarity) et mesure des campagnes (Google Ads)
              : <em>consentement</em>, recueilli par la bannière du site.
            </li>
            <li>
              Prévenir les abus des formulaires (envois automatisés) :{" "}
              <em>intérêt légitime</em>.
            </li>
          </ul>

          <h2>4. Sous-traitants et destinataires</h2>
          <p>
            Vos données sont partagées uniquement avec les prestataires
            nécessaires au service&nbsp;:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> : authentification et base de données.
            </li>
            <li>
              <strong>Stripe</strong> : traitement des paiements.
            </li>
            <li>
              <strong>Anthropic</strong> : fourniture du Mentor IA (modèle Claude).
            </li>
            <li>
              <strong>Resend</strong> : envoi des emails transactionnels.
            </li>
            <li>
              <strong>Vercel</strong> : hébergement du site.
            </li>
            <li>
              <strong>Google</strong> (Analytics, Ads) et{" "}
              <strong>Microsoft</strong> (Clarity) : mesure d’audience et de
              campagnes, seulement après votre accord dans la bannière.
            </li>
            <li>
              <strong>Telegram</strong> : alerte interne au fondateur lors
              d’une inscription au kit ou d’un témoignage. Elle contient au plus
              un prénom, un métier et la page d’origine, jamais l’adresse email
              ni le texte d’un témoignage.
            </li>
          </ul>
          <p>
            Certains prestataires peuvent être situés hors de l’Union européenne&nbsp;;
            les transferts sont alors encadrés par les garanties appropriées
            (clauses contractuelles types).
          </p>

          <h2>5. Durée de conservation</h2>
          <p>
            Les données de compte sont conservées tant que le compte est actif.
            Les données de facturation sont conservées conformément aux
            obligations légales (généralement 10 ans). Les messages que vous
            envoyez au Mentor IA ne sont pas conservés de manière persistante par
            nos soins&nbsp;: ils sont transmis à Anthropic pour générer la
            réponse, puis ne sont pas stockés au-delà du traitement de la requête.
            Seuls des compteurs d’usage (nombre de questions par jour) sont
            conservés afin d’appliquer les limites du service.
          </p>
          <p>
            Les données du kit gratuit sont conservées tant que vous restez
            inscrit. Après une désinscription, seule votre adresse est gardée,
            avec la date de désinscription, pour ne plus jamais vous écrire. Un
            témoignage publié reste en ligne tant que vous ne retirez pas votre
            accord&nbsp;; un retour non publié est supprimé sur simple demande,
            et au plus tard trois ans après sa réception. Les données de mesure
            d’audience sont conservées selon les réglages des outils, au plus 14
            mois pour Google Analytics.
          </p>

          <h2>6. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de
            rectification, d’effacement, de limitation, de portabilité et
            d’opposition. Pour les exercer&nbsp;:{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
            . Vous pouvez également introduire une réclamation auprès de la CNIL
            (cnil.fr).
          </p>

          <h2>7. Cookies</h2>
          <p>
            Le site utilise les cookies strictement nécessaires à son
            fonctionnement (session, authentification), qui ne requièrent pas de
            consentement préalable.
          </p>
          <p>
            Il dépose également un cookie de <strong>provenance</strong>{" "}
            (<code>cai_prov</code>, 90 jours), émis par notre propre domaine,
            qui mémorise uniquement le canal par lequel vous êtes arrivé sur le
            site (par exemple «&nbsp;linkedin&nbsp;», «&nbsp;moteur de
            recherche&nbsp;» ou «&nbsp;direct&nbsp;») et la première page vue.
            Il ne contient aucun identifiant personnel, n’est transmis à aucun
            tiers et ne permet aucun suivi d’un site à l’autre&nbsp;: il sert
            seulement à savoir quels canaux amènent de vrais élèves. Vous
            pouvez le supprimer à tout moment depuis les données de site de
            votre navigateur.
          </p>
          <p>
            Avec votre accord seulement, le site utilise aussi des cookies de{" "}
            <strong>mesure d’audience (Google Analytics)</strong>, d’
            <strong>enregistrement des visites (Microsoft
            Clarity)</strong>, qui montre où un visiteur clique et s’arrête,
            et de <strong>mesure de conversion Google (Google Ads)</strong>,
            qui indique quelles campagnes aboutissent à une inscription. Ces
            cookies ne sont déposés
            qu’<strong>avec votre consentement</strong>, recueilli via la
            bannière prévue à cet effet&nbsp;; vous pouvez refuser sans aucune
            conséquence sur votre navigation, et revenir sur votre choix en
            supprimant les données de site de votre navigateur. En cas de refus,
            seuls des signaux techniques anonymes et sans cookie (Google Consent
            Mode) sont émis à des fins de mesure agrégée.
          </p>

          <h2>8. Contact</h2>
          <p>
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
