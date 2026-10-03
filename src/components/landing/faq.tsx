"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import {
  CONTENU_A_JOUR_AU,
  DERNIERE_PASSE,
  NOTES_DE_MISE_A_JOUR,
  SOURCES_SURVEILLEES,
} from "@/lib/content/fraicheur";

type Item = {
  q: string;
  a: string;
};

const items: Item[] = [
  {
    q: "Je n'ai jamais rien fait en IA, c'est pour moi ?",
    a: "Oui. Le parcours Bien démarrer avec Claude part de zéro (créer son compte, installer, paramétrer, personnaliser), puis Prompt Engineering pro pose tous les fondamentaux. Aucun prérequis technique pour ces deux parcours, ni pour Contenu & marketing ou Stratégie & conduite IA. Pour Claude Code, Data & SQL, Trading et les Skills GitHub, des bases de programmation aident — mais chaque parcours démarre par l'essentiel.",
  },
  {
    q: "Combien de temps faut-il pour terminer le programme ?",
    a: "Comptez plus de 26 heures de contenu structuré (9 parcours, 57 leçons). La majorité des membres terminent en 4 à 8 semaines à raison de 2 sessions par semaine. Vous gardez l'accès à vie, donc rien ne vous oblige à courir.",
  },
  {
    q: "Le contenu sera-t-il dépassé dans 6 mois ?",
    // L'objection nº1 d'une formation IA mérite une preuve, pas une promesse :
    // la date de la dernière passe et ce qu'elle a intégré.
    a: `C'est le risque numéro un d'une formation sur l'IA, et nous le traitons comme tel. Une veille surveille ${SOURCES_SURVEILLEES} sources de référence et signale chaque phrase de leçon qu'un changement peut rendre fausse. Dernière passe appliquée : ${CONTENU_A_JOUR_AU}, pour intégrer ${DERNIERE_PASSE}. Les leçons portent ${NOTES_DE_MISE_A_JOUR} notes de mise à jour datées depuis juillet 2026. Les mises à jour sont incluses, sans supplément.`,
  },
  {
    q: "En quoi c'est différent des cours gratuits sur YouTube ?",
    a: "Trois différences. La structure d'abord : les leçons sont conçues comme un programme cohérent, pas une succession de tutos isolés. La densité ensuite : on vous épargne l'exposition et on va à l'essentiel. Et l'écosystème : bibliothèque de prompts, templates, mentor IA, mises à jour. Le tout dans un cadre francophone qui n'existe pas ailleurs.",
  },
  {
    q: "Et si je ne suis pas convaincu après l'achat ?",
    a: "Garantie 14 jours satisfait ou remboursé. Vous testez, vous formez votre opinion, et si ça ne vous convient pas, vous nous écrivez à contact@claudeai-academy.com et nous procédons au remboursement intégral. Pas de question, pas de justification à fournir.",
  },
  {
    q: "J'ai une facture pro, c'est possible ?",
    a: "Oui. Vous indiquez vos coordonnées de facturation lors du paiement Stripe et vous recevez automatiquement une facture professionnelle. TVA non applicable, article 293 B du CGI : le prix affiché est le prix facturé, sans TVA à récupérer.",
  },
];

export function FAQ() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-14">
          <Eyebrow align="center">Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Les <span className="accent-serif">objections</span> qu&apos;on nous remonte le plus
          </h2>
        </div>

        <ul className="space-y-3">
          {items.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-coral font-semibold hover:text-coral-dark transition-colors"
          >
            Voir toutes les questions
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function FAQItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={`bg-white border rounded-[18px] overflow-hidden transition-colors duration-200 ${
        open ? "border-coral shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]" : "border-line hover:border-coral-soft"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[16px] font-semibold text-ink leading-snug">
          {item.q}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center text-lg transition-transform duration-200 ${
            open ? "bg-coral text-cream rotate-45" : "bg-cream text-coral"
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[15px] leading-[1.7] text-muted">{item.a}</p>
        </div>
      </div>
    </li>
  );
}
