import type { Metadata } from "next";
import Link from "next/link";

import { blogs } from "@/lib/data/blogs";
import { getBlogs } from "@/lib/api/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const { blogs } = await getBlogs();

  console.log("blogs", blogs);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Blog</h1>

      <ul className="mt-4 flex flex-wrap gap-4">
        {blogs.map((blog) => (
          <li key={blog._id}>
            <Link className="underline" href={`/blog/${blog.slug}`}>
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
