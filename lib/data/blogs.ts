export interface Blog {
  id: number;
  title: string;
}

export const blogs: Blog[] = [
  { id: 1, title: "Yellow Pail" },
  { id: 2, title: "Green Pail" },
  { id: 3, title: "Blue Pail" },
];

export function getBlogById(id: string): Blog | undefined {
  return blogs.find((blog) => String(blog.id) === id);
}
