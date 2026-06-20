"use client";

import { NoteDialog } from "@/components/note-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { topics, type NoteWithTopic } from "@/lib/data";
import { NoteTypeCard } from "@/lib/note-types/cards";
import { parseNoteType } from "@/lib/note-types/registry";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function NoteCard({ note, focused = false }: { note: NoteWithTopic; focused?: boolean }) {
  const parsed = parseNoteType(note);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focused]);

  return (
    <Card className={`group relative ${focused ? "border-accent" : ""}`} id={`note-${note.id}`} ref={ref}>
      <Button aria-label="Edit note" className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" onClick={() => setOpen(true)} size="icon" type="button" variant="ghost"><Pencil className="size-4" /></Button>
      <NoteTypeCard note={note} parsed={parsed} />
      <NoteDialog note={note} onOpenChange={setOpen} open={open} topics={topics} />
    </Card>
  );
}
