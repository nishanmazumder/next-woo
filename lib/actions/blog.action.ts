import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";
import {cacheLife} from "next/cache";

export async function getSimilarItems(slug: string) {
    'use cache';
    cacheLife('hours');

    try {
        await connectDB();

        const blog = await BlogModel.findOne({ slug }).lean();
        const similarItems = await BlogModel.find({ _id: { $ne: blog._id }, tags: blog.tags }).limit(5).lean();

        return JSON.parse(JSON.stringify(similarItems));
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error",
        );
    }
}