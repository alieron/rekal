import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { getTopicsWithStats, shortDate } from "@/lib/data";
import Link from "next/link";

export default function TopicsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header><h1 className="text-xl font-semibold text-text">Topics</h1><p className="mt-1 text-sm text-muted">Groups for the notes worth returning to.</p></header>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {getTopicsWithStats().map((topic) => (
            <Link href={`/topics/${topic.slug}`} key={topic.id}>
              <Card className="h-full p-4 transition hover:border-line-strong hover:bg-panel-soft">
                <Tag tone="accent">{topic.noteCount} notes</Tag>
                <h2 className="mt-4 text-base font-semibold text-text">{topic.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{topic.description}</p>
                <p className="mt-5 text-xs text-faint">Edited {shortDate(topic.lastEditedAt)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
