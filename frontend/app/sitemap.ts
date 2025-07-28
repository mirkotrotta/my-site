import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

// Define static pages available in both languages
const staticPages = [
  '', // homepage
  'about',
  'contact', 
  'projects',
  'resume',
  'privacy',
  'terms',
  'impressum'
];

// Define supported languages
const languages = ['en', 'de'];

// Get base URL based on environment
function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000';
  }
  // In production, you might want to use an environment variable
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const sitemap: MetadataRoute.Sitemap = [];

  // Add static pages for both languages
  for (const lang of languages) {
    for (const page of staticPages) {
      const path = page === '' ? `/${lang}` : `/${lang}/${page}`;
      sitemap.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8
      });
    }
  }

  // Add blog posts for both languages
  for (const lang of languages) {
    try {
      const posts = getAllPosts(lang);
      for (const post of posts) {
        sitemap.push({
          url: `${baseUrl}/${lang}/blog/${post.slug}`,
          lastModified: new Date(post.frontmatter.date),
          changeFrequency: 'monthly',
          priority: 0.6
        });
      }
    } catch (error) {
      console.error(`Error fetching posts for language ${lang}:`, error);
      // Continue with other languages even if one fails
    }
  }

  return sitemap;
} 