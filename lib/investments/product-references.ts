/**
 * Product reference library for the investor electronics portfolio.
 * Official product links are technical examples, NOT validated acquisition sources.
 * Generic product concepts are explicitly marked representative; modeled
 * product economics in lib/investments/electronics.ts are NOT linked prices.
 */
export type ProductRefInfo = {
  name:string;
  label:string;
  url:string;
  maker:string;
  model:string;
  detail:string;
  image?:string;
  kind:"computer"|"controller"|"panel"|"gateway"|"harness"|"sensor"|"edge"|"ssd"|"gpu"|"memory"|"transceiver"|"psu"|"pcb";
  match:"example"|"exact-sku";
};
export const productReferences: Record<string,ProductRefInfo> = {
  "Industrial AI vision controller": {
    name:"Industrial AI vision controller",label:"Advantech AIR-030 edge-AI inference system",maker:"Advantech",model:"AIR-030",kind:"computer",match:"example",
    url:"https://www.advantech.com/en-us/products/932c8818-07cc-4917-89e9-7a678ddc029c/air-030/mod_a08e709e-09af-4124-bf1f-42d12c1c2fb0",
    detail:"Jetson AGX Orin edge-inference platform with industrial I/O. A technical example, not the $280 configured-controller BOM or supplier price."
  },
  "Smart irrigation / fertigation controller": {
    name:"Smart irrigation / fertigation controller",label:"OpenSprinkler smart irrigation controller",maker:"OpenSprinkler",model:"OS controller family",kind:"controller",match:"example",
    url:"https://opensprinkler.com/product/opensprinkler/",
    detail:"Wi-Fi/web-controlled irrigation valves; example of the controller class. The planning model's fertigation system requires its own BOM and functional specification."
  },
  "Custom industrial control panel": {
    name:"Custom industrial control panel",label:"Custom industrial control panel manufacturing example",maker:"Trimantec",model:"Configured UL508A panel",kind:"panel",match:"example",
    url:"https://trimantec.com/pages/custom-control-panels",
    detail:"A full custom panel-building capability example, not a standardized enclosure SKU or the proposed $420 acquisition BOM. PLC, HMI, wiring, testing and country certification determine the real price."
  },
  "Industrial IoT gateway": {
    name:"Industrial IoT gateway",label:"Moxa AIG-101 ready-to-deploy IIoT gateway",maker:"Moxa",model:"AIG-101 Series",kind:"gateway",match:"example",
    url:"https://www.moxa.com/en/products/industrial-computing/iiot-gateways/ready-to-deploy-iiot-gateways/aig-101-series",
    detail:"Modbus/serial industrial IoT gateway with wired networking and edge-to-cloud connectivity. Example gateway, not the $115 modeled acquisition unit."
  },
  "Custom wiring harness assembly": {
    name:"Custom wiring harness assembly",label:"Molex custom cable and wire harness range",maker:"Molex",model:"Custom cable assemblies",kind:"harness",match:"example",
    url:"https://www.molex.com/en-us/products/cable-assemblies/custom-cable-assembly-solutions",
    detail:"Cable/harness assemblies built against drawings, pinouts and connector specifications. No single catalog SKU can represent a custom harness BOM."
  },
  "Industrial sensor module": {
    name:"Industrial sensor module",label:"Advantech ADAM-4017+ industrial analog-input interface",maker:"Advantech",model:"ADAM-4017+",kind:"sensor",match:"example",
    url:"https://www.advantech.com/en-us/products/gf-5vtd/adam-4017/mod_10fd9e9c-8e8a-42f2-b749-a395f8426262",
    detail:"8-channel analog industrial remote I/O interface using RS-485 and Modbus. This is an industrial interface example, not the modeled $65 assembly cost or an approved substitute BOM."
  },
  "Jetson-based edge AI kit": {
    name:"Jetson-based edge AI kit",label:"NVIDIA Jetson Orin Nano Super Developer Kit",maker:"NVIDIA",model:"Jetson Orin Nano Super Developer Kit",kind:"edge",match:"example",
    url:"https://developer.nvidia.com/embedded/faq",
    detail:"Developer/evaluation kit example, not a production-certified assembled product. NVIDIA lists Jetson Orin Nano Super Developer Kit at $399 on its current FAQ; a $420 assembled-kit purchase target would require a separate supported production BOM, carrier, enclosure, power, software and quote. The prior Seeed J4012 16GB commercial system lists at $1,394 and is NOT an equivalent item."
  },
  "Industrial SSD 1TB": {
    name:"Industrial SSD 1TB",label:"Transcend MTE720T industrial-grade SSD 1TB",maker:"Transcend",model:"TS1TMTE720T",kind:"ssd",match:"example",
    url:"https://transcend-info.com/embedded/product/embedded-ssd-solutions/mte720t-mte720t-i",
    detail:"Actual industrial/embedded SSD family with 1TB order SKU TS1TMTE720T, qualified operating temperature and component endurance. The modeled $105 target cost is NOT a manufacturer quotation."
  },
  "RTX 5060 8GB GPU": {
    name:"RTX 5060 8GB GPU",label:"PNY RTX 5060 OC Dual Fan 8GB",maker:"PNY",model:"VCG50608DFXPB1-O",kind:"gpu",match:"exact-sku",
    url:"https://www.pny.com/geforce-rtx-5060-8gb-models?sku=VCG50608DFXPB1-O",
    image:"https://computechstore.in/media/uploads/wp/2025/08/PNY-RTX-5060-OC-8GB-GDDR7-Graphics-Card-1-e1755253495695.jpg",
    detail:"Manufacturer-defined 8GB GDDR7 Blackwell board reference. Exact MPN must match approved distributor terms; the site's modeled USD trading price is not a PNY quote."
  },
  "DDR5 16GB memory module": {
    name:"DDR5 16GB memory module",label:"Crucial Basics DDR5 16GB (CB16GU4800)",maker:"Crucial",model:"CB16GU4800",kind:"memory",match:"example",
    url:"https://content.crucial.com/content/dam/crucial/dram-products/basics/flyer/crucial-basics-memory-productflyer.pdf",
    detail:"Manufacturer datasheet for a 16GB DDR5 UDIMM, 4800MT/s. Verify speed, form factor and exact MPN: the generic catalog target is not an executable quote."
  },
  "NVMe 2TB Gen4 SSD": {
    name:"NVMe 2TB Gen4 SSD",label:"Crucial P3 Plus 2TB family specification",maker:"Crucial",model:"CT2000P3PSSD8",kind:"ssd",match:"example",
    url:"https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf",
    detail:"Consumer PCIe 4.0 2TB reference specification; this product is not qualified as an industrial SSD or guaranteed reseller inventory."
  },
  "10G SFP+ optical transceiver": {
    name:"10G SFP+ optical transceiver",label:"FS 10G SFP+ optics technical datasheet",maker:"FS",model:"SFP-10G product family",kind:"transceiver",match:"example",
    url:"https://resource.fs.com/mall/doc/20221219143135iscwcs.pdf",
    detail:"10GbE SFP+ module family. Compatibility, connector, wavelength, distance and specific MPN must match buyer devices."
  },
  "Populated PCB · 100-component assembly": {
    name:"Populated PCB · 100-component assembly",label:"JLCPCB PCB assembly service and SMT capabilities",maker:"JLCPCB",model:"Turnkey PCBA service",kind:"pcb",match:"example",
    url:"https://jlcpcb.com/pcb-assembly",
    detail:"Manufacturer PCB-assembly service reference. Each populated PCB requires an exact design, BOM, pick-and-place files, testing method and supplier quotation; no single standard SKU matches this line."
  },
  "Industrial 24V power supply": {
    name:"Industrial 24V power supply",label:"MEAN WELL SDR-120-24 industrial DIN-rail power supply",maker:"MEAN WELL",model:"SDR-120-24",kind:"psu",match:"example",
    url:"https://www.meanwell.com/Upload/PDF/SDR-120/SDR-120-SPEC.PDF",
    detail:"24V DC, 5A, 120W industrial DIN-rail reference. This exact unit and compliance profile may differ from the planning product."
  },
  "Pump VFD control subassembly": {
    name:"Pump VFD control subassembly",label:"AutomationDirect variable-frequency drives",maker:"AutomationDirect",model:"VFD product families",kind:"panel",match:"example",
    url:"https://www.automationdirect.com/adc/shopping/catalog/drives_-a-_soft_starters/ac_variable_frequency_drives_%28vfd%29",
    detail:"VFD catalog for AC pump speed control. The proposed subassembly would also require motor specification, panel wiring, protective devices and testing."
  },
  "RTX 5070 12GB GPU": {
    name:"RTX 5070 12GB GPU",label:"PNY RTX 5070 Triple Fan 12GB (non-OC)",maker:"PNY",model:"VCG507012TFXPB1",kind:"gpu",match:"example",
    url:"https://www.pny.com/geforce-rtx-5070-models?sku=VCG507012TFXPB1",
    detail:"12GB GDDR7 reference graphics card. The listed planning target does not represent a manufacturer quote for this exact board."
  }
};

  // Catalog benchmark uses a consumer SSD. Keep its exact part separate from the industrial portfolio row.
