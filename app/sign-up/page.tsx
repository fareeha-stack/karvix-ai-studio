import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AuthLayout, SignUpForm } from '@/app/components/auth-ui'
import { getInsForgeServerClient } from '@/lib/insforge'

export default function SignUpPage() {
  return <Suspense fallback={<div className="route-loading"><span className="brand-mark">✦</span><p>Preparing your account…</p></div>}><SignUpContent /></Suspense>
}

async function SignUpContent() {
  const client = await getInsForgeServerClient()
  const { data: current } = await client.auth.getCurrentUser()
  if (current?.user) redirect('/')

  const { data: config } = await client.auth.getPublicAuthConfig()
  return <AuthLayout heading="Create your account" subheading="Your next creative chapter starts with one small step.">
    <SignUpForm providers={config?.oAuthProviders ?? []} />
  </AuthLayout>
}

