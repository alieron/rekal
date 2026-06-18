import { BookOpen, FileText, GitBranch, LinkIcon, NotebookText } from "lucide-react";

export function TypeIcon({ type }: { type: string }) {
  const className = "size-4 text-muted";

  if (type === "repo") return <GitBranch className={className} />;
  if (type === "paper") return <FileText className={className} />;
  if (type === "book") return <BookOpen className={className} />;
  if (type === "note") return <NotebookText className={className} />;
  return <LinkIcon className={className} />;
}
