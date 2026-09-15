import { NextResponse, NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

import { connectDB } from "@/database/db";
import { BlogModel } from "@/database/models/Blog";


export async function POST(request: NextRequest) {
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
          error: "coverImage must be a file",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(
      await imagefile.arrayBuffer()
    );

    const uploadResult = await uploadImage(buffer);
    blog.coverImage = uploadResult.secure_url;

    const createdBlog =
      await BlogModel.create({
        ...blog,
        publishedAt:
          blog.status === "published"
            ? new Date()
            : undefined,
      });

    return NextResponse.json(
      {
        blog: createdBlog,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

async function uploadImage(
  buffer: Buffer
): Promise<UploadApiResponse> {

  return new Promise(
    (resolve, reject) => {

      cloudinary.uploader
        .upload_stream(
          {
            folder: "blogs",
            resource_type: "image",
          },

          (error, result) => {
            
            if (error) {
              reject(error);
              return;
            }

            resolve(
              result as UploadApiResponse
            );
          }
        )
        .end(buffer);
    }
  );
}