/**
 * AI-era industrial modernization investment thesis and financial architecture.
 * Industry statistics from third-party research, last reviewed November 2026.
 * All growth paths, sector participation, gross margins and commercial account
 * assumptions below are NOT supplier quotes, customer orders, or projections of
 * achieved company market share.
 */
export const aiIndustrialMarket={
  global:{baseYear:2025,baseUsdBn:226.8,forecastYear:2033,forecastUsdBn:504.4,source:"Grand View Research · Industrial Automation & Control Systems (June 2026)",url:"https://www.grandviewresearch.com/industry-analysis/industrial-automation-market"},
  us:{baseYear:2025,baseUsdBn:51.8363,forecastYear:2033,forecastUsdBn:113.9839,source:"Grand View Research · U.S. Industrial Automation & Control Systems (August 2026)",url:"https://www.grandviewresearch.com/horizon/outlook/industrial-automation-and-control-systems-market/united-states"},
  canada:{baseYear:2025,baseUsdBn:8.5089,forecastYear:2033,forecastUsdBn:14.8332,source:"Grand View Research · Canada Industrial Automation & Control Systems (2026)",url:"https://www.grandviewresearch.com/horizon/outlook/industrial-automation-and-control-systems-market/canada"},
  ifr:{source:"International Federation of Robotics · U.S. robot industry returns to growth (2026)",url:"https://ifr.org/news/us-robot-industry-returns-to-double-digit-growth/1st",us2025Installations:38000,usGrowthPct:11}
} as const;

export const aiHardwareStack=[
 {number:"01",title:"Sense the physical operation",products:"Industrial cameras · vibration & environmental sensors · industrial gateways",engineering:"Sensor configuration, environmental fit, calibration and field connectivity",value:"Establish reliable machine data"},
 {number:"02",title:"Compute and decide locally",products:"Edge AI computers · GPUs · industrial storage · inference accelerators",engineering:"Model optimization, compute selection, I/O integration, enclosure and power design",value:"Turn data into low-latency industrial decisions"},
 {number:"03",title:"Execute and integrate safely",products:"PLCs · control panels · motor/pump interfaces · wiring harnesses",engineering:"Electrical design, tested assembly, system interfaces and commissioning",value:"Connect AI decisions to real equipment"},
 {number:"04",title:"Operate and improve",products:"Spare parts · diagnostics · device support · lifecycle replacements",engineering:"Monitoring, configuration management, repair coordination and planned refresh",value:"Support renewals and repeat purchasing"}
] as const;

export const structuralWedge=[
 {title:"Legacy-channel strength",detail:"Scaled automation OEMs and distributors already own broad catalogs, certifications, global supply and enterprise relationships."},
 {title:"New integration opportunity",detail:"AI-ready machines can require combining sensors, inference compute, industrial controls and software into configurations that do not map neatly to one catalog SKU."},
 {title:"Proposed advantage",detail:"Use verified component distribution as an entry point, then provide application-specific engineered kits, qualified assembly and partner-delivered integration across regions."}
] as const;

export const engineeredRevenueMix=[
 {year:2027,revenueM:1.8,opexK:250,wholesalePct:83,engineeredPct:12,servicePct:5},
 {year:2028,revenueM:4,opexK:500,wholesalePct:65,engineeredPct:25,servicePct:10},
 {year:2029,revenueM:7.5,opexK:850,wholesalePct:47,engineeredPct:35,servicePct:18},
] as const;

export const unitMarginAssumptions={
 wholesale:12,
 engineered:28,
 services:35
} as const;
export function calculateWeightedGrossMargin(mix:{wholesalePct:number;engineeredPct:number;servicePct:number},margins:{wholesale:number;engineered:number;services:number}=unitMarginAssumptions){
 return (mix.wholesalePct*margins.wholesale+mix.engineeredPct*margins.engineered+mix.servicePct*margins.services)/100;
}
export const investmentRaise={
 estimatedUsd:1000000,
 structure:"Proposed syndicate of multiple investors",
 deployment:[
 {name:"Inventory and trade capital",usd:600000,detail:"Initial stock allocation and revolving purchases under negotiated supplier terms"},
 {name:"Engineering, tooling and product enablement",usd:150000,detail:"Prototype/BOM work, third-party assembly, testing and technical configuration capability"},
 {name:"Distribution systems and market access",usd:100000,detail:"Wholesale channel infrastructure, fulfillment, serial/RMA management and market-entry support"},
 {name:"Logistics, compliance and contingency",usd:150000,detail:"Landed-cost and certification reviews, shipping and operational reserve"}
 ],
 caution:"Illustrative total capital requirement, not a fixed security price, equity split or binding investment offering. Investor participation and definitive instrument terms are to be negotiated."
} as const;

export const regionalScaleExample=[
 {metric:"Wholesale distribution transactions",units:3000,ticket:4000,sales:12000000},
 {metric:"Configured industrial AI systems",units:120,ticket:60000,sales:7200000},
 {metric:"Annual technical service contracts",units:150,ticket:25000,sales:3750000},
] as const;
export const northAmericaScaleSensitivity=[.01,.05,.10].map(sharePct=>({
 sharePct, revenueUsdM:(aiIndustrialMarket.us.forecastUsdBn+aiIndustrialMarket.canada.forecastUsdBn)*1000*sharePct/100
}));
