import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "The Kit: 15 Claude prompts, and what Claude Code changes in a workday",
  description:
    "15 Claude prompts sorted by job, the story of a restaurant director who works with Claude Code every day, and the line between a prompt and a real system.",
  robots: { index: false, follow: false },
};

type Prompt = { title: string; replaces: string; body: string };
type Group = { label: string; intro: string; prompts: Prompt[] };

/**
 * English version of /kit/ressources (rewritten in French on 6 October 2026).
 * Same 15 prompts, same structure. The sales block at the bottom is replaced
 * by one question: the paid course is in French, and this page exists to
 * find out whether anyone wants it in English.
 */
const GROUPS: Group[] = [
  {
    label: "For everyone",
    intro: "The three tasks everyone does, and almost nobody delegates well.",
    prompts: [
      {
        title: "The summary that keeps what matters",
        replaces: "Twenty minutes reading a document you did not want to read.",
        body: `You are my summary assistant. Here is a document: [paste the text].
Give me:
1. The 3 main ideas, one sentence each.
2. The concrete decisions or actions that follow from it.
3. One question this document leaves unanswered.
No paraphrasing, get to the point.`,
      },
      {
        title: "The difficult email, written for you",
        replaces: "The email you rewrite four times before sending.",
        body: `Help me write an email to [recipient and their role].
Context: [the delicate situation].
Goal: [what I want to get].
Tone: professional, direct, no aggression and no excessive apologies.
Give me 2 versions: one short, one more diplomatic.`,
      },
      {
        title: "The decision, stress-tested",
        replaces: "The sleepless night going round in circles between two options.",
        body: `I am torn between [option A] and [option B] for [context].
Play devil's advocate on both sides.
Give me: the hidden risks of each option, the one decisive question
I should ask myself, and your reasoned recommendation.`,
      },
    ],
  },
  {
    label: "Restaurants, shops, trades",
    intro:
      "What I use myself, in a restaurant. The numbers you paste are yours. Claude does the math and the layout, you keep the decision.",
    prompts: [
      {
        title: "The recipe card and food cost of a dish",
        replaces: "The spreadsheet you have not updated since the last supplier price increase.",
        body: `You are a head chef and a cost controller.
Here is the recipe for [number] portions: [ingredients with quantities].
Here are my purchase prices: [ingredient, price, unit, supplier].
Calculate: the food cost per portion, the food cost ratio at the
current selling price of [price], and the selling price that would
give a food cost of [target, e.g. 28%].
Flag the ingredient that weighs most in the cost and suggest a
substitution that does not change the dish.
Present everything as a table.`,
      },
      {
        title: "The menu built from what you have",
        replaces: "The Sunday evening spent composing the week's menu.",
        body: `You are a head chef. I need to compose [a seasonal menu /
a daily special / a group menu] for [context: season, number of covers,
budget per person, style of the house].
Here are my available products and the ones to use up: [list].
Propose [number] dishes with, for each: the name as it will appear on
the menu, a one-line description, the allergens to declare, and the
difficulty level in service.
Vary the techniques and avoid repeating a product.
I will check the allergens myself: flag the ones you are not sure about.`,
      },
      {
        title: "The reply to a review or a group request",
        replaces: "The Google review left unanswered for three weeks.",
        body: `You handle customer relations for [type of venue: name, style].
Here is [a customer review / a group booking request]: [paste].
Write a reply in this tone: [warm and precise / understated].
If it is a negative review: thank them, acknowledge the specific point
without justifying yourself, offer a concrete next step. Never a generic
formula. If it is a request: answer every question, ask the 2 questions
I am missing to make a quote, and propose a time slot. 120 words maximum.`,
      },
    ],
  },
  {
    label: "Freelancers and small businesses",
    intro: "The admin nobody bills for, and that eats half a day a month.",
    prompts: [
      {
        title: "The quote, and the reminder that does not sour things",
        replaces: "The quote done by hand, and the unpaid invoice you dare not chase.",
        body: `You are my admin assistant. My business: [trade].
My rates: [list]. My terms: [deposit, payment delay, tax].
Task 1: write a quote for [client] from this request: [paste].
Lay out the lines, the total, the terms.
Task 2: write 3 reminders for an invoice of [amount] that is [days] late:
polite, firm, final before formal notice.
Each under 80 words, in my tone: [direct / cordial].`,
      },
      {
        title: "The inbox sorted, the replies drafted",
        replaces: "The hour every morning lost reading email before starting work.",
        body: `Here are today's emails, separated by ---: [paste].
Sort them into 4 columns: reply today, reply this week, delegate or
forward, ignore.
For the first column, draft a 3 to 5 line reply in my tone:
[example of an email I wrote].
Flag any email that contains a commitment, a date or an amount,
quoting it.`,
      },
    ],
  },
  {
    label: "Job search, career change",
    intro: "If you are not working right now, this is when Claude pays you back the most.",
    prompts: [
      {
        title: "The targeted resume and the prepared interview",
        replaces: "The same resume sent everywhere, and the interview where the trick question catches you.",
        body: `You are a senior recruiter in [industry].
Here is the job posting: [paste]. Here is my current resume: [paste].
1. Rewrite my resume for this posting: same facts, nothing invented,
   but the vocabulary and order that answer the ad.
2. List what is missing in my profile and how to present it honestly.
3. Prepare the 8 most likely interview questions, each with a
   30-second answer built on my real background.`,
      },
    ],
  },
  {
    label: "Developers",
    intro: "The two tasks where Claude saves the most, because we always put them off.",
    prompts: [
      {
        title: "The bug, tracked methodically",
        replaces: "The two hours rerunning the same code while changing one line at random.",
        body: `I have this error: [full error message].
Here is the code involved: [paste].
Here is what I already tried: [your attempts].
Propose 3 hypotheses for the cause, ranked by probability,
and for each one how to verify it quickly.`,
      },
      {
        title: "The tests you never write",
        replaces: "The \"I'll test it later\" that ends up as a bug in production.",
        body: `Write a test suite for this function.
Cover: the nominal case, edge cases, invalid inputs, and one case a
developer would rarely think of. Framework: [e.g. Jest, pytest].
Function: [paste].`,
      },
    ],
  },
  {
    label: "Data, Excel, numbers",
    intro: "For people who live in a spreadsheet without being analysts, and for analysts.",
    prompts: [
      {
        title: "The Excel or Sheets table, untangled",
        replaces: "The formula copied from a forum that works without you knowing why.",
        body: `I have a table with these columns: [list].
I want [goal: pivot table, formula, cleanup...].
Give me the exact formula (Excel and Google Sheets),
and explain it so I can adapt it myself next time.`,
      },
      {
        title: "The analysis that finds the story in the numbers",
        replaces: "The monthly report that says \"revenue went up\" without saying why.",
        body: `Here is a dataset: [paste or describe].
Act as a senior analyst. Give me: the 3 notable trends, one anomaly
worth investigating, and the single most telling visualization to
produce (and why).
For every number you state, cite the row or column it comes from.`,
      },
    ],
  },
  {
    label: "Marketing, content",
    intro: "Claude writes correct and flat by default. The difference is in the brief.",
    prompts: [
      {
        title: "The content that does not smell like AI",
        replaces: "The generic LinkedIn post nobody reads to the end.",
        body: `Write [type of content] about [topic] for [precise audience].
Constraints: [adjective] tone, short sentences, concrete examples,
zero empty phrases ("in a world where", "it is important to note").
Here is a text I wrote, imitate its rhythm: [paste].
Give me 3 different angles before writing, I will choose.`,
      },
    ],
  },
  {
    label: "Managers, consultants",
    intro: "Before rolling AI out to a team, know where it actually pays off.",
    prompts: [
      {
        title: "The AI decision framework for your team",
        replaces: "The \"we should do something with AI\" meeting that goes nowhere.",
        body: `You are an AI transformation consultant. My team does [activity].
Identify the 5 tasks where generative AI would bring the most gain,
rank them by (impact x ease of implementation), and for the top one
give me a 2-week test plan, with what we measure.`,
      },
    ],
  },
];

