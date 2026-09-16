import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";

export async function getSimilarItems(slug: string) {
    try {
        await connectDB();

        const blog = await BlogModel.findOne({ slug });
        const similarItems = await BlogModel.find({ _id: { $ne: blog._id }, tags: blog.tags }).limit(5);

        return similarItems;
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error",
        );
    }
}