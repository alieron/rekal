"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Unable to sign in.");
      setIsSubmitting(false);
      return;
    }

    router.replace(searchParams.get("next") || "/");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm font-medium text-text" htmlFor="password">
        Password
      </label>
      <div className="flex items-center gap-3 border border-line bg-page px-4 py-3 focus-within:border-accent">
        <LockKeyhole className="size-4 text-faint" />
        <input
          autoFocus
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-faint"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          type="password"
          value={password}
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        className="w-full bg-text px-4 py-3 text-sm font-semibold text-page transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting || !password}
        type="submit"
      >
        {isSubmitting ? "Checking..." : "Continue"}
      </button>
    </form>
  );
}
