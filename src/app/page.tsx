export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-coral">
          Bientôt en ligne
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
          ClaudeAI Academy
        </h1>
        <p className="mt-6 text-lg text-muted">
          La formation francophone pour maîtriser Claude AI : prompt
          engineering, Claude Code, automatisation, IA pour le business.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 rounded-lg border border-line bg-cream-soft px-4 py-2 text-sm text-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green" />
          Site en construction
        </div>
      </div>
    </main>
  );
}
