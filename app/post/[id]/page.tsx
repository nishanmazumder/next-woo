import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Comment from "@/components/Comment";
import { getComment, getPost, getPosts } from "@/lib/api/posts";

export async function generateMetadata(
  props: PageProps<"/post/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const post = await getPost(id);

  return {
    title: post?.title ?? "Post not found",
    description: post?.body,
  };
}

export default async function PostDetailPage(
  props: PageProps<"/post/[id]">,
) {
  const { id } = await props.params;

  // Start the independent requests together. We await the post immediately,
  // but pass the comment promise to Suspense so it can stream separately.
  const postPromise = getPost(id);
  const commentPromise = getComment(id);
  const post = await postPromise;

  if (!post) {
    notFound();
  }

  return (
    <main className="p-6">
      <article>
        <h1 className="text-3xl font-bold text-green-600">{post.title}</h1>
        <p className="mt-3">{post.body}</p>
      </article>

      <section className="mt-8 rounded bg-pink-700 p-4 text-white">
        <h2 className="text-2xl font-bold">Comment</h2>
        <div className="mt-3">
          <Suspense fallback={<p role="status">Loading comment…</p>}>
            <Comment promise={commentPromise} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const { posts } = await getPosts();

  return posts.map((post) => ({
    id: String(post.id),
  }));
}
