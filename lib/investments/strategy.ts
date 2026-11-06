/**
 * Investor strategy & launch execution framework.
 * Strategic judgments and proposed milestones, NOT verified agreements or completed work.
 * Source context: Government of India ECMS progress and PRS analysis of electronics manufacturing constraints.
 */
export const swot = [
  {
    id: "strengths", symbol: "S", title: "Strengths", subtitle: "Proposed structural advantages", tone: "positive",
    points: [
      "Flexible route selection: source directly into India or Nepal, and use Nepal-based integration when it adds technical value.",
      "Blended offer: distribution establishes access, while controls, industrial assemblies and services can deepen account economics.",
      "Asset-light launch path through qualified OEM, authorized-channel and contract-manufacturing partners."
    ],
    response: "Lead with configured industrial products and customer-backed orders; build durable supply and service capabilities before scaling stock."
  },
  {
    id: "weaknesses", symbol: "W", title: "Weaknesses", subtitle: "Execution gaps to close", tone: "caution",
    points: [
      "Pre-commercial plan: no verified active B2B buying accounts or booked pipeline included in the model.",
      "Limited initial supplier pricing power, unproven warranty/returns operations and insufficient evidence on country-of-origin economics.",
      "An all-products baseline purchase cycle exceeds the initially earmarked $600k trade capital before financing or phased ordering."
    ],
    response: "Start with two product wedges, obtain comparable RFQs, recruit anchor accounts and release inventory capital in stages."
  },
  {
    id: "opportunities", symbol: "O", title: "Opportunities", subtitle: "Demand and capability tailwinds", tone: "growth",
    points: [
      "India's electronics-component investment and industrial automation expansion support a wider ecosystem of specialized equipment buyers.",
      "Short-run panels, controllers, harnesses and gateways can differentiate on configuration, service and reliable fulfillment.",
      "Repeat OEM and systems-integrator purchasing can support volume aggregation, negotiated terms and recurring technical services."
    ],
    response: "Build a qualified-account funnel in automation, agritech and industrial integration; validate product configurations and reorder cadence."
  },
  {
    id: "threats", symbol: "T", title: "Threats", subtitle: "External pressure", tone: "risk",
    points: [
      "Large distributors can outperform a new entrant on price, credit, catalog breadth and national fulfillment.",
      "GPUs and commodity compute carry rapid price erosion, obsolescence, warranty and inventory-financing exposure.",
      "FX shifts, import duties, certification and origin rules can alter landed economics or restrict a trade route."
    ],
    response: "Keep commodity exposure selective; price per route after taxes, limit aged inventory and verify classification and origin before committing volume."
  }
] as const;

export const competitionForces = [
  {name:"Industry rivalry", level:"High", strength:5, why:"Established ICT distributors and scaled electronics manufacturers compete on buying power, brand access and service reach.", play:"Avoid a commodity-first price war; concentrate on integration-intensive niches."},
  {name:"Buyer bargaining", level:"High", strength:5, why:"Professional buyers can compare quotes, negotiate credit and switch standardized hardware suppliers.", play:"Win on specification ownership, engineering support and dependable replenishment."},
  {name:"Supplier bargaining", level:"Medium–High", strength:4, why:"Authorized products, exact MPN supply and small initial orders limit negotiating leverage.", play:"Dual-source qualified equivalents and aggregate demand before factory RFQs."},
  {name:"Substitute solutions", level:"Medium", strength:3, why:"Importers, local integrators and customer-built assemblies can replace parts of the offer.", play:"Provide testing, pre-configuration, installation and warranty coordination."},
  {name:"New entrants", level:"Medium", strength:3, why:"Trading models are accessible; industrial execution, quality and repeat contracts take longer to replicate.", play:"Build customer-side process integration and reliable service evidence."}
] as const;

export const investmentWedges = [
  {label:"Lead", title:"Industrial controls & configured automation", why:"Engineering content, repeat B2B needs and service attachment create a more defensible commercial entry point.", proof:"Two exact application BOMs, two qualified manufacturing routes and paid customer pilot scopes.", capital:"Low-volume, made-to-spec batches; milestone-based funding"},
  {label:"Build", title:"Wiring harnesses, sensors & engineered assemblies", why:"Customized assemblies offer repeat part numbers, quality differentiation and manageable inventory when ordered against drawings.", proof:"Approved drawing/BOM, sample inspection report, repeat-order intent and documented warranty process.", capital:"Sample lots first, then scheduled batch commitments"},
  {label:"Selective", title:"GPUs, SSDs & general computing trade", why:"Trading can generate cash cycles but pricing is transparent, working capital intensive and exposed to obsolescence.", proof:"Authorized-channel landed quote, customer purchase order and acceptable net margin after finance.", capital:"Back-to-back purchase cycles; minimal speculative stock"}
] as const;

