"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export function Dialog({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto border border-line bg-page shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line p-4">
          <div>
            <h2 className="text-base font-semibold text-text">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          <Button aria-label="Close dialog" onClick={() => onOpenChange(false)} size="icon" type="button" variant="ghost">
            <X className="size-4" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={cn("block space-y-2 text-sm font-medium text-text", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClassName = "w-full border border-line bg-panel px-3 py-2.5 text-sm text-text outline-none placeholder:text-faint focus:border-line-strong";
