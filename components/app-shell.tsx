"use client";

import { Button } from "@/components/ui/button";
import { CreateMenu } from "@/components/create-menu";
import { inputClassName } from "@/components/ui/dialog";
import { Tag } from "@/components/ui/tag";
import type { NoteWithTopic, Topic } from "@/lib/data";
import { getNoteTypeTitle, parseNoteType } from "@/lib/note-types/registry";
import { Home, Library, LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

export function AppShell({ children, topics, notes }: { children: React.ReactNode; topics: Topic[]; notes: NoteWithTopic[] }) {
  const pathname = usePathname();
  const currentTopic = topics.find((topic) => pathname === `/topics/${topic.slug}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[220px_1fr]">
      <MobileHeader currentTopicId={currentTopic?.id} onMenu={() => setSidebarOpen(true)} onSearch={() => setSearchOpen(true)} topicOnly={Boolean(currentTopic)} topics={topics} />
      <aside className="hidden border-r border-line bg-panel/60 lg:block"><Sidebar notes={notes} topics={topics} /></aside>
      {sidebarOpen ? <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)}><div className="flex h-full w-72 flex-col border-r border-line bg-page" onClick={(event) => event.stopPropagation()}><div className="flex shrink-0 justify-end p-3"><Button onClick={() => setSidebarOpen(false)} size="icon" type="button" variant="ghost"><X className="size-4" /></Button></div><div className="min-h-0 flex-1"><Sidebar notes={notes} onNavigate={() => setSidebarOpen(false)} showLogout topics={topics} /></div></div></div> : null}
      <div className="min-w-0">
        <DesktopHeader currentTopicId={currentTopic?.id} notes={notes} topicOnly={Boolean(currentTopic)} topics={topics} />
        <main className="w-full min-w-0 px-3 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <SearchOverlay notes={notes} onOpenChange={setSearchOpen} open={searchOpen} topics={topics} />
    </div>
  );
}

function MobileHeader({ onMenu, onSearch, topicOnly, currentTopicId, topics }: { onMenu: () => void; onSearch: () => void; topicOnly: boolean; currentTopicId?: string; topics: Topic[] }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-page/90 px-3 py-3 backdrop-blur lg:hidden">
      <Button aria-label="Open navigation" onClick={onMenu} size="icon" type="button" variant="primary"><Menu className="size-5" /></Button>
      <div className="flex items-center gap-2">
        <Button aria-label="Search notes" onClick={onSearch} size="icon" type="button" variant="primary"><Search className="size-4" /></Button>
        <CreateMenu defaultTopicId={currentTopicId} topicOnly={topicOnly} topics={topics} />
      </div>
    </header>
  );
}

function DesktopHeader({ topicOnly, currentTopicId, topics, notes }: { topicOnly: boolean; currentTopicId?: string; topics: Topic[]; notes: NoteWithTopic[] }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-end gap-3 border-b border-line bg-page/90 px-8 py-3 backdrop-blur lg:flex">
      <DesktopSearch notes={notes} topics={topics} />
      <CreateMenu defaultTopicId={currentTopicId} topicOnly={topicOnly} topics={topics} />
      <Button aria-label="Logout" onClick={logout} size="icon" type="button" variant="primary"><LogOut className="size-4" /></Button>
    </header>
  );
}

function DesktopSearch({ topics, notes }: { topics: Topic[]; notes: NoteWithTopic[] }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const results = useSearchResults(query, topics, notes);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (!query) return;
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setQuery("");
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [query]);

  function openActiveResult() {
    const result = results[activeIndex];
    if (!result) return;
    setQuery("");
    router.push(result.href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") setQuery("");
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openActiveResult();
    }
  }

  return (
    <div className="relative w-96" ref={rootRef}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text" />
      <input className={`${inputClassName} pl-9`} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeyDown} placeholder="Search notes, topics, links..." value={query} />
      {query ? <button aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-text" onClick={() => setQuery("")} type="button"><X className="size-4" /></button> : null}
      {query ? <SearchResults activeIndex={activeIndex} onSelect={() => setQuery("")} results={results} /> : null}
    </div>
  );
}

function Sidebar({ onNavigate, showLogout = false, topics, notes }: { onNavigate?: () => void; showLogout?: boolean; topics: Topic[]; notes: NoteWithTopic[] }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 p-4 text-lg">
      <nav className="shrink-0 space-y-1">
        <NavLink active={pathname === "/"} href="/" icon={<Home className="size-4" />} label="Home" onNavigate={onNavigate} />
        <NavLink active={pathname === "/notes"} href="/notes" icon={<Library className="size-4" />} label="All notes" onNavigate={onNavigate} />
      </nav>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <p className="px-2 text-[11px] uppercase tracking-[0.22em] text-faint">Topics</p>
        {topics.map((topic) => (
          <NavLink active={pathname === `/topics/${topic.slug}`} href={`/topics/${topic.slug}`} key={topic.id} label={topic.name} meta={String(notes.filter((note) => note.topicId === topic.id).length)} onNavigate={onNavigate} />
        ))}
      </div>
      {showLogout ? <Button className="shrink-0 justify-start" onClick={logout} type="button" variant="ghost"><LogOut className="size-4" /> Logout</Button> : null}
    </div>
  );
}

function NavLink({ href, label, active, icon, meta, onNavigate }: { href: string; label: string; active?: boolean; icon?: React.ReactNode; meta?: string; onNavigate?: () => void }) {
  return (
    <Link className={`flex items-center justify-between gap-3 px-2 py-2 text-sm transition ${active ? "bg-panel-lift text-text" : "text-muted hover:bg-panel hover:text-text"}`} href={href} onClick={onNavigate}>
      <span className="flex min-w-0 items-center gap-2 truncate">{icon}{label}</span>
      {meta ? <span className="text-xs text-faint">{meta}</span> : null}
    </Link>
  );
}

function SearchOverlay({ open, onOpenChange, topics, notes }: { open: boolean; onOpenChange: (open: boolean) => void; topics: Topic[]; notes: NoteWithTopic[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useSearchResults(query, topics, notes);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [query]);

  function closeSearch() {
    setQuery("");
    onOpenChange(false);
  }

  function openActiveResult() {
    const result = results[activeIndex];
    if (!result) return;
    closeSearch();
    router.push(result.href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") closeSearch();
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openActiveResult();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-page/98 p-3 lg:hidden">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text" />
        <input autoFocus className={`${inputClassName} h-12 pl-9 pr-10`} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeyDown} placeholder="Search notes, topics, links..." value={query} />
        <button aria-label="Close search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text" onClick={closeSearch} type="button"><X className="size-4" /></button>
      </div>
      <SearchResults activeIndex={activeIndex} className="static mt-3" onSelect={closeSearch} results={results} showEmpty={Boolean(query)} />
    </div>
  );
}

function useSearchResults(query: string, topics: Topic[], notes: NoteWithTopic[]) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const topicResults = topics.map((topic) => ({ href: `/topics/${topic.slug}`, label: topic.name, meta: "topic", haystack: `${topic.name} ${topic.description}`.toLowerCase() }));
    const noteResults = notes.map((note) => {
      const topic = topics.find((item) => item.id === note.topicId) ?? topics[0];
      const parsed = parseNoteType(note);
      const title = getNoteTypeTitle(note, parsed);
      return { href: `/topics/${topic.slug}?note=${note.id}`, label: title, meta: parsed.label, haystack: `${note.note} ${note.resource ?? ""} ${title}`.toLowerCase() };
    });
    return [...topicResults, ...noteResults].filter((item) => fuzzyMatch(item.haystack, normalized)).slice(0, 8);
  }, [query, topics, notes]);
}

function SearchResults({ results, onSelect, activeIndex, className = "absolute left-0 right-0 top-12 z-40", showEmpty = true }: { results: Array<{ href: string; label: string; meta: string }>; onSelect: () => void; activeIndex: number; className?: string; showEmpty?: boolean }) {
  if (!results.length && !showEmpty) return null;
  return (
    <div className={`${className} divide-y divide-line border border-line bg-panel shadow-xl`}>
      {results.map((result, index) => (
        <Link className={`flex items-center justify-between gap-4 px-3 py-3 text-sm text-text ${index === activeIndex ? "bg-panel-lift" : "hover:bg-panel-lift"}`} href={result.href} key={result.href} onClick={onSelect}>
          <span className="truncate">{result.label}</span><Tag>{result.meta}</Tag>
        </Link>
      ))}
      {!results.length ? <p className="px-3 py-8 text-center text-sm text-muted">No matches</p> : null}
    </div>
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
