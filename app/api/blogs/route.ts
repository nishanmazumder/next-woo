import { NextResponse } from "next/server";

import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const blogs = await BlogModel.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, status } = body;

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

    await connectDB();
    const blog = await BlogModel.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
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
