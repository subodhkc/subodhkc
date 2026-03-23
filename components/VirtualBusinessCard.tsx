'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share2, X, Mail, MapPin, Linkedin, Github } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VirtualBusinessCardProps {
  onOpen?: () => void
}

export default function VirtualBusinessCard({ onOpen }: VirtualBusinessCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleOpen = () => {
    setIsOpen(true)
    onOpen?.()
  }

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Subodh Kumar Kc
N:Kc;Subodh;Kumar;;
EMAIL:Subodh.kc@haiec.com
TEL:+16822249904
ADR:;;Dallas-Fort Worth;Texas;;75001;United States
URL:https://subodhkc.com
URL;TYPE=LinkedIn:https://www.linkedin.com/in/subodhkc
URL;TYPE=GitHub:https://github.com/subodhkc
NOTE:AI Compliance Architect & Sr Program Manager
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
      title: 'Subodh Kumar Kc - AI Compliance Architect',
      text: 'AI Compliance Architect & Sr Program Manager\n\nConnect with me:',
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
        onClick={handleOpen}
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-4"
            >
              <Card className="relative shadow-2xl border-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>

                <CardContent className="p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Subodh Kumar Kc</h2>
                    <p className="text-sm text-muted-foreground">AI Compliance Architect</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a href="https://subodhkc.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">SK</span>
                      </div>
                      <span className="text-sm font-medium">subodhkc.com</span>
                    </a>

                    <a href="mailto:Subodh.kc@haiec.com" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Subodh.kc@haiec.com</span>
                    </a>

                    <a href="tel:+16822249904" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-lg">📱</span>
                      </div>
                      <span className="text-sm">682 224 9904</span>
                    </a>

                    <div className="flex items-center gap-3 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Dallas-Fort Worth, Texas</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a
                      href="https://www.linkedin.com/in/subodhkc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-xs font-medium">LinkedIn</span>
                    </a>
                    <a
                      href="https://github.com/subodhkc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-xs font-medium">GitHub</span>
                    </a>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground italic">
                      Building ethical AI systems for enterprise compliance
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={shareCard}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Share2 className="h-3 w-3" />
                      Share
                    </Button>
                    <Button
                      onClick={downloadVCard}
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
