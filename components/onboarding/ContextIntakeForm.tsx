'use client'

import { useState } from 'react'
import { Save, CheckCircle2, Loader2, ChevronDown, ChevronUp, FileText } from 'lucide-react'

export interface ContextProfileData {
  organization?: {
    name?: string
    website?: string
    industry?: string
    primaryMarkets?: string
    companySize?: string
    memberRole?: string
  }
  priorities?: {
    topPriorities?: string
    next90DayGoals?: string
    operationalBottlenecks?: string
    areasToImprove?: string
  }
  technology?: {
    currentSystems?: string
    aiProductsUsed?: string
    importantVendors?: string
    aiProjectsInProgress?: string
    architectureConstraints?: string
  }
  workflows?: {
    aiCandidateWorkflows?: string
    manualBottlenecks?: string
    customerFacingAi?: string
    employeeFacingAi?: string
  }
  decisions?: {
    decisionsInPlay?: string
    vendorEvaluations?: string
    upcomingInvestments?: string
    deadlines?: string
  }
  market?: {
    competitorsToWatch?: string
    vendorsToWatch?: string
  }
  riskGovernance?: {
    sensitiveDataCategories?: string
    regulatedActivities?: string
    governanceConcerns?: string
    policyMaturity?: string
  }
  jurisdiction?: {
    operatingRegions?: string
    aiUseRegions?: string
  }
  watchPreferences?: {
    priorityAreas?: string[]
  }
}

interface ContextIntakeFormProps {
  initialData: ContextProfileData | null
  currentStatus: string
  onSave: (data: ContextProfileData) => void
  onComplete: (data: ContextProfileData) => void
  saving: boolean
}

const watchPreferenceOptions = [
  'Opportunity',
  'AI Advancements',
  'Vendors',
  'Competitors/Market',
  'Architecture',
  'Security',
  'Governance',
  'Law/Regulation',
  'Compliance Exposure',
]