export const externalDrivers = [
  {code:"P", name:"Policy", signal:"India supports domestic component depth; incentive eligibility depends on scheme rules.", move:"Pursue OEM relationships, not assumed subsidy capture."},
  {code:"E", name:"Economic", signal:"Inventory financing, currency movements and logistics shape realized margin.", move:"Use cash-conversion and landed-cost controls by route."},
  {code:"S", name:"Customer", signal:"OEMs and integrators value tested products, delivery and support alongside price.", move:"Start with narrowly defined industrial buyer segments."},
  {code:"T", name:"Technology", signal:"Edge AI and compute change rapidly, while controls need robust long-life designs.", move:"Separate fast-moving trade SKUs from engineered product roadmaps."},
  {code:"L", name:"Legal", signal:"HS codes, import rules, origin and safety requirements differ by product.", move:"Validate customs, certification and warranty chain before scale."}
] as const;

export const principalRisks = [
  {risk:"Demand conversion", exposure:"High", indicator:"Pipeline is inquiry-only; repeat-order commitments absent", action:"Use paid pilots and buyer PO/deposits before broad inventory purchases"},
  {risk:"Gross-to-net margin", exposure:"High", indicator:"Supplier quote changes, freight/duty leakage, slow sell-through", action:"Price exact MPN/BOM after landed costs and warranty reserve"},
  {risk:"Working capital", exposure:"High", indicator:"Inventory + receivables outrun trade-capital facility", action:"Stage purchases; negotiate deposits, supplier credit and receivable limits"},
  {risk:"Supply and quality", exposure:"Medium", indicator:"Single-source BOM, delivery variance or batch failure", action:"Dual-source, test pilot lots and document acceptance criteria"},
  {risk:"Cross-border compliance", exposure:"High", indicator:"Unclear origin, HS classification or importer requirements", action:"Validate each route with customs and qualified local counsel"},
  {risk:"Inventory obsolescence", exposure:"Medium–High", indicator:"Aged GPU/compute stock, falling market price", action:"Favor back-to-back trade and enforce SKU aging limits"}
] as const;

/** Dates are relative to program kickoff, not claims of work already completed. */
export const deliveryPhases = [
  {
    code:"01", window:"Day 0–30", title:"Foundation & validation",
    focus:"Confirm investment vehicle, target buyer segments and the first two product wedges.",
    deliverables:["Operating plan and decision rights","10 qualified buyer discovery conversations (target)","3 comparable RFQs per priority BOM (target)","Route-level tax, origin and landed-cost memo"],
    gate:"Select two commercially viable product wedges before releasing major inventory capital."
  },
  {
    code:"02", window:"Day 31–90", title:"Commercial proof",
    focus:"Convert prospects into pilot scopes and test actual supply reliability.",
    deliverables:["2 customer-backed pilot orders or paid scopes (target)","Sample/first-article acceptance tests","Written warranty and return workflow","Purchase-cycle cash forecast by route"],
    gate:"Release the first pilot-order tranche after buyer and supplier terms are evidenced."
  },
  {
    code:"03", window:"Months 4–6", title:"Repeatable delivery",
    focus:"Prove replenishment, quality and service attachment on a narrow catalog.",
    deliverables:["Track repeat order and delivery metrics","Establish supplier price validity and backup sources","Document integration / support service offer","Monthly gross margin and cash-conversion review"],
    gate:"Scale proven SKUs that meet contribution and cash-cycle thresholds."
  },
  {
    code:"04", window:"Months 7–12", title:"Channel expansion",
    focus:"Expand into adjacent industrial accounts and contracted assembly programs.",
    deliverables:["Broaden qualified OEM/system-integrator pipeline","Standardize small-batch manufacturing QA","Negotiate tiered pricing and credit","Add technical service and channel support capacity"],
    gate:"Seek additional working capital when supported by repeat orders and supplier terms."
  },
  {
    code:"05", window:"Months 13–18", title:"Regional scaling",
    focus:"Concentrate on repeat demand and selectively broaden regional distribution.",
    deliverables:["Multi-quarter purchase and production plans","Preferred supply agreements where justified","Revolving trade-finance framework","Investor milestone and capital-efficiency reporting"],
    gate:"Expand funded order volume on evidence of delivery, quality and collections."
  }
] as const;

export const launchMeasures = [
  {name:"Qualified demand", target:"Buyer interviews → paid pilot → repeat purchase", category:"Commercial"},
  {name:"Supply qualification", target:"Comparable RFQs, exact BOM, warranty and delivery", category:"Procurement"},
  {name:"Unit economics", target:"Positive gross contribution after landed cost and reserves", category:"Economics"},
  {name:"Cash discipline", target:"Collection days, inventory age and committed funding per PO", category:"Capital"}
] as const;

export const analysisSources = [
 {label:"Government of India · ECMS progress (2026)",url:"https://www.pib.gov.in/FactsheetDetails.aspx?Id=151016&lang=1&reg=3"},
 {label:"PRS Legislative Research · electronics manufacturing constraints",url:"https://prsindia.org/budgets/parliament/demand-for-grants-2025-26-analysis-electronics-and-information-technology"},
 {label:"Embassy of India · Nepal trade overview",url:"https://www.indembkathmandu.gov.in/commerce-wing-brief"}
] as const;
