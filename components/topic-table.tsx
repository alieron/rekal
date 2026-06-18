"use client";

import { formatDate, type TopicWithStats } from "@/lib/data";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortKey = "name" | "resourceCount" | "lastAddedAt";

export function TopicTable({ topics }: { topics: TopicWithStats[] }) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastAddedAt");

  const filteredTopics = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    return topics
      .filter((topic) => `${topic.name} ${topic.description}`.toLowerCase().includes(normalized))
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "resourceCount") return b.resourceCount - a.resourceCount;
        return Date.parse(b.lastAddedAt ?? b.createdAt) - Date.parse(a.lastAddedAt ?? a.createdAt);
      });
  }, [filter, sortKey, topics]);

  return (
    <div className="space-y-4">
      <input
        className="w-full  border border-line bg-panel px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-line-strong sm:max-w-sm"
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filter topics..."
        value={filter}
      />
      <div className="overflow-hidden  border border-line bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-panel-soft text-xs uppercase tracking-wide text-faint">
              <tr>
                <SortableHead label="Topic" onClick={() => setSortKey("name")} />
                <th className="px-5 py-4 font-medium">Description</th>
                <SortableHead label="Resources" onClick={() => setSortKey("resourceCount")} />
                <SortableHead label="Last added" onClick={() => setSortKey("lastAddedAt")} />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredTopics.map((topic) => (
                <tr className="hover:bg-panel-soft/70" key={topic.id}>
                  <td className="px-5 py-4">
                    <Link className="font-medium text-text hover:text-accent" href={`/topics/${topic.slug}`}>
                      {topic.name}
                    </Link>
                  </td>
                  <td className="max-w-lg px-5 py-4 text-muted">{topic.description}</td>
                  <td className="px-5 py-4 text-muted">{topic.resourceCount}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(topic.lastAddedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortableHead({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="px-5 py-4 font-medium">
      <button className="inline-flex items-center gap-2 hover:text-text" onClick={onClick} type="button">
        {label}
        <ArrowUpDown className="size-3.5" />
      </button>
    </th>
  );
}
