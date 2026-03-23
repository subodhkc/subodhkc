'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MapPin, GraduationCap, Code, X } from 'lucide-react'
import VirtualBusinessCard from './VirtualBusinessCard'

export default function ProfileCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setButtonRect(rect)
    setIsOpen(true)
  }

  return (
    <>
      <button
        onClick={handleOpen}
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
              style={{
                position: 'fixed',
                left: buttonRect ? `${Math.min(buttonRect.left, window.innerWidth - 280)}px` : '50%',
                top: buttonRect ? `${Math.min(buttonRect.bottom + 10, window.innerHeight - 400)}px` : '50%',
                transform: buttonRect ? 'none' : 'translate(-50%, -50%)',
                maxHeight: '80vh',
              }}
              className="z-50 w-full max-w-xs sm:max-w-sm p-3 overflow-y-auto"
            >
              <Card className="relative shadow-2xl border-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-secondary transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-4 space-y-3 flex flex-col items-center text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-xl">
                      <Image
                        src="/profile-photo.jpeg"
                        alt="Subodh Kumar Kc"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">Subodh Kumar Kc</h2>
                  <p className="text-primary font-medium mb-6">
                    Former Fortune 50 AI Strategy CTL
                  </p>

                  <div className="w-full space-y-4 text-left">
                    <div className="flex-1">
                      <div className="space-y-2 pt-3 border-t border-border">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">Dallas-Fort Worth, Texas</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <GraduationCap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">MSc Engineering & Technology Mgmt</p>
                            <p className="text-xs text-muted-foreground">LA Tech • Dean's Honor List</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Code className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">Full-Stack Developer</p>
                            <p className="text-xs text-muted-foreground">AI Compliance & Governance</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border space-y-2">
                          <div className="flex justify-center">
                            <VirtualBusinessCard />
                          </div>
                          <p className="text-xs text-muted-foreground text-center leading-tight">
                            Father of two daughters | Building ethical AI systems
                          </p>
                        </div>
                      </div>
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
