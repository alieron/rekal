import type { Note } from "@/lib/data";
import { normalizeUrl, type ParsedNoteType } from "@/lib/note-types/types";

export function parseGitRepoNote(note: Note): ParsedNoteType | null {
  const url = normalizeUrl(note.resource);
  if (!url || url.hostname !== "github.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  return {
    kind: "repo",
    label: "repo",
    title: `${parts[0]}/${parts[1]}`,
    url: url.toString(),
  };
}
