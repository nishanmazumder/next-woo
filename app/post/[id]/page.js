import { getPost } from "@/api/postAPI"

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

    return (
        <div>
            <h1 className="text-green-500">{post.title}</h1>
            <p>{post.body}</p>
        </div>
    )
}
