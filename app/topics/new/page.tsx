import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";

export default function NewTopicPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading eyebrow="Mock form" title="Create topic" description="Static frontend mockup for the future topic creation flow." />
        <form className="max-w-2xl space-y-4  border border-line bg-panel p-5">
          <input className="w-full  border border-line bg-page px-4 py-3 text-sm outline-none" placeholder="Topic name" />
          <textarea className="min-h-36 w-full  border border-line bg-page px-4 py-3 text-sm outline-none" placeholder="Description" />
          <button className=" bg-text px-4 py-3 text-sm font-semibold text-page" type="button">Create topic</button>
        </form>
      </div>
    </AppShell>
  );
}
