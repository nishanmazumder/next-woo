import { getPost } from "@/api/postAPI"

export default function Single({ params }) {

    const { id } = params

    const post = getPost(id)

    console.log(post);

    return (
        <h1>{post.tittle}</h1>
    )
}
