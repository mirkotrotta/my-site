import { NextResponse, NextRequest } from 'next/server';

// Define supported languages
const supportedLanguages = ['en', 'de'];
const defaultLanguage = 'de';

// Paths that should be excluded from language redirection
const excludedPaths = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/images/',
  '/fonts/'
];

function getLanguageFromCookie(request: NextRequest): string | null {
  const cookie = request.cookies.get('NEXT_LOCALE');
  return cookie?.value || null;
}

function getLanguageFromHeader(request: NextRequest): string | null {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (!acceptLanguage) return null;

  // Extract languages and their quality values
  const languages = acceptLanguage.split(',')
    .map(lang => {
      const [language, quality = 'q=1.0'] = lang.trim().split(';');
      const q = parseFloat(quality.replace('q=', ''));
      return { language: language.split('-')[0], q };
    })
    .sort((a, b) => b.q - a.q);

  // Find the first supported language
  const matchedLanguage = languages.find(lang => 
    supportedLanguages.includes(lang.language)
  );

  return matchedLanguage ? matchedLanguage.language : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip excluded paths
  if (excludedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Handle /blog routes to redirect to /{lang}/blog
  if (pathname.startsWith('/blog') || pathname === '/blog') {
    const cookieLanguage = getLanguageFromCookie(request);
    const headerLanguage = getLanguageFromHeader(request);
    const language = cookieLanguage || headerLanguage || defaultLanguage;
    
    const newPath = pathname.replace(/^\/blog/, `/${language}/blog`);
    
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    
    return NextResponse.redirect(url);
  }
  
  // Check if we're at the root path or if the path doesn't start with a language
  if (pathname === '/' || !supportedLanguages.some(lang => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`)) {
    // Determine which language to use
    const cookieLanguage = getLanguageFromCookie(request);
    const headerLanguage = getLanguageFromHeader(request);
    const language = cookieLanguage || headerLanguage || defaultLanguage;
    
    // Build new path with language prefix if it's not just the root
    const newPath = pathname === '/' ? `/${language}` : `/${language}${pathname}`;
    
    // Redirect to the appropriate language route
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    
    return NextResponse.redirect(url);
  }

  // For other paths, let Next.js handle routing
  return NextResponse.next();
}

// Configure paths to match
export const config = {
  matcher: [
    // Match all paths except for excluded ones
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|fonts).*)',
  ],
}; 