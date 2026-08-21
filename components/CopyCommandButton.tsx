'use client'

import * as React from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  command: string
  npmUrl?: string
  size?: 'default' | 'lg' | 'sm'
  className?: string
}

/**
 * CopyCommandButton - copies the install command to clipboard.
 * Falls back to opening npm URL if clipboard API is unavailable.
 */
export function CopyCommandButton({ command, npmUrl, size = 'lg', className = '' }: Props) {
  const [copied, setCopied] = React.useState(false)

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Try clipboard API first
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(command)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
        return
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback: execCommand for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = command
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Final fallback: open npm URL
      if (npmUrl) {
        window.open(npmUrl, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <Button
      size={size}
      onClick={onClick}
      className={`gap-2 font-mono ${className}`}
      aria-label={copied ? 'Copied' : `Copy ${command}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="truncate max-w-[280px] sm:max-w-none">{command}</span>
    </Button>
  )
}
