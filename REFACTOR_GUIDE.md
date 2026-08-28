# Next.js 16 + TypeScript Refactor Guide

This guide explains the changes made to the uploaded learning project, why each change was made, and what you should learn from it.

## 1. Goal of the refactor

The original project already demonstrated many useful Next.js App Router ideas:

- layouts and nested layouts
- static pages
- dynamic routes
- `notFound()`
- `generateMetadata()`
- `generateStaticParams()`
- server-side data fetching
- React Suspense
- a Client Component button
- `next/image`
- TypeScript API models
- the `@/*` import alias

The main problem was not the feature set. The problem was consistency and version alignment. Some code followed older Next.js patterns, some files were JavaScript while others were TypeScript, the ESLint package was from Next.js 14 while the app used Next.js 16, and the TypeScript configuration contained an option that TypeScript 7 no longer supports.

The refactor therefore keeps the same learning application, but gives it a cleaner structure and modern Next.js 16 / TypeScript 7 conventions.

---

## 2. New project structure

The important structure is now:

```text
app/
├── about/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── mission/page.tsx
│   └── vision/page.tsx
├── blog/
│   ├── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── not-found.tsx
├── post/
│   ├── page.tsx
│   └── [id]/page.tsx
├── error.tsx
├── layout.tsx
├── loading.tsx
├── not-found.tsx
└── page.tsx

components/
├── Button.tsx
└── Comment.tsx

lib/
├── api/
│   └── posts.ts
└── data/
    └── blogs.ts

types/
└── post.ts

eslint.config.mjs
next.config.ts
tsconfig.json
```

### Why this structure is better

The `app` directory now mostly describes routing. Shared components are under `components`, data-access code is under `lib/api`, reusable static data is under `lib/data`, and domain types are under `types`.

This makes each folder answer one question:

- `app`: Which routes exist?
- `components`: Which reusable UI pieces exist?
- `lib/api`: How does the application communicate with external services?
- `lib/data`: What reusable local data/helpers exist?
- `types`: What shape does application data have?

Next.js does allow components and helpers inside `app`; that was not technically wrong. This refactor uses top-level folders because it makes the routing layer easier to read while you are learning architecture.

---

## 3. JavaScript files converted to TypeScript

The original project had files such as:

```text
app/layout.js
app/page.js
app/loading.js
app/error.js
app/not-found.js
```

They are now:

```text
app/layout.tsx
app/page.tsx
app/loading.tsx
app/error.tsx
app/not-found.tsx
```

### Why

A TypeScript application is much easier to reason about if application source files consistently use TypeScript. Otherwise, strict checking may protect one route but not another.

For example, the root layout now explicitly types its metadata and children:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  // ...
};

