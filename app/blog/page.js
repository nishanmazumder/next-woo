import Link from "next/link"

const blogs = [{
    id: 1,
    title: 'Yellow Pail',
},
{
    id: 2,
    title: 'Green Pail',
},
{
    id: 3,
    title: 'Blue Pail',
}
]

export default function Blog() {
    return (
        <ul className="m-2 flex gap-4">
            {
                blogs.map((blog, i) => {
                    return <li key={blog.id}><Link href={'/blog/' + blog.id}>{blog.title}</Link></li>
                })
            }
        </ul>
    )
}
