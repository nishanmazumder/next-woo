export async function getPosts() {

    return await fetch('https://dummyjson.com/posts?limit=10',
        {
            next: {
                revalidate: 10,
            },
        })
        .then(res => res.json())
        .catch(e => {
            throw new Error(e)
        });
}

export async function getPost(id) {
    return await fetch(`https://dummyjson.com/posts/${id}`)
        .then(res => res.json())
        .catch(e => {
            throw new Error(e)
        })
}
