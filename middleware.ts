import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/admin')) {
    const userCookie = request.cookies.get('metinport_user')
    
    if (!userCookie) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    try {
      const user = JSON.parse(userCookie.value)
      
      if (user.userType !== 'super_admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
