// components/home/FrontOfAIBanner.tsx — FrontOfAI live news banner (RSS-fed)
// Server component. Fetches the FrontOfAI briefing RSS feed and renders a
// compact news ticker above the hero. Falls back gracefully.
//
// Revalidation strategy:
//   - On-demand: a GitHub Actions cron hits /api/revalidate at 09:00 CST daily
//     (aligned to FrontOfAI's update window), calling revalidateTag + revalidatePath.
//   - Fallback: ISR revalidate of 86400s (24h) so the feed never goes stale
//     silently if the cron fails.

export const revalidate = 86400 // 24h safety-net fallback (cron drives the daily refresh)

export const NEWS_TAG = 'frontofai-news'

type NewsItem = {
  title: string
  link: string
  pubDate: string
  description: string
  impact: number | null
  source: string
}

const FEED_URL = 'https://frontofai.com/api/feed'
const BRIEFING_URL = 'https://frontofai.com/briefing'

function extractCdata(block: string, tag: string): string {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const m = block.match(re)
  if (!m) return ''
  const raw = m[1].trim()
  const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return (cdata ? cdata[1] : raw).trim()
}

function extractPlain(block: string, tag: string): string {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const m = block.match(re)
  return m ? m[1].trim() : ''
}

function extractImpact(block: string): number | null {
  const m = block.match(/Impact Score:\s*<\/strong>\s*(\d+)/i)
  return m ? parseInt(m[1], 10) : null
}

function extractSource(block: string): string {
  const m = block.match(/Source:\s*<\/strong>\s*([^<]+)/i)
  return m ? m[1].trim() : ''
}

function parseRss(xml: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = itemRegex.exec(xml)) && items.length < 12) {
    const block = m[1]
    const title = extractCdata(block, 'title')
    const link = extractPlain(block, 'link')
    if (!title || !link) continue
    items.push({
      title,
      link,
      pubDate: extractPlain(block, 'pubDate'),
      description: extractCdata(block, 'description'),
      impact: extractImpact(block),
      source: extractSource(block),
    })
  }
  return items
}

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate, tags: [NEWS_TAG] },
      headers: { Accept: 'application/rss+xml' },
    })
    if (!res.ok) {
      console.error(`[FrontOfAIBanner] feed returned ${res.status}`)
      return []
    }
    const xml = await res.text()
    const items = parseRss(xml)
    if (items.length === 0) console.error('[FrontOfAIBanner] parsed 0 items from feed')
    return items
  } catch (err) {
    console.error('[FrontOfAIBanner] failed to fetch news feed:', err)
    return []
  }
}

function relativeTime(iso: string): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Date.now() - then
  const min = Math.round(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.round(hr / 24)
  if (day < 7) return `${day}d`
  const wk = Math.round(day / 7)
  return `${wk}w`
}

function impactClass(score: number | null): string {
  if (score === null) return 'foa-impact-na'
  if (score >= 9) return 'foa-impact-crit'
  if (score >= 7) return 'foa-impact-high'
  if (score >= 5) return 'foa-impact-med'
  return 'foa-impact-low'
}

export async function FrontOfAIBanner() {
  const items = await fetchNews()
  const visible = items.slice(0, 8)

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...visible, ...visible]

  return (
    <section
      className="foa-news"
      aria-label="FrontOfAI news"
      style={{
        background: 'var(--op-card)',
        borderBottom: '1px solid var(--op-border)',
        borderTop: '1px solid var(--op-border)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {/* Label */}
        <a
          href={BRIEFING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="foa-news-label"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--bg)',
            background: 'var(--op-accent)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <span className="foa-live-dot" aria-hidden="true" />
          AI News
        </a>

        {/* Ticker */}
        {visible.length > 0 ? (
          <div className="foa-ticker" role="marquee" aria-label="Latest AI news headlines">
            <div className="foa-ticker-track">
              {loop.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="foa-ticker-item"
                  style={{ textDecoration: 'none' }}
                >
                  {item.impact !== null && (
                    <span className={`foa-impact ${impactClass(item.impact)}`}>
                      {item.impact}
                    </span>
                  )}
                  <span className="foa-ticker-title">{item.title}</span>
                  {item.source && <span className="foa-ticker-source">{item.source}</span>}
                  {item.pubDate && (
                    <span className="foa-ticker-time">{relativeTime(item.pubDate)}</span>
                  )}
                  <span className="foa-ticker-sep" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--op-muted)',
            }}
          >
            AI intelligence feed unavailable —{' '}
            <a
              href={BRIEFING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--op-accent)', marginLeft: 6, textDecoration: 'none' }}
            >
              open the briefing →
            </a>
          </div>
        )}

        {/* View all */}
        <a
          href={BRIEFING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="foa-news-all"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'var(--op-accent)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            borderLeft: '1px solid var(--op-border)',
          }}
        >
          View all →
        </a>
      </div>

      <style>{`
        .foa-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--bg);
          box-shadow: 0 0 0 0 rgba(255,255,255,0.7);
          animation: foa-pulse 2s infinite;
        }
        @keyframes foa-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
          70% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .foa-ticker {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .foa-ticker-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: foa-scroll 60s linear infinite;
          will-change: transform;
        }
        .foa-ticker:hover .foa-ticker-track {
          animation-play-state: paused;
        }
        @keyframes foa-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .foa-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 0;
          color: var(--fg);
          transition: color 0.15s;
        }
        .foa-ticker-item:hover {
          color: var(--op-accent);
        }
        .foa-ticker-title {
          font-family: Georgia, serif;
          font-size: 13.5px;
          font-weight: 600;
        }
        .foa-ticker-source {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--op-muted);
        }
        .foa-ticker-time {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--op-muted);
        }
        .foa-ticker-sep {
          width: 1px;
          height: 14px;
          background: var(--op-border);
          margin: 0 14px;
        }
        .foa-impact {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--op-border);
        }
        .foa-impact-crit { color: #ef4444; border-color: #ef4444; }
        .foa-impact-high { color: #f97316; border-color: #f97316; }
        .foa-impact-med  { color: #eab308; border-color: #eab308; }
        .foa-impact-low  { color: var(--op-muted); }
        .foa-impact-na   { color: var(--op-muted); }
        @media (max-width: 768px) {
          .foa-news-all { display: none; }
          .foa-ticker-track { animation-duration: 45s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .foa-ticker-track { animation: none; }
          .foa-live-dot { animation: none; }
          .foa-ticker { overflow-x: auto; }
        }
      `}</style>
    </section>
  )
}
