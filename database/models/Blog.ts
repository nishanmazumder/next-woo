import { model, models, Schema, Document, type InferSchemaType } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      trim: true,
      validate: {
        validator: (v: string[]) =>
          v.length > 0 && v.every((tag) => tag.trim().length > 0),
        message: "At least one valid tag is required",
      },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    collection: "blogs",
  },
);

export type Blog = InferSchemaType<typeof blogSchema>;
export const BlogModel = models.Blog || model("Blog", blogSchema);