productReferences["Crucial P3 Plus 1TB consumer"] = {
  name:"Crucial P3 Plus 1TB consumer",
  label:"Crucial P3 Plus 1TB NVMe retail SSD",
  maker:"Crucial",model:"CT1000P3PSSD8",kind:"ssd",match:"exact-sku",
  url:"https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf",
  image:"https://pcmart.in/api/img/uploads/tenants/store-m5jrt9/products/c15-1785074677890-7ba5a062.avif?fit=cover&h=600&w=600",
  detail:"Exact retail SKU shown by PC Mart at ₹6,200 (verified November 5, 2026). It is a consumer-grade PCIe Gen4 NVMe drive, not an industrial-temperature-rated MTE720T. ₹4,500 target acquisition remains unquoted."
};

export const catalogReferenceKeys: Record<string,string> = {
  "VCG50608DFXPB1-O":"RTX 5060 8GB GPU",
  "CT1000P3PSSD8":"Crucial P3 Plus 1TB consumer",
  "GPU-5070-12":"RTX 5070 12GB GPU",
  "GPU-EDGE-KIT":"Jetson-based edge AI kit",
  "DDR5-16G":"DDR5 16GB memory module",
  "NVME-2TB":"NVMe 2TB Gen4 SSD",
  "10G-SFP":"10G SFP+ optical transceiver",
  "IOT-RS485-4G":"Industrial IoT gateway",
  "CTRL-IRR-01":"Smart irrigation / fertigation controller",
  "SENSOR-MOD-01":"Industrial sensor module",
  "HARNESS-01":"Custom wiring harness assembly",
  "PLC-PANEL-01":"Custom industrial control panel",
  "PCB-SMT-01":"Populated PCB · 100-component assembly",
  "POWER-24V":"Industrial 24V power supply",
  "PUMP-VFD":"Pump VFD control subassembly"
};

export function competitionDescription(level:number):{label:string;meaning:string;tone:string}{
  if(level<=1)return {label:"Very low",meaning:"Few comparable sellers; limited direct price rivalry in this niche.",tone:"low"};
  if(level===2)return {label:"Low",meaning:"Some rival offerings, with room to differentiate or bundle.",tone:"low"};
  if(level===3)return {label:"Moderate",meaning:"Established alternatives; price and service both matter.",tone:"medium"};
  if(level===4)return {label:"High",meaning:"Many alternatives and frequent pricing comparisons.",tone:"high"};
  return {label:"Very high",meaning:"Commodity-style rivalry, tight pricing and stronger incumbents.",tone:"high"};
}
export const competitionMethodology = "Directional 1–5 competition-pressure judgment: 1 = very low rivalry, 2 = low, 3 = moderate, 4 = high, 5 = very high. Higher means MORE competition, not a better product. Scores are qualitative screening assumptions, not researched market shares or validated supplier outcomes.";
