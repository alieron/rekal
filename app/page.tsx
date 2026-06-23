import { ActivityRangeSelect } from "@/components/activity-range-select";
import { AppShell } from "@/components/app-shell";
import { NoteTable } from "@/components/note-table";
import { Heatmap } from "@/components/ui/heatmap";
import { Tag } from "@/components/ui/tag";
import { getActivityByDay, getNotesWithTopics, getTopics, getTopicsWithStats, shortDate } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

const activityRanges = [
  { label: "This year", value: "this-year" },
  { label: "This month", value: "this-month" },
  { label: "Past year", value: "past-year" },
];

export default async function HomePage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const selectedRange = activityRanges.find((option) => option.value == range) ?? activityRanges[0];
  const [allNotes, topics, topicStats, activityByDay] = await Promise.all([getNotesWithTopics(), getTopics(), getTopicsWithStats(), getActivityByDay()]);
  const recentNotes = allNotes.slice(0, 7);
  const activity = Array.from(activityByDay, ([date, count]) => ({ date, count }));
  const today = new Date();
  const { start, end } = activityDateRange(selectedRange.value, today);

  return (
    <AppShell notes={allNotes} topics={topics}>
      <div className="space-y-5">
        <header className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted">{allNotes.length} note{allNotes.length == 1 ? '' : 's'} · {topics.length} topic{topics.length == 1 ? '' : 's'}</p>
        </header>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-text">Activity</h2>
            <ActivityRangeSelect ranges={activityRanges} selectedValue={selectedRange.value} />
          </div>
          <Heatmap
            colorMode="gradient"
            endDate={dateKey(end)}
            maxColor="#f59e0b"
            minColor="#451a03"
            numColors={4}
            startDate={dateKey(start)}
            values={activity}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-text">Recent additions</h2>
            <Link className="text-sm text-muted hover:text-accent" href="/notes">View all</Link>
          </div>
          <NoteTable notes={recentNotes} topics={topics} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-text">Topics</h2>
            <Link className="text-sm text-muted hover:text-accent" href="/topics">View all</Link>
          </div>
          <div className="grid w-full gap-3 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {topicStats.map((topic) => (
              <Link className="border border-line bg-page p-4 transition hover:border-line-strong hover:bg-panel-soft" href={`/topics/${topic.slug}`} key={topic.id}>
                <Tag tone="accent">{topic.noteCount} notes</Tag>
                <p className="mt-4 text-sm font-semibold text-text">{topic.name}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{topic.description}</p>
                <p className="mt-4 text-xs text-faint">Last edit {shortDate(topic.lastEditedAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function activityDateRange(range: string, today: Date) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDay();

  switch (range) {
    case "past-year": {
      return { start: new Date(year - 1, month, day), end: today };
    }
    case "this-year":
      return { start: new Date(year, 0, 1), end: today };
    case "this-month":
    default: {
      return { start: new Date(year, month, 1), end: today };
    }
  }
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
