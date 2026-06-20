import { AppShell } from "@/components/app-shell";
import { NoteCard } from "@/components/note-card";
import { Tag } from "@/components/ui/tag";
import { getNotesWithTopics, getTopicBySlug, getTopics, shortDate } from "@/lib/data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TopicDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ note?: string }> }) {
  const { slug } = await params;
  const { note: focusedNoteId } = await searchParams;
  const [topic, allNotes, topics] = await Promise.all([getTopicBySlug(slug), getNotesWithTopics(), getTopics()]);
  if (!topic) notFound();

  const notes = allNotes.filter((note) => note.topicId === topic.id);

  return (
    <AppShell notes={allNotes} topics={topics}>
      <div className="space-y-6">
        <header>
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold text-text">{topic.name}</h1>
            <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
            <div className="mt-4 flex flex-wrap gap-2"><Tag tone="accent">{notes.length} notes</Tag><Tag>created {shortDate(topic.createdAt)}</Tag><Tag>edited {shortDate(topic.updatedAt)}</Tag></div>
          </div>
        </header>
        <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard focused={focusedNoteId === note.id} key={note.id} note={note} topics={topics} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
