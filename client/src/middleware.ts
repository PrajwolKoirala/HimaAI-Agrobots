// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// const locales = ['en', 'nep']

// function getLocale(request: NextRequest) {
//   // Check in this order:
//   // 1. localStorage (via cookie)
//   // 2. Accept-Language header
//   // 3. Default to 'en'
  
//   const localeCookie = request.cookies.get('preferred-language')
//   if (localeCookie && locales.includes(localeCookie.value)) {
//     return localeCookie.value
//   }

//   const acceptLanguage = request.headers.get('accept-language')?.split(',')[0].split('-')[0]
//   if (acceptLanguage && locales.includes(acceptLanguage)) {
//     return acceptLanguage
//   }

//   return 'en'
// }

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname
  
//   // Check if the pathname already has a locale
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   )

//   if (pathnameHasLocale) return

//   // Redirect to pathname with locale
//   const locale = getLocale(request)
//   request.nextUrl.pathname = `/${locale}${pathname}`
//   return NextResponse.redirect(request.nextUrl)
// }

// export const config = {
//   matcher: [
//     // Skip all internal paths (_next)
//     '/((?!_next|api|favicon.ico).*)',
//   ],
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'nep']

function getLocale(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameLocale = pathname.split('/')[1]
  
  if (locales.includes(pathnameLocale)) {
    return pathnameLocale
  }
  
  const localeCookie = request.cookies.get('preferred-language')
  if (localeCookie && locales.includes(localeCookie.value)) {
    return localeCookie.value
  }

  return 'en'
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico).*)',
  ],
}