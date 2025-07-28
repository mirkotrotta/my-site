import { NextResponse } from 'next/server';

// Get base URL based on environment
function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000';
  }
  // In production, you might want to use an environment variable
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
}

export async function GET() {
  const baseUrl = getBaseUrl();
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin or private areas (if any)
Disallow: /api/
Disallow: /admin/
Disallow: /private/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
} 