import { getMetadataString, NoteTypeCardFrame } from "@/lib/note-types/card-frame";
import type { NoteTypeCardProps, ParsedNoteType } from "@/lib/note-types/types";

type GitRepoNote = Extract<ParsedNoteType, { kind: "repo" }>;

export function GitRepoNoteCard({ note, parsed }: NoteTypeCardProps<GitRepoNote>) {
  return (
    <NoteTypeCardFrame
      date={note.createdAt}
      externalTitle={parsed.title}
      externalUrl={parsed.url}
      icon="GitBranch"
      noteText={note.note}
      previewImage={getMetadataString(note.metadata, "imageUrl")}
      title={parsed.title}
      typeName={parsed.label}
    />
  );
}
