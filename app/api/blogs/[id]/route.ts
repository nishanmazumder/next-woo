import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";

export const runtime = "nodejs";

type BlogRouteContext = {
  params: Promise<{ id: string }>;
};

function invalidIdResponse() {
  return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
}

export async function GET(_: Request, context: BlogRouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  await connectDB();
  const blog = await BlogModel.findById(id).lean();

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function PATCH(request: Request, context: BlogRouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const updates = await request.json();
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    await connectDB();
    const blog = await BlogModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}

export async function DELETE(_: Request, context: BlogRouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  await connectDB();
  const blog = await BlogModel.findByIdAndDelete(id).lean();

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Blog deleted" });
}