interface RootLayoutProps {
  children: ReactNode;
}
```

The important idea is that TypeScript should describe the boundaries of your application: props, API results, route data, reusable objects, and configuration.

---

## 4. `strict: true`

The original `tsconfig.json` contained:

```json
"strict": false
```

It is now:

```json
"strict": true
```

### Why this is important

`strict: false` lets many dangerous values flow through the program without enough checking. It reduces a major benefit of using TypeScript.

`strict: true` enables a group of checks including stricter null handling, function typing, property initialization, and implicit `any` detection.

For a learning project, strict mode is especially valuable because TypeScript forces you to understand what a value really is instead of silently accepting assumptions.

---

## 5. TypeScript 7: removed `baseUrl`

The original configuration had:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

The new configuration is:

```json
"paths": {
  "@/*": ["./*"]
}
```

### Why

Your project uses TypeScript 7.0.2. TypeScript 7 removed support for `baseUrl`. `paths` no longer needs it.

This means the alias still works:

```tsx
import Button from "@/components/Button";
import { getPosts } from "@/lib/api/posts";
```

The mental model is:

```text
@/*  ->  ./*
```

So:

```text
@/components/Button
```

resolves to:

```text
./components/Button
```

This is also why the project no longer needs `jsconfig.json`: TypeScript projects should keep this configuration in `tsconfig.json`, not duplicate it in both files.

---

## 6. `jsx: preserve`

The project now uses:

```json
"jsx": "preserve"
```

Instead of:

```json
"jsx": "react-jsx"
```

### Why

Next.js handles the JSX compilation step. `preserve` leaves JSX available for the Next.js compiler rather than asking TypeScript to transform it itself.

You do not manually compile TSX in a normal Next.js workflow. `next dev` and `next build` handle the application compilation.

---

## 7. Removed `allowJs`

The project now uses:

```json
"allowJs": false
```

because all application source files have been migrated to TypeScript.

Configuration files such as the existing Tailwind/PostCSS JavaScript files can still exist; they are consumed by their respective tools. `allowJs` controls whether JavaScript source files participate in the TypeScript program.

---

## 8. Next.js 16 dynamic `params`

One of the most important changes is the dynamic route API.

The old blog page used:

```tsx
interface BlogPageProps {
  params: {
    id: number;
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const { id } = params;
}
```

There are two problems here.

First, URL parameters are strings, not numbers. `/blog/2` gives an ID conceptually equivalent to `"2"`.

Second, modern Next.js uses async route props. In Next.js 16, `params` is a Promise.

The refactored version uses Next.js's generated route-aware helper:

```tsx
export default async function BlogDetailPage(
  props: PageProps<"/blog/[id]">,
) {
  const { id } = await props.params;
}
```

### Why `PageProps` is useful

Next.js generates route-aware global types during `next dev`, `next build`, or `next typegen`.

With:

```tsx
PageProps<"/blog/[id]">
```

Next.js knows that the route contains an `id` segment and gives you the proper `params` type.

This is better than maintaining your own duplicate route-prop interface.

---

## 9. Correct runtime validation for blog IDs

The old code checked:

```tsx
if (id > 3) {
  notFound();
}
```

This depends on numeric coercion and assumes the only invalid case is a number larger than 3. Values such as other malformed IDs are not represented cleanly by that rule.

The refactor puts the blog data in one shared module:

```ts
export const blogs: Blog[] = [
  { id: 1, title: "Yellow Pail" },
  { id: 2, title: "Green Pail" },
  { id: 3, title: "Blue Pail" },
];

export function getBlogById(id: string): Blog | undefined {
  return blogs.find((blog) => String(blog.id) === id);
}
```

Then the route performs a real lookup:

```tsx
const blog = getBlogById(id);

if (!blog) {
  notFound();
}
```

### Lesson

Do not validate an identifier by making assumptions about its range if the real question is, "Does this resource exist?"

Find the resource and handle the missing case.

---

## 10. `generateStaticParams()` added to the local blog route

Because the three blog IDs are known ahead of time, the dynamic blog route can tell Next.js about them:

```tsx
export function generateStaticParams() {
  return blogs.map((blog) => ({
    id: String(blog.id),
  }));
}
```

Notice the conversion:

```ts
String(blog.id)
```

Dynamic route parameters are strings.

This is another example of the difference between your domain model and your URL model:

```text
Blog.id in application data: number
Route params.id:             string
```

---

## 11. API types simplified

The original types included:

```ts
export type Posts = Post[];
```

and then several call sites repeated annotations such as:

```ts
const { posts }: { posts: Posts } = await getPosts();
```

That syntax is valid TypeScript, but it is unnecessary if `getPosts()` is typed correctly.

The new response type is:

```ts
export interface PostListResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}
```

and the API function returns:

```ts
export function getPosts(): Promise<PostListResponse> {
  // ...
}
```

Now the page can simply write:

```ts
const { posts } = await getPosts();
```

TypeScript already knows that `posts` is `Post[]`.

### Lesson: type at the source

Prefer this:

```ts
function getPosts(): Promise<PostListResponse>
```

and then rely on inference at call sites.

Avoid repeatedly telling TypeScript the same thing:

```ts
const result: PostListResponse = await getPosts();
```

unless the explicit annotation provides a specific benefit.

---

## 12. API code moved from `api/` to `lib/api/`

The original files were:

```text
api/postAPI.ts
api/type.ts
```

They are now:

```text
lib/api/posts.ts
types/post.ts
```

### Why

A top-level folder named `api` can be ambiguous in a Next.js project because Next.js also has API/route-handler concepts.

`lib/api/posts.ts` makes the purpose clearer: this is application data-access code that calls an external API.

The type definitions are separated because they describe domain data rather than request logic.

---

## 13. Removed `.then().catch()` from async functions

The original code used this style:

```ts
return await fetch(url)
  .then((res) => res.json())
  .catch((e) => {
    throw new Error(e);
  });
```

This mixes Promise chaining with `async`/`await`.

The new code consistently uses `async`/`await`:

```ts
const response = await fetch(url);

if (!response.ok) {
  throw new Error(...);
}

return (await response.json()) as Post;
```

### Why this is better

Both Promise chaining and `async`/`await` are valid, but mixing them usually makes control flow harder to read.

More importantly, the old `.catch()` did not solve the biggest HTTP problem.

---

## 14. `fetch()` does not throw for normal HTTP errors

This is a crucial JavaScript/Next.js lesson.

If the server responds with:

```text
404 Not Found
500 Internal Server Error
```

`fetch()` normally resolves to a `Response`. It does not automatically reject the Promise just because the HTTP status is an error.

Therefore this is necessary:

```ts
if (!response.ok) {
  throw new Error(...);
}
```

For single resources, the code treats 404 specially:

```ts
if (response.status === 404) {
  return null;
}
```

So the API layer communicates a useful domain result:

```ts
Promise<Post | null>
```

The page can then decide that a missing resource means a Next.js 404:

```tsx
if (!post) {
  notFound();
}
```

### Separation of responsibility

The API function says:

> The resource was not found.

The page says:

> In this route, that means render the not-found experience.

That separation is cleaner than calling Next.js navigation APIs inside a generic data-access function.

---

## 15. `encodeURIComponent()` for IDs

The API request now uses:

```ts
encodeURIComponent(id)
```

before putting a runtime value into a URL path.

For your current numeric IDs this does not visibly change the URL, but it is a good boundary habit when constructing URLs from arbitrary strings.

---

## 16. TypeScript types do not validate API data at runtime

The API layer contains code such as:

```ts
return (await response.json()) as Post;
```

This is a compile-time assertion. It does **not** prove that the remote server really returned a valid `Post` object.

This distinction is extremely important:

```text
TypeScript type checking -> development/compile time
API JSON                  -> runtime external data
```

For this learning app, the response is typed according to the known DummyJSON contract.

In a production system where external data is untrusted or can change, the next improvement would be runtime validation with a schema library such as Zod, Valibot, ArkType, or a hand-written validator.

For example, the production-level pipeline is conceptually:

```text
fetch
  ↓
response.json() -> unknown
  ↓
runtime schema validation
  ↓
typed Post
  ↓
application
```

Do not confuse `as Post` with validation.

---

## 17. Server Components remain the default

The pages and the `Comment` component do not use `"use client"` because they do not require browser APIs or React client-side interactivity.

For example:

```tsx
export default async function Comment(...) {
  const comment = await promise;
  // ...
}
```

This is an async Server Component.

The button still has:

```tsx
"use client";
```

because it uses an event handler:

```tsx
onClick={handleClick}
```

### Mental rule

Start with a Server Component.

Add `"use client"` only when the component needs something such as:

- `useState`
- `useEffect`
- event handlers
- `window`
- `document`
- `localStorage`
- other browser-only APIs

This keeps unnecessary JavaScript out of the browser bundle.

---

## 18. Client boundary made clearer

The button now accepts typed children:

```tsx
interface ButtonProps {
  children?: ReactNode;
}
```

and uses a named handler:

```tsx
function handleClick() {
  console.log("click");
}
```

This is easier to expand later than keeping all behavior inline.

The pages can render:

```tsx
<Button>Test client interaction</Button>
```

The page itself stays a Server Component while only the interactive button becomes a Client Component.

That composition pattern is central to the App Router.

---

## 19. Suspense fallback fixed

The original code used:

```tsx
<Suspense fallback="<h1>Loading comments....</h1>">
```

That is a string. React would display the characters `<h1>...</h1>` as text rather than creating an actual heading element.

The new version uses JSX:

```tsx
<Suspense fallback={<p role="status">Loading comment…</p>}>
```

### Remember

These are different:

```tsx
fallback="<p>Loading</p>"   // string
fallback={<p>Loading</p>}   // React element
```

---

## 20. Avoided a request waterfall while preserving streaming

The post detail page now does:

```tsx
const postPromise = getPost(id);
const commentPromise = getComment(id);
const post = await postPromise;
```

Both requests start before the first one is awaited.

Then the unresolved comment Promise is passed into the Suspense subtree:

```tsx
<Suspense fallback={<p role="status">Loading comment…</p>}>
  <Comment promise={commentPromise} />
</Suspense>
```

### Why this matters

A slower pattern would be:

```ts
const post = await getPost(id);
const comment = await getComment(id);
```

That creates a waterfall:

```text
get post starts
↓
wait
↓
get post finishes
↓
get comment starts
↓
wait
↓
get comment finishes
```

Starting independent requests together gives:

```text
post starts      comment starts
     \             /
      \           /
       work overlaps
```

At the same time, not awaiting the comment in the page allows Suspense to control that part of the render.

This is a very useful Server Component pattern.

---

## 21. Metadata is typed

Metadata exports now use Next.js's `Metadata` type:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts",
};
```

Dynamic metadata also declares its result:

```tsx
export async function generateMetadata(...): Promise<Metadata> {
  // ...
}
```

This gives editor autocomplete and catches invalid metadata fields.

The root layout also uses a title template:

```ts
title: {
  default: "Woo App by Next",
  template: "%s | Woo App by Next",
}
```

A child page can now specify:

```ts
title: "About"
```

and the final document title can become:

```text
About | Woo App by Next
```

---

## 22. Error boundary typed correctly

`app/error.tsx` must be a Client Component because it uses an effect and the reset callback.

Its props are now explicit:

```tsx
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}
```

This is better than implicit `any` values for `error` and `reset`.

The component still logs the error and gives the user a retry button.

---

## 23. Loading and not-found UI improved

The root loading UI now includes:

```tsx
role="status"
aria-live="polite"
```

This is a small accessibility improvement for assistive technology.

The not-found pages now also provide navigation back to a useful route rather than only displaying static text.

---

## 24. Semantic HTML improved

The refactor uses elements according to their job:

- `<header>` for site header
- `<nav>` for navigation
- `<main>` for page content
- `<article>` for post/comment content
- `<section>` for grouped content
- `<h1>` / `<h2>` for hierarchy

The navigation elements also have labels such as:

```tsx
<nav aria-label="Main navigation">
```

These changes do not alter application logic, but semantic markup improves accessibility and maintainability.

---

## 25. Image usage improved

The old image used:

```tsx
quality={100}
```

That was removed.

Maximum image quality is usually unnecessary and can increase transferred image size without a meaningful visual benefit.

The image now includes a more meaningful `alt` value and a `sizes` hint:

```tsx
<Image
  src={img1}
  alt="Example landscape"
  placeholder="blur"
  sizes="(max-width: 640px) 100vw, 350px"
/>
```

Because this is a static image import, Next.js already knows its intrinsic dimensions.

---

## 26. Component and function names improved

Names such as:

```tsx
function Single()
function Mission() // inside the Vision page
```

were changed to clearer names such as:

```tsx
PostDetailPage
MissionPage
VisionPage
BlogDetailPage
PostsPage
```

### Why naming matters

Names become especially important when reading React DevTools, stack traces, error messages, and larger codebases.

A component name should describe what the component represents, not merely the fact that it is "single" or "a page".

---

## 27. `next.config.ts` and typed routes

The empty JavaScript config was replaced with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
};

export default nextConfig;
```

This does two useful things.

First, the Next configuration itself is type checked.

Second, typed routes allow Next.js to catch many invalid `Link` destinations during development/type checking.

For example, a typo in a statically known route can be detected much earlier than discovering it by clicking a broken link in the browser.

---

## 28. Next.js 16 ESLint migration

The original project used:

```json
"lint": "next lint"
```

and:

```json
"eslint-config-next": "14.0.4"
```

while the application itself used Next.js 16.3.3.

That is a major tooling mismatch.

Next.js 16 removed the `next lint` command. The project now uses the ESLint CLI:

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

and the lint packages now align with the Next.js 16 generation:

```json
"eslint": "^9.0.0",
"eslint-config-next": "^16.3.3"
```

The old `.eslintrc.json` was replaced by modern flat config:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

This includes both the Core Web Vitals rules and TypeScript-specific rules.

---

## 29. Added a separate TypeScript check command

The package scripts now include:

```json
"typecheck": "tsc --noEmit"
```

This does not replace Next.js compilation.

It gives you a fast, explicit way to ask TypeScript:

> Does the project type-check?

A useful development routine is:

```bash
npm run typecheck
npm run lint
npm run build
```

Each command checks a different layer:

```text
typecheck -> TypeScript correctness
lint      -> code-quality/framework rules
build     -> actual Next.js production compilation
```

---

## 30. Why the package lock is not in the refactored ZIP

The uploaded project had a lockfile generated with:

```text
eslint 8
eslint-config-next 14
```

The refactor updates those dependencies for Next.js 16.

A lockfile must exactly represent the dependency graph in `package.json`. Keeping the old lockfile would be incorrect and could make `npm ci` fail.

The execution environment used for this review could not connect to the npm registry, so it could not regenerate a trustworthy lockfile.

Therefore the stale lockfile was intentionally removed.

On your machine, run:

```bash
npm install
```

That will install the updated dependencies and create a new `package-lock.json`.

Commit that generated lockfile to your repository.

---

## 31. Recommended first commands after extracting

Run:

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

If all checks pass, open the application and test these routes:

```text
/
/about
/about/mission
/about/vision
/blog
/blog/1
/blog/999
/post
/post/1
```

Expected behavior:

- `/blog/1` resolves a known local blog.
- `/blog/999` uses the nested blog not-found UI.
- `/post` fetches ten posts.
- `/post/1` renders the post and streams the comment section through Suspense.

---

## 32. What I deliberately did not add

A professional codebase does not mean installing every possible library.

I deliberately did not add:

- Redux/Zustand: there is no shared client state requiring them.
- React Query/SWR: your current API use is server-side and simple.
- Zod: useful for runtime validation, but adding it would distract from the current Next.js/TypeScript lesson.
- a custom design system: the app is still a learning project.
- route groups: the current route tree is small enough without them.
- middleware/proxy: there is no authentication or request-rewrite requirement.
- Server Actions: the app does not mutate data yet.

The principle is important: architecture should solve existing complexity, not create new complexity in anticipation of problems you do not have.

---

## 33. Next concepts to learn from this project

Once you are comfortable with this version, the natural next steps are:

1. Add runtime API validation with Zod and make `response.json()` start as `unknown`.
2. Add post comments by post ID instead of fetching one comment by the same numeric ID.
3. Add an `app/post/[id]/loading.tsx` to compare route-level loading UI with component-level Suspense.
4. Add a POST form using a Server Action.
5. Validate that Server Action with Zod.
6. Add a database and compare typed database results with external API results.
7. Add authentication and learn which code belongs on the server versus client.
8. Add tests for `getBlogById()` and the API data layer.
9. Add environment variables for the API base URL if it becomes configurable.
10. Add a production error-reporting service rather than relying on `console.error`.

---

## 34. Core mental model to keep

The most useful architecture model for this project is:

```text
Browser
  ↓
Next.js route (app/.../page.tsx)
  ↓
Server Component
  ↓
lib/api/posts.ts
  ↓
External API
  ↓
typed domain model (types/post.ts)
  ↓
Server-rendered UI
  ↓
small Client Components only where interaction is required
```

And for a dynamic route:

```text
/post/1
  ↓
PageProps<"/post/[id]">
  ↓
await params
  ↓
id: string
  ↓
getPost(id)
  ↓
Post | null
  ↓
post exists? render : notFound()
```

And for TypeScript inference:

```text
getPosts(): Promise<PostListResponse>
               ↓
await getPosts()
               ↓
PostListResponse
               ↓
const { posts } = ...
               ↓
posts: Post[]
```

That last example is why this is now enough:

```ts
const { posts } = await getPosts();
```

You no longer need to repeat:

```ts
const { posts }: { posts: Posts } = await getPosts();
```

Type the source well, then let TypeScript infer downstream values.
