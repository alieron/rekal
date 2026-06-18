import { AppShell } from "@/components/app-shell";
import { ResourceTable } from "@/components/resource-table";
import { SectionHeading } from "@/components/section-heading";
import { getResourcesWithTopics } from "@/lib/data";

export default function ResourcesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Resources"
          title="Everything captured so far."
          description="A table of notes, URLs, repositories, papers, and books with their associated topic tags."
        />
        <ResourceTable resources={getResourcesWithTopics()} />
      </div>
    </AppShell>
  );
}
