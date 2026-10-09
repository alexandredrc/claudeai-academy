import { SITE_URL } from "@/lib/email/send";

/**
 * English delivery email for the free kit (smoke test, October 2026).
 *
 * Why a separate file: the French sequence (lead-magnet.ts) carries thirteen
 * emails, pricing in euros and a sales path that does not exist in English.
 * An English lead gets exactly one email, this one, and the nurture cron
 * skips every lead whose source starts with "en-". The one question at the
 * end ("what would you want it for?") is the demand signal the test is for.
 *
 * Same rules as the French emails: no claim without a source, no revenue
 * promise, plain HTML that renders everywhere.
 */

const KIT_URL = `${SITE_URL}/en/kit/resources?src=email-en-kit`;

function shell(inner: string, unsubscribe: string | null): string {
  const out = unsubscribe
    ? `To stop receiving emails: <a href="${unsubscribe}" style="color:#8A857B;">unsubscribe in one click</a>.`
    : "To stop receiving emails, reply with the single word STOP.";
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      ${inner}
      <hr style="border:none;border-top:1px solid #E2DCD0;margin:28px 0 20px;" />
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0 0 4px;">You are receiving this because you requested the ClaudeAI Academy kit. ${out}</p>
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0;">Questions? <a href="mailto:contact@claudeai-academy.com" style="color:#8A857B;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function p(text: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function cta(label: string, href: string): string {
  return `<p style="margin:8px 0 24px;"><a href="${href}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${label}</a></p>`;
}

/** Capitalise an all-lowercase first name ("camille" becomes "Camille"), leave anything else alone. */
function tidyName(name: string): string {
  const n = name.trim();
  if (n !== n.toLowerCase()) return n;
  return n.replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, l: string) => sep + l.toUpperCase());
}

function greeting(firstName: string | null): string {
  return firstName?.trim() ? `Hi ${tidyName(firstName)},` : "Hi,";
}

function toText(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function renderLeadMagnetEn(
  firstName: string | null,
  unsubscribe: string | null,
): { subject: string; html: string; text: string } {
  const blocks = [
    p(greeting(firstName)),
    p("Here is your access. The kit is on this page, ready to copy:"),
    cta("Open the kit (15 prompts)", KIT_URL),
    p("It has three parts. First, what I do with Claude Code every day while running a restaurant: the menu, food cost, pricing, group menus, email. Then the 15 prompts, sorted by work situation (restaurants and shops, freelancers, job search, developers, data, marketing, management), each with the task it replaces. Last, the line between a prompt and a real system, the line most people never cross."),
    p("One piece of advice so it actually helps: pick <strong>one</strong> prompt today, the one that matches a task you will do this week. Use it, keep the result."),
    p("One honest note. The full course behind this kit (9 tracks, 58 lessons, 170 prompts, an AI mentor) exists in French today. I am testing whether it is worth building in English. If you would want it, reply to this email with one line: what you would use it for. That answer decides it."),
    p("Talk soon,<br />Alexandre, founder of ClaudeAI Academy"),
  ];
  const inner = blocks.join("");
  return {
    subject: "Your kit: 15 Claude prompts ready to use",
    html: shell(inner, unsubscribe),
    text: toText(inner) + "\n\n" + toText(unsubscribe ? `To stop receiving emails: ${unsubscribe}` : "To stop receiving emails, reply STOP."),
  };
}
