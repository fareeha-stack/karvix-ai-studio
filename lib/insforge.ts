import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@insforge/sdk/ssr'

export async function getInsForgeServerClient() {
  return createServerClient({ cookies: await cookies() })
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

