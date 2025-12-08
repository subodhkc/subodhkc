'use client';

export default function CoinbaseResumePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased print:text-[11px]">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 0.35in 0.4in; size: letter; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="max-w-[8in] mx-auto px-6 py-6 print:px-0 print:py-0">
        
        {/* ═══════════════════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════════════════ */}
        <header className="pb-4 mb-4 border-b-2 border-blue-600">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Subodh Kumar KC</h1>
              <p className="text-sm font-semibold text-blue-600 mt-0.5">Product Manager — Compliance Automation & AI Systems</p>
            </div>
            <div className="text-right text-xs text-zinc-600 leading-relaxed shrink-0">
              <p className="font-medium text-zinc-900">Dallas, TX (Hybrid)</p>
              <p>subodh@subodhkc.com</p>
              <p className="text-blue-600">subodhkc.com · linkedin.com/in/subodhkc · github.com/subodhkc</p>
            </div>
          </div>
          
          {/* Summary */}
          <p className="mt-3 text-xs text-zinc-700 leading-relaxed">
            <span className="font-semibold text-zinc-900">7+ years</span> building AI-powered automation for regulated, high-stakes workflows. 
            Led compliance automation across <span className="font-semibold text-zinc-900">53 enterprise apps</span>, reducing manual review by <span className="font-semibold text-zinc-900">40–60%</span>. 
            Shipped AI-native products for drift detection, autonomous RCA, and compliance mapping. 
            <span className="font-semibold text-zinc-900">5 patent filings</span> in AI governance. Thrives in ambiguous problem spaces with cross-functional execution.
          </p>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════
            IMPACT METRICS - Horizontal Bar
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="mb-4">
          <div className="flex items-center gap-6 py-2 px-3 bg-zinc-50 border border-zinc-200 rounded">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">53</span>
              <span className="text-xs text-zinc-600">Enterprise Apps</span>
            </div>
            <div className="w-px h-6 bg-zinc-300" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-600">40-60%</span>
              <span className="text-xs text-zinc-600">Less Manual Review</span>
            </div>
            <div className="w-px h-6 bg-zinc-300" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-violet-600">5+</span>
              <span className="text-xs text-zinc-600">AI Products Shipped</span>
            </div>
            <div className="w-px h-6 bg-zinc-300" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-600">5</span>
              <span className="text-xs text-zinc-600">Patent Filings</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            TWO COLUMN LAYOUT
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-[1fr_280px] gap-5 print:gap-4">
          
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            
            {/* EXPERIENCE */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                Experience
              </h2>
              
              {/* HP Inc */}
              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div>
                    <span className="font-semibold text-sm text-zinc-900">Senior Technical Program Manager / Product Lead</span>
                    <span className="text-xs text-zinc-500 ml-2">— AI Automation & Compliance</span>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">7+ years</span>
                </div>
                <p className="text-xs text-zinc-600 mb-1">HP Inc. · Dallas, TX</p>
                <p className="text-xs text-zinc-600 italic mb-1.5">
                  Owned AI automation, compliance governance, and risk intelligence for 53+ enterprise applications. Hybrid PM / Core Tech Lead.
                </p>
                <ul className="text-xs text-zinc-700 space-y-0.5 ml-3">
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Defined multi-quarter roadmaps for AI Efficiency Workstreams, reducing manual review by 40–60%</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Built precision drift detection engine (patent 19/284,705) for silent failure detection—analogous to on-chain transaction-risk heuristics and AML alerting</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Led AI-powered Root Cause Analysis system, compressing investigation cycles from days to hours</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Drove cross-functional initiatives with engineering, data, design, and security; owned stakeholder comms and risk framing</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Built metrics dashboards for error rates, drift signals, model trust scores; ran A/B tests and controlled rollouts</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Started from ambiguous mandates ("reduce risk / reduce manual load") and delivered shipping tools with clear KPIs</li>
                </ul>
              </div>

              {/* HAIEC */}
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <div>
                    <span className="font-semibold text-sm text-zinc-900">Founder / Product Builder</span>
                    <span className="text-xs text-zinc-500 ml-2">— AI Compliance & Legal Automation</span>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">Ongoing</span>
                </div>
                <p className="text-xs text-zinc-600 mb-1">HAIEC & Independent Products · Remote</p>
                <ul className="text-xs text-zinc-700 space-y-0.5 ml-3">
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Launched <strong>LLMVerify</strong>—npm package for real-time AI behavior verification, drift detection, PII exposure, and policy breaches</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Created <strong>AI Compliance Twin™</strong> (patent 63/808,089)—modular engine mapping AI behaviors to regulatory rules</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Built <strong>CourtCase Packet</strong>—legal workflow automation structuring events into evidence packets (similar to EDD case files)</li>
                  <li className="flex gap-1.5"><span className="text-blue-600">▸</span>Ship fast iterations with working demos, public repos, and live endpoints</li>
                </ul>
              </div>
            </section>

            {/* AI PRODUCTS */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                AI & Compliance Products (Live Demos)
              </h2>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-zinc-50 border border-zinc-200 rounded">
                  <p className="font-semibold text-zinc-900">LLMVerify</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">AI behavior verification engine. Scores drift, hallucination, PII exposure.</p>
                  <p className="text-blue-600 text-[10px] mt-1">npmjs.com/package/llmverify</p>
                </div>
                <div className="p-2 bg-zinc-50 border border-zinc-200 rounded">
                  <p className="font-semibold text-zinc-900">AI Compliance Twin™</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">Maps AI/system behavior to regulatory rules. Drift alerts + audit trails.</p>
                  <p className="text-violet-600 text-[10px] mt-1">Patent 63/808,089</p>
                </div>
                <div className="p-2 bg-zinc-50 border border-zinc-200 rounded">
                  <p className="font-semibold text-zinc-900">CourtCase Packet</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">Structures events into timelines & evidence packets. Similar to EDD workflows.</p>
                  <p className="text-blue-600 text-[10px] mt-1">github.com/subodhkc</p>
                </div>
              </div>
            </section>

            {/* SELECTED IP */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                Selected Intellectual Property
              </h2>
              <div className="text-xs space-y-1">
                <div className="flex gap-3">
                  <span className="font-mono text-zinc-500 shrink-0">19/284,705</span>
                  <span className="text-zinc-700">Modular Precision Drift Detection & Audit-Grade Compliance Fingerprinting</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono text-zinc-500 shrink-0">19/283,287</span>
                  <span className="text-zinc-700">Autonomous Root Cause Analysis & Compliance Mapping</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono text-zinc-500 shrink-0">63/808,089</span>
                  <span className="text-zinc-700">AI Compliance Twin — Modular compliance engine for AI governance</span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3">
            
            {/* ROLE ALIGNMENT */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                Coinbase Role Alignment
              </h2>
              <div className="text-xs space-y-1.5 text-zinc-700">
                <div className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">✓</span>
                  <span><strong className="text-zinc-900">Ambiguous → Concrete:</strong> Turn vague mandates into clear goals, strategy, and execution milestones</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">✓</span>
                  <span><strong className="text-zinc-900">Full Lifecycle:</strong> Ideation → discovery → launch → adoption → iteration</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">✓</span>
                  <span><strong className="text-zinc-900">AI-Native Shipping:</strong> Working demos, live endpoints, public repos</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">✓</span>
                  <span><strong className="text-zinc-900">Metrics & A/B:</strong> Dashboards, statistical analysis, controlled rollouts</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">✓</span>
                  <span><strong className="text-zinc-900">Cross-Functional:</strong> Eng, data, design, security, compliance stakeholders</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">✓</span>
                  <span><strong className="text-zinc-900">Independent Operator:</strong> Lead complex initiatives with strategic + tactical execution</span>
                </div>
              </div>
            </section>

            {/* SKILLS */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                Core Skills
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">Product Management</p>
                  <p className="text-zinc-600">Vision & Strategy · Roadmapping · Discovery · A/B Testing · Metrics · Stakeholder Alignment</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">AI & Automation</p>
                  <p className="text-zinc-600">Drift Detection · Anomaly Detection · Risk Scoring · LLM Verification · Dashboards</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">Compliance & Risk</p>
                  <p className="text-zinc-600">Automation · Governance · KYC/EDD Workflows · Risk Narratives · Audit Trails</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">Technical</p>
                  <p className="text-zinc-600">Python · TypeScript · FastAPI · SQL · REST APIs · Cloud/CI-CD</p>
                </div>
              </div>
            </section>

            {/* CRYPTO & FINANCE */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                Crypto & Finance Fluency
              </h2>
              <ul className="text-xs text-zinc-700 space-y-0.5">
                <li>• Wallets, keys, on-chain transactions, CEX vs DEX, DeFi primitives</li>
                <li>• Transaction monitoring, address risk scoring, EDD narratives</li>
                <li>• Order books, spreads, derivatives, ETFs, risk metrics</li>
                <li>• Audit-grade data trails for regulated environments</li>
              </ul>
            </section>

            {/* EDUCATION */}
            <section>
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 pb-1 border-b border-blue-200">
                Education
              </h2>
              <div className="text-xs space-y-1">
                <div>
                  <p className="font-semibold text-zinc-900">MS – Engineering & Technology Management</p>
                  <p className="text-zinc-600">Louisiana Tech University</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">BS – Computer Information Systems</p>
                  <p className="text-zinc-600">Louisiana Tech University · Information Assurance</p>
                </div>
              </div>
            </section>

            {/* WHY COINBASE */}
            <section className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-700 mb-1">
                Why Coinbase
              </h2>
              <p className="text-[10px] text-zinc-700 leading-relaxed">
                I want to build the future of finance at a company that demands excellence. 
                Compliance automation at Coinbase scale—reducing friction for customers while managing regulatory risk—is exactly the kind of hard, high-impact problem I've spent my career preparing for.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
