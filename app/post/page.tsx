import type { Metadata } from "next";
import Link from "next/link";

import { getPosts } from "@/lib/api/posts";

export const metadata: Metadata = {
  title: "Posts",
};

export default async function PostsPage() {
  const { posts } = await getPosts();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Posts</h1>

      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link className="underline" href={`/post/${post.id}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
