import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { TopicTable } from "@/components/topic-table";
import { getTopicsWithStats } from "@/lib/data";

export default function TopicsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Topics"
          title="Groups of things worth returning to."
          description="Filter and sort the mock topic list by name, resource count, or latest addition."
        />
        <TopicTable topics={getTopicsWithStats()} />
      </div>
    </AppShell>
  );
}
