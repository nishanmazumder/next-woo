export default async function Comment({ promise }) {

    const comment = await promise;

    return (
        <p>{comment.body}</p>
    )
}
