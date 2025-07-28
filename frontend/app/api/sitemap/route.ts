import { NextResponse } from 'next/server';
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

// Generate sitemap XML
function generateSitemapXml(urls: Array<{
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}>): string {
  const baseUrl = getBaseUrl();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export async function GET() {
  try {
    const urls: Array<{
      loc: string;
      lastmod?: string;
      changefreq: string;
      priority: number;
    }> = [];

    // Add static pages for both languages
    for (const lang of languages) {
      for (const page of staticPages) {
        const path = page === '' ? `/${lang}` : `/${lang}/${page}`;
        urls.push({
          loc: path,
          changefreq: page === '' ? 'weekly' : 'monthly',
          priority: page === '' ? 1.0 : 0.8
        });
      }
    }

    // Add blog posts for both languages
    for (const lang of languages) {
      try {
        const posts = getAllPosts(lang);
        for (const post of posts) {
          urls.push({
            loc: `/${lang}/blog/${post.slug}`,
            lastmod: post.frontmatter.date,
            changefreq: 'monthly',
            priority: 0.6
          });
        }
      } catch (error) {
        console.error(`Error fetching posts for language ${lang}:`, error);
        // Continue with other languages even if one fails
      }
    }

    // Generate XML
    const sitemapXml = generateSitemapXml(urls);

    // Return XML response with proper headers
    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 