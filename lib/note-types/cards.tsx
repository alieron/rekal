import { GitRepoNoteCard } from "@/lib/note-types/git-repo/card";
import { PlainNoteCard } from "@/lib/note-types/plain/card";
import type { NoteTypeCardProps, ParsedNoteType } from "@/lib/note-types/types";
import { WebpageNoteCard } from "@/lib/note-types/webpage/card";

export function NoteTypeCard({ note, parsed }: NoteTypeCardProps) {
  if (parsed.kind === "repo") return <GitRepoNoteCard note={note} parsed={parsed} />;
  if (parsed.kind === "webpage") return <WebpageNoteCard note={note} parsed={parsed} />;
  return <PlainNoteCard note={note} parsed={parsed as Extract<ParsedNoteType, { kind: "plain" }>} />;
}
