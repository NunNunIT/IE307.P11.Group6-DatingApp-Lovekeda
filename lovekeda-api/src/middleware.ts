import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECRET_KEY } from './utils/constants';

export function middleware(request: NextRequest) {
  const secretKey = request.headers.get(SECRET_KEY);

  if (!secretKey || secretKey !== process.env.SECRET_KEY) {
    return new NextResponse(
      JSON.stringify({ message: 'Unauthorized - Missing secret key' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};