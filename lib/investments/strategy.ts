/**
 * Investor strategy & launch execution framework.
 * Strategic judgments and proposed milestones, NOT verified agreements or completed work.
 * Source context: Government of India ECMS progress and PRS analysis of electronics manufacturing constraints.
 */
export const swot = [
 {id:"strengths",symbol:"S",title:"Strengths",subtitle:"Potential commercial advantages",tone:"positive",points:[
   "India–Nepal route flexibility with direct-market imports wherever they offer the best landed economics.",
   "Distribution-first entry can generate product sales before committing to proprietary manufacturing capacity.",
   "Multiple supplier ecosystems and the option to attach configuration, assembly and support services later."
 ],response:"Make distributor economics the near-term advantage: secure authorized supply, selective stock availability, reliable fulfillment and faster reorder cycles."},
 {id:"weaknesses",symbol:"W",title:"Weaknesses",subtitle:"Launch constraints",tone:"caution",points:[
   "Distribution agreements and factory-issued acquisition prices remain to be negotiated, so true buy-side margin is not yet proven.",
   "First-time inventory carries real liquidity exposure without established sales history or returns experience.",
   "A full baseline inventory cycle exceeds the $600k capital earmarked for initial inventory and revolving trade."
 ],response:"Negotiate resalable product terms and selective initial inventory allocations; preserve capital for fast reorder and working-capital contingencies."},
 {id:"opportunities",symbol:"O",title:"Opportunities",subtitle:"Market and channel expansion",tone:"growth",points:[
   "India electronics and industrial-automation demand supports repeat procurement of computing, networking, storage and control products.",
   "Authorized distributor or stockist relationships may give access to better tier pricing, channel programs and replenishment.",
   "Bangladesh, Thailand, Vietnam, Malaysia and the United States offer different future sales, sourcing or industrial-specialist paths."
 ],response:"Start with high-liquidity SKUs and accountable stock turns, then expand manufacturer relationships, country coverage and value-added industrial product lines."},
 {id:"threats",symbol:"T",title:"Threats",subtitle:"Competitive and inventory exposure",tone:"risk",points:[
   "Large incumbents can undercut commodity prices, offer longer buyer credit and handle warranties at scale.",
   "Compute price changes, counterfeits, FX shifts, duties and product obsolescence can erase a quoted trading spread.",
   "Unsold inventory ties up cash; distributor authorization and territory rights may constrain resale."
 ],response:"Purchase only exact-MPN, traceable inventory with tested channel exit routes, age limits, margin floors and clearly documented RMA/return terms."}
] as const;

export const competitionForces = [
 {name:"Industry rivalry",level:"High",strength:5,why:"Major distributors compete on manufacturer access, purchasing scale, logistics and credit.",play:"Use narrow stock availability, trusted channel relationships and targeted replenishment rather than a nationwide price war."},
 {name:"Buyer bargaining",level:"High",strength:5,why:"Resellers and systems integrators can compare exact SKUs across numerous sellers.",play:"Offer documented provenance, competitive landed prices, rapid dispatch and dependable stock."},
 {name:"Supplier bargaining",level:"Medium–High",strength:4,why:"New distributors have limited tier leverage, authorization and credit history.",play:"Negotiate resale rights, pricing tiers, stock rotation, RMA and future credit before scaling purchase orders."},
 {name:"Substitute solutions",level:"Medium",strength:3,why:"Regional wholesalers, e-commerce and OEM-direct channels compete for the same orders.",play:"Differentiate on assured availability, bundles and flexible quantities."},
 {name:"New entrants",level:"Medium",strength:3,why:"Basic electronics trading is easy to enter; sustainable supplier terms and channel trust are harder.",play:"Build preferential distribution economics and a track record of repeat sell-through."}
] as const;

export const investmentWedges = [
 {label:"Launch",title:"Fast-turn distribution inventory",why:"Start commercial operations with a narrow set of standardized, resalable electronics with established channel demand and clear MPNs.",proof:"Supplier authorization or valid resale terms, comparative landed quotes, written warranty support, multiple buyer-channel quotes and documented stock-exit routes.",capital:"Controlled first stock tranche, then replenish against actual velocity"},
 {label:"Expand",title:"OEM / distributor channel relationships",why:"More durable supplier access can improve acquisition costs, stock rotation, assortment and payment terms over successive orders.",proof:"Manufacturer/distributor agreement or written channel terms, tier pricing, credit/RMA conditions and territory clarity.",capital:"Revolving working capital and negotiated supplier credit"},
 {label:"Future",title:"Configured industrial systems and services",why:"Engineering, testing and integration provide differentiated margin opportunities after the distribution platform builds purchasing and fulfillment capability.",proof:"Qualified engineering partner, tested BOM, service capability and repeat product requirements.",capital:"Expand selectively from distribution cash flows and separately approved capex"}
] as const;

export const externalDrivers = [
  {code:"P", name:"Policy", signal:"India supports domestic component depth; incentive eligibility depends on scheme rules.", move:"Pursue OEM relationships, not assumed subsidy capture."},
  {code:"E", name:"Economic", signal:"Inventory financing, currency movements and logistics shape realized margin.", move:"Use cash-conversion and landed-cost controls by route."},
  {code:"S", name:"Customer", signal:"OEMs and integrators value tested products, delivery and support alongside price.", move:"Start with narrowly defined industrial buyer segments."},
  {code:"T", name:"Technology", signal:"Edge AI and compute change rapidly, while controls need robust long-life designs.", move:"Separate fast-moving trade SKUs from engineered product roadmaps."},
  {code:"L", name:"Legal", signal:"HS codes, import rules, origin and safety requirements differ by product.", move:"Validate customs, certification and warranty chain before scale."}
] as const;

