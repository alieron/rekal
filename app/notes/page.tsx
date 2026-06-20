import { AppShell } from "@/components/app-shell";
import { NoteTable } from "@/components/note-table";
import { getNotesWithTopics, topics } from "@/lib/data";

export default function NotesPage() {
  const notes = getNotesWithTopics();
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div><h1 className="text-xl font-semibold text-text">All notes</h1><p className="mt-1 text-sm text-muted">{notes.length} captured notes across {topics.length} topics.</p></div>
        </header>
        <NoteTable notes={notes} />
      </div>
    </AppShell>
  );
}
