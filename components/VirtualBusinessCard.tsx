'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Mail, Linkedin, Github, MapPin, Briefcase, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function VirtualBusinessCard() {
  const [isOpen, setIsOpen] = useState(false)

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Subodh Kumar Kc
N:Kc;Subodh;Kumar;;
TITLE:AI Compliance Architect & Sr Program Manager
ORG:HP Inc.;HAIEC
EMAIL;TYPE=INTERNET:Subodh.kc@haiec.com
URL:https://subodhkc.com
URL;TYPE=LinkedIn:https://www.linkedin.com/in/subodhkc
URL;TYPE=GitHub:https://github.com/subodhkc
ADR;TYPE=WORK:;;Dallas-Fort Worth Metroplex;Texas;;75001;United States
NOTE:Former Fortune 50 AI Strategy CTL | Founder of HAIEC | AI Governance & Compliance Expert
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Subodh_Kumar_Kc.vcf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Virtual Business Card
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
            >
              <Card className="relative shadow-2xl border-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl opacity-50 animate-pulse-glow" />
                      <div className="relative rounded-full overflow-hidden border-4 border-background shadow-xl">
                        <Image
                          src="/profile-photo.jpeg"
                          alt="Subodh Kumar Kc"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Subodh Kumar Kc</h2>
                  <p className="text-sm text-muted-foreground mb-2">AI Compliance Architect</p>
                  <p className="text-xs text-muted-foreground">Former Fortune 50 AI Strategy CTL</p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <Briefcase className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Sr Program Manager - AI</p>
                      <p className="text-xs text-muted-foreground">HP Inc. | Founder, HAIEC</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Dallas-Fort Worth, Texas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <a href="mailto:Subodh.kc@haiec.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Subodh.kc@haiec.com
                    </a>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a
                      href="https://www.linkedin.com/in/subodhkc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-xs">LinkedIn</span>
                    </a>
                    <a
                      href="https://github.com/subodhkc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-xs">GitHub</span>
                    </a>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={downloadVCard}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Download className="h-4 w-4" />
                      Download Contact (.vcf)
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Save to your phone or email contacts
                    </p>
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
