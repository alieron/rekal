import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { topics } from "@/lib/data";

export default function NewResourcePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading eyebrow="Mock form" title="Create resource" description="Static frontend mockup for capturing a new resource under a topic." />
        <form className="max-w-3xl space-y-4  border border-line bg-panel p-5">
          <input className="w-full  border border-line bg-page px-4 py-3 text-sm outline-none" placeholder="Title" />
          <div className="grid gap-4 sm:grid-cols-2">
            <select className=" border border-line bg-page px-4 py-3 text-sm outline-none" defaultValue="url">
              {['note', 'url', 'repo', 'paper', 'book'].map((type) => <option key={type}>{type}</option>)}
            </select>
            <select className=" border border-line bg-page px-4 py-3 text-sm outline-none" defaultValue={topics[0].id}>
              {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
            </select>
          </div>
          <input className="w-full  border border-line bg-page px-4 py-3 text-sm outline-none" placeholder="URL, repo, DOI, or leave blank for notes/books" />
          <textarea className="min-h-40 w-full  border border-line bg-page px-4 py-3 text-sm outline-none" placeholder="Short note" />
          <button className=" bg-text px-4 py-3 text-sm font-semibold text-page" type="button">Create resource</button>
        </form>
      </div>
    </AppShell>
  );
}
