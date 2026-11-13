import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { StudioDashboard } from '@/app/components/studio-dashboard'
import { getInsForgeServerClient } from '@/lib/insforge'

export default function Home() {
  return <Suspense fallback={<div className="route-loading"><span className="brand-mark">✦</span><p>Opening your studio…</p></div>}><AuthenticatedHome /></Suspense>
}

async function AuthenticatedHome() {
  const client = await getInsForgeServerClient()
  const { data } = await client.auth.getCurrentUser()
  if (!data?.user) redirect('/sign-in')
  const { data: profile } = await client.database
    .from('users')
    .select('name')
    .eq('id', data.user.id)
    .maybeSingle()
  return <StudioDashboard email={data.user.email ?? 'creator@karvix.studio'} displayName={profile?.name ?? undefined} />
}
