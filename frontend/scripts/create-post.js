#!/usr/bin/env node

/**
 * create-post.js
 * 
 * A utility script to generate new blog posts with the correct structure.
 * Usage: node scripts/create-post.js "My Post Title"
 */

const fs = require('fs');
const path = require('path');

// Get the post title from command line arguments
const title = process.argv[2];

if (!title) {
  console.error('Please provide a post title. Example: node scripts/create-post.js "My New Post Title"');
  process.exit(1);
}

// Generate a slug from the title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading and trailing hyphens
}

const slug = generateSlug(title);
const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
const blogDir = path.join(process.cwd(), 'content/blog');
const filePath = path.join(blogDir, `${slug}.mdx`);

// Ensure the blog directory exists
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
  console.log(`Created blog directory: ${blogDir}`);
}

// Check if a post with this slug already exists
if (fs.existsSync(filePath)) {
  console.error(`A post with slug "${slug}" already exists at ${filePath}`);
  process.exit(1);
}

// Template for the new post
const postTemplate = `---
title: "${title}"
date: "${date}"
summary: "Add a summary for your post here"
tags: [example, draft]
---

# ${title}

This is your new blog post. Start writing here!

## Subheading

Add your content here. You can use **Markdown** and *styling*.

- List item 1
- List item 2
- List item 3

### Code Example

\`\`\`javascript
// Add your code here
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`
`;

// Write the file
fs.writeFileSync(filePath, postTemplate);

console.log(`
✅ Successfully created new blog post!
    Title: ${title}
    Slug: ${slug}
    File: ${filePath}
    Date: ${date}

You can now edit your post at:
${filePath}
`); 