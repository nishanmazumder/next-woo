import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";


export async function POST(request: Request) {
    try {
        await connectDB();

        const formData = await request.formData();
        const blog = Object.fromEntries(
            formData.entries()
        );

        const imagefile = formData.get("coverImage");

        if (!(imagefile instanceof File)) {
            return NextResponse.json(
                {
                    error: "Image required"
                },
                {
                    status: 400
                }
            );
        }

        const bytes = await imagefile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName =
            `${Date.now()}-${imagefile.name}`;

        const uploadPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            "blogs",
            fileName
        );

        await fs.writeFile(
            uploadPath,
            buffer
        );

        blog.coverImage =
            `/uploads/blogs/${fileName}`;

        const createdBlog =
            await BlogModel.create({
                ...blog,
            });

        return NextResponse.json(
            {
                blog: createdBlog
            },
            {
                status: 201
            }
        );

    } catch(error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Upload failed"
            },
            {
                status:500
            }
        );
    }
}