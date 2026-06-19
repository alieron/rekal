import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="card-shadow w-full max-w-sm  border border-line bg-panel p-6">
        <div className="mb-7">
          <p className="text-md font-semibold uppercase tracking-[0.32em] text-accent">Rekal</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
