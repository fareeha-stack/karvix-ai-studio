import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AuthLayout, ErrorNotice, SignInForm } from '@/app/components/auth-ui'
import { getInsForgeServerClient } from '@/lib/insforge'

type SignInSearchParams = Promise<{ verified?: string; error?: string | string[] }>

export default function SignInPage({ searchParams }: { searchParams: SignInSearchParams }) {
  return <Suspense fallback={<div className="route-loading"><span className="brand-mark">✦</span><p>Preparing sign in…</p></div>}><SignInContent searchParams={searchParams} /></Suspense>
}

async function SignInContent({ searchParams }: { searchParams: SignInSearchParams }) {
  const client = await getInsForgeServerClient()
  const { data: current } = await client.auth.getCurrentUser()
  if (current?.user) redirect('/')

  const { data: config } = await client.auth.getPublicAuthConfig()
  const query = await searchParams
  const notice = query.verified === '1' ? 'Your email is verified. Welcome back!' : undefined
  return <AuthLayout heading="Welcome back" subheading="Sign in to pick up right where your imagination left off.">
    <ErrorNotice error={typeof query.error === 'string' ? query.error : undefined} />
    <SignInForm providers={config?.oAuthProviders ?? []} notice={notice} />
  </AuthLayout>
}

