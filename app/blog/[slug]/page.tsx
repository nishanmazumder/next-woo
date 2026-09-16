import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogs, getBlogById } from "@/lib/data/blogs";

import {getBlogs} from "@/lib/api/posts";
import { getSimilarItems } from "@/lib/actions/blog.action";

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const { blogs } = await getBlogs();
  const blog = blogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  return {
    title: blog.title,
    description: blog.excerpt,
  };
}

export async function generateStaticParams() {
  const { blogs } = await getBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage(
  props: PageProps<"/blog/[slug]">,
) {
  const { slug } = await props.params;
  const { blogs } = await getBlogs();
  const blog = blogs.find((blog) => blog.slug === slug);
  const similarItems = await getSimilarItems(slug);

  return (
    <main className="p-6">
      <p className="text-sm opacity-70">Blog #{blog?.slug}</p>
      <h1 className="mt-1 text-3xl font-bold">{blog?.title}</h1>
      <p className="text-sm opacity-70">{blog?.tags}</p>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Similar Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {similarItems && similarItems.map((item) => (
            <div key={item._id} className="border p-4">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-sm opacity-70">{item.excerpt}</p>
              <p className="text-sm opacity-70">{item.tags}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
