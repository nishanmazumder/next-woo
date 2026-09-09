export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: User;
}

export interface BlogListResponse {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: string;
  status: "draft" | "published";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}