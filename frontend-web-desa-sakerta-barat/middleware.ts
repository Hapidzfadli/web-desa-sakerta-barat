import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode, JwtPayload as DefaultJwtPayload } from 'jwt-decode';
import { API_URL } from './constants';

export interface CustomJwtPayload extends DefaultJwtPayload {
  role: string;
  username: string;
}

export const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPrivatePath = path.startsWith('/member') || path.startsWith('/admin');
  const token = request.cookies.get('session')?.value;

  if (isPrivatePath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      const isValid = await validateToken(token);
      if (!isValid) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userRole = decodedToken.role || 'WARGA';

      if (
        path.startsWith('/admin') &&
        userRole !== 'ADMIN' &&
        userRole !== 'KADES'
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (path.startsWith('/member') && userRole !== 'WARGA') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.error('Error processing token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/member/:path*', '/admin/:path*'],
};
