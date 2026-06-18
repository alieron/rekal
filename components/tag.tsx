import Link from "next/link";

export function TopicTag({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="inline-flex w-fit items-center border border-accent/30 bg-accent-soft/50 px-2.5 py-1 text-xs font-medium text-accent transition hover:border-accent/60"
      href={href}
    >
      {label}
    </Link>
  );
}
