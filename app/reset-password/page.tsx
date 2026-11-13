import { AuthLayout, ForgotPasswordForm } from '@/app/components/auth-ui'

export default function ResetPasswordPage() {
  return <AuthLayout heading="Reset your password" subheading="Enter the code from your inbox and choose a new password.">
    <ForgotPasswordForm />
  </AuthLayout>
}

