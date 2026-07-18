import Link from 'next/link'

export function MagazineBadge() {
  return (
    <section className="py-20 px-6" style={{ background: '#0a1620' }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/magazine" className="block group" style={{ textDecoration: 'none' }}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'radial-gradient(circle at 72% 34%, #123f57 0%, #0a2639 36%, #061824 75%)',
              border: '1px solid rgba(142, 205, 200, 0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div className="grid md:grid-cols-2 gap-0 items-stretch">
              {/* Left: Cover preview */}
              <div className="relative p-10 md:p-12 flex flex-col justify-between" style={{ minHeight: 380 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: 10,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#a8c3cf',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 28,
                    }}
                  >
                    <span>Independent field magazine</span>
                    <span>2026 · No. 01</span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#8ecdc8',
                      marginBottom: 12,
                    }}
                  >
                    Strategy · systems · governance · field practice
                  </div>
                  <h2
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 'clamp(36px, 5vw, 56px)',
                      fontWeight: 900,
                      letterSpacing: '-0.055em',
                      lineHeight: 0.86,
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    AI THAT<br />WORKS
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 20,
                      fontStyle: 'italic',
                      color: '#b9dfdb',
                      marginTop: 16,
                      lineHeight: 1.1,
                    }}
                  >
                    From demo to operating system
                  </p>
                </div>
                <div style={{ marginTop: 32 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 999,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s',
                    }}
                    className="group-hover:bg-white/20"
                  >
                    Read the Magazine →
                  </div>
                </div>
              </div>

              {/* Right: Cover lines preview */}
              <div
                className="p-10 md:p-12 flex flex-col justify-center"
                style={{
                  borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingTop: 20,
                  }}
                >
                  {[
                    { num: '09', title: 'The pilot was never the product' },
                    { num: '17', title: 'What the caller heard' },
                    { num: '24', title: 'Secure retrieval field guide' },
                    { num: '29', title: 'Dashboards are not evidence' },
                  ].map((item) => (
                    <div
                      key={item.num}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '42px 1fr',
                        gap: 12,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '10px 0',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#79d4c8',
                        }}
                      >
                        {item.num}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: 1.15,
                          color: '#e8f0f3',
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 24,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    fontFamily: "'Courier New', monospace",
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#7c8d99',
                  }}
                >
                  <span>36 pages</span>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
                  <span>Free to read</span>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
                  <span>By Subodh KC</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