export function ContextIntakeForm({
  initialData,
  currentStatus,
  onSave,
  onComplete,
  saving,
}: ContextIntakeFormProps) {
  const [data, setData] = useState<ContextProfileData>(initialData || {})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    organization: true,
    priorities: true,
    technology: false,
    workflows: false,
    decisions: false,
    market: false,
    riskGovernance: false,
    jurisdiction: false,
    watchPreferences: false,
  })

  function toggleSection(key: string) {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function updateField(section: keyof ContextProfileData, field: string, value: string) {
    setData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown> || {}),
        [field]: value,
      },
    }))
  }

  function toggleWatchPreference(pref: string) {
    const current = data.watchPreferences?.priorityAreas || []
    const updated = current.includes(pref)
      ? current.filter(p => p !== pref)
      : [...current, pref]
    setData(prev => ({
      ...prev,
      watchPreferences: { priorityAreas: updated },
    }))
  }

  const isCompleted = currentStatus === 'completed'

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Organizational AI Context Profile
          </h3>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          This takes 5 to 10 minutes. You can save and resume. Never share passwords, API keys, or secrets here.
        </p>
      </div>

      {/* Organization */}
      <FormSection
        title="Organization"
        expanded={expandedSections.organization}
        onToggle={() => toggleSection('organization')}
      >
        <Field label="Organization name" value={data.organization?.name || ''} onChange={v => updateField('organization', 'name', v)} placeholder="e.g., Acme Inc." />
        <Field label="Website" value={data.organization?.website || ''} onChange={v => updateField('organization', 'website', v)} placeholder="https://..." />
        <Field label="Industry" value={data.organization?.industry || ''} onChange={v => updateField('organization', 'industry', v)} placeholder="e.g., Healthcare, SaaS, Manufacturing" />
        <Field label="Primary markets" value={data.organization?.primaryMarkets || ''} onChange={v => updateField('organization', 'primaryMarkets', v)} placeholder="e.g., US, EU, Dallas-Fort Worth" />
        <Field label="Company size / operating scale" value={data.organization?.companySize || ''} onChange={v => updateField('organization', 'companySize', v)} placeholder="e.g., 50 employees, 10K customers" />
        <Field label="Your role" value={data.organization?.memberRole || ''} onChange={v => updateField('organization', 'memberRole', v)} placeholder="e.g., CEO, CTO, Head of Operations" />
      </FormSection>

      {/* Priorities */}
      <FormSection
        title="Priorities"
        expanded={expandedSections.priorities}
        onToggle={() => toggleSection('priorities')}
      >
        <TextArea label="Top 3 business priorities" value={data.priorities?.topPriorities || ''} onChange={v => updateField('priorities', 'topPriorities', v)} placeholder="What matters most right now?" />
        <TextArea label="Next 90-day goals" value={data.priorities?.next90DayGoals || ''} onChange={v => updateField('priorities', 'next90DayGoals', v)} />
        <TextArea label="Operational bottlenecks" value={data.priorities?.operationalBottlenecks || ''} onChange={v => updateField('priorities', 'operationalBottlenecks', v)} />
        <TextArea label="Areas leadership wants improved" value={data.priorities?.areasToImprove || ''} onChange={v => updateField('priorities', 'areasToImprove', v)} />
      </FormSection>

      {/* Technology */}
      <FormSection
        title="Technology"
        expanded={expandedSections.technology}
        onToggle={() => toggleSection('technology')}
      >
        <TextArea label="Current major systems" value={data.technology?.currentSystems || ''} onChange={v => updateField('technology', 'currentSystems', v)} placeholder="e.g., Salesforce, Shopify, custom ERP" />
        <TextArea label="AI products already being used" value={data.technology?.aiProductsUsed || ''} onChange={v => updateField('technology', 'aiProductsUsed', v)} placeholder="e.g., ChatGPT Enterprise, Copilot, Jasper" />
        <TextArea label="Important AI and non-AI vendors" value={data.technology?.importantVendors || ''} onChange={v => updateField('technology', 'importantVendors', v)} />
        <TextArea label="AI projects in progress" value={data.technology?.aiProjectsInProgress || ''} onChange={v => updateField('technology', 'aiProjectsInProgress', v)} />
        <TextArea label="Relevant architecture constraints" value={data.technology?.architectureConstraints || ''} onChange={v => updateField('technology', 'architectureConstraints', v)} placeholder="e.g., on-prem only, AWS, hybrid" />
      </FormSection>

      {/* Workflows */}
      <FormSection
        title="Workflows"
        expanded={expandedSections.workflows}
        onToggle={() => toggleSection('workflows')}
      >
        <TextArea label="Workflows that may benefit from AI" value={data.workflows?.aiCandidateWorkflows || ''} onChange={v => updateField('workflows', 'aiCandidateWorkflows', v)} />
        <TextArea label="Known manual bottlenecks" value={data.workflows?.manualBottlenecks || ''} onChange={v => updateField('workflows', 'manualBottlenecks', v)} />
        <TextArea label="Customer-facing AI use" value={data.workflows?.customerFacingAi || ''} onChange={v => updateField('workflows', 'customerFacingAi', v)} placeholder="e.g., chatbot, recommendation engine" />
        <TextArea label="Employee-facing AI use" value={data.workflows?.employeeFacingAi || ''} onChange={v => updateField('workflows', 'employeeFacingAi', v)} placeholder="e.g., Copilot, internal knowledge base" />
      </FormSection>

      {/* Decisions */}
      <FormSection
        title="Decisions"
        expanded={expandedSections.decisions}
        onToggle={() => toggleSection('decisions')}
      >
        <TextArea label="1-3 decisions currently in play" value={data.decisions?.decisionsInPlay || ''} onChange={v => updateField('decisions', 'decisionsInPlay', v)} />
        <TextArea label="Vendor evaluations" value={data.decisions?.vendorEvaluations || ''} onChange={v => updateField('decisions', 'vendorEvaluations', v)} />
        <TextArea label="Upcoming investments" value={data.decisions?.upcomingInvestments || ''} onChange={v => updateField('decisions', 'upcomingInvestments', v)} />
        <TextArea label="Deadlines" value={data.decisions?.deadlines || ''} onChange={v => updateField('decisions', 'deadlines', v)} />
      </FormSection>

      {/* Market */}
      <FormSection
        title="Market"
        expanded={expandedSections.market}
        onToggle={() => toggleSection('market')}
      >
        <TextArea label="Competitors or companies worth watching (optional)" value={data.market?.competitorsToWatch || ''} onChange={v => updateField('market', 'competitorsToWatch', v)} />
        <TextArea label="Technologies or vendors you specifically want watched" value={data.market?.vendorsToWatch || ''} onChange={v => updateField('market', 'vendorsToWatch', v)} />
      </FormSection>

      {/* Risk / Governance */}
      <FormSection
        title="Risk and Governance"
        expanded={expandedSections.riskGovernance}
        onToggle={() => toggleSection('riskGovernance')}
      >
        <TextArea label="Sensitive-data categories (high level)" value={data.riskGovernance?.sensitiveDataCategories || ''} onChange={v => updateField('riskGovernance', 'sensitiveDataCategories', v)} placeholder="e.g., customer PII, health data, financial records" />
        <TextArea label="Regulated activities" value={data.riskGovernance?.regulatedActivities || ''} onChange={v => updateField('riskGovernance', 'regulatedActivities', v)} placeholder="e.g., hiring, lending, healthcare" />
        <TextArea label="Known governance concerns" value={data.riskGovernance?.governanceConcerns || ''} onChange={v => updateField('riskGovernance', 'governanceConcerns', v)} />
        <Field label="AI policy / control maturity" value={data.riskGovernance?.policyMaturity || ''} onChange={v => updateField('riskGovernance', 'policyMaturity', v)} placeholder="e.g., no policy, draft policy, enforced policy" />
      </FormSection>

      {/* Jurisdiction */}
      <FormSection
        title="Jurisdiction"
        expanded={expandedSections.jurisdiction}
        onToggle={() => toggleSection('jurisdiction')}
      >
        <Field label="Regions where the business operates" value={data.jurisdiction?.operatingRegions || ''} onChange={v => updateField('jurisdiction', 'operatingRegions', v)} placeholder="e.g., Texas, California, EU" />
        <Field label="Regions where AI is used" value={data.jurisdiction?.aiUseRegions || ''} onChange={v => updateField('jurisdiction', 'aiUseRegions', v)} placeholder="e.g., US, UK, Germany" />
      </FormSection>

      {/* Watch Preferences */}
      <FormSection
        title="Watch Preferences"
        expanded={expandedSections.watchPreferences}
        onToggle={() => toggleSection('watchPreferences')}
      >
        <p className="text-sm text-muted-foreground mb-3">Prioritize what you want me to watch for:</p>
        <div className="flex flex-wrap gap-2">
          {watchPreferenceOptions.map(pref => {
            const selected = data.watchPreferences?.priorityAreas?.includes(pref) || false
            return (
              <button
                key={pref}
                type="button"
                onClick={() => toggleWatchPreference(pref)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  selected
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {pref}
              </button>
            )
          })}
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={() => onSave(data)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg border border-border hover:bg-accent/10 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save and Continue Later
        </button>
        <button
          onClick={() => onComplete(data)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Complete Context Profile
        </button>
      </div>
    </div>
  )
}

// ============================================
// Form Section (collapsible)
// ============================================
function FormSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent/5 transition-colors"
        aria-expanded={expanded}
      >
        <h4 className="text-sm font-semibold">{title}</h4>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-6 pb-6 space-y-4">{children}</div>
      )}
    </div>
  )
}

// ============================================
// Field components
// ============================================
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />
    </div>
  )
}
