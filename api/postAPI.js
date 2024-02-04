export async function getPosts() {

    const result = await fetch('https://dummyjson.com/posts?limit=10');

    if (!result.ok) {
        throw new Error('No data!')
    }

    return result.posts.json();

}

export async function getPost(id) {

    const result = await fetch('https://dummyjson.com/posts/' + 1);

    if (!result.ok) {
        throw new Error('No data!')
    }

    console.log(result);

    // return result.post.json();

}
