import { formatDate, type ResourceWithTopic } from "@/lib/data";
import Link from "next/link";
import { TopicTag } from "./tag";
import { TypeIcon } from "./type-icon";

export function ResourceTable({ resources }: { resources: ResourceWithTopic[] }) {
  return (
    <div className="overflow-hidden  border border-line bg-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-panel-soft text-xs uppercase tracking-wide text-faint">
            <tr>
              <th className="px-5 py-4 font-medium">Resource</th>
              <th className="px-5 py-4 font-medium">Topic</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {resources.map((resource) => (
              <tr className="hover:bg-panel-soft/70" key={resource.id}>
                <td className="px-5 py-4">
                  <Link className="font-medium text-text hover:text-accent" href={`/resources/${resource.id}`}>
                    {resource.title}
                  </Link>
                  <p className="mt-1 max-w-xl truncate text-muted">{resource.note}</p>
                </td>
                <td className="px-5 py-4">
                  <TopicTag href={`/topics/${resource.topic.slug}`} label={resource.topic.name} />
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 capitalize text-muted">
                    <TypeIcon type={resource.type} />
                    {resource.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted">{formatDate(resource.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
