import { type ResourceWithTopic } from "@/lib/data";
import Link from "next/link";
import { TypeIcon } from "./type-icon";

export function ResourceCard({ resource }: { resource: ResourceWithTopic }) {
  return (
    <Link
      className="group flex min-h-64 flex-col justify-between  border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel-soft"
      href={`/resources/${resource.id}`}
    >
      <div>
        <div className="mb-5 flex h-24 items-center justify-center  border border-line bg-page p-4 text-center text-sm text-muted">
          {resource.preview}
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-faint">
          <TypeIcon type={resource.type} />
          {resource.type}
        </div>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-text group-hover:text-accent">{resource.title}</h2>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">{resource.note}</p>
      </div>
      {resource.url ? <p className="mt-5 truncate text-xs text-faint">{resource.url}</p> : null}
    </Link>
  );
}
