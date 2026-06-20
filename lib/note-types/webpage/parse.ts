import type { Note } from "@/lib/data";
import { normalizeUrl, type ParsedNoteType } from "@/lib/note-types/types";

export function parseWebpageNote(note: Note): ParsedNoteType | null {
  const url = normalizeUrl(note.resource);
  if (!url) return null;
  const metadataTitle = getMetadataString(note.metadata, "title");

  return {
    kind: "webpage",
    label: "link",
    title: metadataTitle || url.hostname.replace(/^www\./, ""),
    url: url.toString(),
  };
}

function getMetadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value ? value : undefined;
}
