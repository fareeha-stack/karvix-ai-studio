'use client'

import { useActionState, useState, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LoaderCircle, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  oauthAction,
  requestPasswordResetAction,
  resetPasswordAction,
  resendVerificationAction,
  signInAction,
  signUpAction,
  verifyEmailAction,
  type AuthActionState,
} from '@/app/actions/auth'

const initial: AuthActionState = {}

function ProviderSubmitButton({ provider }: { provider: string }) {
  const { pending } = useFormStatus()
  return <button className="oauth-button" type="submit" disabled={pending}>
    {pending ? <LoaderCircle className="spin" size={16} /> : provider === 'google' ? <span className="google-g" aria-hidden="true">G</span> : provider === 'github' ? <span className="github-mark" aria-hidden="true">GH</span> : <span className="x-mark" aria-hidden="true">𝕏</span>}
    <span>{pending ? 'Connecting…' : `Continue with ${provider === 'x' ? 'X' : provider[0].toUpperCase() + provider.slice(1)}`}</span>
  </button>
}

function Brand({ dark = false }: { dark?: boolean }) {
  return <Link className={`brand-lockup ${dark ? 'brand-lockup-light' : ''}`} href="/" aria-label="Karvix home">
    <span className="brand-mark"><Sparkles size={18} strokeWidth={2.4} /></span>
    <span>karvix<span className="brand-dot">.</span></span>
  </Link>
}

function OAuthButtons({ providers }: { providers: string[] }) {
  const items = providers.filter((provider) => ['google', 'github', 'x'].includes(provider))
  if (items.length === 0) return null
  return <>
    <div className="auth-divider"><span>or continue with</span></div>
    <div className={`oauth-grid ${items.length === 1 ? 'oauth-grid-single' : ''}`}>
      {items.map((provider) => <form action={oauthAction} key={provider}>
        <input type="hidden" name="provider" value={provider} />
        <ProviderSubmitButton provider={provider} />
      </form>)}
    </div>
  </>
}

function AuthArtwork() {
  return <div className="auth-artwork" aria-hidden="true">
    <div className="art-orb art-orb-one" /><div className="art-orb art-orb-two" />
    <div className="art-glow-card">
      <div className="art-window-bar"><i /><i /><i /><span>Portrait Studio</span></div>
      <div className="art-portrait">
        <div className="portrait-halo" /><div className="portrait-hair" /><div className="portrait-face"><i /><i /><b /></div>
        <div className="portrait-neck" /><div className="portrait-shirt" />
      </div>
      <div className="art-caption"><span className="caption-spark"><Sparkles size={14} /></span><span><b>Studio quality</b><small>Every detail, thoughtfully made</small></span><span className="caption-check"><Check size={14} /></span></div>
    </div>
    <div className="art-float art-float-top"><span className="float-icon">✦</span><span><b>Express your vision</b><small>Made for your next big idea</small></span></div>
    <div className="art-float art-float-bottom"><span className="mini-avatar">K</span><span><b>Your creative space</b><small>Private by default</small></span><span className="live-dot" /></div>
  </div>
}

export function AuthLayout({ children, heading, subheading }: { children: ReactNode; heading: string; subheading: string }) {
  return <main className="auth-page">
    <section className="auth-showcase">
      <div className="auth-showcase-inner">
        <Brand dark />
        <div className="showcase-copy"><span className="eyebrow light-eyebrow"><Sparkles size={13} /> YOUR CREATIVE STUDIO</span><h1>Make something<br /><em>unmistakably you.</em></h1><p>A quieter space for bold ideas, beautiful portraits, and the next version of your vision.</p></div>
        <AuthArtwork />
        <div className="showcase-footer"><span>© 2026 Karvix Studio</span><span>Thoughtfully made for creators</span></div>
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-mobile-brand"><Brand /></div>
      <ThemeToggle className="auth-theme-toggle" />
      <div className="auth-panel-content">
        <div className="auth-heading"><span className="eyebrow">WELCOME TO KARVIX</span><h2>{heading}</h2><p>{subheading}</p></div>
        {children}
        <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </div>
      <span className="auth-panel-corner">01 <i /> 03</span>
    </section>
  </main>
}

export function SignInForm({ providers, notice }: { providers: string[]; notice?: string }) {
  const [state, action, pending] = useActionState(signInAction, initial)
  const [visible, setVisible] = useState(false)
  return <div className="auth-form-wrap">
    {notice && <div className="form-notice"><Check size={16} />{notice}</div>}
    {state.message && <div className="form-alert" role="alert">{state.message}</div>}
    <form action={action} className="auth-form">
      <label className="field-label" htmlFor="email">Email address</label>
      <input className="auth-input" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <div className="field-label-row"><label className="field-label" htmlFor="password">Password</label><Link href="/forgot-password" className="text-link">Forgot password?</Link></div>
      <div className="password-field"><input className="auth-input" id="password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required minLength={6} /><button type="button" className="password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
      <button className="auth-submit" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={17} /> Signing in...</> : <>Sign in <ArrowRight size={17} /></>}</button>
    </form>
    <OAuthButtons providers={providers} />
    <p className="auth-switch">New to Karvix? <Link href="/sign-up">Create an account <ArrowRight size={14} /></Link></p>
  </div>
}

