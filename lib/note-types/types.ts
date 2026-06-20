import type { Note } from "@/lib/data";

export type ParsedNoteType =
  | { kind: "plain"; label: "note" }
  | { kind: "repo"; label: "repo"; title: string; url: string }
  | { kind: "webpage"; label: "link"; title: string; url: string };

export type NoteTypeParser = (note: Note) => ParsedNoteType | null;

export type NoteTypeCardProps<TParsed extends ParsedNoteType = ParsedNoteType> = {
  note: Note;
  parsed: TParsed;
};

export function normalizeUrl(value?: string | null) {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
