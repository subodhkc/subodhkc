'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share2, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function VirtualBusinessCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Subodh KC
N:KC;Subodh;;;
TITLE:AI Systems Builder | Founder
URL:https://subodhkc.com
TEL:+16822249904
URL;TYPE=LinkedIn:https://www.linkedin.com/in/subodhkc
URL;TYPE=GitHub:https://github.com/subodhkc
NOTE:AI security • Voice automation • Legal AI
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Subodh_KC.vcf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const shareCard = async () => {
    const shareData = {
      title: 'Subodh KC - AI Systems Builder',
      text: 'AI security • Voice automation • Legal AI\n\nConnect with me:',
      url: 'https://subodhkc.com'
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        alert('Card details copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
      >
        <Download className="h-3 w-3" />
        Business Card
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm sm:max-w-md p-4"
            >
              <div className="relative" style={{ perspective: '1000px' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-2 -right-2 p-2 rounded-full bg-background border border-border hover:bg-secondary transition-colors z-20"
                >
                  <X className="h-4 w-4" />
                </button>

                <motion.div
                  className="relative w-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of Card */}
                  <Card className="shadow-2xl border-2" style={{ backfaceVisibility: 'hidden' }}>
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Subodh KC</h2>
                        <p className="text-sm text-muted-foreground">AI Systems Builder | Founder</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <a href="https://subodhkc.com" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition-colors">
                          subodhkc.com
                        </a>
                        <p>682 224 9904</p>
                      </div>

                      <div className="flex gap-2">
                        <a href="https://www.linkedin.com/in/subodhkc" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-xs">
                          LinkedIn
                        </a>
                        <a href="https://github.com/subodhkc" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-xs">
                          GitHub
                        </a>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                          AI security • Voice automation • Legal AI
                        </p>
                      </div>

                      <div className="flex justify-center pt-2">
                        <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center">
                          <div className="text-xs text-center text-muted-foreground">
                            QR Code
                            <br />
                            <span className="text-xs">subodhkc.com</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setIsFlipped(true)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        View Products & Work →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Back of Card */}
                  <Card 
                    className="absolute inset-0 shadow-2xl border-2" 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-bold mb-1">Products</h3>
                      </div>

                      <div className="space-y-2 text-xs">
                        <a href="https://haiec.com" target="_blank" rel="noopener noreferrer" className="block p-2 rounded-lg hover:bg-secondary transition-colors">
                          <p className="font-medium">HAIEC.com</p>
                          <p className="text-muted-foreground">AI Compliance & Security</p>
                        </a>
                        <a href="https://kestrelvoice.com" target="_blank" rel="noopener noreferrer" className="block p-2 rounded-lg hover:bg-secondary transition-colors">
                          <p className="font-medium">KestrelVoice.com</p>
                          <p className="text-muted-foreground">AI Call Automation</p>
                        </a>
                        <a href="https://courtcase.frontofai.com" target="_blank" rel="noopener noreferrer" className="block p-2 rounded-lg hover:bg-secondary transition-colors">
                          <p className="font-medium">CourtCase.frontofAi.com</p>
                          <p className="text-muted-foreground">Legal Intelligence</p>
                        </a>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <h3 className="text-sm font-bold mb-2">Work</h3>
                        <p className="text-xs text-muted-foreground">
                          Consulting • Advisory • Systems Build
                        </p>
                      </div>

                      <Button
                        onClick={() => setIsFlipped(false)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        ← Back to Contact
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={shareCard}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 text-xs"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </Button>
                  <Button
                    onClick={downloadVCard}
                    size="sm"
                    className="flex-1 gap-2 text-xs"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
