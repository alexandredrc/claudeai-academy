/**
 * Blocs pédagogiques des leçons.
 *
 * Le contenu des leçons reste du Markdown stocké en base (`lessons.content_md`).
 * Pour sortir du « mur de texte » sans changer de format de stockage, on y
 * autorise des blocs typés à la syntaxe directive :
 *
 *     :::piege Le titre optionnel
 *     Du **markdown** normal ici.
 *     :::
 *
 * Le parseur découpe le document en segments (markdown brut / bloc riche) que
 * `RichLesson` transforme en composants. Un bloc inconnu ou mal fermé retombe
 * en markdown : on ne casse jamais l'affichage d'une leçon.
 */

export type LessonSegment =
  | { kind: "md"; content: string }
  | { kind: "block"; type: BlockType; title: string | null; body: string };

export const BLOCK_TYPES = [
  "objectifs", // ce que la leçon fait savoir faire
  "flash", // résumé « en 30 secondes »
  "cle", // à retenir
  "piege", // erreur classique
  "astuce", // astuce de praticien
  "prompt", // prompt prêt à copier
  "avant-apres", // comparaison ratée / réussie
  "etapes", // procédure numérotée
  "defi", // exercice avec critères cochables
  "memo", // cartes de révision recto/verso
  "maj", // nouveauté datée
  "chiffres", // 2 à 4 statistiques marquantes
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

const TYPES = new Set<string>(BLOCK_TYPES);

/** Séparateur interne des blocs à plusieurs volets (avant-apres, memo, chiffres). */
export const PART_SEPARATOR = "===";

const OPEN_RE = /^:::[ \t]*([a-z][a-z-]*)[ \t]*(.*)$/;
const CLOSE_RE = /^:::[ \t]*$/;
const CODE_FENCE_RE = /^(```|~~~)/;

/**
 * Découpe un contenu Markdown en segments.
 * Les fences de code (``` … ```) sont traversées telles quelles : un `:::`
 * à l'intérieur d'un exemple de code n'ouvre pas de bloc.
 */
export function parseLessonContent(md: string): LessonSegment[] {
  const lines = md.split("\n");
  const segments: LessonSegment[] = [];
  let buffer: string[] = [];
  let inCodeFence = false;

  function flushMarkdown() {
    const content = buffer.join("\n");
    if (content.trim().length > 0) segments.push({ kind: "md", content });
    buffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (CODE_FENCE_RE.test(line)) {
      inCodeFence = !inCodeFence;
      buffer.push(line);
      continue;
    }

    const open = !inCodeFence ? OPEN_RE.exec(line) : null;
    if (!open || !TYPES.has(open[1])) {
      buffer.push(line);
      continue;
    }

    // Cherche la fermeture. Sans fermeture, on considère que ce n'était pas
    // un bloc : la ligne repart en markdown brut.
    let end = -1;
    let nestedFence = false;
    for (let j = i + 1; j < lines.length; j++) {
      if (CODE_FENCE_RE.test(lines[j])) nestedFence = !nestedFence;
      else if (!nestedFence && CLOSE_RE.test(lines[j])) {
        end = j;
        break;
      }
    }
    if (end === -1) {
      buffer.push(line);
      continue;
    }

    flushMarkdown();
    segments.push({
      kind: "block",
      type: open[1] as BlockType,
      title: open[2].trim() || null,
      body: lines.slice(i + 1, end).join("\n").trim(),
    });
    i = end;
  }

  flushMarkdown();
  return segments;
}

/** Coupe le corps d'un bloc sur ses séparateurs `===`. */
export function splitParts(body: string): string[] {
  return body
    .split(new RegExp(`^${PART_SEPARATOR}\\s*$`, "m"))
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Extrait les puces d'une liste (`- item` ou `1. item`), en repliant les
 * lignes de continuation indentées sur l'item courant.
 */
export function parseListItems(body: string): string[] {
  const items: string[] = [];
  for (const line of body.split("\n")) {
    const bullet = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (bullet) {
      items.push(bullet[1].trim());
    } else if (items.length > 0 && line.trim().length > 0) {
      items[items.length - 1] += " " + line.trim();
    }
  }
  return items.length > 0 ? items : body.split("\n").filter((l) => l.trim());
}

/** Cartes de révision : `Q:` / `R:` séparés par `===`. */
export function parseFlashcards(body: string): { q: string; a: string }[] {
  return splitParts(body)
    .map((part) => {
      const q = /^\s*Q\s*:\s*([\s\S]*?)(?=\n\s*R\s*:|$)/i.exec(part);
      const a = /\n\s*R\s*:\s*([\s\S]*)$/i.exec(part);
      if (!q || !a) return null;
      return { q: q[1].trim(), a: a[1].trim() };
    })
    .filter((c): c is { q: string; a: string } => c !== null);
}

/** Statistiques : `valeur | libellé`, une par ligne. */
export function parseStats(body: string): { value: string; label: string }[] {
  return body
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("|");
      if (idx === -1) return null;
      const value = line.slice(0, idx).trim().replace(/^[-*+]\s*/, "");
      const label = line.slice(idx + 1).trim();
      if (!value || !label) return null;
      return { value, label };
    })
    .filter((s): s is { value: string; label: string } => s !== null);
}

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

/** Identifiant d'ancre stable pour un titre de leçon (accents retirés). */
export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Titres de niveau 2 du document, pour le sommaire.
 * Ignore les fences de code et le corps des blocs riches.
 */
export function extractHeadings(md: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  const seen = new Map<string, number>();

  for (const segment of parseLessonContent(md)) {
    if (segment.kind !== "md") continue;
    let inCodeFence = false;
    for (const line of segment.content.split("\n")) {
      if (CODE_FENCE_RE.test(line)) {
        inCodeFence = !inCodeFence;
        continue;
      }
      if (inCodeFence) continue;
      const h2 = /^##\s+(.+?)\s*#*\s*$/.exec(line);
      if (!h2) continue;
      const text = h2[1].replace(/[*_`]/g, "").trim();
      const base = slugifyHeading(text);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      out.push({ id: count === 0 ? base : `${base}-${count}`, text });
    }
  }
  return out;
}
