import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupAction } from "./actions";

type SearchParams = Promise<{ plan?: string; error?: string; sent?: string }>;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { plan, error, sent } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/account");

  const planLabel =
    plan === "starter"
      ? "Pass Starter — 47 €"
      : plan === "mastery"
        ? "Pass Mastery — 497 €"
        : null;

  if (sent === "1") {
    return (
      <AuthShell title="Vérifie ta boîte mail">
        <p className="text-[15px] leading-[1.7] text-ink-soft">
          On vient de t&apos;envoyer un email de confirmation. Clique sur le
          lien pour activer ton compte, puis reviens te connecter.
        </p>
        <p className="mt-6 text-[13px] text-muted">
          Pas reçu ? Vérifie tes spams. L&apos;email peut prendre 1 à 2 minutes
          à arriver.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="text-sm font-semibold text-coral hover:text-coral-dark"
          >
            Aller à la connexion →
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={
        <>
          Créer un{" "}
          <span className="font-serif font-medium italic text-coral">
            compte
          </span>
        </>
      }
      subtitle="Pour accéder à tes parcours et suivre ta progression. Pas de spam, jamais."
    >
      {planLabel && (
        <div className="mb-6 rounded-[14px] border border-coral-soft bg-coral-soft/30 px-4 py-3 text-[14px] text-ink-soft">
          Tu es sur le point d&apos;acheter le{" "}
          <strong className="font-semibold text-ink">{planLabel}</strong>.
          Crée d&apos;abord ton compte, on enchaîne sur le paiement.
        </div>
      )}

      {error && <FormError message={decodeURIComponent(error)} />}

      <form action={signupAction} className="space-y-5">
        {plan && <input type="hidden" name="plan" value={plan} />}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Prénom"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
          <Field
            label="Nom"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
        </div>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="Au moins 8 caractères."
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-[14px] bg-coral px-6 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
        >
          Créer mon compte
        </button>

        <p className="text-center text-[13px] text-muted">
          En créant un compte, tu acceptes nos{" "}
          <Link href="/cgv" className="underline hover:text-ink">
            CGV
          </Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" className="underline hover:text-ink">
            politique de confidentialité
          </Link>
          .
        </p>
      </form>

      <p className="mt-8 text-center text-[14px] text-ink-soft">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-semibold text-coral hover:text-coral-dark"
        >
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}

/* =========================================
   Composants partagés auth — locaux à signup pour l'instant
   (extraction quand on aura login + reset + etc.)
   ========================================= */

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[480px] flex-col justify-center px-6 py-16">
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
        <div className="mt-10 rounded-[22px] border border-line bg-white p-8 shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]">
          {children}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  minLength,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="w-full rounded-[10px] border border-line bg-cream-soft px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-coral focus:bg-white focus:ring-2 focus:ring-coral/20"
      />
      {hint && (
        <span className="mt-1.5 block text-[12px] text-muted">{hint}</span>
      )}
    </label>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-6 rounded-[14px] border border-coral-dark/30 bg-coral-soft/40 px-4 py-3 text-[14px] text-ink"
    >
      {message}
    </div>
  );
}
