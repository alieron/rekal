"use client";

import { Button } from "@/components/ui/button";
import { Dialog, Field, inputClassName } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function TopicDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    const response = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), description: form.get("description") }),
    });
    setSaving(false);
    if (!response.ok) return;
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog description="Names can be kebab case or plain text. The slug can stay separate later if needed." onOpenChange={onOpenChange} open={open} title="New topic">
      <form className="space-y-4" onSubmit={submit}>
        <Field label="Name">
          <input className={inputClassName} name="name" placeholder="distributed-systems" required />
        </Field>
        <Field label="Description">
          <textarea className={`${inputClassName} min-h-32`} name="description" placeholder="What belongs in this topic?" />
        </Field>
        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">Cancel</Button>
          <Button disabled={saving} type="submit" variant="primary">{saving ? "Creating..." : "Create topic"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
