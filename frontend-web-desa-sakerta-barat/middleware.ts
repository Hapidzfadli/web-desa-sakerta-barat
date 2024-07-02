import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPrivatePath = path.startsWith('/member') || path.startsWith('/admin')
  const token = request.cookies.get('session')?.value

  if (isPrivatePath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (path.startsWith('/admin')) {
    const isAdmin = checkIfUserIsAdmin(token)
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/admin/:path*']
}

function checkIfUserIsAdmin(token: string | undefined): boolean {
  // Implement your admin check logic here
  return false
}