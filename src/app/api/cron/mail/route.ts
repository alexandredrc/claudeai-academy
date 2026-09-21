import { NextResponse, type NextRequest } from "next/server";
import { ImapFlow } from "imapflow";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifierMail } from "@/lib/notify/telegram";

export const dynamic = "force-dynamic";
// Une connexion IMAP + quelques en-têtes : large, mais on ne veut pas qu'une
// boîte lente fasse échouer le relevé.
export const maxDuration = 60;

/**
 * Relève la boîte support et prévient sur Telegram.
 *
 * Pourquoi un relevé et pas une notification poussée : la boîte est chez OVH,
 * qui ne propose pas de webhook entrant. On se connecte donc en IMAP, on lit
 * les EN-TÊTES des nouveaux messages (jamais le corps — on n'a pas besoin de
 * lire le courrier pour signaler qu'il est arrivé), et on prévient.
 *
 * Mémoire : le dernier UID traité, dans `app_state`. Sans ça, chaque passage
 * renotifierait les mêmes messages non lus. On ne touche PAS au drapeau « lu »
 * du serveur : ce serait voler au destinataire son seul repère visuel.
 *
 * Silencieux si `MAIL_IMAP_PASSWORD` n'est pas défini — la tâche peut être
 * déployée avant que le mot de passe ne soit renseigné.
 */

const CLE_ETAT = "mail_support_dernier_uid";

const HOTE = process.env.MAIL_IMAP_HOST ?? "ssl0.ovh.net";
const UTILISATEUR =
  process.env.MAIL_IMAP_USER ?? "contact@claudeai-academy.com";

/** Au premier passage, on ne réveille personne avec l'historique. */
const MAX_PREMIER_PASSAGE = 0;

/** Plafond par passage : un afflux ne doit pas vider la batterie du téléphone. */
const MAX_PAR_PASSAGE = 5;

async function lireDernierUid(): Promise<number | null> {
  const { data } = await supabaseAdmin
    .from("app_state")
    .select("valeur")
    .eq("cle", CLE_ETAT)
    .maybeSingle();
  const n = data?.valeur ? Number.parseInt(data.valeur, 10) : NaN;
  return Number.isFinite(n) ? n : null;
}

async function ecrireDernierUid(uid: number): Promise<void> {
  await supabaseAdmin
    .from("app_state")
    .upsert(
      { cle: CLE_ETAT, valeur: String(uid), updated_at: new Date().toISOString() },
      { onConflict: "cle" },
    );
}

/** « Alexandre <a@b.c> » → « Alexandre » ; sinon l'adresse. */
function expediteurLisible(
  from: { name?: string; address?: string } | undefined,
): string {
  const nom = from?.name?.trim();
  if (nom) return nom;
  return from?.address?.trim() || "expéditeur inconnu";
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron-mail] CRON_SECRET non défini — refus (fail closed).");
    return new NextResponse("Cron secret not configured", { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const motDePasse = process.env.MAIL_IMAP_PASSWORD;
  if (!motDePasse) {
    return NextResponse.json({
      ok: true,
      ignore: "MAIL_IMAP_PASSWORD non défini — relevé désactivé.",
    });
  }

  const client = new ImapFlow({
    host: HOTE,
    port: 993,
    secure: true,
    auth: { user: UTILISATEUR, pass: motDePasse },
    // La bibliothèque est très bavarde par défaut ; on ne garde que les erreurs.
    logger: false,
  });

  let notifies = 0;
  let plusHautUid: number | null = null;

  try {
    await client.connect();
    // Verrou en lecture seule : aucun risque de modifier un drapeau par accident.
    const lock = await client.getMailboxLock("INBOX", { readOnly: true });
    try {
      const dernierUid = await lireDernierUid();

      // Premier passage : on se cale sur l'état actuel sans rien notifier.
      if (dernierUid === null) {
        let max = 0;
        for await (const msg of client.fetch("1:*", { uid: true })) {
          if (msg.uid > max) max = msg.uid;
        }
        await ecrireDernierUid(max);
        return NextResponse.json({
          ok: true,
          initialisation: true,
          dernierUid: max,
          notifies: MAX_PREMIER_PASSAGE,
        });
      }

      const nouveaux: { uid: number; de: string; objet: string }[] = [];
      for await (const msg of client.fetch(
        { uid: `${dernierUid + 1}:*` },
        { uid: true, envelope: true },
      )) {
        // IMAP renvoie parfois le dernier message connu quand la plage est
        // vide : on refiltre côté serveur plutôt que de faire confiance.
        if (msg.uid <= dernierUid) continue;
        plusHautUid = Math.max(plusHautUid ?? 0, msg.uid);
        nouveaux.push({
          uid: msg.uid,
          de: expediteurLisible(msg.envelope?.from?.[0]),
          objet: msg.envelope?.subject ?? "",
        });
      }

      for (const m of nouveaux.slice(0, MAX_PAR_PASSAGE)) {
        if (await notifierMail({ de: m.de, objet: m.objet })) notifies += 1;
      }

      // On avance le curseur même au-delà du plafond de notifications :
      // sinon le surplus serait renotifié en boucle au passage suivant.
      if (plusHautUid !== null) await ecrireDernierUid(plusHautUid);

      return NextResponse.json({
        ok: true,
        nouveaux: nouveaux.length,
        notifies,
        dernierUid: plusHautUid ?? dernierUid,
      });
    } finally {
      lock.release();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron-mail] relevé impossible:", message);
    return NextResponse.json({ ok: false, erreur: message }, { status: 500 });
  } finally {
    try {
      await client.logout();
    } catch {
      /* déjà fermé */
    }
  }
}
