import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createAuthActions } from '@insforge/sdk/ssr'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('insforge_code')
  const hasError = request.nextUrl.searchParams.has('error')
  const verifier = (await cookies()).get('insforge_code_verifier')?.value
  if (hasError || !code || !verifier) {
    const response = NextResponse.redirect(new URL('/sign-in?error=oauth_failed', request.url))
    response.cookies.delete('insforge_code_verifier')
    return response
  }

  const response = NextResponse.redirect(new URL('/', request.url))
  const auth = createAuthActions({ requestCookies: request.cookies, responseCookies: response.cookies })
  const { data, error } = await auth.exchangeOAuthCode(code, verifier)
  if (error || !data?.user) {
    const failed = NextResponse.redirect(new URL('/sign-in?error=oauth_failed', request.url))
    failed.cookies.delete('insforge_code_verifier')
    return failed
  }

  response.cookies.delete('insforge_code_verifier')
  return response
}

