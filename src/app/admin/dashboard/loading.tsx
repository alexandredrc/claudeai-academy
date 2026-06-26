export default function Loading() {
  return (
    <section className="min-h-screen bg-cream-soft">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
        <div className="h-4 w-32 animate-pulse rounded bg-cream-dark" />
        <div className="mt-6 h-10 w-[28rem] max-w-full animate-pulse rounded bg-cream-dark" />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[18px] bg-cream-dark/60" />
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[18px] bg-cream-dark/50" />
          ))}
        </div>
        <div className="mt-12 h-72 animate-pulse rounded-[18px] bg-cream-dark/40" />
      </div>
    </section>
  );
}
