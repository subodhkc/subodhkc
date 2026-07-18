'use client'

import dynamic from 'next/dynamic'
import { useRef, useState, useEffect, useCallback } from 'react'

const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px', color: '#5d6977' }}>
      Loading magazine…
    </div>
  ),
})

interface MagazineViewerProps {
  pages: string[]
}

export default function MagazineViewer({ pages }: MagazineViewerProps) {
  const bookRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(pages.length)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pageWidth = 612
  const pageHeight = 792
  const mobilePageWidth = mounted ? Math.min(window.innerWidth - 32, 612) : 375
  const mobilePageHeight = Math.round(mobilePageWidth * 11 / 8.5)
  const finalWidth = isMobile ? mobilePageWidth : pageWidth
  const finalHeight = isMobile ? mobilePageHeight : pageHeight

  const next = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  const prev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const onFlip = (e: any) => {
    setCurrentPage(e.data)
  }

  const onInit = (e: any) => {
    if (e.data) {
      setTotalPages(e.data.pages)
      setCurrentPage(e.data.page)
    }
  }

  return (
    <>
      <style jsx global>{`
        .flip-magazine-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0 40px;
        }
        .flip-magazine-container {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          box-shadow: 0 18px 50px rgba(7, 25, 39, 0.22);
        }
        .flip-magazine-container .page {
          width: 100%;
          height: 100%;
          overflow: hidden;
          margin: 0;
          box-shadow: none;
          break-after: auto;
          page-break-after: auto;
        }
        .flip-magazine-container .page:before {
          height: 4px;
        }
        .flip-magazine-container .page-inner-content {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .flip-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
        }
        .flip-nav button {
          background: rgba(10, 32, 53, 0.06);
          border: 1px solid rgba(10, 32, 53, 0.12);
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .flip-nav button:hover:not(:disabled) {
          background: rgba(10, 32, 53, 0.12);
        }
        .flip-nav button:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
        .flip-nav button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .flip-nav .page-counter {
          font-size: 13px;
          font-weight: 700;
          color: #0a2035;
          min-width: 80px;
          text-align: center;
        }
      `}</style>
      <div className="flip-magazine-wrapper" role="region" aria-label="Magazine flip book">
        <div className="flip-magazine-container">
          {mounted ? (
            <HTMLFlipBook
              ref={bookRef}
              width={finalWidth}
              height={finalHeight}
              size="fixed"
              minWidth={320}
              maxWidth={612}
              minHeight={440}
              maxHeight={792}
              showCover={true}
              showPageCorners={true}
              drawShadow={true}
              flippingTime={700}
              usePortrait={isMobile}
              startPage={0}
              maxShadowOpacity={0.5}
              useMouseEvents={true}
              swipeDistance={30}
              clickEventForward={true}
              mobileScrollSupport={true}
              disableFlipByClick={false}
              autoSize={false}
              startZIndex={0}
              style={{}}
              className=""
              onFlip={onFlip}
              onInit={onInit}
            >
              {pages.map((pageHtml, i) => (
                <div key={i} className="page" data-number={i}>
                  <div className="page-inner-content" dangerouslySetInnerHTML={{ __html: pageHtml }} />
                </div>
              ))}
            </HTMLFlipBook>
          ) : (
            <div style={{ width: finalWidth, height: finalHeight, background: '#fbf8f1', borderRadius: 4, boxShadow: '0 18px 50px rgba(7,25,39,.22)' }} />
          )}
        </div>
        <div className="flip-nav">
          <button onClick={prev} disabled={currentPage === 0} aria-label="Previous page">
            ← Prev
          </button>
          <span className="page-counter" aria-live="polite">
            {currentPage + 1} / {totalPages}
          </span>
          <button onClick={next} disabled={currentPage >= totalPages - 1} aria-label="Next page">
            Next →
          </button>
        </div>
      </div>
    </>
  )
}
