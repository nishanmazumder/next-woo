"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2">The page could not be loaded.</p>
      <button
        type="button"
        className="mt-4 rounded bg-slate-800 px-4 py-2 text-white"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
