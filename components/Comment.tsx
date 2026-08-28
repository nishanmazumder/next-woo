import type { Comment as CommentType } from "@/types/post";

interface CommentProps {
  promise: Promise<CommentType | null>;
}

export default async function Comment({ promise }: CommentProps) {
  const comment = await promise;

  if (!comment) {
    return <p>No comment was found.</p>;
  }

  return (
    <article>
      <p>{comment.body}</p>
      <p className="mt-2 text-sm opacity-80">
        By {comment.user.fullName} (@{comment.user.username})
      </p>
    </article>
  );
}
