import type { Metadata } from 'next'
import { GoogleSignInButton, MagicLinkForm } from '@/components/auth/AuthForms'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Subodh KC account',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Access your dashboard, courses, and saved resources.
          </p>
        </div>

        <div className="space-y-4">
          <GoogleSignInButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <MagicLinkForm />
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By signing in, you agree to the{' '}
          <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
