import { NextResponse } from 'next/server'

const ALLOWED_HOSTS = [
  'ads.sanddiamondstravel.com',
]

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const path = url.searchParams.get('path') ?? '/'

    // Only allow proxying to the configured host
    const targetOrigin = `https://${ALLOWED_HOSTS[0]}`
    const targetUrl = new URL(path, targetOrigin).toString()

    // Fetch the remote HTML
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'SandDiamondsProxy/1.0',
        Accept: 'text/html',
      },
    })

    if (!res.ok) {
      return new NextResponse('Remote fetch failed', { status: 502 })
    }

    let html = await res.text()

    // 1. Strip META CSP tags (may contain frame-ancestors directives)
    html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '')

    // 2. Rewrite root-relative asset references (src="/…", href="/…" ,url('/…'))
    //    to absolute remote-origin URLs.  <base href> does NOT help with paths
    //    starting with "/" — the browser ignores base for those.
    html = html
      // attribute: src="/  or  href="/  (not protocol-relative "//")
      .replace(/((?:src|href|action)=["'])\/(?!\/)/gi, `$1${targetOrigin}/`)
      // inline style: url('/  or  url("/  or  url(/
      .replace(/url\((['"]?)\/(?!\/)/gi, `url($1${targetOrigin}/`)
      // srcset entries starting with "/"
      .replace(/srcset=(["'])([^"']+)\1/gi, (_m, q, val) => {
        const rewritten = val.replace(/(^|,\s*)\/(?!\/)/g, `$1${targetOrigin}/`)
        return `srcset=${q}${rewritten}${q}`
      })

    // 3. Inject a base href as a fallback for any remaining relative paths
    html = html.replace(/<head([^>]*)>/i, (m) => `${m}\n<base href="${targetOrigin}/" />`)

    // 4. Return as same-origin HTML — omit X-Frame-Options so the iframe loads
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Explicitly allow same-origin framing for this proxied response
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch (err) {
    return new NextResponse(String(err), { status: 500 })
  }
}
