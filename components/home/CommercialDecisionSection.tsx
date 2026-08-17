import Link from 'next/link'
import { MessageSquare, Workflow, Phone, Shield, ShieldCheck, ArrowRight, Users } from 'lucide-react'
import { MobileCollapsible } from './MobileCollapsible'

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
          03
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
        What could you be missing? What is actually worth pursuing? What decision should you make,
        and how would you make it real? Choose the path that matches your situation.
      </p>

      {/* PRIMARY: Three main starting points */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {/* AI Advisor for Business */}
        <Link
          href="/ai-advisor"
          data-track-click="homepage_advisor_for_business"
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
                I want an AI advisor in my corner
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--op-muted)', margin: '4px 0 0' }}>
                AI Advisor for Business &middot; $99/month
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Ongoing human AI advisory. Weekly signal, monthly point of view, and human advice
            when a decision matters. See what is changing, what it could mean for you, and what
            deserves action.
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
            Explore AI Advisor for Business
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>

        {/* AI Work Order */}
        <Link
          href="/ai-automation"
          data-track-click="homepage_assessment"
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
                I want to find where AI could improve a workflow
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--op-muted)', margin: '4px 0 0' }}>
                AI Work Order &middot; $500 fixed
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            One opportunity, one primary workflow. You receive an AI Automation Blueprint with
            tool selection, architecture, cost-benefit, and a clear buy/configure/build
            recommendation. $500 fixed, delivered in 5 business days.
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
            Start My Assessment
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>

        {/* Fractional AI Advisor */}
        <Link
          href="/advisory"
          data-track-click="homepage_fractional_advisor"
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
              <Users style={{ width: 22, height: 22, color: 'var(--op-accent)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                I want an AI advisor in the room
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--op-muted)', margin: '4px 0 0' }}>
                Fractional AI Advisor &middot; $1,250/month
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Executive AI advisory for higher-stakes decisions. Strategy, architecture, vendor
            evaluation, build-vs-buy, and roadmap review with context that carries forward.
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
            Explore Fractional AI Advisor
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
        <MobileCollapsible label="Specific solutions">
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
                  Missing calls while busy or after hours &middot; from $499/month
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
                  Worried about AI security or compliance gaps? &middot; from $950
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
              <ShieldCheck style={{ width: 20, height: 20, color: 'var(--op-accent)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
                  SaaS &amp; AI Security Review
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--op-muted)', margin: '2px 0 0' }}>
                  Tenant isolation &amp; AI app security &middot; from $950
                </p>
              </div>
            </Link>
          </div>
        </MobileCollapsible>
      </div>
    </section>
  )
}
