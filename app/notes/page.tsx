import { AppShell } from "@/components/app-shell";
import { NoteTable } from "@/components/note-table";
import { getNotesWithTopics, topics } from "@/lib/data";

export default function NotesPage() {
  const notes = getNotesWithTopics();
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted">{notes.length} note{notes.length == 1 ? '' : 's'} · {topics.length} topic{topics.length == 1 ? '' : 's'}</p>
        </header>
        <NoteTable notes={notes} />
      </div>
    </AppShell>
  );
}
