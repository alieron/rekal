import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { TopicTag } from "@/components/tag";
import { getResourceById, topics } from "@/lib/data";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) notFound();

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading eyebrow="Edit resource" title={resource.title} description="Static mockup of the future edit experience." />
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <form className="space-y-4  border border-line bg-panel p-5">
            <Field label="Title" defaultValue={resource.title} />
            <label className="block space-y-2 text-sm font-medium text-text">
              <span>Type</span>
              <select className="w-full  border border-line bg-page px-4 py-3 text-sm outline-none" defaultValue={resource.type}>
                {['note', 'url', 'repo', 'paper', 'book'].map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="block space-y-2 text-sm font-medium text-text">
              <span>Topic</span>
              <select className="w-full  border border-line bg-page px-4 py-3 text-sm outline-none" defaultValue={resource.topicId}>
                {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
              </select>
            </label>
            <Field label="URL" defaultValue={resource.url} />
            <label className="block space-y-2 text-sm font-medium text-text">
              <span>Short note</span>
              <textarea className="min-h-40 w-full  border border-line bg-page px-4 py-3 text-sm outline-none" defaultValue={resource.note} />
            </label>
            <button className=" bg-text px-4 py-3 text-sm font-semibold text-page transition hover:bg-accent" type="button">Save changes</button>
          </form>

          <aside className="h-fit  border border-line bg-panel p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-faint">Preview</p>
            <div className="mt-4  border border-line bg-page p-4 text-sm text-muted">{resource.preview}</div>
            <div className="mt-5">
              <TopicTag href={`/topics/${resource.topic.slug}`} label={resource.topic.name} />
            </div>
            {resource.url ? (
              <a className="mt-5 inline-flex items-center gap-2 text-sm text-muted hover:text-accent" href={resource.url} rel="noreferrer" target="_blank">
                Open source <ExternalLink className="size-4" />
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-text">
      <span>{label}</span>
      <input className="w-full  border border-line bg-page px-4 py-3 text-sm outline-none" defaultValue={defaultValue} />
    </label>
  );
}
