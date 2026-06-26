export default function Loading() {
  return (
    <section className="bg-cream-soft">
      <div className="mx-auto max-w-[860px] px-6 py-16 md:py-24">
        <div className="h-4 w-28 animate-pulse rounded bg-cream-dark" />
        <div className="mt-5 h-11 w-64 max-w-full animate-pulse rounded bg-cream-dark" />
        <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-cream-dark" />
        <div className="mt-10 h-28 animate-pulse rounded-[22px] bg-cream-dark/60" />
        <div className="mt-12 h-48 animate-pulse rounded-[22px] bg-cream-dark/50" />
      </div>
    </section>
  );
}
