import { AppShell } from "@/components/app-shell";
import { NoteTable } from "@/components/note-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heatmap } from "@/components/ui/heatmap";
import { Tag } from "@/components/ui/tag";
import { getActivityByDay, getNotesWithTopics, getTopicsWithStats, shortDate, topics } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const allNotes = getNotesWithTopics();
  const recentNotes = allNotes.slice(0, 7);
  const topicStats = getTopicsWithStats();
  const activity = Array.from(getActivityByDay(), ([date, count]) => ({ date, count }));
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 120);

  return (
    <AppShell>
      <div className="space-y-5">
        <header className="flex items-start justify-between gap-4">
          <div><h1 className="text-xl font-semibold text-text">Home</h1><p className="mt-1 text-sm text-muted">{allNotes.length} notes · {topics.length} topics</p></div>
        </header>

        <Card>
          <CardHeader><h2 className="text-sm font-semibold text-text">Activity</h2><span className="text-xs text-faint">additions and edits</span></CardHeader>
          <CardContent><Heatmap endDate={end.toISOString().slice(0, 10)} startDate={start.toISOString().slice(0, 10)} values={activity} /></CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-text">Recent additions</h2>
            <Link className="text-sm text-muted hover:text-accent" href="/notes">View all</Link>
          </div>
          <NoteTable notes={recentNotes} />
        </section>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="p-4 text-sm font-semibold text-text">Topics</h2>
          </div>
          <div className="grid gap-3 p-4 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {topicStats.map((topic) => (
              <Link className="border border-line bg-page p-4 transition hover:border-line-strong hover:bg-panel-soft" href={`/topics/${topic.slug}`} key={topic.id}>
                <Tag tone="accent">{topic.noteCount} notes</Tag>
                <p className="mt-4 text-sm font-semibold text-text">{topic.name}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{topic.description}</p>
                <p className="mt-4 text-xs text-faint">Last edit {shortDate(topic.lastEditedAt)}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
