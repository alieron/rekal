import { getMetadataString, NoteTypeCardFrame } from "@/lib/note-types/card-frame";
import type { NoteTypeCardProps, ParsedNoteType } from "@/lib/note-types/types";

type PlainNote = Extract<ParsedNoteType, { kind: "plain" }>;

export function PlainNoteCard({ note, parsed }: NoteTypeCardProps<PlainNote>) {
  return (
    <NoteTypeCardFrame date={note.createdAt} icon="FileText" noteText={note.note} previewImage={getMetadataString(note.metadata, "imageUrl")} typeName={parsed.label} />
  );
}
