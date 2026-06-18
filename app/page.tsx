import { AppShell } from "@/components/app-shell";
import { ResourceTable } from "@/components/resource-table";
import { SectionHeading } from "@/components/section-heading";
import { formatDate, getResourcesWithTopics, getTopicsWithStats } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const recentResources = getResourcesWithTopics().slice(0, 5);
  const recentTopics = getTopicsWithStats().slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Private library"
          title="Capture loose threads before they disappear."
          description="A mockup for collecting notes, URLs, repositories, papers, and books under topics you are actively thinking about."
        />

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Topics" value={String(recentTopics.length + 1)} />
          <StatCard label="Resources" value={String(getResourcesWithTopics().length)} />
          <StatCard label="Latest add" value={formatDate(recentResources[0]?.createdAt ?? null)} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Recently added resources</h2>
            <Link className="text-sm text-muted hover:text-accent" href="/resources">View all</Link>
          </div>
          <ResourceTable resources={recentResources} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Recently added to topics</h2>
            <Link className="text-sm text-muted hover:text-accent" href="/topics">View all</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {recentTopics.map((topic) => (
              <Link className=" border border-line bg-panel p-5 transition hover:border-line-strong hover:bg-panel-soft" href={`/topics/${topic.slug}`} key={topic.id}>
                <p className="text-sm font-semibold text-text">{topic.name}</p>
                <p className="mt-2 text-xs text-muted">{topic.resourceCount} resources</p>
                <p className="mt-4 text-xs text-faint">Last added {formatDate(topic.lastAddedAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className=" border border-line bg-panel p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-faint">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-text">{value}</p>
    </div>
  );
}
