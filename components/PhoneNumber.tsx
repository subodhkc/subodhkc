'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PhoneNumber() {
  const [revealed, setRevealed] = useState(false)

  const handleReveal = () => {
    setRevealed(true)
  }

  return (
    <div className="flex items-center gap-2">
      {!revealed ? (
        <Button
          onClick={handleReveal}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Phone className="h-4 w-4" />
          Click to reveal phone number
        </Button>
      ) : (
        <a
          href="sms:6822249904"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <Phone className="h-4 w-4" />
          682-224-9904
        </a>
      )}
    </div>
  )
}
