/** Origine fictive : sert seulement à vérifier qu'un chemin reste chez nous. */
const ORIGINE_INTERNE = "https://interne.invalid";

/**
 * N'accepte qu'un chemin interne : garde anti-open-redirect.
 *
 * Audit du 16/10/2026 : l'ancienne version (« commence par / mais pas par // »)
 * laissait passer `/\evil.com`, que les navigateurs lisent comme `//evil.com`,
 * donc un lien `/login?next=/\evil.com` renvoyait vers un site tiers après une
 * vraie connexion. On refuse désormais l'antislash et les caractères de
 * contrôle, puis on vérifie l'origine une fois l'URL résolue.
 */
export function safeNext(raw: string | null | undefined, fallback = "/courses"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(raw)) return fallback;
  let url: URL;
  try {
    url = new URL(raw, ORIGINE_INTERNE);
  } catch {
    return fallback;
  }
  if (url.origin !== ORIGINE_INTERNE) return fallback;
  return `${url.pathname}${url.search}${url.hash}`;
}
