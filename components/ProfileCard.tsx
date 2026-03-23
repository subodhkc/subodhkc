'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MapPin, GraduationCap, Code, X } from 'lucide-react'

export default function ProfileCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
      >
        <span className="text-lg md:text-xl font-bold gradient-text">
          Subodh Kumar Kc
        </span>
      </button>

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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-4"
            >
              <Card className="p-8 relative shadow-2xl border-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl opacity-50 animate-pulse-glow" />
                    <div className="relative rounded-full overflow-hidden border-4 border-background shadow-xl">
                      <Image
                        src="/profile-photo.jpeg"
                        alt="Subodh Kumar Kc"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">Subodh Kumar Kc</h2>
                  <p className="text-primary font-medium mb-6">
                    Former Fortune 50 AI Strategy CTL
                  </p>

                  <div className="w-full space-y-4 text-left">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Education</p>
                        <p className="text-sm text-muted-foreground">
                          M.Sc. Engineering & Technology Management, Louisiana Tech
                        </p>
                        <p className="text-sm text-muted-foreground">
                          B.Sc. Computer Information Systems, Louisiana Tech
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Dallas-Fort Worth Metroplex, Texas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <Code className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Expertise</p>
                        <p className="text-sm text-muted-foreground">
                          16+ years full-stack engineering experience
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Backend, Frontend, Data Architecture
                        </p>
                        <p className="text-sm text-muted-foreground">
                          AI Compliance & Governance Specialist
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        Father of two daughters | Family-focused professional building ethical AI systems
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
