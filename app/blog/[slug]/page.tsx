import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogs, getBlogById } from "@/lib/data/blogs";

import {getBlogs} from "@/lib/api/posts";

// generateStaticParams
// generateMetadata


export default async function BlogDetailPage(
  props: PageProps<"/blog/[slug]">,
) {
  const { slug } = await props.params;
  const { blogs } = await getBlogs();
  const blog = blogs.find((blog) => blog.slug === slug);

  console.log("slug", slug);

  return (
    <main className="p-6">
      <p className="text-sm opacity-70">Blog #{blog?.slug}</p>
      <h1 className="mt-1 text-3xl font-bold">{blog?.title}</h1>
    </main>
  );
}
