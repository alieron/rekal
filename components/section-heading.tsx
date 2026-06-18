export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
