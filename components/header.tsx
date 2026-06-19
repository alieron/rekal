"use client";

import { topics, resources } from "@/lib/data";
import { BookMarked, ChevronDown, FilePlus2, Layers3, LogOut, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const navItems = [
  // { href: "/", label: "home" },
  { href: "/topics", label: "topics" },
  { href: "/resources", label: "resources" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const topicResults = topics.map((topic) => ({
      href: `/topics/${topic.slug}`,
      label: topic.name,
      meta: "topic",
      haystack: `${topic.name} ${topic.description}`.toLowerCase(),
    }));
    const resourceResults = resources.map((resource) => ({
      href: `/resources/${resource.id}`,
      label: resource.title,
      meta: resource.type,
      haystack: `${resource.title} ${resource.note} ${resource.preview}`.toLowerCase(),
    }));

    return [...topicResults, ...resourceResults]
      .filter((item) => fuzzyMatch(item.haystack, normalized))
      .slice(0, 7);
  }, [query]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex justify-between">
          <div className="flex items-center justify-between gap-2">
            <Link className="px-2 py-1" href="/">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-accent">Rekal</p>
            </Link>
            {navItems.map((item) => (
              <Link
                className={`px-2 py-1 text-sm transition ${pathname === item.href ? "bg-panel-lift text-text" : "text-muted hover:bg-panel hover:text-text"}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="relative sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input
                className="w-full border border-line bg-panel px-9 py-2 text-sm text-text outline-none transition placeholder:text-faint focus:border-line-strong"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Fuzzy search topics, resources..."
                value={query}
              />
              {results.length ? (
                <div className="card-shadow absolute left-0 right-0 top-12 overflow-hidden border border-line bg-panel p-1">
                  {results.map((result) => (
                    <Link
                      className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-panel-lift"
                      href={result.href}
                      key={result.href}
                      onClick={() => setQuery("")}
                    >
                      <span className="truncate">{result.label}</span>
                      <span className="ml-4 text-xs uppercase tracking-wide text-faint">{result.meta}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                className="inline-flex w-full items-center justify-center gap-1 border border-line bg-panel p-2.5 text-sm font-medium text-text transition hover:border-line-strong sm:w-auto"
                onClick={() => setIsCreateOpen((value) => !value)}
                type="button"
              >
                <Plus className="size-4 text-accent" />
                <ChevronDown className="size-4 text-faint" />
              </button>
              {isCreateOpen ? (
                <div className="card-shadow absolute right-0 top-12 w-56 overflow-hidden  border border-line bg-panel p-1">
                  <Link className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-panel-lift" href="/resources/new">
                    <FilePlus2 className="size-4 text-muted" />
                    New resource
                  </Link>
                  <Link className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-panel-lift" href="/topics/new">
                    <Layers3 className="size-4 text-muted" />
                    New topic
                  </Link>
                </div>
              ) : null}
            </div>

            <button
              className="inline-flex items-center justify-center border border-line bg-transparent p-2.5 text-sm text-muted transition hover:text-text"
              onClick={logout}
              type="button"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function fuzzyMatch(value: string, query: string) {
  let valueIndex = 0;
  for (const character of query) {
    valueIndex = value.indexOf(character, valueIndex);
    if (valueIndex === -1) return false;
    valueIndex += 1;
  }
  return true;
}
