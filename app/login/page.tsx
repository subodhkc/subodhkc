import type { Metadata } from 'next'
import Image from 'next/image'
import { GoogleSignInButton, MagicLinkForm } from '@/components/auth/AuthForms'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Subodh KC account to access your workspace, dashboard, and tools.',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; context?: string }>
}) {
  const { next, error, context } = await searchParams

  const errorMessages: Record<string, string> = {
    config: 'Authentication is not properly configured. Please contact support.',
    no_code: 'Authentication failed. Please try again.',
    auth_failed: 'Sign-in failed. Please try again.',
  }

  const errorMessage = error ? errorMessages[error] || 'An error occurred during sign-in.' : null
  const isWilshireContext = context === 'wilshire'
  const isFamilyContext = context === 'family'

  const bgClass = isFamilyContext
    ? 'bg-gradient-to-b from-sky-50 via-background to-background'
    : isWilshireContext
      ? 'bg-gradient-to-b from-sky-50 to-background'
      : 'bg-gradient-to-br from-background to-muted/30'

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-16 ${bgClass}`}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          {(isFamilyContext || isWilshireContext) && (
            <Image
              src="/wilshire/logo-badge.svg"
              alt="Wilshire Elementary"
              width={48}
              height={48}
              className="mx-auto"
              priority
            />
          )}
          <a href="/" className="inline-block">
            <span className="text-xl font-bold tracking-tight">SubodhKC</span>
          </a>
          <h1 className="text-2xl font-bold">
            {isFamilyContext ? 'Family Sign In' : 'Sign In'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isFamilyContext
              ? 'Sign in to access your approved family pickup information.'
              : isWilshireContext
                ? 'Sign in to access your authorized Wilshire School Pickup workspace.'
                : 'Access your organization workspace, tools, and applications.'}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 text-center">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <GoogleSignInButton next={next} />

          {isFamilyContext && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <MagicLinkForm next={next || '/family'} />
            </>
          )}

          <p className="text-xs text-center text-muted-foreground">
            {isFamilyContext
              ? 'Family access must already be approved by the school.'
              : 'Sign in with your organization email (.edu, .org) or Google account.'}
          </p>

          {!isFamilyContext && (
            <div className="bg-muted/50 rounded-lg px-4 py-3 text-xs text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground">Demo Access</p>
              <p>
                Staff with <span className="font-medium">.edu</span> email addresses are automatically
                added to the Wilshire demo workspace with synthetic data.
              </p>
              <p>
                Or use the demo account:{' '}
                <span className="font-mono text-foreground">junekc</span>
                {' / '}
                <span className="font-mono text-foreground">pre-k</span>
              </p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to the{' '}
            <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
