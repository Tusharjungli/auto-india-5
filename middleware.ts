import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const theme = request.cookies.get('theme')?.value || 'system';
  const response = NextResponse.next();

  // Set the theme mode in the response header so it’s available at render time
  response.headers.set('x-theme', theme);
  return response;
}
