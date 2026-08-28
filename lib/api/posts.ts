import type { Comment, Post, PostListResponse } from "@/types/post";

const API_BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(
      `DummyJSON request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export function getPosts(): Promise<PostListResponse> {
  return fetchJson<PostListResponse>("/posts?limit=10", {
    next: {
      revalidate: 10,
    },
  });
}

export async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(
    `${API_BASE_URL}/posts/${encodeURIComponent(id)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Unable to load post ${id}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as Post;
}

export async function getComment(id: string): Promise<Comment | null> {
  const response = await fetch(
    `${API_BASE_URL}/comments/${encodeURIComponent(id)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Unable to load comment ${id}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as Comment;
}
