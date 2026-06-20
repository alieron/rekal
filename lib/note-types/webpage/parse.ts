import type { Note } from "@/lib/data";
import { normalizeUrl, type ParsedNoteType } from "@/lib/note-types/types";

export function parseWebpageNote(note: Note): ParsedNoteType | null {
  const url = normalizeUrl(note.resource);
  if (!url) return null;

  return {
    kind: "webpage",
    label: "link",
    title: note.resourceTitle || url.hostname.replace(/^www\./, ""),
    url: url.toString(),
  };
}
