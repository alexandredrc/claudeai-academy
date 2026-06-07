import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  bg?: "cream" | "cream-soft" | "white" | "ink";
  padding?: "default" | "tight" | "loose";
  id?: string;
  className?: string;
};

const bgClasses = {
  cream: "bg-cream",
  "cream-soft": "bg-cream-soft",
  white: "bg-white",
  ink: "bg-ink text-cream",
};

const paddingClasses = {
  default: "py-20 md:py-28",
  tight: "py-14 md:py-20",
  loose: "py-24 md:py-32",
};

export function Section({
  children,
  bg = "cream",
  padding = "default",
  id,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${bgClasses[bg]} ${paddingClasses[padding]} relative ${className}`}
    >
      {children}
    </section>
  );
}
