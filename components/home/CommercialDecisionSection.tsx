import Link from 'next/link'
import { MessageSquare, Workflow, Phone, Shield, ArrowRight } from 'lucide-react'

export function CommercialDecisionSection() {
  return (
    <section
      id="start"
      style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '48px 28px 32px',
        borderTop: '1px solid var(--op-border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 14,
          paddingBottom: 24,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--op-accent)',
          }}
        >
          §02
        </span>
        <h2
          style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--fg)',
          }}
        >
          Where should you start?
        </h2>
      </div>

      <p
        style={{
          maxWidth: 680,
          fontSize: 17,
          lineHeight: 1.55,
          color: 'var(--text-secondary)',
          marginBottom: 32,
        }}
      >
        I help businesses decide where AI is useful, deploy it where it creates value,
        and put appropriate controls around it. Choose the path that matches your situation.
      </p>

      {/* PRIMARY: Two main starting points */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {/* AI Advisor Desk */}
        <Link
          href="/ai-advisor"
          data-track-click="homepage_advisor_desk"
          style={{
            display: 'block',
            padding: 28,
            borderRadius: 16,
            border: '1px solid var(--op-border)',
            background: 'var(--op-card)',
            textDecoration: 'none',
            transition: 'border-color .2s, transform .2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare style={{ width: 22, height: 22, color: 'var(--op-accent)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                I want ongoing AI guidance
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--op-muted)', margin: '4px 0 0' }}>
                AI Advisor Desk &middot; $99/month
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Stay informed about AI developments relevant to your company, review important AI tools
            and decisions, and know what deserves action without adding another full-time role.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 16,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--op-accent)',
            }}
          >
            Start AI Advisor Desk
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>

        {/* AI Automation Blueprint */}
        <Link
          href="/ai-automation"
          data-track-click="homepage_blueprint"
          style={{
            display: 'block',
            padding: 28,
            borderRadius: 16,
            border: '1px solid var(--op-border)',
            background: 'var(--op-card)',
            textDecoration: 'none',
            transition: 'border-color .2s, transform .2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Workflow style={{ width: 22, height: 22, color: 'var(--op-accent)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                I have a workflow I want to automate
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--op-muted)', margin: '4px 0 0' }}>
                AI Automation Blueprint &middot; $500 fixed
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Find the right AI automation before you pay to build it. One workflow analyzed with
            tool selection, architecture, cost-benefit, and a clear buy/configure/build recommendation.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 16,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--op-accent)',
            }}
          >
            Start My Blueprint
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>
      </div>

      {/* SECONDARY: Specific solutions */}
      <div
        style={{
          padding: '24px 0 0',
          borderTop: '1px solid var(--op-border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--op-muted)',
            marginBottom: 16,
          }}
        >
          Need something specific?
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <Link
            href="/ai-voice-agent"
            data-track-click="homepage_voice"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '18px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
            }}
          >
            <Phone style={{ width: 20, height: 20, color: 'var(--op-accent)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                AI Voice Agent
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--op-muted)', margin: '2px 0 0' }}>
                Calls, intake, booking &middot; from $499/month
              </p>
            </div>
          </Link>
          <Link
            href="/ai-security-compliance"
            data-track-click="homepage_security"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '18px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
            }}
          >
            <Shield style={{ width: 20, height: 20, color: 'var(--op-accent)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                AI Security &amp; Compliance
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--op-muted)', margin: '2px 0 0' }}>
                AI risk, controls, evidence, SaaS security
              </p>
            </div>
          </Link>
          <Link
            href="/saas-security-review"
            data-track-click="homepage_saas_security"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '18px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
            }}
          >
            <Shield style={{ width: 20, height: 20, color: 'var(--op-accent)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                SaaS &amp; AI Security Review
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--op-muted)', margin: '2px 0 0' }}>
                Tenant isolation, AI app security &middot; from $950
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
