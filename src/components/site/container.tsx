import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
  className?: string;
};

const sizes = {
  default: "max-w-[1200px]",
  narrow: "max-w-[860px]",
  wide: "max-w-[1320px]",
};

export function Container({ children, size = "default", className = "" }: ContainerProps) {
  return (
    <div className={`${sizes[size]} mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
