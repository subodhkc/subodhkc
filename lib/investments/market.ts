/**
 * Market evidence for the Nepal–India Electronics & AI Hardware Corridor.
 * Values are published market context, not company revenue, customer commitments,
 * company-addressable TAM, or supplier contract terms.
 * Last research review: 2026-11-05.
 */
export const marketEvidence = {
  electronics: {
    label: "India electronics production",
    latestYear: "FY 2025–26",
    latestLakhCrore: 13.11,
    priorLakhCrore: 11.32,
    growthPercent: 15.8,
    sourceName: "Government of India · MeitY / PIB, 29 July 2026",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2291171&lang=1&reg=1",
    interpretation: "Sector-wide output across electronics, including consumer and mobile devices; not the venture's obtainable market."
  },
  automation: {
    label: "India industrial automation & controls",
    baseYear: 2025,
    baseUsdBn: 9.3323,
    forecastYear: 2033,
    forecastUsdBn: 26.114,
    forecastCagrPercent: 13.7,
    sourceName: "Grand View Research · India industrial automation & control systems outlook",
    url: "https://www.grandviewresearch.com/horizon/outlook/industrial-automation-and-control-systems-market/india",
    interpretation: "Independent market-research estimate/forecast. Includes categories beyond the specific products offered by this venture."
  },
  components: {
    label: "Electronics component manufacturing momentum",
    approvedProjects: 106,
    projectInvestmentInrCrore: 69548,
    asOf: "August 2026",
    sourceName: "Government of India · PIB, 17 August 2026",
    url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2300625&lang=2&reg=48",
    interpretation: "Approved third-party ECMS projects and projected investments, not the venture's funding or business pipeline."
  },
  nepalIndia: {
    label: "India–Nepal merchandise trade",
    fy: "FY 2025–26",
    totalUsdBn: 9.38898,
    sourceName: "Embassy of India, Kathmandu · Commerce Wing",
    url: "https://www.indembkathmandu.gov.in/commerce-wing-brief",
    interpretation: "All goods traded bilaterally; not a market-size estimate for electronics or a proof of tariff preference."
  },
  ambition: {
    label: "India electronics production policy aspiration",
    targetUsdBn: 500,
    year: "2030",
    sourceName: "NITI Aayog · Electronics: Powering India's Participation in GVCs, July 2024",
    url: "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2034096&lang=2&reg=3",
    interpretation: "Government policy ambition conditioned on major investment and reforms; not an independent forecast or guaranteed outcome."
  },
  industrial: {
    year: "FY 2023–24",
    industrialElectronicsUsdBn: 12.5,
    electronicComponentsUsdBn: 10.5,
    sourceName: "NITI Aayog · Trade Watch FY2025–26 (MeitY annual report data)",
    url: "https://www.niti.gov.in/node/2193",
    interpretation: "Historical output benchmarks for adjacent Indian product segments; not company-addressable demand."
  }
} as const;

export const targetAccountScenarios = [
  {year:2027,accounts:24,annualSpendUsd:75000,marginPercent:18},
  {year:2028,accounts:40,annualSpendUsd:100000,marginPercent:21},
  {year:2029,accounts:60,annualSpendUsd:125000,marginPercent:23},
] as const;

export const demandDrivers = [
  {number:"01",title:"Industrial automation",description:"Automation and control-system investment can support demand for PLC panels, gateways and integration.",example:"PLC panels · gateways · commissioned systems",source:marketEvidence.automation.url},
  {number:"02",title:"Electronic components",description:"India is deepening its component and sub-assembly ecosystem. Qualified sourcing and engineered assemblies can participate in this value chain.",example:"Control boards · sensors · wiring harnesses",source:marketEvidence.components.url},
  {number:"03",title:"AI and edge infrastructure",description:"AI-enabled compute and edge inference create product opportunities, with fast-changing pricing and procurement economics.",example:"Edge kits · industrial vision · selected compute",source:marketEvidence.electronics.url},
] as const;
