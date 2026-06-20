import type { Note } from "@/lib/data";
import { parseGitRepoNote } from "@/lib/note-types/git-repo/parse";
import { parsePlainNote } from "@/lib/note-types/plain/parse";
import type { NoteTypeParser, ParsedNoteType } from "@/lib/note-types/types";
import { parseWebpageNote } from "@/lib/note-types/webpage/parse";

const parsers: NoteTypeParser[] = [parseGitRepoNote, parseWebpageNote];

export function parseNoteType(note: Note): ParsedNoteType {
  for (const parser of parsers) {
    const parsed = parser(note);
    if (parsed) return parsed;
  }

  return parsePlainNote(note);
}

export function getNoteTypeTitle(note: Note, parsed = parseNoteType(note)) {
  if (parsed.kind === "plain") return note.note.split("\n")[0]?.slice(0, 84) || "Untitled note";
  return parsed.title;
}
