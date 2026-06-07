import { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  align?: "left" | "center";
  tone?: "coral" | "cream";
  className?: string;
};

export function Eyebrow({ children, align = "left", tone = "coral", className = "" }: EyebrowProps) {
  const alignClass = align === "center" ? "block text-center" : "inline-block";
  const toneClass = tone === "cream" ? "text-coral-soft" : "text-coral";
  return (
    <span
      className={`${alignClass} ${toneClass} text-[13px] font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      {children}
    </span>
  );
}
