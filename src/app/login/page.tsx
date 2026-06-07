import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginAction } from "./actions";

type SearchParams = Promise<{ error?: string; next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, next } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next || "/account");

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[480px] flex-col justify-center px-6 py-16">
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Bon{" "}
          <span className="font-serif font-medium italic text-coral">
            retour
          </span>
          .
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Connecte-toi pour accéder à tes parcours et reprendre où tu en étais.
        </p>

        <div className="mt-10 rounded-[22px] border border-line bg-white p-8 shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]">
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-[14px] border border-coral-dark/30 bg-coral-soft/40 px-4 py-3 text-[14px] text-ink"
            >
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={loginAction} className="space-y-5">
            {next && <input type="hidden" name="next" value={next} />}
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-[10px] border border-line bg-cream-soft px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-coral focus:bg-white focus:ring-2 focus:ring-coral/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
                Mot de passe
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-[10px] border border-line bg-cream-soft px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-coral focus:bg-white focus:ring-2 focus:ring-coral/20"
              />
            </label>

            <button
              type="submit"
              className="mt-4 w-full rounded-[14px] bg-coral px-6 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
            >
              Se connecter
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[14px] text-ink-soft">
          Pas encore de compte ?{" "}
          <Link
            href="/signup"
            className="font-semibold text-coral hover:text-coral-dark"
          >
            En créer un
          </Link>
        </p>
      </div>
    </section>
  );
}
