import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { cache } from "react";

// Define a constant for the blog directory path
const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface Frontmatter {
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  coverImage?: string;
}

export interface PostData {
  slug: string;
  frontmatter: Frontmatter;
}

/**
 * Sanitize a slug to ensure it's safe for file operations
 * and follows a consistent pattern
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Replace non-alphanumeric characters (except hyphens) with hyphens
  // Convert to lowercase for consistency
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single one
    .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Validate that a given slug corresponds to a valid MDX file
 */
export function isValidPostSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Clean the slug to ensure consistent file access
  const sanitized = sanitizeSlug(slug);
  if (!sanitized) return false;
  
  // Check if the corresponding MDX file exists
  const filePath = path.join(BLOG_DIR, `${sanitized}.mdx`);
  return fs.existsSync(filePath);
}

/**
 * Get the absolute file path for a blog post by its slug
 */
export function getPostFilePath(slug: string): string {
  return path.join(BLOG_DIR, `${slug}.mdx`);
}

/**
 * Extract slug from a filename by removing the .mdx extension
 */
export function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, '');
}

// Cache the post data results using React's cache function
export const getPostData = cache(async (slug: string): Promise<{
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  mdxSource: any;
} | null> => {
  try {
    // Validate slug input
    if (!slug || typeof slug !== 'string') {
      console.error(`Invalid slug provided: ${slug}`);
      return null;
    }

    // Build file path and check existence
    const filePath = getPostFilePath(slug);
    if (!fs.existsSync(filePath)) {
      console.error(`Post not found: ${slug}`);
      return null;
    }

    // Read and parse MDX content
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw || raw.trim() === '') {
      console.error(`Post is empty: ${slug}`);
      return null;
    }

    // Parse frontmatter with error handling
    let parsed;
    try {
      parsed = matter(raw);
    } catch (e) {
      console.error(`Error parsing MDX frontmatter for ${slug}:`, e);
      return null;
    }

    const { data, content } = parsed;

    // Validate required frontmatter fields
    if (!data.title || typeof data.title !== 'string') {
      console.error(`Post ${slug} is missing required 'title' frontmatter`);
      return null;
    }

    if (!data.date || !(new Date(data.date)).getTime()) {
      console.error(`Post ${slug} is missing or has invalid 'date' frontmatter`);
      return null;
    }

    // Serialize MDX content
    let mdxSource;
    try {
      mdxSource = await serialize(content, {
        // Add MDX parsing options to better handle images
        parseFrontmatter: true,
        mdxOptions: {
          development: process.env.NODE_ENV === 'development',
          remarkPlugins: [],
          rehypePlugins: [],
          format: 'mdx',
        }
      });
    } catch (e) {
      console.error(`Error serializing MDX for ${slug}:`, e);
      return null;
    }

    // Return complete post data
    return {
      slug,
      frontmatter: data as Frontmatter,
      content,
      mdxSource,
    };
  } catch (error) {
    console.error(`Unexpected error processing post ${slug}:`, error);
    return null;
  }
});

export async function getPostBySlug(
  slug: string
): Promise<{
  slug: string;
  frontmatter: Frontmatter;
  content: string;
} | null> {
  if (!isValidPostSlug(slug)) return null;

  const filePath = getPostFilePath(slug);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as Frontmatter,
    content,
  };
}

/**
 * Get all blog posts with consistent slug handling
 */
export function getAllPosts(): PostData[] {
  // Ensure the blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`Blog directory not found: ${BLOG_DIR}`);
    return [];
  }

  try {
    const files = fs.readdirSync(BLOG_DIR);
    const posts: PostData[] = [];

    for (const file of files) {
      if (!file.endsWith('.mdx')) continue;
      
      // Derive slug directly from filename
      const slug = getSlugFromFilename(file);
      const filePath = path.join(BLOG_DIR, file);
      
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        
        posts.push({
          slug,
          frontmatter: data as Frontmatter
        });
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        // Skip this file on error
      }
    }
    
    // Sort posts by date (newest first)
    return posts.sort((a, b) => 
      b.frontmatter.date.localeCompare(a.frontmatter.date)
    );
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}
