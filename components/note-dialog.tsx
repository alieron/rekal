"use client";

import { Button } from "@/components/ui/button";
import { Dialog, Field, inputClassName } from "@/components/ui/dialog";
import type { NoteWithTopic, Topic } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function NoteDialog({ open, onOpenChange, topics, note, defaultTopicId }: { open: boolean; onOpenChange: (open: boolean) => void; topics: Topic[]; note?: NoteWithTopic; defaultTopicId?: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    const response = await fetch(note ? `/api/notes/${note.id}` : "/api/notes", {
      method: note ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: form.get("topicId"), note: form.get("note"), resource: form.get("resource") }),
    });
    setSaving(false);
    if (!response.ok) return;
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog description="Capture the thought first. Resource parsing happens from the optional resource field." onOpenChange={onOpenChange} open={open} title={note ? "Edit note" : "New note"}>
      <form className="space-y-4" onSubmit={submit}>
        <Field label="Topic">
          <select className={inputClassName} defaultValue={note?.topicId ?? defaultTopicId ?? topics[0]?.id} name="topicId">
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Note">
          <textarea className={`${inputClassName} min-h-40`} defaultValue={note?.note} name="note" placeholder="Write the note..." required />
        </Field>
        <Field label="Resource, optional">
          <input className={inputClassName} defaultValue={note?.resource ?? ""} name="resource" placeholder="https://..., github repo, book title, etc." />
        </Field>
        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">Cancel</Button>
          <Button disabled={saving} type="submit" variant="primary">{saving ? "Saving..." : note ? "Save note" : "Create note"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