const GROUP_OFFSETS = GROUPS.reduce<number[]>((acc, group, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + GROUPS[i - 1].prompts.length);
  return acc;
}, []);

const LINE: { task: string; prompt: string; claudeCode: string }[] = [
  {
    task: "Food cost",
    prompt: "You paste a recipe and a price list, you get a table.",
    claudeCode:
      "It reads your recipe cards and supplier invoices, recalculates every dish when a price changes, and tells you which ones drop below margin.",
  },
  {
    task: "Email",
    prompt: "You paste ten emails, it gives you ten drafts.",
    claudeCode:
      "Connected to your inbox, it sorts every morning, drafts replies in your tone, and lets nothing leave without your approval.",
  },
  {
    task: "The menu",
    prompt: "It suggests dishes from a list you type.",
    claudeCode:
      "It starts from your real stock, last week's sales and your target food cost, and outputs the menu ready to print, allergens included.",
  },
  {
    task: "A tool of your own",
    prompt: "It gives you code. You do not know what to do with it.",
    claudeCode: "It builds the app, runs it, fixes its own errors and puts it online. You describe, you check.",
  },
  {
    task: "A recurring task",
    prompt: "You redo it by hand, with the same prompt, every week.",
    claudeCode: "It becomes a command or a scheduled agent. You receive the result, you launch nothing.",
  },
];

