// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { Locale, routing } from '@/i18n'

const handleI18n = createMiddleware(routing)

async function handleAuth(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  /*   if (pathname.startsWith('/cashier')) {
    return NextResponse.next()
  } */
  if (pathname.startsWith('/employee')) {
    return NextResponse.next()
  }

  return null
}

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && routing.locales.includes(value as Locale)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // --- EXCLUDE static files & special routes from locale redirect ---
  // Skip robots, sitemap, any file with an extension (png, css, js, ico, txt, xml, json...), _next, api, etc.
  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    // any path that looks like a file with extension -> skip
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Auth checks (keeps your auth flow)
  const authResp = await handleAuth(req)
  if (authResp) return authResp

  // Nếu đường dẫn chưa có locale prefix, thử lấy từ cookie

  const hasLocalePrefix = routing.locales.some(l =>
    pathname.startsWith(`/${l}`),
  )

  if (!hasLocalePrefix) {
    // thử nhiều tên cookie phổ biến nếu cần
    const cookieLocale =
      req.cookies.get('locale')?.value ||
      req.cookies.get('NEXT_LOCALE')?.value ||
      req.cookies.get('locale_preference')?.value

    // chỉ redirect khi cookieLocale là một Locale hợp lệ
    if (isLocale(cookieLocale)) {
      const url = req.nextUrl.clone()
      // nếu pathname là '/' thì không thêm double-slash
      url.pathname = `/${cookieLocale}${pathname === '/' ? '' : pathname}`
      return NextResponse.redirect(url)
    }
  }
  // Finally run i18n middleware for other pages
  return handleI18n(req)
}

// ALSO update matcher to explicitly exclude robots.txt and sitemap.xml
export const config = {
  matcher: [
    // exclude api, _next, static images, favicon, robots/sitemap
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
