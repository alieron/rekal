import type { Note } from "@/lib/data";
import type { ParsedNoteType } from "@/lib/note-types/types";

export function parsePlainNote(_note: Note): ParsedNoteType {
  return { kind: "plain", label: "note" };
}
