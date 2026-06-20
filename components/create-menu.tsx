"use client";

import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { NoteDialog } from "@/components/note-dialog";
import { TopicDialog } from "@/components/topic-dialog";
import type { Topic } from "@/lib/data";
import { FilePlus2, Layers3, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CreateMenu({ topics, defaultTopicId, topicOnly = false }: { topics: Topic[]; defaultTopicId?: string; topicOnly?: boolean; compact?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [menuOpen]);

  if (topicOnly) {
    return (
      <>
        <Button aria-label="Add note" onClick={() => setNoteOpen(true)} size="icon" type="button" variant="primary">
          <Plus className="size-4" />
        </Button>
        <NoteDialog defaultTopicId={defaultTopicId} onOpenChange={setNoteOpen} open={noteOpen} topics={topics} />
      </>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <Button onClick={() => setMenuOpen((value) => !value)} size="icon" type="button" variant="primary">
        <Plus className="size-4" />
      </Button>
      <Dropdown open={menuOpen}>
        <DropdownItem onClick={() => { setNoteOpen(true); setMenuOpen(false); }}><FilePlus2 className="size-4" /> New note</DropdownItem>
        <DropdownItem onClick={() => { setTopicOpen(true); setMenuOpen(false); }}><Layers3 className="size-4" /> New topic</DropdownItem>
      </Dropdown>
      <NoteDialog defaultTopicId={defaultTopicId} onOpenChange={setNoteOpen} open={noteOpen} topics={topics} />
      <TopicDialog onOpenChange={setTopicOpen} open={topicOpen} />
    </div>
  );
}
