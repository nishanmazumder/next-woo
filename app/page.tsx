import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page for the Woo Next.js learning app.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-teal-900 p-6 text-white">
      <h1 className="text-3xl font-bold">Home</h1>
    </main>
  );
}
