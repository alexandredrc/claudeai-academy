export const INSTAGRAM_URL = "https://www.instagram.com/alex_crypto_ia/";
export const INSTAGRAM_HANDLE = "@alex_crypto_ia";

/**
 * Glyphe Instagram officiel (trait plein) avec le dégradé de marque —
 * même rendu que le badge du site ADRC Crypto.
 */
export function InstagramGlyphGradient({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="igBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FD5949" />
          <stop offset="50%" stopColor="#D6249F" />
          <stop offset="100%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <path
        fill="url(#igBrandGrad)"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 1.802c-3.15 0-3.505.011-4.746.068-2.425.111-3.557 1.26-3.667 3.667-.057 1.24-.067 1.593-.067 4.744 0 3.15.011 3.504.067 4.744.111 2.406 1.24 3.556 3.667 3.667 1.24.056 1.596.068 4.746.068 3.15 0 3.506-.012 4.746-.068 2.425-.111 3.556-1.26 3.667-3.667.056-1.24.067-1.594.067-4.744 0-3.15-.011-3.504-.067-4.744-.111-2.407-1.24-3.556-3.667-3.667-1.24-.057-1.596-.068-4.746-.068zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm5.338-9.87a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"
      />
    </svg>
  );
}

/**
 * Badge « @alex_crypto_ia — Une question ? Écris-moi en DM » du header.
 * Sur mobile, seul le glyphe est affiché.
 */
export function InstagramBadge() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram Alexandre — alex_crypto_ia, posez vos questions en DM"
      className="inline-flex items-center gap-2.5 rounded-full bg-ink pl-2.5 pr-2.5 sm:pr-4 py-2 shadow-[0_4px_18px_rgba(31,31,30,0.28)] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(31,31,30,0.38)] transition-all duration-200"
    >
      <InstagramGlyphGradient className="w-[22px] h-[22px] shrink-0" />
      <span className="hidden sm:flex flex-col leading-tight text-left">
        <span className="text-[13px] font-bold text-cream">{INSTAGRAM_HANDLE}</span>
        <span className="text-[11px] text-cream/75">Une question ? Écris-moi en DM</span>
      </span>
    </a>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
