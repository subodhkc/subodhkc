/**
 * Market expansion pathways: sourced industry context plus qualitative strategy.
 * Market sizes are sector-level indicators, not signed customers, addressable revenue
 * or evidence of venture operations. Reviewed November 2026.
 */
export const coreMarkets = [
 {name:"India",role:"Primary sales and distribution",description:"Large electronics and automation market. Begin with qualified stockist, wholesaler and reseller relationships for standardized electronics; expand industrial value-added lines after repeat turnover.",strategicValue:"Revenue scale, wholesale channels and reorder demand",position:"Core"},
 {name:"Nepal",role:"Selective distribution and later integration",description:"Serve local trade, enterprise and industrial channels. Use assembly/integration when it adds value rather than assuming all goods should transit Nepal.",strategicValue:"Regional channel access and focused B2B solutions",position:"Core"}
] as const;

export const futureMarkets = [
 {name:"Bangladesh",flag:"South Asia",phase:"Near-term channel option",role:"Potential distribution sales",offer:"Factory controls, sensors, industrial wiring, automation consumables",case:"A large apparel manufacturing sector provides a prospective installed base for factory electronics and maintenance products.",signal:"$38.70B RMG exports in FY 2025–26",source:"Bangladesh Garment Manufacturers & Exporters Association",url:"https://www.bgmea.com.bd/page/Export_Performance",constraint:"Import processes, local distributor economics and after-sales support"},
 {name:"Thailand",flag:"Southeast Asia",phase:"Supplier and market development",role:"Industrial electronics sourcing + later sales",offer:"Automation components, industrial controls, electronics assemblies",case:"An established advanced-manufacturing ecosystem supports sourcing opportunities and selective B2B distribution.",signal:"$8.91B electronics/electrical investment applications in 2025",source:"Thailand Board of Investment",url:"https://www.boi.go.th/index.php?_module=news&from_page=press_releases2&language=en&page=press_releases_detail&topic_id=138493",constraint:"Established local distributors and channel-specific product approvals"},
 {name:"Vietnam",flag:"Southeast Asia",phase:"Supplier and manufacturing option",role:"Electronics manufacturing and sourcing",offer:"PCBA, cable harnesses, box-build systems, traceable components",case:"A major electronics export base makes Vietnam a potential source of contract manufacturing and selected products.",signal:"$107.75B electronics/computers/components exports in 2025",source:"VnGlobalTrade citing Vietnam statistics agency, preliminary",url:"https://vnglobaltrade.com/en/sectors/dien-tu",constraint:"Supplier verification, MOQ and export-country landed costs"},
 {name:"Malaysia",flag:"Southeast Asia",phase:"Supplier and manufacturing option",role:"OEM and component sourcing",offer:"Industrial electronics, PCBA, connectors, embedded systems",case:"Semiconductor and industrial-electronics clusters provide a credible second-source ecosystem.",signal:"RM16.9B approved electronic-component investments in 2025",source:"Malaysian Investment Development Authority",url:"https://www.mida.gov.my/industries/manufacturing/electrical-electronics/electrical-electronic-products-electrical-components/",constraint:"Supplier qualification, technical requirements and scale economics"},
 {name:"Indonesia",flag:"Southeast Asia",phase:"Longer-horizon partner-led sales",role:"Selective industrial distribution",offer:"Energy monitoring, industrial automation and equipment components",case:"Large manufacturing and energy sectors may support industrial electronics demand through local distributors.",signal:"Opportunity hypothesis; no venture-specific market-size figure assigned",source:"Investment thesis; requires local validation",url:"",constraint:"Geographic distribution complexity, localization and channel competition"},
 {name:"Saudi Arabia",flag:"West Asia",phase:"Longer-horizon strategic partnership",role:"Value-added industrial and automation sales",offer:"Industrial integration, control systems and automation hardware",case:"National industrial-modernization initiatives support a possible distributor and integrator partnership route.",signal:"Vision 2030 programs emphasize future factories and automation",source:"Saudi Vision 2030 Annual Report 2025",url:"https://www.vision2030.gov.sa/media/ecdjfopq/vision2030_annual_report_2025_en.pdf",constraint:"Local partner execution, approvals and project qualification"}
] as const;

export const usMarket = {
 role:"Later specialist distribution and integration path",
 market2025UsdBn:51.8363,
 market2033UsdBn:113.9839,
 forecastCagrPercent:10.4,
 source:"Grand View Research · U.S. industrial automation and controls, 2025–2033",
 url:"https://www.grandviewresearch.com/horizon/outlook/industrial-automation-and-control-systems-market/united-states",
 promisingLanes:["Industrial edge gateways and machine monitoring","Custom wiring harnesses and compliant subassemblies","Configured industrial controls and aftermarket components"],
 competition:[
  {name:"DigiKey, Mouser, Arrow, Avnet",focus:"Massive component availability, OEM reach and pricing power",response:"Do not compete on generic component breadth"},
  {name:"AutomationDirect and controls distributors",focus:"Aggressive catalog pricing, technical documentation and established fulfillment",response:"Emphasize narrow engineered packages, sourced specialty items or service attachment"},
  {name:"Rockwell, Siemens, Schneider and regional integrators",focus:"Deep installed base and industrial customer relationships",response:"Use an authorized U.S. integration/distribution partner and target a differentiated niche"}
 ],
 conditions:"Investigate U.S. importer obligations, product certification, origin, tariffs, warranty and state-level electrical requirements before committing inventory.",
 interpretation:"The $51.84B/$113.98B figures cover the broad U.S. automation/control-systems sector, not this venture's obtainable revenue or guaranteed demand."
} as const;
