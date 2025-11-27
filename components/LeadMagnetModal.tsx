'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Download, CheckCircle2, FileText } from 'lucide-react'

interface LeadMagnetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // TODO: Send email to your backend/email service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      
      // Trigger PDF download
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = '/Doc/Beyond Tpm Csm.pdf'
        link.download = 'AI-Compliance-Framework-Enterprise-Guide.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Close modal after download starts
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setEmail('')
          setName('')
        }, 2000)
      }, 500)
    } catch (error) {
      setStatus('idle')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Download Starting...</h3>
              <p className="text-muted-foreground">
                Your AI Compliance Framework guide is downloading now. Check your email for additional resources!
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                Download Free Guide
              </h3>
              <p className="text-muted-foreground mb-6">
                <strong>AI Compliance Framework: Enterprise Implementation Guide</strong>
                <br />
                <br />
                Get instant access to proven frameworks including:
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Cognitive Systems Management (CSM) Framework</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>5 Patent-Pending AI Compliance Methodologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>SKC Meeting ResetFrame™ Implementation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Enterprise-Scale Deployment Strategies</span>
                </li>
              </ul>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    'Processing...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Free Guide
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                By downloading, you'll also receive AI insights and compliance updates. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
