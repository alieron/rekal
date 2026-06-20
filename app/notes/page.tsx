import { AppShell } from "@/components/app-shell";
import { NoteTable } from "@/components/note-table";
import { getNotesWithTopics, getTopics } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const [notes, topics] = await Promise.all([getNotesWithTopics(), getTopics()]);
  return (
    <AppShell notes={notes} topics={topics}>
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted">{notes.length} note{notes.length == 1 ? '' : 's'} · {topics.length} topic{topics.length == 1 ? '' : 's'}</p>
        </header>
        <NoteTable notes={notes} topics={topics} />
      </div>
    </AppShell>
  );
}