export default function EnglishKitResourcesPage() {
  return (
    <article lang="en" className="pt-12 pb-24 md:pt-16 md:pb-32">
      <Container size="narrow">
        <Eyebrow>The Kit · 15 prompts</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-ink">
          15 prompts, and what Claude changes
          <br />
          in a real workday
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          This kit has two parts. First, what I do with Claude every day while
          running a restaurant. Then 15 prompts to copy, sorted by work
          situation, each with the task it replaces. At the end, the line
          between a prompt and a real system: that is where most people stop,
          and where it gets interesting.
        </p>

        <section className="mt-12 rounded-[18px] border border-line bg-cream-soft p-6 md:p-8">
          <p className="text-[13px] uppercase tracking-[0.08em] text-coral-dark mb-3">
            What I do with Claude Code, every day
          </p>
          <p className="font-serif text-2xl font-medium text-ink mb-4">
            I run a restaurant in Switzerland. I am not a developer.
          </p>
          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-soft">
            <p>
              Claude Code is Claude working directly in my files, instead of a
              chat where I paste bits of text. It reads my recipe cards, my
              supplier invoices, my till exports, and it acts on them. Here is
              what my week looks like with it.
            </p>
            <ul className="flex flex-col gap-3 list-none pl-0">
              {[
                ["The menu.", "I give it the season, the products to use up and the style of the house. It proposes the dishes, writes the names and descriptions, lists the allergens to declare. I check, I decide, and the formatted menu comes out right after."],
                ["Food cost.", "Every dish has its recipe card in a folder. When a supplier changes a price, Claude Code recalculates the food cost of every dish concerned and tells me which ones drop below my target margin. Before, it was a spreadsheet I updated when I had time, so rarely."],
                ["Pricing.", "From the food cost, the positioning and what comparable dishes sell for, it proposes a selling price and the resulting food cost. The decision stays mine, but I take it with the numbers in front of me, not by gut feel."],
                ["Menus.", "Daily specials, group menus, events: it starts from the existing cards, composes, formats, and I no longer open a layout program."],
                ["Email.", "Group requests, special bookings, suppliers, job applications: it sorts what comes in, drafts replies in my tone, flags anything with a date or an amount. I reread and send. Nothing leaves without me."],
              ].map(([k, v]) => (
                <li key={k} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[9px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                  <span>
                    <strong className="text-ink">{k}</strong> {v}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              This is not a demo. It is how I have worked for months, and it is
              what made me build a course: everything I just described can be
              learned, and learned fast when someone shows you the way. The 15
              prompts below are the first step. The line, at the bottom of the
              page, is the second.
            </p>
          </div>
        </section>

        <div className="mt-12 rounded-[18px] border border-line bg-white p-6 md:p-8">
          <p className="font-serif text-xl text-ink mb-3">The rule that changes everything</p>
          <p className="text-[15px] leading-relaxed text-ink-soft mb-4">
            Most people write to Claude like they type into a search bar. The
            pros give three things amateurs forget:
          </p>
          <ol className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-soft list-decimal pl-5">
            <li><strong className="text-ink">A role</strong>: &ldquo;You are a head chef and a cost controller&rdquo;, not &ldquo;explain to me&rdquo;.</li>
            <li><strong className="text-ink">Context</strong>: what you already know, your constraint, your real goal.</li>
            <li><strong className="text-ink">An output format</strong>: a table, numbered steps, 3 ranked options.</li>
          </ol>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            The 15 prompts below apply this rule. Copy, replace the{" "}
            <code className="font-mono text-[0.9em] text-coral-dark">[text in brackets]</code>, adapt.
            They are skeletons, not incantations.
          </p>
        </div>

        {GROUPS.map((group, gi) => (
          <section key={group.label} className="mt-14">
            <h2 className="font-serif text-2xl font-medium text-ink mb-2">{group.label}</h2>
            <p className="text-[15px] leading-relaxed text-muted mb-6">{group.intro}</p>
            <div className="flex flex-col gap-8">
              {group.prompts.map((prompt, pi) => {
                const num = GROUP_OFFSETS[gi] + pi + 1;
                return (
                  <div key={prompt.title}>
                    <p className="text-[15px] font-semibold text-ink mb-1">
                      <span className="text-coral-dark font-mono text-[13px] mr-2">{String(num).padStart(2, "0")}</span>
                      {prompt.title}
                    </p>
                    <p className="text-[14px] leading-relaxed text-muted mb-3">Replaces: {prompt.replaces}</p>
                    <pre className="overflow-x-auto rounded-[12px] border border-line bg-white p-4 font-mono text-[13.5px] leading-relaxed text-ink-soft whitespace-pre-wrap">
                      {prompt.body}
                    </pre>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-20">
          <Eyebrow>The line</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-[1.1] tracking-tight text-ink">
            What a prompt will never do
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
            A prompt is you pasting, launching, collecting, every time. It saves
            minutes. What saves hours is Claude working in your files, your tools
            and your calendar without you relaunching it. Same task, two worlds:
          </p>
          <div className="mt-8 overflow-hidden rounded-[18px] border border-line">
            <table className="w-full border-collapse text-[14.5px] leading-relaxed">
              <thead>
                <tr className="bg-cream-soft text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-ink w-[22%]">Task</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-ink w-[34%]">With a prompt in the chat</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-coral-dark">With Claude Code</th>
                </tr>
              </thead>
              <tbody>
                {LINE.map((r) => (
                  <tr key={r.task} className="border-t border-line align-top">
                    <td className="px-4 py-4 font-semibold text-ink">{r.task}</td>
                    <td className="px-4 py-4 text-muted">{r.prompt}</td>
                    <td className="px-4 py-4 text-ink-soft">{r.claudeCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            The right-hand column is not reserved for developers. Claude Code
            writes the code, runs it and fixes its own errors; you describe the
            result you want and you check. It is included in the Claude Pro
            subscription, there is no extra tool to buy. What it takes is the
            method: give it durable context, turn a recurring task into a
            procedure, connect your tools, keep control of what goes out.
          </p>
        </section>

        <section className="mt-16 rounded-[18px] border border-line bg-ink p-8 md:p-10 text-cream">
          <p className="text-[13px] uppercase tracking-[0.08em] text-coral mb-3">One honest question</p>
          <p className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-medium leading-[1.15] mb-4">
            The full course exists in French. Should it exist in English?
          </p>
          <p className="text-[15px] leading-relaxed text-cream/80 mb-5 max-w-[620px]">
            Nine tracks, 58 lessons, 170 prompts, an AI mentor that knows every
            lesson, a certification exam, all in French, all kept up to date
            against Anthropic&apos;s documentation. I am testing whether it is
            worth building the same thing in English before I do it. No
            waiting list, no pre-order: one email.
          </p>
          <p className="text-[15px] leading-relaxed text-cream/90 mb-7 max-w-[620px]">
            If you would want it, write to{" "}
            <a href="mailto:contact@claudeai-academy.com?subject=English%20course" className="underline decoration-coral underline-offset-4 text-cream">
              contact@claudeai-academy.com
            </a>{" "}
            with one line: what you would use it for. That answer decides it.
          </p>
          <p className="text-[13.5px] leading-relaxed text-cream/60">
            Content verified against Anthropic&apos;s official documentation on 9 October 2026.
          </p>
        </section>
      </Container>
    </article>
  );
}
