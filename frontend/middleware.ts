// frontend/middleware.ts
import {NextRequest, NextResponse} from 'next/server';
import Negotiator from 'negotiator';
import {locales, defaultLocale} from './i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  const negotiator = new Negotiator({headers: negotiatorHeaders});
  const preferredLocale = negotiator.language(locales);
  return preferredLocale || defaultLocale;
}

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax'
    });
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except ones with a file extension or API/static paths
    '/((?!api|_next|favicon.ico|.*\..*).*)'
  ]
};
