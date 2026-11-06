/**
 * Shared investment planning inputs.
 * These are venture scenarios, not confirmed supplier quotations or customer orders.
 * All amounts are USD except where a page explicitly uses INR market benchmarks.
 */
export type PortfolioProduct = {
  name: string;
  family: string;
  cost: number;
  sell: number;
  days: number;
  quarter: number;
  competition: number;
  model: string;
};

export const productPortfolio: PortfolioProduct[] = [
  {name:"Industrial AI vision controller",family:"Industrial",cost:280,sell:480,days:90,quarter:250,competition:2,model:"Configured OEM system"},
  {name:"Smart irrigation / fertigation controller",family:"Industrial",cost:145,sell:235,days:75,quarter:500,competition:3,model:"Specialized controller"},
  {name:"Custom industrial control panel",family:"Industrial",cost:420,sell:650,days:90,quarter:200,competition:4,model:"Built-to-spec assembly"},
  {name:"Industrial IoT gateway",family:"Industrial",cost:115,sell:175,days:60,quarter:500,competition:4,model:"Configured gateway"},
  {name:"Custom wiring harness assembly",family:"Manufacturing",cost:24,sell:35,days:45,quarter:2000,competition:3,model:"Made-to-order assembly"},
  {name:"Industrial sensor module",family:"Manufacturing",cost:65,sell:92,days:60,quarter:1000,competition:3,model:"Integrated module"},
  {name:"Jetson-based edge AI kit",family:"AI hardware",cost:420,sell:550,days:60,quarter:200,competition:3,model:"Integrated kit"},
  {name:"Industrial SSD 1TB",family:"Computing",cost:105,sell:130,days:45,quarter:500,competition:4,model:"Standard product"},
  {name:"RTX 5060 8GB GPU",family:"Computing",cost:320,sell:365,days:35,quarter:200,competition:5,model:"Exact SKU wholesale"},
  {name:"RTX 5070 12GB GPU",family:"Computing",cost:500,sell:555,days:35,quarter:150,competition:5,model:"Exact SKU wholesale"},
];

export const initialAllocation = [
  ["Industrial product inventory", 250000],
  ["GPU & computing trade", 100000],
  ["Manufacturing & tooling", 150000],
  ["Distribution infrastructure", 100000],
  ["Revolving working capital", 250000],
  ["Logistics & reserve", 150000],
] as const;

/** Year, revenue ($M), three-engine weighted gross margin (%), operating costs ($000).
 * Uses base distribution/engineered/service mix from ai-industrial.ts:
 * 2027: 83% / 12% / 5%; 2028: 65% / 25% / 10%; 2029: 47% / 35% / 18%.
 * Base stream margins: 12%, 28%, 35%. All are planning scenarios.
 */
export const forecastRows = [
  [2027, 1.8, 15.07, 250],
  [2028, 4, 18.30, 500],
  [2029, 7.5, 21.74, 850],
] as const;

/** Earlier, more aggressive gross margin case; now explicitly engineering-led upside. */
export const upsideForecastRows = [
  [2027, 1.8, 18, 250],
  [2028, 4, 21, 500],
  [2029, 7.5, 23, 850],
] as const;

export const initialInvestmentScenario = initialAllocation.reduce((sum, [,value])=>sum+value,0);
export const initialTradeCapital = initialAllocation[0][1] + initialAllocation[1][1] + initialAllocation[4][1];
export const baselineQuarterlyAcquisition = productPortfolio.reduce((sum,p)=>sum+p.cost*p.quarter,0);
export const baselineQuarterlySalesCapacity = productPortfolio.reduce((sum,p)=>sum+p.sell*p.quarter,0);
export const baselineAnnualizedSalesCapacity = baselineQuarterlySalesCapacity*4;
/** Annualized capacity based on four identical modeled quarters, not the 2027 ramp revenue forecast. */
export const modeled2027RampRatio = forecastRows[0][1]*1_000_000/baselineAnnualizedSalesCapacity;
