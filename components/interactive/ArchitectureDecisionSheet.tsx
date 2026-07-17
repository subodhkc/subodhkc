'use client'

import { useState, useMemo, useEffect, useRef, Fragment, useCallback } from 'react'
import { layers, groups, csmPillars, glossary, scenarioMap, filterDefs, type Layer } from './architecture-data'

type ViewType = 'layer' | 'phase' | 'ai' | 'csm'
type TabType = 'overview' | 'decision' | 'people' | 'risk' | 'ai' | 'pm'

interface ActiveFilters {
  group: string[]
  crit: string[]
  phase: string[]
  status: string[]
  appl: string[]
  csmPillar: string[]
}

const tabDefs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'decision', label: 'Decision Details' },
  { id: 'people', label: 'People & Governance' },
  { id: 'risk', label: 'Risk & Dependencies' },
  { id: 'ai', label: 'AI Development Risk' },
  { id: 'pm', label: 'PM Tracking' },
]

const phases = ['Discovery', 'Design', 'Build', 'Launch', 'Operate']

export function ArchitectureDecisionSheet() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ group: [], crit: [], phase: [], status: [], appl: [], csmPillar: [] })
  const [currentView, setCurrentView] = useState<ViewType>('layer')
  const [activeScenario, setActiveScenario] = useState<string | null>('aiproduct')
  const [trackingData, setTrackingData] = useState<Record<number, { status: string; sprint: string; owner: string; adr: string; techDebt: string }>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [popupLayer, setPopupLayer] = useState<Layer | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [glossarySearch, setGlossarySearch] = useState('')
  const popupRef = useRef<HTMLDivElement>(null)
  const glossaryRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const filteredLayers = useMemo(() => {
    let result = layers
    if (activeScenario && scenarioMap[activeScenario]) {
      result = result.filter(scenarioMap[activeScenario])
    }
    if (activeFilters.group.length) result = result.filter(l => activeFilters.group.includes(l.g))
    if (activeFilters.crit.length) result = result.filter(l => activeFilters.crit.includes(l.crit))
    if (activeFilters.phase.length) result = result.filter(l => activeFilters.phase.includes(l.phase))
    if (activeFilters.status.length) result = result.filter(l => activeFilters.status.includes(l.status))
    if (activeFilters.appl.length) result = result.filter(l => activeFilters.appl.includes(l.appl.split(' ')[0]))
    if (activeFilters.csmPillar.length) result = result.filter(l => activeFilters.csmPillar.includes(l.csmPillar))
    const q = searchQuery.toLowerCase().trim()
    if (q) {
      result = result.filter(l => {
        const blob = [l.name, l.plain, l.purpose, l.risks, l.tools, l.artifact, l.depends, l.blocks, l.csmPillar].join(' ').toLowerCase()
        return blob.includes(q)
      })
    }
    return result
  }, [activeFilters, activeScenario, searchQuery])

  const filteredGlossary = useMemo(() => {
    const q = glossarySearch.toLowerCase()
    return glossary.filter(g => !q || g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q))
  }, [glossarySearch])

  const dashboardStats = useMemo(() => {
    const f = filteredLayers
    const getStatus = (l: typeof f[0]) => trackingData[l.id]?.status || l.status
    return {
      total: f.length,
      critical: f.filter(l => l.crit === 'Critical').length,
      important: f.filter(l => l.crit === 'Important').length,
      decided: f.filter(l => getStatus(l) === 'Decided').length,
      blocked: f.filter(l => getStatus(l) === 'Blocked').length,
      pending: f.filter(l => getStatus(l) === 'Not Started').length,
      aiLayers: f.filter(l => l.g === 'E').length,
    }
  }, [filteredLayers, trackingData])

  const toggleFilter = (key: keyof ActiveFilters, val: string) => {
    setActiveFilters(prev => {
      const arr = prev[key]
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
      return { ...prev, [key]: next }
    })
  }

  const toggleScenario = (name: string) => {
    setActiveScenario(prev => prev === name ? null : name)
  }

  const openPopup = (layer: Layer) => {
    setPopupLayer(layer)
    setActiveTab('overview')
  }

  const closePopup = () => {
    setPopupLayer(null)
    if (previousFocusRef.current) previousFocusRef.current.focus()
  }

  const closeGlossary = () => {
    setGlossaryOpen(false)
    if (previousFocusRef.current) previousFocusRef.current.focus()
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (popupLayer) closePopup()
        if (glossaryOpen) closeGlossary()
      }
    }
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const container = popupLayer ? popupRef.current : glossaryOpen ? glossaryRef.current : null
      if (!container) return
      const focusable = container.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleEsc)
    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('keydown', handleTab)
    }
  }, [popupLayer, glossaryOpen])

  useEffect(() => {
    if (popupLayer) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setTimeout(() => {
        const focusable = popupRef.current?.querySelector<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
        focusable?.focus()
      }, 50)
    }
  }, [popupLayer])

  useEffect(() => {
    if (glossaryOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setTimeout(() => {
        const focusable = glossaryRef.current?.querySelector<HTMLElement>('input, button, [tabindex]:not([tabindex="-1"])')
        focusable?.focus()
      }, 50)
    }
  }, [glossaryOpen])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arch-sheet-tracking')
      if (saved) setTrackingData(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const updateTracking = useCallback((layerId: number, field: 'status' | 'sprint' | 'owner' | 'adr' | 'techDebt', value: string) => {
    setTrackingData(prev => {
      const next = { ...prev, [layerId]: { ...prev[layerId], [field]: value } }
      try { localStorage.setItem('arch-sheet-tracking', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const getTracking = (layerId: number) => trackingData[layerId] || {}

  const exportCSV = () => {
    const headers = ['ID', 'Group', 'CSM Pillar', 'Name', 'Purpose', 'Criticality', 'Phase', 'Applicability', 'Effort', 'Reversibility', 'RACI', 'Risks', 'Risk Severity', 'Mitigation', 'AI Pitfall', 'AI Quality Gate', 'Dependencies', 'Blocks', 'DoD', 'Arch Docs', 'PM Docs', 'Status', 'Sprint', 'Owner', 'ADR Ref', 'Tech Debt']
    const rows = filteredLayers.map(l => {
      const t = trackingData[l.id] || {}
      return [l.id, l.g, l.csmPillar, l.name, l.purpose, l.crit, l.phase, l.appl, l.effort, l.rev, l.raci, l.risks, l.riskSev, l.mitigation, l.aiPitfall, l.aiGate, l.depends, l.blocks, l.dod, l.archDocs.join('; '), l.pmDocs.join('; '), t.status || l.status, t.sprint || l.sprint, t.owner || l.owner, t.adr || l.adr, t.techDebt || l.techDebt]
    })
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'architecture-decision-master-sheet.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    const exportData = filteredLayers.map(l => ({ ...l, ...trackingData[l.id] }))
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'architecture-decision-master-sheet.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="arch-sheet-wrapper">
    <div className="arch-sheet">
      <style>{`
        .arch-sheet{--bg:#0a1020;--card:#121c38;--card2:#1a2748;--border:rgba(255,255,255,.08);--text:#e8eef9;--accent:#4ab3e4;--danger:#e5484d;--warning:#f5a623;--success:#30a46c;--info:#4ab3e4;--purple:#9b8cff;max-width:1100px;margin:0 auto;padding:20px;font-family:system-ui,-apple-system,sans-serif;color:var(--text);background:var(--bg);border-radius:16px}
        .arch-sheet .arch-header{text-align:center;margin-bottom:20px}
        .arch-sheet .arch-header h2{font-size:28px;margin:0 0 6px}
        .arch-sheet .arch-header p{font-size:14px;opacity:.7;margin:0 0 10px}
        .arch-sheet .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(74,179,228,.15);color:var(--accent);margin:2px}
        .arch-sheet .scenarios{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:16px}
        .arch-sheet .scenario-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;cursor:pointer;transition:border-color .2s}
        .arch-sheet .scenario-card:hover{border-color:var(--accent)}
        .arch-sheet .scenario-card.active{border-color:var(--accent);background:rgba(74,179,228,.08)}
        .arch-sheet .scenario-card h4{margin:0 0 4px;font-size:13px}
        .arch-sheet .scenario-card p{margin:0;font-size:11px;opacity:.6}
        .arch-sheet .dashboard{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
        .arch-sheet .stat{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:8px 14px;text-align:center;min-width:80px}
        .arch-sheet .stat-num{display:block;font-size:22px;font-weight:700}
        .arch-sheet .stat-label{font-size:10px;opacity:.6;text-transform:uppercase}
        .arch-sheet .stat.critical .stat-num{color:var(--danger)}
        .arch-sheet .stat.important .stat-num{color:var(--warning)}
        .arch-sheet .stat.decided .stat-num{color:var(--success)}
        .arch-sheet .stat.blocked .stat-num{color:var(--danger)}
        .arch-sheet .stat.pending .stat-num{color:var(--info)}
        .arch-sheet .view-toggle{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap}
        .arch-sheet .view-btn{padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px;cursor:pointer;transition:all .2s}
        .arch-sheet .view-btn:hover{border-color:var(--accent)}
        .arch-sheet .view-btn.active{background:var(--accent);color:#000;border-color:var(--accent);font-weight:600}
        .arch-sheet .controls{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
        .arch-sheet .search{flex:1;min-width:200px;padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px}
        .arch-sheet .export-btn{padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:12px;cursor:pointer}
        .arch-sheet .export-btn:hover{border-color:var(--accent)}
        .arch-sheet .filters{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px}
        .arch-sheet .filter-group{display:flex;flex-direction:column;gap:4px}
        .arch-sheet .filter-group-label{font-size:10px;text-transform:uppercase;letter-spacing:.5px;opacity:.5;margin-bottom:2px}
        .arch-sheet .chip{padding:3px 10px;border-radius:16px;border:1px solid var(--border);background:transparent;color:var(--text);font-size:11px;cursor:pointer;transition:all .2s}
        .arch-sheet .chip:hover{border-color:var(--accent)}
        .arch-sheet .chip.active{background:var(--accent);color:#000;border-color:var(--accent);font-weight:600}
        .arch-sheet .table-container{overflow:auto;border-radius:12px;background:var(--card);border:1px solid var(--border);max-height:65vh}
        .arch-sheet table{width:100%;border-collapse:collapse;font-size:13px}
        .arch-sheet th,.arch-sheet td{padding:10px 12px;border-bottom:1px solid var(--border);vertical-align:top;text-align:left}
        .arch-sheet th{position:sticky;top:0;background:var(--card2);z-index:2;font-size:12px;text-transform:uppercase;letter-spacing:.5px;opacity:.9}
        .arch-sheet tr:hover{background:rgba(74,179,228,.05);cursor:pointer}
        .arch-sheet .group-header td{background:var(--card2);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--accent);cursor:default}
        .arch-sheet .crit-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase}
        .arch-sheet .csm-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;background:rgba(155,140,255,.2);color:var(--purple);border:1px solid rgba(155,140,255,.3)}
        .arch-sheet .crit-Critical{background:rgba(229,72,77,.2);color:var(--danger);border:1px solid rgba(229,72,77,.3)}
        .arch-sheet .crit-Important{background:rgba(245,166,35,.2);color:var(--warning);border:1px solid rgba(245,166,35,.3)}
        .arch-sheet .crit-Standard{background:rgba(75,179,228,.2);color:var(--info);border:1px solid rgba(75,179,228,.3)}
        .arch-sheet .status-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600}
        .arch-sheet .status-NotStarted{background:rgba(75,179,228,.15);color:var(--info)}
        .arch-sheet .status-InDiscussion{background:rgba(245,166,35,.15);color:var(--warning)}
        .arch-sheet .status-Decided{background:rgba(48,164,108,.15);color:var(--success)}
        .arch-sheet .status-Blocked{background:rgba(229,72,77,.15);color:var(--danger)}
        .arch-sheet .ai-risk-icon{color:var(--danger);font-size:11px;margin-left:4px}
        .arch-sheet .popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
        .arch-sheet .popup{background:var(--bg);border:1px solid var(--border);border-radius:14px;max-width:680px;width:100%;max-height:85vh;overflow-y:auto;position:relative}
        .arch-sheet .popup-header{position:sticky;top:0;background:var(--bg);padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;z-index:3}
        .arch-sheet .popup-header h3{margin:0;font-size:20px}
        .arch-sheet .popup-close{background:none;border:none;color:var(--text);font-size:24px;cursor:pointer;padding:0 4px}
        .arch-sheet .popup-tabs{display:flex;gap:2px;padding:0 20px;border-bottom:1px solid var(--border);position:sticky;top:53px;background:var(--bg);z-index:2;overflow-x:auto}
        .arch-sheet .popup-tab{padding:8px 14px;border:none;background:none;color:var(--text);font-size:12px;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;opacity:.6}
        .arch-sheet .popup-tab.active{border-bottom-color:var(--accent);opacity:1;font-weight:600}
        .arch-sheet .popup-body{padding:20px}
        .arch-sheet .section-title{font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--accent);margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid var(--border)}
        .arch-sheet .kv{display:grid;grid-template-columns:160px 1fr;gap:4px;padding:4px 0;font-size:13px}
        .arch-sheet .kv .k{opacity:.5;font-size:12px}
        .arch-sheet .kv .v{color:var(--text)}
        .arch-sheet .doc-box{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:12px;margin:8px 0}
        .arch-sheet .doc-box h4{margin:0 0 6px;font-size:13px}
        .arch-sheet .doc-box ul{margin:0;padding-left:16px;font-size:12px}
        .arch-sheet .doc-box li{margin:3px 0}
        .arch-sheet .doc-arch{border-left:3px solid var(--accent)}
        .arch-sheet .doc-pm{border-left:3px solid var(--warning)}
        .arch-sheet .dod-box{background:rgba(48,164,108,.1);border:1px solid rgba(48,164,108,.3);border-radius:8px;padding:12px;font-size:13px}
        .arch-sheet .ai-risk-card{background:var(--card);border:1px solid var(--border);border-left:3px solid var(--danger);border-radius:8px;padding:12px;margin-bottom:8px}
        .arch-sheet .ai-field{font-size:12px;margin:4px 0}
        .arch-sheet .ai-label{font-size:10px;text-transform:uppercase;opacity:.5;margin-bottom:2px}
        .arch-sheet .phase-cell{text-align:center;font-size:11px}
        .arch-sheet .glossary-btn{position:fixed;bottom:20px;right:20px;width:40px;height:40px;border-radius:50%;background:var(--accent);color:#000;border:none;font-size:18px;font-weight:700;cursor:pointer;z-index:50;box-shadow:0 4px 12px rgba(0,0,0,.3)}
        .arch-sheet .glossary-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:90;display:flex;justify-content:flex-end}
        .arch-sheet .glossary-panel{background:var(--bg);border-left:1px solid var(--border);width:340px;max-width:90vw;height:100vh;overflow-y:auto;display:flex;flex-direction:column}
        .arch-sheet .glossary-header{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
        .arch-sheet .glossary-search{padding:10px 18px;border-bottom:1px solid var(--border)}
        .arch-sheet .glossary-search input{width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px}
        .arch-sheet .glossary-list{overflow-y:auto;flex:1;padding:8px 18px}
        .arch-sheet .glossary-item{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)}
        .arch-sheet .glossary-item strong{color:var(--accent);font-size:13px}
        .arch-sheet .glossary-item p{margin:2px 0 0;font-size:12px;opacity:.85}
        .arch-sheet .arch-footer{margin-top:18px;padding:12px 0;border-top:1px solid var(--border);font-size:12px;opacity:.7;text-align:center}
        .arch-sheet .arch-footer a{color:var(--accent);text-decoration:none}
        .arch-sheet-wrapper{position:relative;border-radius:18px;padding:4px;background:linear-gradient(135deg,rgba(74,179,228,.15),rgba(155,140,255,.1),transparent);margin:0 auto;max-width:1110px}
        .arch-sheet select:focus,.arch-sheet input:focus{outline:2px solid var(--accent);outline-offset:1px}
        @media print{
          .arch-sheet-wrapper{background:none;padding:0}
          .arch-sheet{background:#fff;color:#000;border-radius:0;padding:8px}
          .arch-sheet .scenarios,.arch-sheet .controls,.arch-sheet .filters,.arch-sheet .view-toggle,.arch-sheet .glossary-btn,.arch-sheet .arch-footer{display:none!important}
          .arch-sheet .table-container{max-height:none;overflow:visible;border:none}
          .arch-sheet th{background:#eee;color:#000}
          .arch-sheet tr{page-break-inside:avoid}
          .arch-sheet .crit-badge,.arch-sheet .status-badge,.arch-sheet .csm-badge{border:1px solid #999!important}
        }
        @media(max-width:768px){
          .arch-sheet{padding:10px 12px 30px}
          .arch-sheet .arch-header h2{font-size:22px}
          .arch-sheet .scenarios{grid-template-columns:1fr}
          .arch-sheet .kv{grid-template-columns:1fr;gap:2px}
          .arch-sheet .kv .k{margin-top:6px}
          .arch-sheet .table-container{max-height:50vh;font-size:12px}
          .arch-sheet th,.arch-sheet td{padding:8px}
        }
      `}</style>

      <div className="arch-header">
        <h2>Architecture Decision Master Sheet</h2>
        <p>A practitioner&apos;s guide for software development PMs, architects, and tech leads — with or without AI.</p>
        <div>
          <span className="badge">Software Dev PM</span>
          <span className="badge">Architect</span>
          <span className="badge">Tech Lead</span>
          <span className="badge">AI Development Risks</span>
          <span className="badge">25 Layers</span>
          <span className="badge">Documents per Step</span>
          <span className="badge">CSM-Aligned</span>
        </div>
      </div>

      <div className="scenarios">
        {[
          { id: 'webapp', title: 'Web app without AI', desc: 'Layers 1–14, 18–25. Standard delivery decisions.' },
          { id: 'aiproduct', title: 'AI-powered product', desc: 'All 25 layers. Emphasis on AI Pipeline, Agents, Validation.' },
          { id: 'aitools', title: 'Using AI tools to develop', desc: 'All layers. Focus on AI Development Risks per layer.' },
          { id: 'audit', title: 'Auditing existing system', desc: 'Start with Observability, Governance, Security.' },
          { id: 'pilot', title: 'Recovering stalled AI pilot', desc: 'AI Pipeline, Agents, Observability, Governance first.' },
        ].map(s => (
          <div
            key={s.id}
            className={`scenario-card ${activeScenario === s.id ? 'active' : ''}`}
            onClick={() => toggleScenario(s.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleScenario(s.id)}
          >
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="dashboard">
        <div className="stat"><span className="stat-num">{dashboardStats.total}</span><span className="stat-label">Layers</span></div>
        <div className="stat critical"><span className="stat-num">{dashboardStats.critical}</span><span className="stat-label">Critical</span></div>
        <div className="stat important"><span className="stat-num">{dashboardStats.important}</span><span className="stat-label">Important</span></div>
        <div className="stat decided"><span className="stat-num">{dashboardStats.decided}</span><span className="stat-label">Decided</span></div>
        <div className="stat blocked"><span className="stat-num">{dashboardStats.blocked}</span><span className="stat-label">Blocked</span></div>
        <div className="stat pending"><span className="stat-num">{dashboardStats.pending}</span><span className="stat-label">Not Started</span></div>
        {dashboardStats.aiLayers > 0 && <div className="stat"><span className="stat-num" style={{ color: 'var(--danger)' }}>{dashboardStats.aiLayers}</span><span className="stat-label">AI Layers</span></div>}
      </div>

      <div className="view-toggle">
        {([['layer', 'Layer View'], ['phase', 'Phase Matrix'], ['ai', 'AI Risk View'], ['csm', 'CSM Pillar View']] as const).map(([v, label]) => (
          <button key={v} className={`view-btn ${currentView === v ? 'active' : ''}`} onClick={() => setCurrentView(v)}>{label}</button>
        ))}
      </div>

      {currentView === 'layer' && (
        <>
          <div className="controls">
            <input
              className="search"
              placeholder="Filter by keyword (e.g., RLS, idempotency, embeddings, rollback, ADR)…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search layers"
            />
            <button className="export-btn" onClick={exportCSV}>Export CSV</button>
            <button className="export-btn" onClick={exportJSON}>Export JSON</button>
          </div>

          <div className="filters">
            {filterDefs.map(fd => (
              <div key={fd.key} className="filter-group">
                <span className="filter-group-label">{fd.label}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {fd.options.map(opt => (
                    <button
                      key={opt.val}
                      className={`chip ${activeFilters[fd.key as keyof ActiveFilters].includes(opt.val) ? 'active' : ''}`}
                      onClick={() => toggleFilter(fd.key as keyof ActiveFilters, opt.val)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr><th>#</th><th>Layer</th><th>Purpose</th><th>Criticality</th><th>Phase</th><th>Status</th><th>AI Risk</th></tr>
              </thead>
              <tbody>
                {filteredLayers.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>No layers match current filters</td></tr>
                ) : (
                  filteredLayers.map((layer, i) => {
                    const showGroupHeader = i === 0 || filteredLayers[i - 1].g !== layer.g
                    const g = groups.find(x => x.id === layer.g)
                    return (
                      <Fragment key={layer.id}>
                        {showGroupHeader && (
                          <tr className="group-header"><td colSpan={7}>{g?.name}</td></tr>
                        )}
                        <tr onClick={() => openPopup(layer)}>
                          <td>{layer.id}</td>
                          <td>
                            <strong>{layer.name}</strong>{layer.g === 'E' && <span className="ai-risk-icon">AI</span>}
                            <br /><span style={{ opacity: 0.6, fontSize: '11px' }}>{layer.plain}</span>
                            <br /><span className="csm-badge" style={{ marginTop: '2px' }}>{layer.csmPillar}</span>
                          </td>
                          <td>{layer.purpose}</td>
                          <td><span className={`crit-badge crit-${layer.crit}`}>{layer.crit}</span></td>
                          <td>{layer.phase}</td>
                          <td><span className={`status-badge status-${(getTracking(layer.id).status || layer.status).replace(/\s/g, '')}`}>{getTracking(layer.id).status || layer.status}</span></td>
                          <td>{layer.g === 'E' ? <span style={{ color: 'var(--danger)' }}>High</span> : <span style={{ opacity: 0.5 }}>—</span>}</td>
                        </tr>
                      </Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {currentView === 'phase' && (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Group</th><th>Layer</th>{phases.map(p => <th key={p}>{p}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLayers.map((l, i) => {
                const showGroupHeader = i === 0 || filteredLayers[i - 1].g !== l.g
                const g = groups.find(x => x.id === l.g)
                return (
                  <Fragment key={l.id}>
                    {showGroupHeader && (
                      <tr className="group-header"><td colSpan={7}>{g?.name}</td></tr>
                    )}
                    <tr style={{ cursor: 'pointer' }} onClick={() => openPopup(l)}>
                      <td></td>
                      <td><strong>{l.name}</strong></td>
                      {phases.map(p => (
                        <td key={p} className="phase-cell">
                          {l.phase === p ? <><strong>{l.short}</strong><br /><span className={`crit-badge crit-${l.crit}`}>{l.crit}</span></> : <span style={{ opacity: 0.3 }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {currentView === 'ai' && (
        <div>
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '12px' }}>AI-specific layers (Group E) and AI development risks for all other layers.</p>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--danger)', margin: '16px 0 8px' }}>AI-Specific Architecture Layers</div>
          {filteredLayers.filter(l => l.g === 'E').map(l => (
            <div key={l.id} className="ai-risk-card" style={{ cursor: 'pointer' }} onClick={() => openPopup(l)}>
              <h4 style={{ margin: '0 0 6px' }}>{l.name}</h4>
              <div className="ai-field"><div className="ai-label">Purpose</div>{l.purpose}</div>
              <div className="ai-field"><div className="ai-label">Key Risk</div>{l.risks}</div>
              <div className="ai-field"><div className="ai-label">If Skipped</div>{l.skip}</div>
              <div className="ai-field"><div className="ai-label">Quality Gate</div><strong>{l.aiGate}</strong></div>
            </div>
          ))}
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--warning)', margin: '20px 0 8px' }}>AI Development Risks (All Layers)</div>
          {filteredLayers.filter(l => l.g !== 'E' && l.aiPitfall).map(l => (
            <div key={l.id} className="ai-risk-card" style={{ borderLeftColor: 'var(--warning)', cursor: 'pointer' }} onClick={() => openPopup(l)}>
              <h4 style={{ color: 'var(--warning)', margin: '0 0 6px' }}>{l.name} <span style={{ fontSize: '12px', opacity: 0.7 }}>({l.short})</span></h4>
              <div className="ai-field"><div className="ai-label">AI Pitfall</div>{l.aiPitfall}</div>
              <div className="ai-field"><div className="ai-label">Mitigation</div>{l.aiApproach}</div>
              <div className="ai-field"><div className="ai-label">Quality Gate</div><strong>{l.aiGate}</strong></div>
            </div>
          ))}
        </div>
      )}

      {currentView === 'csm' && (
        <div>
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '12px' }}>Layers mapped to the four pillars of Cognitive Systems Management (CSM) — the methodology underlying the HAIEC platform.</p>
          {csmPillars.map(pillar => {
            const pillarLayers = filteredLayers.filter(l => l.csmPillar === pillar.id)
            return (
              <div key={pillar.id} style={{ margin: '20px 0 8px', padding: '12px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', borderLeft: '3px solid var(--purple)' }}>
                <h4 style={{ margin: '0 0 4px', color: 'var(--purple)', fontSize: '16px' }}>{pillar.name}</h4>
                <p style={{ margin: '0 0 10px', fontSize: '12px', opacity: 0.7 }}>{pillar.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '8px' }}>
                  {pillarLayers.map(l => (
                    <div key={l.id} className="ai-risk-card" style={{ cursor: 'pointer', borderLeftColor: 'var(--purple)' }} onClick={() => openPopup(l)}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 4px' }}>{l.name}</h4>
                      <div className="ai-field"><div className="ai-label">Purpose</div>{l.purpose}</div>
                      <div className="ai-field"><div className="ai-label">Phase</div>{l.phase} · <span className={`crit-badge crit-${l.crit}`}>{l.crit}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {popupLayer && (
        <div className="popup-overlay" onClick={closePopup} role="dialog" aria-modal="true" aria-label={popupLayer.name}>
          <div className="popup" ref={popupRef} onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>{popupLayer.name}</h3>
              <button className="popup-close" onClick={closePopup} aria-label="Close">&times;</button>
            </div>
            <div className="popup-tabs">
              {tabDefs.map(td => (
                <button key={td.id} className={`popup-tab ${activeTab === td.id ? 'active' : ''}`} onClick={() => setActiveTab(td.id)}>{td.label}</button>
              ))}
            </div>
            <div className="popup-body">
              {activeTab === 'overview' && (
                <>
                  <div className="section-title">What is this layer?</div>
                  <div className="kv"><div className="k">In plain English</div><div className="v">{popupLayer.plain}</div></div>
                  <div className="kv"><div className="k">Purpose</div><div className="v">{popupLayer.purpose}</div></div>
                  <div className="kv"><div className="k">Criticality</div><div className="v"><span className={`crit-badge crit-${popupLayer.crit}`}>{popupLayer.crit}</span></div></div>
                  <div className="kv"><div className="k">Applicability</div><div className="v">{popupLayer.appl}</div></div>
                  <div className="kv"><div className="k">Phase</div><div className="v">{popupLayer.phase}</div></div>
                  <div className="kv"><div className="k">CSM Pillar</div><div className="v"><span className="csm-badge">{popupLayer.csmPillar}</span></div></div>
                  <div className="kv"><div className="k">Effort</div><div className="v">{popupLayer.effort}</div></div>
                  <div className="section-title">What does it produce?</div>
                  <div className="kv"><div className="k">Output Artifact</div><div className="v">{popupLayer.artifact}</div></div>
                  <div className="section-title">What does bad look like?</div>
                  <div className="kv"><div className="k">Anti-pattern</div><div className="v" style={{ color: 'var(--danger)' }}>{popupLayer.anti}</div></div>
                </>
              )}
              {activeTab === 'decision' && (
                <>
                  <div className="section-title">Inputs</div>
                  <div className="kv"><div className="k">Required Inputs</div><div className="v">{popupLayer.inputs}</div></div>
                  <div className="section-title">Options</div>
                  <div className="kv"><div className="k">Decision Options</div><div className="v">{popupLayer.options}</div></div>
                  <div className="section-title">Tools & Techniques</div>
                  <div className="kv"><div className="k">Tools</div><div className="v">{popupLayer.tools}</div></div>
                  <div className="section-title">Reversibility</div>
                  <div className="kv"><div className="k">Door Type</div><div className="v">{popupLayer.rev}</div></div>
                  <div className="kv"><div className="k">Change Process</div><div className="v">{popupLayer.change}</div></div>
                  <div className="kv"><div className="k">Review Cadence</div><div className="v">{popupLayer.cadence}</div></div>
                </>
              )}
              {activeTab === 'people' && (
                <>
                  <div className="section-title">Accountability</div>
                  <div className="kv"><div className="k">RACI</div><div className="v">{popupLayer.raci}</div></div>
                  <div className="kv"><div className="k">Stakeholders</div><div className="v">{popupLayer.stakeholders}</div></div>
                  <div className="kv"><div className="k">Escalation Path</div><div className="v">{popupLayer.escalation}</div></div>
                  <div className="section-title">Documents to Create</div>
                  <div className="doc-box doc-arch"><h4>Architect Documents</h4><ul>{popupLayer.archDocs.map((d, i) => <li key={i}>{d}</li>)}</ul></div>
                  <div className="doc-box doc-pm"><h4>PM Documents</h4><ul>{popupLayer.pmDocs.map((d, i) => <li key={i}>{d}</li>)}</ul></div>
                </>
              )}
              {activeTab === 'risk' && (
                <>
                  <div className="section-title">Risks</div>
                  <div className="kv"><div className="k">Risk Description</div><div className="v">{popupLayer.risks}</div></div>
                  <div className="kv"><div className="k">Severity</div><div className="v">{popupLayer.riskSev}</div></div>
                  <div className="kv"><div className="k">Mitigation</div><div className="v">{popupLayer.mitigation}</div></div>
                  <div className="section-title">If Skipped</div>
                  <div className="kv"><div className="k">Consequence of Skipping</div><div className="v" style={{ color: 'var(--danger)' }}>{popupLayer.skip}</div></div>
                  <div className="section-title">Dependencies</div>
                  <div className="kv"><div className="k">Depends On</div><div className="v">{popupLayer.depends}</div></div>
                  <div className="kv"><div className="k">Blocks</div><div className="v">{popupLayer.blocks}</div></div>
                </>
              )}
              {activeTab === 'ai' && (
                <>
                  <div className="section-title">AI Development Risks</div>
                  <div className="kv"><div className="k">AI Pitfall</div><div className="v" style={{ color: 'var(--danger)' }}>{popupLayer.aiPitfall}</div></div>
                  <div className="kv"><div className="k">Risk in AI Product</div><div className="v">{popupLayer.aiProduct}</div></div>
                  <div className="kv"><div className="k">Risk Using AI to Build</div><div className="v">{popupLayer.aiProcess}</div></div>
                  <div className="section-title">Planned Approach</div>
                  <div className="kv"><div className="k">Mitigation Approach</div><div className="v">{popupLayer.aiApproach}</div></div>
                  <div className="kv"><div className="k">Quality Gate</div><div className="v"><strong>{popupLayer.aiGate}</strong></div></div>
                </>
              )}
              {activeTab === 'pm' && (
                <>
                  <div className="section-title">Tracking</div>
                  <div className="kv"><div className="k">Status</div><div className="v">
                    <select
                      value={getTracking(popupLayer.id).status || popupLayer.status}
                      onChange={e => updateTracking(popupLayer.id, 'status', e.target.value)}
                      style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', fontSize: '13px' }}
                    >
                      <option>Not Started</option>
                      <option>In Discussion</option>
                      <option>Decided</option>
                      <option>Blocked</option>
                    </select>
                  </div></div>
                  <div className="kv"><div className="k">Sprint</div><div className="v">
                    <input
                      value={getTracking(popupLayer.id).sprint || popupLayer.sprint}
                      onChange={e => updateTracking(popupLayer.id, 'sprint', e.target.value)}
                      placeholder={popupLayer.sprint}
                      style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', width: '100%' }}
                    />
                  </div></div>
                  <div className="kv"><div className="k">Owner</div><div className="v">
                    <input
                      value={getTracking(popupLayer.id).owner || popupLayer.owner}
                      onChange={e => updateTracking(popupLayer.id, 'owner', e.target.value)}
                      placeholder={popupLayer.owner}
                      style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', width: '100%' }}
                    />
                  </div></div>
                  <div className="kv"><div className="k">ADR Reference</div><div className="v">
                    <input
                      value={getTracking(popupLayer.id).adr || popupLayer.adr}
                      onChange={e => updateTracking(popupLayer.id, 'adr', e.target.value)}
                      placeholder={popupLayer.adr}
                      style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', width: '100%' }}
                    />
                  </div></div>
                  <div className="kv"><div className="k">Tech Debt</div><div className="v">
                    <input
                      value={getTracking(popupLayer.id).techDebt || popupLayer.techDebt}
                      onChange={e => updateTracking(popupLayer.id, 'techDebt', e.target.value)}
                      placeholder={popupLayer.techDebt}
                      style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', width: '100%' }}
                    />
                  </div></div>
                  <div className="section-title">Definition of Done</div>
                  <div className="dod-box"><strong>DoD:</strong> {popupLayer.dod}</div>
                  <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px' }}>Changes save automatically to your browser. Export to CSV/JSON to share with your team.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <button className="glossary-btn" onClick={() => setGlossaryOpen(true)} aria-label="Open glossary">?</button>

      {glossaryOpen && (
        <div className="glossary-overlay" onClick={closeGlossary} role="dialog" aria-modal="true" aria-label="Glossary">
          <div className="glossary-panel" ref={glossaryRef} onClick={e => e.stopPropagation()}>
            <div className="glossary-header">
              <h3 style={{ margin: 0, fontSize: '18px' }}>Glossary</h3>
              <button className="popup-close" onClick={closeGlossary} aria-label="Close glossary">&times;</button>
            </div>
            <div className="glossary-search">
              <input
                placeholder="Search terms…"
                value={glossarySearch}
                onChange={e => setGlossarySearch(e.target.value)}
                aria-label="Search glossary"
              />
            </div>
            <div className="glossary-list">
              {filteredGlossary.length === 0 ? (
                <p style={{ opacity: 0.6, padding: '10px 0' }}>No terms found</p>
              ) : (
                filteredGlossary.map(g => (
                  <div key={g.term} className="glossary-item">
                    <strong>{g.term}</strong>
                    <p>{g.def}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="arch-footer">
        <p>Use this as a living checklist. Your tracking edits save automatically to your browser. Export to CSV/JSON to share with your team.</p>
        <p>Part of <a href="https://subodhkc.com">subodhkc.com</a> — AI Architecture, Governance & Advisory</p>
      </div>
    </div>
    </div>
  )
}
