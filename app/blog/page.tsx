import type { Metadata } from "next";
import Link from "next/link";

import { blogs } from "@/lib/data/blogs";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Blog</h1>

      <ul className="mt-4 flex flex-wrap gap-4">
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link className="underline" href={`/blog/${blog.id}`}>
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
