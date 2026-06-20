import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

const variants: Record<Variant, string> = {
  primary: "border-line bg-panel text-text hover:border-line-strong hover:bg-panel-lift",
  secondary: "border-text bg-text text-page hover:bg-accent hover:border-accent",
  ghost: "border-transparent bg-transparent text-muted hover:bg-panel hover:text-text",
  danger: "border-line bg-transparent text-danger hover:border-danger",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "size-10 p-0",
};

export function buttonClassName({ variant = "secondary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 border font-medium outline-none transition focus-visible:border-accent disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ className, variant, size, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClassName({ variant, size, className })} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size }) {
  return <a className={buttonClassName({ variant, size, className })} {...props} />;
}
