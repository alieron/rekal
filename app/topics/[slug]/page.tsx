import { AppShell } from "@/components/app-shell";
import { NoteCard } from "@/components/note-card";
import { Tag } from "@/components/ui/tag";
import { getNotesForTopic, getTopicBySlug, shortDate } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function TopicDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ note?: string }> }) {
  const { slug } = await params;
  const { note: focusedNoteId } = await searchParams;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const notes = getNotesForTopic(topic.id);

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold text-text">{topic.name}</h1>
            <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
            <div className="mt-4 flex flex-wrap gap-2"><Tag tone="accent">{notes.length} notes</Tag><Tag>created {shortDate(topic.createdAt)}</Tag><Tag>edited {shortDate(topic.updatedAt)}</Tag></div>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard focused={focusedNoteId === note.id} key={note.id} note={note} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
