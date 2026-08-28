import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Blog not found</h1>
      <Link className="mt-4 inline-block underline" href="/blog">
        Back to blog
      </Link>
    </main>
  );
}
