import Script from "next/script";

// Tag Google (gtag.js) partagé entre Google Ads et GA4 — INACTIF tant
// qu'aucun des deux IDs n'est défini :
//   - NEXT_PUBLIC_GADS_ID  (ex. "AW-123456789")  → conversions Google Ads
//   - NEXT_PUBLIC_GA4_ID   (ex. "G-XXXXXXXXXX")  → mesure d'audience GA4
// Consent Mode v2 : tout est "denied" par défaut, la bannière de consentement
// (consent-banner.tsx) fait l'update. En cas de refus, Ads et GA4 restent
// mesurables en agrégé via les pings sans cookie (données modélisées).
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const GOOGLE_TAG_ENABLED = Boolean(GADS_ID || GA4_ID);

export function GoogleTag() {
  if (!GOOGLE_TAG_ENABLED) return null;
  const configs = [GADS_ID, GA4_ID]
    .filter(Boolean)
    .map((id) => `gtag('config', '${id}');`)
    .join("\n");
  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
${configs}`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID ?? GA4_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
