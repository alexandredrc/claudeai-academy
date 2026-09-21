import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { programmeLabel, type PublicCertificate } from "./core";

/**
 * Génération du certificat en PDF.
 *
 * Choix des polices : les polices standard du format PDF (Times, Helvetica)
 * plutôt qu'une fonte embarquée. Times est la fonte des diplômes depuis
 * toujours, elle ne coûte pas un octet au déploiement, et elle s'affiche à
 * l'identique partout — un certificat qui change de tête selon le lecteur,
 * c'est un certificat qui a l'air faux.
 *
 * Contrainte à ne jamais oublier : ces polices sont encodées en WinAnsi. Une
 * apostrophe typographique ou un tiret cadratin les fait lever une exception.
 * D'où `ascii()`, appliqué à TOUT texte qui passe par ici.
 */

const CREAM = rgb(0.992, 0.984, 0.969);
const INK = rgb(0.122, 0.122, 0.118);
const CORAL = rgb(0.851, 0.467, 0.341);
const MUTED = rgb(0.404, 0.392, 0.361);
const LINE = rgb(0.867, 0.847, 0.808);

/** Ramène un texte dans le jeu de caractères WinAnsi, accents conservés. */
function ascii(input: string): string {
  return input
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[   ]/g, " ")
    .replace(/[•]/g, "-");
}

/** Texte centré horizontalement sur la page. */
function center(
  page: PDFPage,
  text: string,
  opts: { y: number; size: number; font: PDFFont; color?: ReturnType<typeof rgb> },
) {
  const t = ascii(text);
  const width = opts.font.widthOfTextAtSize(t, opts.size);
  page.drawText(t, {
    x: (page.getWidth() - width) / 2,
    y: opts.y,
    size: opts.size,
    font: opts.font,
    color: opts.color ?? INK,
  });
}

/**
 * Texte centré avec interlettrage. pdf-lib ne sait pas espacer les caractères :
 * on les dessine un par un. Réservé aux petites capitales, où l'interlettrage
 * fait la différence entre « imprimé » et « tapé à la machine ».
 */
function centerTracked(
  page: PDFPage,
  text: string,
  opts: { y: number; size: number; font: PDFFont; tracking: number; color?: ReturnType<typeof rgb> },
) {
  const chars = [...ascii(text)];
  const total =
    chars.reduce((w, c) => w + opts.font.widthOfTextAtSize(c, opts.size), 0) +
    opts.tracking * Math.max(0, chars.length - 1);
  let x = (page.getWidth() - total) / 2;
  for (const c of chars) {
    page.drawText(c, {
      x,
      y: opts.y,
      size: opts.size,
      font: opts.font,
      color: opts.color ?? INK,
    });
    x += opts.font.widthOfTextAtSize(c, opts.size) + opts.tracking;
  }
}

function frenchDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

