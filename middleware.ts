// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  response.headers.set('x-next-pathname', pathname);  // Set the pathname in response headers
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],  // Match /dashboard and all its subroutes
};
