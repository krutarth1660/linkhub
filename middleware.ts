import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Check if request is for a subdomain
  const subdomain = hostname.split('.')[0]
  const isSubdomain = hostname.includes('.') && 
                     !hostname.includes('localhost:') && 
                     subdomain !== 'www' && 
                     subdomain !== 'app'

  if (isSubdomain) {
    // Rewrite subdomain requests to username profile pages
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    const token = await getToken({ req: request })
    
    if (!token) {
      url.pathname = '/auth/signin'
      url.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (url.pathname.startsWith('/auth/')) {
    const token = await getToken({ req: request })
    
    if (token) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}