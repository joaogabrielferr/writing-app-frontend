import { NextResponse, type NextRequest } from 'next/server';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //middlware used just for optimistic check for refresh token, refreshToken is http-only
    console.log("middleware:",pathname);
  if (pathname === '/') {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME);
    console.log("ON MIDDLEWARE:",refreshToken);
    if (refreshToken && refreshToken.value) {
      const feedUrl = new URL('/feed', request.nextUrl.origin); // Internal path for feed content
      return NextResponse.rewrite(feedUrl);
    } else {
      // No refresh token, definitely not logged in from server's perspective
      console.log('Middleware: No refresh token, rewriting to /app-landing for path /');
      const landingUrl = new URL('/app-landing', request.nextUrl.origin);
      return NextResponse.rewrite(landingUrl);
    }
  }

  //  For other protected routes, client-side will handle full auth check

  return NextResponse.next(); // Allow other requests
}

// Matcher: Apply middleware to relevant paths.
export const config = {
  matcher: [
    '/', // For the root landing/feed decision, client side auth will deal with other pages
  ],
};