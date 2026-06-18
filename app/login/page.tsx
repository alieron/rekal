import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  const isConfigured = Boolean(process.env.APP_PASSWORD);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="card-shadow w-full max-w-sm  border border-line bg-panel p-6">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">Rekal</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text">Private access</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Enter the app password to continue.</p>
        </div>
        {isConfigured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <div className=" border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
            Set <code>APP_PASSWORD</code> in your environment before using the app.
          </div>
        )}
      </section>
    </main>
  );
}
