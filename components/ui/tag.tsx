import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Tag({ className, tone = "neutral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1 text-xs leading-none",
        tone === "accent" ? "border-accent-soft bg-accent-soft/60 text-accent" : "border-line bg-panel-soft text-muted",
        className,
      )}
      {...props}
    />
  );
}
