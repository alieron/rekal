import { AppShell } from "@/components/app-shell";
import { ResourceCard } from "@/components/resource-card";
import { SectionHeading } from "@/components/section-heading";
import { getResourcesForTopic, getTopicBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function TopicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const resources = getResourcesForTopic(topic.id);

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading eyebrow="Topic" title={topic.name} description={topic.description} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
