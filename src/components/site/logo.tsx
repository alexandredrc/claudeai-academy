import Link from "next/link";

type LogoProps = {
  variant?: "default" | "light";
  href?: string;
  className?: string;
};

export function Logo({ variant = "default", href = "/", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-cream" : "text-ink";
  return (
    <Link
      href={href}
      aria-label="ClaudeAI Academy"
      className={`inline-flex items-center gap-2.5 ${textColor} ${className}`}
    >
      <span aria-hidden="true" className="inline-flex">
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="15" fill="#D97757" />
          <path
            d="M10 11c1.5-1 3-1.5 5-1.5s4 .5 5.5 2c-1 .5-2 1-3 1-1.5 0-2.5-.5-4-.5-1 0-1.8.3-2.5.8-.5-.5-.8-1.2-1-1.8zm12 9.5c-1.5 1-3 1.5-5 1.5s-4-.5-5.5-2c1-.5 2-1 3-1 1.5 0 2.5.5 4 .5 1 0 1.8-.3 2.5-.8.5.5.8 1.2 1 1.8z"
            fill="#1F1F1E"
          />
        </svg>
      </span>
      <span className="text-[17px] tracking-tight">
        <strong className="font-bold">ClaudeAI</strong> Academy
      </span>
    </Link>
  );
}
