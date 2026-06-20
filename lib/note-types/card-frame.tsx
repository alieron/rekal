import { Tag } from "@/components/ui/tag";
import { Tooltip } from "@/components/ui/tooltip";
import { shortDate } from "@/lib/data";
import { ExternalLink, FileText, GitBranch, LinkIcon, type LucideIcon } from "lucide-react";

const icons = {
  FileText,
  GitBranch,
  LinkIcon,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof icons;

export function NoteTypeCardFrame({ icon, typeName, title, noteText, previewImage, date, externalUrl, externalTitle }: { icon: IconName; typeName: string; title?: string; noteText: string; previewImage?: string; date: string; externalUrl?: string; externalTitle?: string }) {
  const Icon = icons[icon];

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2 pr-8">
        <div className="flex items-center gap-2 text-xs text-faint"><Icon className="size-3.5" /> {typeName}</div>
        {title ? <h2 className="line-clamp-2 text-base font-semibold text-text">{title}</h2> : null}
      </div>
      <p className={title ? "line-clamp-5 text-sm leading-6 text-muted" : "line-clamp-7 text-sm leading-6 text-text"}>{noteText}</p>
      {previewImage ? <img alt="" className="hidden max-h-40 w-full border border-line object-cover sm:block" src={previewImage} /> : null}
      <div className="flex items-center justify-between gap-3">
        <Tag>{shortDate(date)}</Tag>
        {externalUrl ? (
          <Tooltip content={externalTitle || externalUrl}>
            <a aria-label={externalTitle ? `Open ${externalTitle}` : "Open external link"} className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent" href={externalUrl} rel="noreferrer" target="_blank">
              Open <ExternalLink className="size-3" />
            </a>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
}

export function getMetadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value ? value : undefined;
}
