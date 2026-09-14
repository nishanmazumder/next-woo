import { NextResponse } from "next/server";

import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";
import type { BlogListResponse } from "@/types/post";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const blogs = await BlogModel.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    let obj;

    try {
      obj = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { title, slug, excerpt, content, author, status } = obj;


    const imagefile = formData.get("coverImage") as File;

    if(!imagefile || imagefile.size === 0) {
      return NextResponse.json({ error: "coverImage is required" }, { status: 400 });
    }

    const imageBuffer = await imagefile.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    const uploadeResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: 'blogs' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (
      typeof title !== "string" ||
      typeof slug !== "string" ||
      typeof content !== "string" ||
      typeof author !== "string"
    ) {
      return NextResponse.json(
        { error: "title, slug, content, and author are required" },
        { status: 400 },
      );
    }

    const blog = await BlogModel.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: ( uploadeResult as { secure_url: string }).secure_url,
      author,
      status,
      publishedAt: status === "published" ? new Date() : undefined,
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.name === "MongoServerError") {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 },
      );
    }

    throw error;
  }
}
