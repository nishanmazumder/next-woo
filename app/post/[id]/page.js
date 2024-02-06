import { getComment, getPost, getPosts } from "@/api/postAPI";
import Comment from "@/app/components/Comment";
import { Suspense } from "react"

export async function generateMetadata({ params }) {
    const { id } = params
    const post = await getPost(id)

    return {
        title: post.title,
        description: post.body,
    }
}

export default async function Single({ params }) {

    const { id } = params
    const post = await getPost(id)
    const commentPromise = getComment(id)

    return (
        <div>
            <h1 className="text-green-500">{post.title}</h1>
            <p>{post.body}</p>

            <div className="bg-pink-700">
                <h1>Comment</h1>
                <Suspense fallback="<h1>Loading comments....</h1>">
                    <Comment promise={commentPromise} />
                </Suspense>
            </div>
        </div>
    )
}

export async function generateStaticParams() {
    const { posts } = await getPosts();

    return posts.map(post => ({ id: post.id.toString() }))
}
