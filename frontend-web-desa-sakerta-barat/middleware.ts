import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from "jwt-decode";
import { JwtPayload as DefaultJwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends DefaultJwtPayload {
  role: string;
  username: string;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPrivatePath = path.startsWith('/member') || path.startsWith('/admin')
  const token = request.cookies.get('session')?.value
  console.log(token)
  if (isPrivatePath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userRole = decodedToken.role || 'WARGA';
      console.log(decodedToken)

      if (path.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      if (path.startsWith('/member') && userRole !== 'WARGA') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/admin/:path*']
}