'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAuthActions } from '@insforge/sdk/ssr'
import { getAppUrl, getInsForgeServerClient } from '@/lib/insforge'

export type AuthActionState = {
  message?: string
  mode?: 'verify-email' | 'sent' | 'success'
  email?: string
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function authError(error: { message?: string } | null, fallback: string) {
  return error?.message || fallback
}

export async function signInAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = text(formData, 'email').toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!email || !email.includes('@') || !password) return { message: 'Enter a valid email and password.' }

  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.signInWithPassword({ email, password })
  if (error || !data?.user) return { message: authError(error, 'We could not sign you in. Please try again.') }
  redirect('/')
}

export async function signUpAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = text(formData, 'name')
  const email = text(formData, 'email').toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (name.length < 2) return { message: 'Enter your name to continue.' }
  if (!email || !email.includes('@')) return { message: 'Enter a valid email address.' }
  if (password.length < 6) return { message: 'Your password must be at least 6 characters.' }

  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.signUp({ email, password, name })
  if (error) return { message: authError(error, 'We could not create your account. Please try again.') }
  if (data?.requireEmailVerification) return { mode: 'verify-email', email }
  redirect('/')
}

export async function verifyEmailAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = text(formData, 'email').toLowerCase()
  const otp = text(formData, 'otp').replace(/\s/g, '')
  if (!/^\d{6}$/.test(otp)) return { message: 'Enter the 6-digit code from your email.' }

  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.verifyEmail({ email, otp })
  if (error || !data?.user) return { message: authError(error, 'That code could not be verified. Request a new code and try again.') }
  redirect('/')
}

export async function resendVerificationAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = text(formData, 'email').toLowerCase()
  const client = await getInsForgeServerClient()
  const { error } = await client.auth.resendVerificationEmail({
    email,
    redirectTo: new URL('/sign-in?verified=1', getAppUrl()).toString(),
  })
  if (error) return { message: authError(error, 'We could not resend the code yet.') }
  return { mode: 'sent', message: 'A fresh verification code is on its way.' }
}

export async function oauthAction(formData: FormData) {
  const provider = text(formData, 'provider')
  const client = await getInsForgeServerClient()
  const { data: config, error: configError } = await client.auth.getPublicAuthConfig()
  if (configError || !config?.oAuthProviders?.includes(provider as never)) {
    redirect('/sign-in?error=provider_unavailable')
  }

  const store = await cookies()
  const auth = createAuthActions({ cookies: store })
  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo: new URL('/api/auth/callback', getAppUrl()).toString(),
    skipBrowserRedirect: true,
  })
  if (error || !data?.url || !data.codeVerifier) redirect('/sign-in?error=oauth_failed')

  store.set('insforge_code_verifier', data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  redirect(data.url)
}

export async function requestPasswordResetAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = text(formData, 'email').toLowerCase()
  if (!email || !email.includes('@')) return { message: 'Enter a valid email address.' }
  const client = await getInsForgeServerClient()
  const { error } = await client.auth.sendResetPasswordEmail({
    email,
    redirectTo: new URL('/reset-password', getAppUrl()).toString(),
  })
  if (error) return { message: authError(error, 'We could not send a reset code. Please try again.') }
  return { mode: 'sent', message: 'If an account exists for this email, a reset code is on its way.' }
}

export async function resetPasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = text(formData, 'email').toLowerCase()
  const code = text(formData, 'code').replace(/\s/g, '')
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')
  if (!/^\d{6}$/.test(code)) return { message: 'Enter the 6-digit reset code.' }
  if (password.length < 6) return { message: 'Your password must be at least 6 characters.' }
  if (password !== confirmPassword) return { message: 'Your passwords do not match.' }

  const client = await getInsForgeServerClient()
  const { data, error } = await client.auth.exchangeResetPasswordToken({ email, code })
  if (error || !data?.token) return { message: authError(error, 'That reset code is invalid or expired.') }
  const { error: resetError } = await client.auth.resetPassword({ newPassword: password, otp: data.token })
  if (resetError) return { message: authError(resetError, 'We could not update your password. Please try again.') }
  return { mode: 'success', message: 'Your password has been updated. You can sign in now.' }
}

export async function signOutAction() {
  const auth = createAuthActions({ cookies: await cookies() })
  await auth.signOut()
  redirect('/sign-in')
}

