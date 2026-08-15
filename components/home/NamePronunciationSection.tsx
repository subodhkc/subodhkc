// components/home/NamePronunciationSection.tsx - name pronunciation and meaning (00b)
export function NamePronunciationSection() {
  return (
    <section
      id="name"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "48px 28px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
          gap: 0,
          border: "1px solid var(--op-border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Left: the name in display type */}
        <div
          style={{
            padding: "36px 32px",
            background: "var(--op-card)",
            borderBottom: "1px solid var(--op-border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--op-accent)",
            }}
          >
            The name
          </span>
          <h2
            style={{
              margin: "14px 0 6px",
              fontSize: "clamp(32px, 4.5vw, 48px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "var(--fg)",
            }}
          >
            Subodh Kc
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 15,
              letterSpacing: "0.02em",
              color: "var(--text-secondary)",
            }}
          >
            soo&middot;BOHD&nbsp;&nbsp;KAY&middot;see
          </p>
        </div>

        {/* Right: breakdown and meaning */}
        <div
          style={{
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Syllable breakdown */}
          <div
            style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--op-muted)",
                  marginBottom: 6,
                }}
              >
                First name
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.01em" }}>
                Subodh
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                soo &rarr; BOHD
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--op-muted)",
                  marginBottom: 6,
                }}
              >
                Last name
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.01em" }}>
                Kc
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                KAY &rarr; see
              </div>
            </div>
          </div>

          {/* Meaning */}
          <div
            style={{
              paddingTop: 18,
              borderTop: "1px solid var(--op-border)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ color: "var(--fg)", fontWeight: 500 }}>Subodh</span> comes from Sanskrit.{" "}
              <em>Su</em> (good) + <em>bodh</em> (understanding). One who understands easily. A name
              for someone who grasps things quickly and sees clearly.
            </p>
          </div>

          {/* Punchline */}
          <div
            style={{
              paddingTop: 16,
              borderTop: "1px solid var(--op-border)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--op-muted)",
                fontStyle: "italic",
              }}
            >
              soo-BOHD KAY-see. Four syllables. Easier to say than &ldquo;EU AI Act Article 10 compliance documentation.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 720px) {
          #name > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
