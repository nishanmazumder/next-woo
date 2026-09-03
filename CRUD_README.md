# Mongoose CRUD Reference

Mongoose is an ODM: it lets your Next.js code work with MongoDB using JavaScript objects and models.

## Schema

A schema defines document fields and validation rules:

```ts
const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
});
```

## Model

A model is created from the schema and is used for CRUD operations:

```ts
export const BlogModel =
  models.Blog || model("Blog", blogSchema);
```

Think of `BlogModel` as the MongoDB `blogs` collection interface.

## Create

Create one document:

```ts
const blog = await BlogModel.create({
  title: "My first blog",
  slug: "my-first-blog",
  content: "Blog content",
  author: "Rashidul",
  status: "draft",
});
```

Create multiple documents:

```ts
const blogs = await BlogModel.insertMany([
  {
    title: "Blog one",
    slug: "blog-one",
    content: "Content one",
    author: "Admin",
  },
  {
    title: "Blog two",
    slug: "blog-two",
    content: "Content two",
    author: "Admin",
  },
]);
```

## Read

```ts
const blogs = await BlogModel.find();

const sortedBlogs = await BlogModel
  .find()
  .sort({ createdAt: -1 });

const blog = await BlogModel.findOne({
  slug: "my-first-blog",
});

const blogById = await BlogModel.findById(id);

const publishedBlogs = await BlogModel.find({
  status: "published",
});

const selectedBlogs = await BlogModel
  .find()
  .select("title slug author");

const plainBlogs = await BlogModel.find().lean();
```

`lean()` returns plain JavaScript objects instead of full Mongoose documents. It is useful for read-only API responses.

## Update

Update one document by ID:

```ts
const blog = await BlogModel.findByIdAndUpdate(
  id,
  {
    title: "Updated title",
    status: "published",
  },
  {
    new: true,
    runValidators: true,
  },
);
```

- `new: true` returns the updated document.
- `runValidators: true` applies schema validation during updates.

Update using a filter:

```ts
await BlogModel.updateOne(
  { slug: "my-first-blog" },
  { $set: { status: "published" } },
);
```

Update many documents:

```ts
await BlogModel.updateMany(
  { status: "draft" },
  { $set: { status: "published" } },
);
```

## Delete

```ts
const deletedBlog = await BlogModel.findByIdAndDelete(id);

await BlogModel.deleteOne({
  slug: "my-first-blog",
});

await BlogModel.deleteMany({
  status: "draft",
});
```

## Useful Mongoose Functions

| Function | Purpose |
|---|---|
| `create()` | Insert one document |
| `insertMany()` | Insert multiple documents |
| `find()` | Find many documents |
| `findOne()` | Find one document by conditions |
| `findById()` | Find by MongoDB ID |
| `findByIdAndUpdate()` | Update by ID |
| `updateOne()` | Update one matching document |
| `updateMany()` | Update multiple documents |
| `findByIdAndDelete()` | Delete by ID |
| `deleteOne()` | Delete one matching document |
| `countDocuments()` | Count matching documents |
| `exists()` | Check whether a document exists |
| `populate()` | Load related documents |
| `lean()` | Return plain objects |
| `sort()` | Sort results |
| `limit()` | Limit result count |
| `skip()` | Skip results for pagination |

Always connect before database operations:

```ts
await connectDB();
```

## Typical Next.js Routes

```text
GET     /api/blogs       -> find()
POST    /api/blogs       -> create()
GET     /api/blogs/:id   -> findById()
PATCH   /api/blogs/:id   -> findByIdAndUpdate()
DELETE  /api/blogs/:id   -> findByIdAndDelete()
```
