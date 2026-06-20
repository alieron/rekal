"use client";

import { NoteDialog } from "@/components/note-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { shortDate, topics, type NoteWithTopic } from "@/lib/data";
import { parseNoteResource } from "@/lib/note-resource";
import { ExternalLink, FileText, GitBranch, LinkIcon, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function NoteCard({ note, focused = false }: { note: NoteWithTopic; focused?: boolean }) {
  const parsed = parseNoteResource(note);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = parsed.kind === "repo" ? GitBranch : parsed.kind === "webpage" ? LinkIcon : FileText;

  useEffect(() => {
    if (focused) ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focused]);

  return (
    <Card className={focused ? "border-accent" : ""} id={`note-${note.id}`} ref={ref}>
      {parsed.kind === "webpage" && parsed.description ? (
        <div className="hidden border-b border-line bg-panel-soft p-4 text-xs text-muted sm:block">{parsed.description}</div>
      ) : null}
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2 text-xs text-faint"><Icon className="size-3.5" /> {parsed.label}<span className="ml-auto sm:hidden">{shortDate(note.createdAt)}</span></div>
            <h2 className="line-clamp-2 text-base font-semibold text-text">{parsed.title}</h2>
          </div>
          <Button aria-label="Edit note" onClick={() => setOpen(true)} size="icon" type="button" variant="ghost"><Pencil className="size-4" /></Button>
        </div>
        <p className="line-clamp-5 text-sm leading-6 text-muted">{note.note}</p>
        <div className="flex items-center justify-between gap-3">
          <Tag>{shortDate(note.createdAt)}</Tag>
          {parsed.kind !== "plain" ? (
            <a className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent" href={parsed.url} rel="noreferrer" target="_blank">Open <ExternalLink className="size-3" /></a>
          ) : null}
        </div>
      </div>
      <NoteDialog note={note} onOpenChange={setOpen} open={open} topics={topics} />
    </Card>
  );
}
