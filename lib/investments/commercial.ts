/**
 * Proposed commercial architecture and sales acquisition methodology.
 * This is a business plan, not existing commercial terms or signed customer contracts.
 * Updated November 2026. All illustrative levels are subject to underwriting and service capability.
 */
export const wholesaleTiers = [
  {id:"spot",level:"01",name:"Spot wholesale",buyer:"Independent resellers, installers, local retailers",fit:"Fast-moving exact-SKU stock",order:"Single order / published RFQ",pricing:"Quoted per SKU; prepaid opening orders",promise:"Quoted stock availability, verified MPN, invoice, serial documentation and OEM/RMA route",growth:"Convert a profitable first purchase into repeat monthly reorders"},
  {id:"partner",level:"02",name:"Repeat trade account",buyer:"Established IT resellers, regional stockists, VARs",fit:"Monthly replenishment and grouped orders",order:"Repeat orders against an account-level price sheet",pricing:"Negotiated quantity breaks; credit only after collection history",promise:"Account manager, rolling availability sheet, defined dispatch windows, returns terms and reorder alerts",growth:"Improve replenishment cadence and average order value"},
  {id:"distribution",level:"03",name:"Volume / distribution partner",buyer:"Multi-location wholesalers, approved channel partners, integrators",fit:"Quarterly purchase schedules and larger assortments",order:"Framework or call-off POs with defined targets",pricing:"Tiered rebates/stock reservations only by written agreement",promise:"Quarterly supply reviews, product documentation, allocation and forecast process",growth:"Better purchase economics and channel reach; potential supplier credit"}
] as const;

export const serviceOfferings = [
 {id:"configuration",name:"Configuration & QA",category:"One-time technical service",scope:"BOM selection, firmware/configuration, bench test, serialization and acceptance report.",contract:"Fixed-fee statement of work (SOW), materials billed separately.",service:"Acceptance checklist and agreed handover date; defect correction per SOW.",exclusions:"No ongoing monitoring or uptime SLA; hardware warranty follows OEM terms."},
 {id:"integration",name:"Installation & commissioning",category:"Project-based delivery",scope:"Panel/gateway setup, site integration, handover, training, optional commissioning test.",contract:"Milestone-based SOW and change control; travel/onsite costs defined.",service:"Named project contact, acceptance criteria and defect remediation window in SOW.",exclusions:"Local licensed electrician/integrator where required; no guaranteed emergency response."}
] as const;

export const supportLevels = [
 {id:"basic",name:"Care Basic",availability:"Business hours",response:"2 business days",coverage:"Email support, product guidance, RMA coordination and documented case history.",cadence:"Per-case or annual support allowance",terms:"Proposed; no uptime or onsite response guarantee."},
 {id:"priority",name:"Care Priority",availability:"Business hours",response:"1 business day",coverage:"Priority remote triage, configuration support, quarterly health review and escalation coordination.",cadence:"Annual or monthly retainer; hour caps in SOW",terms:"Target is acknowledgment, not resolution; only with staffed capacity."},
 {id:"managed",name:"Managed / Enterprise",availability:"Negotiated coverage",response:"Contract-specific",coverage:"Device estate monitoring, patch windows, spare-parts plan, escalation trees and onsite partner coordination.",cadence:"Custom multi-site managed-services contract",terms:"24×7 or 4-hour emergency acknowledgment only when specifically staffed and contracted."}
] as const;

export const acquisitionChannels = [
 {lane:"Supply-side",name:"Manufacturer and OEM channel programs",method:"Apply for reseller / stockist terms using official partner and distributor programs. Request authorized territory, MOQ, initial price list, stock rotation, price protection and warranty rights.",proof:"Written channel status, quote validity, serial provenance and RMA policy",link:""},
 {lane:"Supply-side",name:"Regional master distributors & importers",method:"Build a shortlist of regional IT and industrial stockists; request weekly available-to-sell lists and benchmark landed prices across at least three qualified sources.",proof:"Comparable exact-MPN quotes with import/tax/warranty basis",link:""},
 {lane:"Demand-side",name:"TradeIndia buyer and seller leads",method:"Publish exact stock with MPN, volume bands, warranty and delivery city; respond to verified buying inquiries. Use trade-lead search for distributor/wholesale introductions.",proof:"Qualified inquiry, repeat order, payment history",link:"https://www.tradeindia.com/TradeLeads/index.html"},
 {lane:"Demand-side",name:"India wholesale associations and reseller directories",method:"Target regional distributors, computer shops, industrial system integrators and value-added resellers. Build buyer account lists from trade directories and industry networks.",proof:"Contacted decision maker, SKU fit, cash terms and delivery location",link:""},
 {lane:"Demand-side",name:"Nepal chambers and trade associations",method:"Use chamber/member networks to identify Nepal electronics importers, institutional suppliers and industrial service distributors.",proof:"Qualified Nepal reseller or integrator relationship",link:"https://fncci.org/member/dmlcci.php"},
 {lane:"Later / selective",name:"India Government e-Marketplace",method:"Assess GeM eligibility for OEM/authorized reseller and category-specific product rules before listing government supply opportunities.",proof:"Approved seller/category registration and documented provenance",link:"https://gem.gov.in/"}
] as const;

export const accountStages = [
 {step:"01",name:"Target",trigger:"Identified manufacturer, distributor or resale buyer",measure:"Named company, product fit and reachable procurement/channel owner"},
 {step:"02",name:"Qualify",trigger:"Verified region, trade credentials, MPNs, monthly volume and payment/returns terms",measure:"Qualified partner and quote or purchase criteria"},
 {step:"03",name:"Quote",trigger:"Supplier exact-MPN price and resale offer with tax/freight, warranty and validity",measure:"Gross-to-net spread, expected cash cycle, quote conversion"},
 {step:"04",name:"Trade",trigger:"Purchase order, dispatch, delivery and collections",measure:"Realized margin, days to cash and returns"},
 {step:"05",name:"Reorder",trigger:"Repeat availability sheet and scheduled replenishment",measure:"Account retention, inventory turns, reorder frequency"}
] as const;

export const planningGuardrails = [
 {title:"Margin separation",detail:"Wholesale distribution, configurable AI-ready hardware and contracted technical services require three separate cost and margin assumptions. The base scenario uses 12%, 28% and 35% respective gross margins; the old 18–23% consolidated plan is now an engineering-led upside sensitivity."},
 {title:"2027 ramp arithmetic",detail:"24 accounts × $75k annual purchases = $1.8M only if all 24 generate a full year of spending, or an equivalent level of account-years is achieved. Newly acquired accounts later in the year contribute proportionally less."},
 {title:"Service delivery readiness",detail:"A proposed response target is not a guaranteed SLA. Accept service contracts only after confirming qualified personnel, coverage, spare parts and partner capacity."},
 {title:"First-stock discipline",detail:"Stock is purchased after supplier and multi-channel price checks, without requiring a service pilot. Inventory allocations should reflect observed resale liquidity, expected cash conversion and warranty exposure."}
] as const;
