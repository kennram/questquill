import { type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const studentSession = request.cookies.get('student_session')

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. Block students (cookie only) from Teacher Dashboard
  if (pathname.startsWith('/dashboard') && studentSession && !user) {
    return NextResponse.redirect(new URL('/student/dashboard', request.url))
  }

  // 2. Block teachers (Supabase user) from Student Dashboard to avoid bleed
  if (pathname.startsWith('/student/dashboard') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Redirect completely unauthenticated users to login
  if (!user && !studentSession && (pathname.startsWith('/dashboard') || pathname.startsWith('/student/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/student/dashboard/:path*'],
}