export function SignUpForm({ providers }: { providers: string[] }) {
  const [state, action, pending] = useActionState(signUpAction, initial)
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyEmailAction, initial)
  const [resendState, resendAction, resendPending] = useActionState(resendVerificationAction, initial)
  const [visible, setVisible] = useState(false)
  const verification = state.mode === 'verify-email'
  if (verification) return <div className="auth-form-wrap">
    <div className="verification-icon"><span><Check size={22} /></span></div>
    <div className="verification-copy"><h3>Check your inbox</h3><p>We sent a 6-digit verification code to <strong>{state.email}</strong>. Enter it below to secure your account.</p></div>
    {(verifyState.message || resendState.message) && <div className={verifyState.message ? 'form-alert' : 'form-notice'} role="status">{verifyState.message || resendState.message}</div>}
    <form action={verifyAction} className="auth-form">
      <input type="hidden" name="email" value={state.email ?? ''} />
      <label className="field-label" htmlFor="otp">Verification code</label>
      <input className="auth-input code-input" id="otp" name="otp" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} minLength={6} required />
      <button className="auth-submit" type="submit" disabled={verifyPending}>{verifyPending ? <><LoaderCircle className="spin" size={17} /> Verifying...</> : <>Verify email <ArrowRight size={17} /></>}</button>
    </form>
    <form action={resendAction} className="resend-form"><input type="hidden" name="email" value={state.email ?? ''} /><button className="text-link" type="submit" disabled={resendPending}>{resendPending ? 'Sending…' : 'Resend verification code'}</button></form>
    <Link className="back-link" href="/sign-up"><ArrowLeft size={15} /> Back to sign up</Link>
  </div>

  return <div className="auth-form-wrap">
    {state.message && <div className="form-alert" role="alert">{state.message}</div>}
    <form action={action} className="auth-form">
      <label className="field-label" htmlFor="name">Your name</label>
      <input className="auth-input" id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required minLength={2} />
      <label className="field-label" htmlFor="email">Email address</label>
      <input className="auth-input" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <label className="field-label" htmlFor="password">Create a password <span className="field-hint">At least 6 characters</span></label>
      <div className="password-field"><input className="auth-input" id="password" name="password" type={visible ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a secure password" required minLength={6} /><button type="button" className="password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
      <button className="auth-submit" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={17} /> Creating account...</> : <>Create account <ArrowRight size={17} /></>}</button>
    </form>
    <OAuthButtons providers={providers} />
    <p className="auth-switch">Already have an account? <Link href="/sign-in">Sign in <ArrowRight size={14} /></Link></p>
  </div>
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initial)
  const [resetState, resetAction, resetPending] = useActionState(resetPasswordAction, initial)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [visible, setVisible] = useState(false)
  if (resetState.mode === 'success') {
    return <div className="auth-form-wrap"><div className="form-notice"><Check size={16} />{resetState.message}</div><button className="auth-submit" type="button" onClick={() => router.push('/sign-in')}>Go to sign in <ArrowRight size={17} /></button></div>
  }
  if (state.mode === 'sent') return <div className="auth-form-wrap">
    <div className="form-notice"><Check size={16} />{state.message}</div>
    {resetState.message && <div className="form-alert" role="alert">{resetState.message}</div>}
    <form action={resetAction} className="auth-form">
      <input type="hidden" name="email" value={email} />
      <label className="field-label" htmlFor="code">6-digit reset code</label>
      <input className="auth-input code-input" id="code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} minLength={6} required />
      <label className="field-label" htmlFor="password">New password</label>
      <div className="password-field"><input className="auth-input" id="password" name="password" type={visible ? 'text' : 'password'} autoComplete="new-password" minLength={6} placeholder="At least 6 characters" required /><button type="button" className="password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
      <label className="field-label" htmlFor="confirmPassword">Confirm new password</label><input className="auth-input" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} placeholder="Re-enter your password" required />
      <button className="auth-submit" type="submit" disabled={resetPending}>{resetPending ? <><LoaderCircle className="spin" size={17} /> Updating...</> : <>Update password <ArrowRight size={17} /></>}</button>
    </form>
  </div>
  return <div className="auth-form-wrap">
    {state.message && <div className="form-alert" role="alert">{state.message}</div>}
    <form action={action} className="auth-form">
      <label className="field-label" htmlFor="email">Email address</label>
      <input className="auth-input" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <button className="auth-submit" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={17} /> Sending code...</> : <>Send reset code <ArrowRight size={17} /></>}</button>
    </form>
    <Link className="back-link" href="/sign-in"><ArrowLeft size={15} /> Back to sign in</Link>
  </div>
}

export function ErrorNotice({ error }: { error?: string }) {
  if (!error) return null
  const message = error === 'provider_unavailable' ? 'That sign-in option is not available right now.' : 'Sign-in did not complete. Please try again.'
  return <div className="form-alert" role="alert">{message}</div>
}

