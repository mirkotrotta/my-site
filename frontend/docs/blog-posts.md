# Blog Post Management

This document explains how blog posts are structured and managed in our Next.js application.

## Directory Structure

All blog posts are stored as MDX files in the `content/blog` directory, following this pattern:

```
content/blog/
  ├─ my-first-post.mdx
  ├─ another-post.mdx
  └─ hello-world.mdx
```

## Slug to File Mapping

We maintain a predictable mapping between URL slugs and MDX files:

1. Each blog post is accessible at `/blog/[slug]`
2. The slug is derived directly from the filename (without the `.mdx` extension)
3. For example, a file named `hello-world.mdx` will be accessible at `/blog/hello-world`

This mapping is implemented in the `generateStaticParams` function which:
- Reads all files in the `content/blog` directory
- Filters for `.mdx` files
- Creates a slug parameter for each file by removing the `.mdx` extension

## Creating a New Blog Post

There are two ways to create a new blog post:

### 1. Using the CLI Tool

Run the following command:

```bash
npm run new-post "My New Blog Post Title"
```

This will:
- Generate a slug from the title (e.g., `my-new-blog-post-title`)
- Create an MDX file in the correct location with basic frontmatter
- Set the current date in the frontmatter

### 2. Manually

1. Create a new `.mdx` file in the `content/blog` directory
2. Name the file according to the URL slug you want (e.g., `my-post.mdx` for `/blog/my-post`)
3. Add the required frontmatter:

```md
---
title: "Your Post Title"
date: "YYYY-MM-DD"
summary: "A brief summary of your post"
tags: [tag1, tag2]
---

# Your Post Content

Start writing your content here...
```

## Required Frontmatter

Each blog post must include:

- `title` (string): The title of your blog post
- `date` (string): The publication date in YYYY-MM-DD format

Optional frontmatter:

- `summary` (string): A brief description used in listings and SEO
- `tags` (array): An array of tags for categorizing the post

## Slug Generation Rules

When a slug is generated from a title (via the `new-post` script):

1. All text is converted to lowercase
2. Special characters are removed (except hyphens)
3. Spaces are replaced with hyphens
4. Multiple consecutive hyphens are consolidated
5. Leading and trailing hyphens are removed

For example, "Hello, World! This is a Test" becomes `hello-world-this-is-a-test`.

## Code Implementation

The key files for this system are:

- `frontend/lib/mdx.ts`: Contains utility functions for reading and validating blog posts
- `frontend/app/blog/[slug]/page.tsx`: Implements the slug-based routing with `generateStaticParams`
- `frontend/scripts/create-post.js`: Helper script for creating new posts

## Best Practices

1. Always use the `new-post` script to ensure consistent formatting
2. Don't manually change filenames after creation - it will change the URL
3. Use descriptive filenames that reflect the content of the post
4. Keep slugs reasonably short for better URLs 