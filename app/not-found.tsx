import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2">The page you requested does not exist.</p>
      <Link className="mt-4 inline-block underline" href="/">
        Return home
      </Link>
    </main>
  );
}
