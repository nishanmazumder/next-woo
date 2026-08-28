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
