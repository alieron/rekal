import type { Note } from "@/lib/data";

export type ParsedNoteResource =
  | { kind: "plain"; title: string; label: "note" }
  | { kind: "repo"; title: string; label: "repo"; url: string; description?: string }
  | { kind: "webpage"; title: string; label: "link"; url: string; description?: string };

type ResourceParser = (note: Note) => ParsedNoteResource | null;

const parsers: ResourceParser[] = [parseGitRepo, parseWebpage];

export function parseNoteResource(note: Note): ParsedNoteResource {
  for (const parser of parsers) {
    const result = parser(note);
    if (result) return result;
  }

  return { kind: "plain", label: "note", title: firstLine(note.note) };
}

function parseGitRepo(note: Note): ParsedNoteResource | null {
  const url = normalizeUrl(note.resource);
  if (!url || url.hostname !== "github.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  return {
    kind: "repo",
    label: "repo",
    title: `${parts[0]}/${parts[1]}`,
    url: url.toString(),
    description: note.resourcePreview,
  };
}

function parseWebpage(note: Note): ParsedNoteResource | null {
  const url = normalizeUrl(note.resource);
  if (!url) return null;

  return {
    kind: "webpage",
    label: "link",
    title: note.resourceTitle || url.hostname.replace(/^www\./, ""),
    url: url.toString(),
    description: note.resourcePreview,
  };
}

function normalizeUrl(value?: string | null) {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function firstLine(value: string) {
  return value.split("\n")[0]?.slice(0, 84) || "Untitled note";
}
