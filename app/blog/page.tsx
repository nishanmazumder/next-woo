import type { Metadata } from "next";
import Link from "next/link";

import { blogs } from "@/lib/data/blogs";
import { getBlogs } from "@/lib/api/posts";

export const metadata: Metadata = {
  title: "Blog",
};



export default async function BlogPage() {
  const { blogs } = await getBlogs();

  // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`);
  // const checkBlogsData = await response.json();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Blog</h1>

      <ul className="mt-4 flex flex-wrap gap-4">
        {blogs.map((blog) => (
          <li key={blog._id}>
            <Link className="underline" href={`/blog/${blog.slug}`}>
              {blog.title && <h2 className="text-xl font-bold">{blog.title}</h2>}
            </Link>
            {blog.excerpt && <p className="text-gray-600">{blog.content}</p>}
            {blog.tags && (
              <ul className="mt-2 flex gap-2">
                {blog.tags.map((tag) => (
                  <li key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
