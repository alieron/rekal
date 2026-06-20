"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Dropdown({ open, align = "right", children }: { open: boolean; align?: "left" | "right"; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className={cn("absolute top-11 z-40 w-56 border border-line bg-panel p-1 shadow-xl", align === "right" ? "right-0" : "left-0")}>
      {children}
    </div>
  );
}

export function DropdownItem({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-muted hover:bg-panel-lift hover:text-text" onClick={onClick} type="button">
      {children}
    </button>
  );
}
