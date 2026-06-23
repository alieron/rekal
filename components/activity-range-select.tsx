"use client";

import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ActivityRangeSelect({ ranges, selectedValue }: { ranges: Array<{ label: string; value: string }>; selectedValue: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const selectedRange = ranges.find((range) => range.value == selectedValue) ?? ranges[0];

  function selectRange(value: string) {
    setOpen(false);
    router.replace(`/?range=${value}`);
  }

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 border border-line bg-page px-2 py-1.5 text-sm text-muted outline-none transition hover:border-line-strong hover:text-text focus:border-accent focus:text-text"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {selectedRange.label}
        <ChevronDown className= "size-4"/>
      </button>
      <Dropdown open={open}>
        {ranges.map((option) => (
          <DropdownItem key={option.value} onClick={() => selectRange(option.value)}>
            <span className={option.value == selectedValue ? "text-text" : undefined}>{option.label}</span>
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}