export async function renderCertificatePdf(
  cert: PublicCertificate,
  siteUrl: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Certificat de réussite - ${cert.holderName} - ClaudeAI Academy`);
  doc.setAuthor("ClaudeAI Academy");
  doc.setSubject("Certificat de réussite - Formation Claude AI");
  doc.setProducer("ClaudeAI Academy");
  doc.setCreationDate(new Date(cert.issuedAt));

  // A4 paysage.
  const page = doc.addPage([841.89, 595.28]);
  const W = page.getWidth();
  const H = page.getHeight();

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);

  // Fond.
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });

  // Double filet : un trait franc, un cheveu à l'intérieur.
  page.drawRectangle({
    x: 26, y: 26, width: W - 52, height: H - 52,
    borderColor: CORAL, borderWidth: 1.6,
  });
  page.drawRectangle({
    x: 34, y: 34, width: W - 68, height: H - 68,
    borderColor: LINE, borderWidth: 0.6,
  });

  // En-tête.
  centerTracked(page, "CLAUDEAI ACADEMY", {
    y: H - 96, size: 11, font: sans, tracking: 4.2, color: MUTED,
  });

  // Filet court sous l'en-tête.
  page.drawLine({
    start: { x: W / 2 - 34, y: H - 112 },
    end: { x: W / 2 + 34, y: H - 112 },
    thickness: 1, color: CORAL,
  });

  // Titre — c'est le mot que le lecteur doit voir en premier.
  centerTracked(page, "CERTIFICAT DE RÉUSSITE", {
    y: H - 164, size: 30, font: serifBold, tracking: 3.2, color: INK,
  });

  center(page, "Ce certificat atteste que", {
    y: H - 212, size: 13, font: serifItalic, color: MUTED,
  });

  // Le nom : plus grand que tout le reste, et rétréci s'il déborde.
  const holder = ascii(cert.holderName);
  let nameSize = 44;
  const maxNameWidth = W - 200;
  while (serifBold.widthOfTextAtSize(holder, nameSize) > maxNameWidth && nameSize > 20) {
    nameSize -= 1;
  }
  center(page, holder, { y: H - 270, size: nameSize, font: serifBold, color: INK });

  // Filet sous le nom, calé sur sa largeur.
  const nameWidth = serifBold.widthOfTextAtSize(holder, nameSize);
  page.drawLine({
    start: { x: (W - nameWidth) / 2 - 16, y: H - 286 },
    end: { x: (W + nameWidth) / 2 + 16, y: H - 286 },
    thickness: 0.8, color: LINE,
  });

  center(page, "a suivi l'intégralité du programme et réussi l'examen final", {
    y: H - 320, size: 13.5, font: serif, color: MUTED,
  });

  center(page, programmeLabel(cert.tier), {
    y: H - 356, size: 18, font: serifBold, color: CORAL,
  });

  // Les faits chiffrés, dans une bande discrète.
  const faits = `${cert.lessonsCompleted} leçons validées   •   Examen final : ${cert.score}/${cert.total}   •   ${Math.round((cert.score / cert.total) * 100)} %`;
  page.drawRectangle({
    x: W / 2 - 230, y: H - 410, width: 460, height: 30,
    color: rgb(0.973, 0.957, 0.929),
  });
  center(page, faits, { y: H - 401, size: 11.5, font: sans, color: MUTED });

  // Pied : date à gauche, vérification à droite.
  const baseY = 132;
  page.drawText(ascii("Délivré le " + frenchDate(cert.issuedAt)), {
    x: 76, y: baseY, size: 11, font: sans, color: MUTED,
  });
  page.drawText(ascii("Alexandre Dos Reis Caetano"), {
    x: 76, y: baseY - 17, size: 11.5, font: serifBold, color: INK,
  });
  page.drawText(ascii("Fondateur — ClaudeAI Academy"), {
    x: 76, y: baseY - 31, size: 9.5, font: sans, color: MUTED,
  });

  const verifUrl = `${siteUrl.replace(/^https?:\/\//, "")}/certification/${cert.code}`;
  const codeWidth = sans.widthOfTextAtSize(ascii(cert.code), 13);
  page.drawText(ascii("Code de vérification"), {
    x: W - 76 - Math.max(codeWidth, sans.widthOfTextAtSize(ascii(verifUrl), 9)),
    y: baseY, size: 9, font: sans, color: MUTED,
  });
  const rightBlockWidth = Math.max(codeWidth, sans.widthOfTextAtSize(ascii(verifUrl), 9));
  page.drawText(ascii(cert.code), {
    x: W - 76 - rightBlockWidth, y: baseY - 20, size: 13, font: serifBold, color: INK,
  });
  page.drawText(ascii(verifUrl), {
    x: W - 76 - rightBlockWidth, y: baseY - 34, size: 9, font: sans, color: MUTED,
  });

  // La mention qui rend ce document honnête. Elle n'est pas négociable : sans
  // elle, le certificat laisse planer un doute sur une reconnaissance qui
  // n'existe pas, et c'est exactement ce qu'on reproche aux autres.
  const mention =
    "ClaudeAI Academy est un organisme de formation privé et indépendant. Ce certificat atteste de la réussite de son " +
    "programme ; il ne constitue pas un titre reconnu par l'État et n'est enregistré à aucun répertoire national.";
  const mention2 =
    "ClaudeAI Academy n'est ni affiliée à Anthropic, éditeur de Claude, ni approuvée par elle.";
  center(page, mention, { y: 60, size: 7.6, font: sans, color: MUTED });
  center(page, mention2, { y: 50, size: 7.6, font: sans, color: MUTED });

  return doc.save();
}
