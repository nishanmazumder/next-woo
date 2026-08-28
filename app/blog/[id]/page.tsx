import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogs, getBlogById } from "@/lib/data/blogs";

export function generateStaticParams() {
  return blogs.map((blog) => ({
    id: String(blog.id),
  }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const blog = getBlogById(id);

  return {
    title: blog?.title ?? "Blog not found",
  };
}

export default async function BlogDetailPage(
  props: PageProps<"/blog/[id]">,
) {
  const { id } = await props.params;
  const blog = getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="p-6">
      <p className="text-sm opacity-70">Blog #{blog.id}</p>
      <h1 className="mt-1 text-3xl font-bold">{blog.title}</h1>
    </main>
  );
}
