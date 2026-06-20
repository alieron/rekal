"use client";

import { NoteDialog } from "@/components/note-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableWrap, Td, Th } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { shortDate, topics, type NoteWithTopic } from "@/lib/data";
import { getNoteTypeTitle, parseNoteType } from "@/lib/note-types/registry";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function NoteTable({ notes }: { notes: NoteWithTopic[] }) {
  const [editing, setEditing] = useState<NoteWithTopic | undefined>();
  return (
    <>
      <TableWrap>
        <div className="overflow-x-auto">
          <Table>
            <thead className="border-b border-line bg-panel-soft"><tr><Th>Note</Th><Th>Topic</Th><Th>Type</Th><Th>Edited</Th><Th /></tr></thead>
            <tbody className="divide-y divide-line">
              {notes.map((note) => {
                const parsed = parseNoteType(note);
                const title = getNoteTypeTitle(note, parsed);
                return (
                  <tr className="hover:bg-panel-soft/70" key={note.id}>
                    <Td><Link className="font-medium text-text hover:text-accent" href={`/topics/${note.topic.slug}?note=${note.id}`}>{title}</Link><p className="mt-1 max-w-xl truncate text-muted">{note.note}</p></Td>
                    <Td><Link href={`/topics/${note.topic.slug}`}><Tag>{note.topic.name}</Tag></Link></Td>
                    <Td className="text-muted">{parsed.label}</Td>
                    <Td className="text-muted">{shortDate(note.updatedAt)}</Td>
                    <Td><Button aria-label="Edit note" onClick={() => setEditing(note)} size="icon" type="button" variant="ghost"><Pencil className="size-4" /></Button></Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </TableWrap>
      <NoteDialog note={editing} onOpenChange={(open) => !open && setEditing(undefined)} open={Boolean(editing)} topics={topics} />
    </>
  );
}
