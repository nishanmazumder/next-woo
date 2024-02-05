import Link from "next/link";
import { getPosts } from "@/api/postAPI"

export default async function Posts() {

    const { posts } = await getPosts();

    return (
        <div>
            <h1>Posts</h1>

            <ul>
                {posts.map((post) => (<li key={post.id}><Link href={'/post/' + post.id}>{post.title}</Link></li>))}
            </ul>
        </div>
    )
}
