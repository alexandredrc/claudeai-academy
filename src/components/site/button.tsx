import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "ghost-light" | "link";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-coral text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] hover:bg-coral-dark hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(217,119,87,0.35)]",
  ghost:
    "bg-transparent text-ink border-[1.5px] border-ink hover:bg-ink hover:text-cream",
  "ghost-light":
    "bg-transparent text-cream border-[1.5px] border-cream/50 hover:bg-cream/10 hover:border-cream",
  link:
    "bg-transparent text-coral hover:text-coral-dark p-0 shadow-none",
};

const sizeClasses: Record<Size, string> = {
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  external?: boolean;
};

type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", size = "md", children, className = "" } = props;
  const linkVariantOverride = variant === "link" ? "" : sizeClasses[size];
  const finalClass = `${variant === "link" ? "" : baseClasses} ${variantClasses[variant]} ${linkVariantOverride} ${className}`.trim();

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} className={finalClass} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={finalClass}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, children: _c, className: _cn, ...rest } = props as NativeButtonProps;
  return (
    <button className={finalClass} {...rest}>
      {children}
    </button>
  );
}
