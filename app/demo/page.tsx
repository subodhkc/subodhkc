'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, AlertCircle, Sparkles } from 'lucide-react'

export default function DemoLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('JuneKc')
  const [password, setPassword] = useState('pre-k')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/demo/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Redirect to app — personal dashboard shows their Wilshire Demo org
      router.push('/app')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  function fillCredentials() {
    setUsername('JuneKc')
    setPassword('pre-k')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, #faf6ee, #e8eef5, #f0f4f8)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg overflow-hidden" role="img" aria-label="Wilshire Elementary logo" style={{ background: '#1a3a5c' }}>
            <Image
              src="/wilshire/logo-color.png"
              alt="Wilshire Elementary"
              width={40}
              height={40}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#0f2a44' }}>
            Wilshire School Pickup Demo
          </h1>
          <p className="text-sm mt-2" style={{ color: '#2d5a82' }}>
            Explore the School Pickup workflow using synthetic demonstration data.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border p-6 sm:p-8" style={{ borderColor: 'rgba(26,58,92,0.15)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: '#1a3a5c' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition focus:ring-2"
                style={{
                  borderColor: 'rgba(26,58,92,0.25)',
                  color: '#0f2a44',
                }}
                placeholder="JuneKc"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#1a3a5c' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition focus:ring-2"
                style={{
                  borderColor: 'rgba(26,58,92,0.25)',
                  color: '#0f2a44',
                }}
                placeholder="pre-k"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(to right, #1a3a5c, #2d5a82)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Sign Up for Demo
                </>
              )}
            </button>
          </form>

          {/* Helper */}
          <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(26,58,92,0.10)' }}>
            <button
              onClick={fillCredentials}
              className="w-full text-sm font-medium flex items-center justify-center gap-1.5"
              style={{ color: '#d4a017' }}
              aria-label="Reset demo username and password fields"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Reset demo credentials
            </button>
            <p className="text-xs text-center mt-3" style={{ color: '#2d5a82' }}>
              Demo data only. No real student or family information is used.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: '#2d5a82', opacity: 0.7 }}>
          Synthetic demonstration environment for Wilshire School Pickup
        </p>
      </div>
    </div>
  )
}
