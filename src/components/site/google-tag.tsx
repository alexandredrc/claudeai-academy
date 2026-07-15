import Script from "next/script";

// Tag Google (Google Ads / gtag.js) — INACTIF tant que NEXT_PUBLIC_GADS_ID
// n'est pas défini (ex. "AW-123456789"). Consent Mode v2 : tout est "denied"
// par défaut, la bannière de consentement (consent-banner.tsx) fait l'update.
// Les conversions restent mesurables en agrégé via les pings sans cookie.
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export function GoogleTag() {
  if (!GADS_ID) return null;
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
gtag('config', '${GADS_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
