'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { i18n } from '../i18n.config';

// Define a constant for the blog directory path
const BLOG_BASE_DIR = path.join(process.cwd(), "content/blog");

// Interface definitions
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
  language: string;
}

/**
 * Extract slug from a filename by removing the .mdx extension
 */
function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, '');
}

/**
 * Server action to get all blog posts
 */
export async function fetchAllPosts(language?: string): Promise<PostData[]> {
  try {
    const posts: PostData[] = [];
    
    // If language is specified, only fetch posts for that language
    const languages = language ? [language] : i18n.locales;
    
    for (const lang of languages) {
      const langDir = path.join(BLOG_BASE_DIR, lang);
      
      // Skip if the language directory doesn't exist
      if (!fs.existsSync(langDir)) {
        console.warn(`Blog directory not found for language ${lang}: ${langDir}`);
        continue;
      }
      
      const files = fs.readdirSync(langDir);
      
      for (const file of files) {
        if (!file.endsWith('.mdx')) continue;
        
        // Derive slug directly from filename
        const slug = getSlugFromFilename(file);
        const filePath = path.join(langDir, file);
        
        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const { data } = matter(raw);
          
          posts.push({
            slug,
            frontmatter: data as Frontmatter,
            language: lang
          });
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
          // Skip this file on error
        }
      }
    }
    
    // Sort posts by date (newest first)
    return posts.sort((a, b) => 
      b.frontmatter.date.localeCompare(a.frontmatter.date)
    );
  } catch (error) {
    console.error("Error reading blog directories:", error);
    return [];
  }
}

/**
 * Server action to get blog posts for a specific language
 */
export async function fetchPostsByLanguage(language: string): Promise<PostData[]> {
  return fetchAllPosts(language);
} 