"use client";

import { cn } from "@/lib/cn";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function Tooltip({ children, content, className }: { children: ReactNode; content: ReactNode; className?: string }) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  return (
    <span
      className={cn("inline-flex", className)}
      onMouseEnter={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({ x: rect.left + rect.width / 2, y: rect.top });
      }}
      onMouseLeave={() => setPosition(null)}
    >
      {children}
      {position
        ? createPortal(
            <span className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full whitespace-nowrap border border-line bg-panel px-2 py-1 text-xs text-text shadow-xl" style={{ left: position.x, top: position.y - 8 }}>
              {content}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