export const principalRisks = [
 {risk:"Inventory sell-through",exposure:"High",indicator:"Slow-moving SKUs, weak reseller bids, rising stock age",action:"Begin with limited resalable lots, market-check multiple exit channels, age inventory and halt reorders on poor turnover"},
 {risk:"Gross-to-net margin",exposure:"High",indicator:"Price drops or freight, tax, RMA and payment fees erode spread",action:"Calculate landed net contribution per exact SKU and preserve a margin floor before PO approval"},
 {risk:"Supplier legitimacy",exposure:"High",indicator:"Unverified stock, lack of authorization, unclear serial provenance",action:"Request channel documentation, serial traceability and written warranty/RMA conditions"},
 {risk:"Working capital",exposure:"High",indicator:"Purchases, taxes and receivables consume the available cash pool",action:"Limit initial deployment, maintain liquidity reserve and use short credit terms until collections are proven"},
 {risk:"Country compliance",exposure:"High",indicator:"Unclear import, certification, resale, warranty or origin requirements",action:"Verify product classification and route-specific obligations before importing or cross-border shipment"},
 {risk:"Price erosion",exposure:"Medium–High",indicator:"New compute launches or currency movements discount held stock",action:"Reduce speculative GPU exposure; refresh competitor prices and hold stock aging thresholds"}
] as const;

export const firstInventoryPolicy = {
 availableTradeCapitalUsd:600000,
 openingTrancheLowPct:10,
 openingTrancheHighPct:25,
 initialSkuCount:"4–8",
 preferredStock:"Standardized, traceable, channel-eligible stock with observable market prices",
 decisionRule:"Landed net margin after taxes, freight, fees, financing and warranty allowances, plus credible multiple-channel resalability",
 pacing:"Order → receive → list through qualified resale partners → sell → collect → replenish",
 capitalApproach:"A proposed 10–25% opening release of the $600k trade-capital bucket ($60k–$150k); not a committed order or recommended spend without live quotes."
} as const;

/** Dates are relative to program kickoff, not claims of work already completed. */
export const deliveryPhases = [
 {code:"01",window:"Days 0–30",title:"Secure distribution access",focus:"Negotiate manufacturer, authorized-distributor and regional-wholesaler relationships for fast-turn standard products.",
  deliverables:["Build a prioritized 4–8 SKU opening shortlist (target)","Compare 3 supplier/stockist quotes per priority SKU (target)","Negotiate territory, RMA, MOQ, stock rotation and payment terms","Complete landed-cost, import and serial-provenance checks"],
  gate:"Select suppliers and SKUs with verified resale rights, margin headroom and more than one credible channel exit."},
 {code:"02",window:"Days 31–60",title:"Acquire opening inventory",focus:"Purchase the first limited inventory tranche and activate reseller, B2B and wholesale channel listings.",
  deliverables:["Set opening stock purchase approvals and limits","Receive, inspect and reconcile exact-MPN inventory","Set up channel price sheets, fulfillment, returns and serial tracking","Launch initial wholesale and distributor/reseller listings"],
  gate:"Keep the first stock tranche within a controlled portion of trade capital; expand only against observed price and sales velocity."},
 {code:"03",window:"Days 61–90",title:"Sell through and reorder",focus:"Flip the first stock, measure cash conversion and adjust SKU allocation.",
  deliverables:["Track SKU-level gross-to-net contribution and days to sale","Compare channel sales, stock aging and cash collection","Replenish only top-turning SKUs","Use first-cycle performance to negotiate next distributor tiers"],
  gate:"Release reorder capital for SKUs that clear return, margin, sell-through and cash-conversion standards."},
 {code:"04",window:"Months 4–9",title:"Broaden channels and product breadth",focus:"Scale repeat inventory cycles and negotiate stronger upstream terms.",
  deliverables:["Add qualified distribution and wholesale relationships","Expand repeat-selling product categories by demonstrated velocity","Negotiate volume tiers and credit/consignment where available","Introduce bundled industrial and configured electronics where justified"],
  gate:"Expand line card and trade capital with reconciled sell-through and supplier terms, not merely market-size projections."},
 {code:"05",window:"Months 10–18",title:"Build regional expansion options",focus:"Extend proven supply lines to Nepal and selective adjacent Asian channels; prepare U.S. specialist distribution later.",
  deliverables:["Evaluate Bangladesh and Southeast Asia distribution partnerships","Develop Malaysia/Vietnam/Thailand sourcing routes where economic","Assess U.S. compliance, distributor competition and specialized niche selection","Explore engineered systems and support as second-stage margin expansion"],
  gate:"Open a new geography or service line only when the trading base and channel economics can support it."}
] as const;

export const launchMeasures = [
 {name:"Distribution relationships",target:"Signed terms, authorization, tier quotes, MOQ, RMA and replenishment",category:"Supply access"},
 {name:"Inventory velocity",target:"SKU sell-through, days-to-cash, aging and reorder frequency",category:"Commercial"},
 {name:"Net unit economics",target:"Landed resale contribution after freight, taxes, fees and returns",category:"Economics"},
 {name:"Capital discipline",target:"Opening tranche utilization, channel collections and available reorder cash",category:"Capital"}
] as const;

export const analysisSources = [
 {label:"Government of India · ECMS progress (2026)",url:"https://www.pib.gov.in/FactsheetDetails.aspx?Id=151016&lang=1&reg=3"},
 {label:"PRS Legislative Research · electronics manufacturing constraints",url:"https://prsindia.org/budgets/parliament/demand-for-grants-2025-26-analysis-electronics-and-information-technology"},
 {label:"Embassy of India · Nepal trade overview",url:"https://www.indembkathmandu.gov.in/commerce-wing-brief"}
] as const;
