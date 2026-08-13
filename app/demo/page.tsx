'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2, AlertCircle, Sparkles } from 'lucide-react'

export default function DemoLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

      // Redirect to app — user has one org so will auto-redirect to wilshire-demo
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg" role="img" aria-label="Wilshire School Pickup logo">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Wilshire School Pickup Demo
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Explore the School Pickup workflow using synthetic demonstration data.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="JuneKc"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entering demo...
                </>
              ) : (
                'Enter Demo'
              )}
            </button>
          </form>

          {/* Helper */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={fillCredentials}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1.5"
              aria-label="Fill demo username and password fields"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Fill demo credentials
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Demo data only. No real student or family information is used.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Synthetic demonstration environment for Wilshire School Pickup
        </p>
      </div>
    </div>
  )
}
