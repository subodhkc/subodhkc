'use client'

import { useEffect, useState } from 'react'

interface SafeEmailProps {
  user?: string
  domain?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function SafeEmail({
  user = 'admin',
  domain = 'subodhkc.com',
  className,
  style,
  children,
}: SafeEmailProps) {
  const [mounted, setMounted] = useState(false)
  const email = `${user}@${domain}`
  const obfuscated = `${user} [at] ${domain.replace(/\./g, ' [dot] ')}`

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <a
      href={mounted ? `mailto:${email}` : undefined}
      className={className}
      style={style}
      aria-label={`Email ${email}`}
    >
      {mounted ? (children || email) : obfuscated}
    </a>
  )
}
