import { AuthLayout, ForgotPasswordForm } from '@/app/components/auth-ui'

export default function ForgotPasswordPage() {
  return <AuthLayout heading="Reset your password" subheading="We’ll send a secure code to the email linked to your account.">
    <ForgotPasswordForm />
  </AuthLayout>
}

