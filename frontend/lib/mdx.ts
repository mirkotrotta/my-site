import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { cache } from "react";

// Define constants for the blog directory paths
const BASE_BLOG_DIR = path.join(process.cwd(), "content/blog");
const BLOG_DIR = {
  en: path.join(BASE_BLOG_DIR, "en"),
  de: path.join(BASE_BLOG_DIR, "de")
};

// Default language to fall back to
const DEFAULT_LANGUAGE = 'en';

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
  language?: string;
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
export function isValidPostSlug(slug: string, language: string = DEFAULT_LANGUAGE): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Clean the slug to ensure consistent file access
  const sanitized = sanitizeSlug(slug);
  if (!sanitized) return false;
  
  // Get the blog directory for the specified language, falling back to default
  const blogDir = BLOG_DIR[language as keyof typeof BLOG_DIR] || BLOG_DIR[DEFAULT_LANGUAGE];
  
  // Check if the corresponding MDX file exists
  const filePath = path.join(blogDir, `${sanitized}.mdx`);
  return fs.existsSync(filePath);
}

/**
 * Get the absolute file path for a blog post by its slug
 */
export function getPostFilePath(slug: string, language: string = DEFAULT_LANGUAGE): string {
  // Get the blog directory for the specified language, falling back to default
  const blogDir = BLOG_DIR[language as keyof typeof BLOG_DIR] || BLOG_DIR[DEFAULT_LANGUAGE];
  return path.join(blogDir, `${slug}.mdx`);
}

/**
 * Extract slug from a filename by removing the .mdx extension
 */
export function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, '');
}

/**
 * Check if the content directory for a language exists
 */
export function languageHasContent(language: string): boolean {
  const langDir = BLOG_DIR[language as keyof typeof BLOG_DIR];
  return Boolean(langDir && fs.existsSync(langDir));
}

// Cache the post data results using React's cache function
export const getPostData = cache(async (slug: string, language: string = DEFAULT_LANGUAGE): Promise<{
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  mdxSource: any;
  language: string;
} | null> => {
  try {
    // Validate slug input
    if (!slug || typeof slug !== 'string') {
      console.error(`Invalid slug provided: ${slug}`);
      return null;
    }

    // If the post doesn't exist in the requested language but exists in the default language,
    // fallback to the default language
    if (!isValidPostSlug(slug, language) && isValidPostSlug(slug, DEFAULT_LANGUAGE)) {
      language = DEFAULT_LANGUAGE;
    }

    // Build file path and check existence
    const filePath = getPostFilePath(slug, language);
    if (!fs.existsSync(filePath)) {
      console.error(`Post not found: ${slug} in language ${language}`);
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
      language,
    };
  } catch (error) {
    console.error(`Unexpected error processing post ${slug}:`, error);
    return null;
  }
});

export async function getPostBySlug(
  slug: string,
  language: string = DEFAULT_LANGUAGE
): Promise<{
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  language: string;
} | null> {
  // If the post doesn't exist in the requested language but exists in the default language,
  // fallback to the default language
  if (!isValidPostSlug(slug, language) && isValidPostSlug(slug, DEFAULT_LANGUAGE)) {
    language = DEFAULT_LANGUAGE;
  }
  
  // Final validation
  if (!isValidPostSlug(slug, language)) return null;

  const filePath = getPostFilePath(slug, language);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as Frontmatter,
    content,
    language,
  };
}

/**
 * Get all blog posts for a specific language with consistent slug handling
 */
export function getAllPosts(language: string = DEFAULT_LANGUAGE): PostData[] {
  // Get the blog directory for the specified language, falling back to default if not available
  const langDir = BLOG_DIR[language as keyof typeof BLOG_DIR];
  
  if (!langDir || !fs.existsSync(langDir)) {
    console.warn(`Blog directory not found for language ${language}, falling back to ${DEFAULT_LANGUAGE}`);
    return getAllPosts(DEFAULT_LANGUAGE);
  }

  try {
    const files = fs.readdirSync(langDir);
    const posts: PostData[] = [];

    for (const file of files) {
      if (!file.endsWith('.mdx')) continue;
      
      // Derive slug directly from filename
      const slug = getSlugFromFilename(file);
      const filePath = path.join(langDir, file);
      
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        
        // Skip posts that explicitly specify a different language in frontmatter
        const postLang = data.lang as string;
        if (postLang && postLang !== language) {
          continue;
        }
        
        posts.push({
          slug,
          frontmatter: data as Frontmatter,
          language
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
    console.error(`Error reading blog directory for language ${language}:`, error);
    
    // If there was an error with the requested language and it's not already the default,
    // try falling back to the default language
    if (language !== DEFAULT_LANGUAGE) {
      console.warn(`Falling back to ${DEFAULT_LANGUAGE} language for blog posts`);
      return getAllPosts(DEFAULT_LANGUAGE);
    }
    
    return [];
  }
}
