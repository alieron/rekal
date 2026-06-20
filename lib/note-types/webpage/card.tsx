import { getMetadataString, NoteTypeCardFrame } from "@/lib/note-types/card-frame";
import type { NoteTypeCardProps, ParsedNoteType } from "@/lib/note-types/types";

type WebpageNote = Extract<ParsedNoteType, { kind: "webpage" }>;

export function WebpageNoteCard({ note, parsed }: NoteTypeCardProps<WebpageNote>) {
  return (
    <NoteTypeCardFrame
      date={note.createdAt}
      externalTitle={parsed.title}
      externalUrl={parsed.url}
      icon="LinkIcon"
      noteText={note.note}
      previewImage={getMetadataString(note.metadata, "imageUrl")}
      title={parsed.title}
      typeName={parsed.label}
    />
  );
}
