'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px', color: '#5d6977' }}>
      Loading book…
    </div>
  ),
});

interface BookViewerProps {
  pages: string[];
  pageCss: string;
}

export default function BookViewer({ pages, pageCss }: BookViewerProps) {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(pages.length);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        flipPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flipNext, flipPrev]);

  const onPage = (e: any) => {
    setCurrentPage(e.data);
  };

  const onInit = (e: any) => {
    if (e.data) {
      setTotalPages(e.data.pages);
      setCurrentPage(e.data.page);
    }
  };

  const pageWidth = isMobile ? Math.min(window.innerWidth - 32, 612) : 612;
  const pageHeight = isMobile ? Math.round(pageWidth * 11 / 8.5) : 792;

  return (
    <>
      <style jsx global>{pageCss}</style>
      <style jsx global>{`
        .flip-book-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0 40px;
        }
        .flip-book-container {
          position: relative;
          overflow: hidden;
        }
        .flip-book-container .page {
          width: 100%;
          height: 100%;
          overflow: hidden;
          margin: 0;
          box-shadow: none;
          break-after: auto;
          page-break-after: auto;
        }
        .flip-book-container .page:before {
          height: 4px;
        }
        .flip-book-container .page-inner-content {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .flip-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
        }
        .flip-nav button {
          border: 1px solid rgba(10, 32, 53, 0.2);
          background: rgba(10, 32, 53, 0.06);
          color: #0a2035;
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
        @media print {
          .flip-book-wrapper { display: none !important; }
        }
      `}</style>

      <div className="flip-book-wrapper" role="region" aria-label="Portfolio flip book">
        <div className="flip-book-container">
          <HTMLFlipBook
            ref={bookRef}
            width={pageWidth}
            height={pageHeight}
            size="fixed"
            minWidth={320}
            maxWidth={612}
            minHeight={440}
            maxHeight={792}
            showCover={true}
            mobileScrollSupport={false}
            usePortrait={isMobile}
            drawShadow={true}
            flippingTime={700}
            maxShadowOpacity={0.5}
            startPage={0}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            style={{}}
            onFlip={onPage}
            onInit={onInit}
            className="flip-book"
          >
            {pages.map((html, i) => (
              <div key={i} className="page">
                <div
                  className="page-inner-content"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        <div className="flip-nav">
          <button
            onClick={flipPrev}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            ◀ Prev
          </button>
          <span className="page-counter" aria-live="polite">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={flipNext}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            Next ▶
          </button>
        </div>
      </div>
    </>
  );
}
