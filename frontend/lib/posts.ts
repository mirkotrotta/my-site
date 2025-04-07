// Re-export the types from mdx.ts
export type { Frontmatter } from './mdx';

// Import the actual implementation from mdx.ts, but we'll modify how it's used
import { getAllPosts as getAll, getPostBySlug as getPost } from './mdx';

// Re-export the getAllPosts function directly
export const getAllPosts = getAll;

// Create a wrapper for getPostBySlug that handles serialization differences
export async function getPostBySlug(slug: string) {
  try {
    // Call the original function
    return await getPost(slug);
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
} 