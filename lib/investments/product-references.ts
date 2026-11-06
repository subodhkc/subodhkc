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
  kind:"computer"|"controller"|"panel"|"gateway"|"harness"|"sensor"|"edge"|"ssd"|"gpu";
  match:"example"|"exact-category";
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
    name:"Custom industrial control panel",label:"Industrial control enclosure references",maker:"AutomationDirect / Hammond",model:"Control enclosure family",kind:"panel",match:"example",
    url:"https://www.automationdirect.com/adc/shopping/catalog/enclosures_-a-_racks/junction_boxes",
    detail:"Enclosure products used in control-panel construction. These are not complete, wired, certified industrial control panels; PLC, enclosure, testing and safety requirements differ by order."
  },
  "Industrial IoT gateway": {
    name:"Industrial IoT gateway",label:"Moxa AIG-101 ready-to-deploy IIoT gateway",maker:"Moxa",model:"AIG-101 Series",kind:"gateway",match:"example",
    url:"https://www.moxa.com/en/products/industrial-computing/iiot-gateways/ready-to-deploy-iiot-gateways/aig-101-series",
    image:"https://cdn-cms-frontdoor-dfc8ebanh6bkb3hs.a02.azurefd.net/en/getattachment/Products/INDUSTRIAL-COMPUTING/IIoT-Gateways/Ready-to-deploy-IIoT-Gateways/AIG-101-Series/moxa-aig-101-series-image-1-%282%29.jpg",
    detail:"Modbus/serial industrial IoT gateway with wired networking and edge-to-cloud connectivity. Example gateway, not the $115 modeled acquisition unit."
  },
  "Custom wiring harness assembly": {
    name:"Custom wiring harness assembly",label:"Molex custom cable and wire harness range",maker:"Molex",model:"Custom cable assemblies",kind:"harness",match:"example",
    url:"https://www.molex.com/en-us/products/cable-assemblies/custom-cable-assembly-solutions",
    detail:"Cable/harness assemblies built against drawings, pinouts and connector specifications. No single catalog SKU can represent a custom harness BOM."
  },
  "Industrial sensor module": {
    name:"Industrial sensor module",label:"DFRobot Gravity SEN0193 soil moisture sensor",maker:"DFRobot",model:"SEN0193",kind:"sensor",match:"example",
    url:"https://www.dfrobot.com/product-1385.html",
    detail:"Capacitive 3.3–5.5V moisture sensor component. It is a reference sensor only, not an equivalent to a completed industrial sensor module with enclosure and calibration."
  },
  "Jetson-based edge AI kit": {
    name:"Jetson-based edge AI kit",label:"Seeed reComputer J4012 Jetson Orin NX 16GB",maker:"Seeed Studio",model:"110110184",kind:"edge",match:"example",
    url:"https://www.seeedstudio.com/reComputer-J4012-w-o-power-adapter-p-5628.html",
    image:"https://m.media-amazon.com/images/I/51uVsANlpZL._AC_SL1400_.jpg",
    detail:"Complete Jetson Orin NX 16GB computer. IMPORTANT: its published manufacturer price is not comparable to the modeled $420 acquisition target for a different configurable kit."
  },
  "Industrial SSD 1TB": {
    name:"Industrial SSD 1TB",label:"Crucial P3 Plus 1TB retail SSD example",maker:"Crucial / Micron",model:"CT1000P3PSSD8",kind:"ssd",match:"example",
    url:"https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf",
    image:"https://paksell.pk/cdn/shop/products/crucial-p3-plus-ssd-1tb-500gb-pcie-gen4-3d-nand-nvme-upto-5000mbs-620480.jpg?v=1691492292&width=800",
    detail:"Retail PCIe 4.0 1TB M.2 NVMe SSD used for format reference. This is NOT an industrial-rated SSD and must not be assumed equivalent to the portfolio's industrial SSD specification."
  },
  "RTX 5060 8GB GPU": {
    name:"RTX 5060 8GB GPU",label:"PNY RTX 5060 OC Dual Fan 8GB",maker:"PNY",model:"VCG50608DFXPB1-O",kind:"gpu",match:"example",
    url:"https://www.pny.com/geforce-rtx-5060-8gb-models?sku=VCG50608DFXPB1-O",
    image:"https://m.media-amazon.com/images/I/71zmLJZ77VL._AC_SL1500_.jpg",
    detail:"Manufacturer-defined 8GB GDDR7 Blackwell board reference. Exact MPN must match approved distributor terms; the site's modeled USD trading price is not a PNY quote."
  },
  "DDR5 16GB memory module": {
    name:"DDR5 16GB memory module",label:"Crucial Basics DDR5 16GB (CB16GU4800)",maker:"Crucial",model:"CB16GU4800",kind:"ssd",match:"example",
    url:"https://content.crucial.com/content/dam/crucial/dram-products/basics/flyer/crucial-basics-memory-productflyer.pdf",
    detail:"Manufacturer datasheet for a 16GB DDR5 UDIMM, 4800MT/s. Verify speed, form factor and exact MPN: the generic catalog target is not an executable quote."
  },
  "NVMe 2TB Gen4 SSD": {
    name:"NVMe 2TB Gen4 SSD",label:"Crucial P3 Plus 2TB family specification",maker:"Crucial",model:"CT2000P3PSSD8",kind:"ssd",match:"example",
    url:"https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf",
    detail:"Consumer PCIe 4.0 2TB reference specification; this product is not qualified as an industrial SSD or guaranteed reseller inventory."
  },
  "10G SFP+ optical transceiver": {
    name:"10G SFP+ optical transceiver",label:"FS 10G SFP+ optics technical datasheet",maker:"FS",model:"SFP-10G product family",kind:"gateway",match:"example",
    url:"https://resource.fs.com/mall/doc/20221219143135iscwcs.pdf",
    detail:"10GbE SFP+ module family. Compatibility, connector, wavelength, distance and specific MPN must match buyer devices."
  },
  "Populated PCB · 100-component assembly": {
    name:"Populated PCB · 100-component assembly",label:"Molex engineered connectivity/assembly reference",maker:"Molex",model:"Custom assembly overview",kind:"panel",match:"example",
    url:"https://www.molex.com/en-us/products/cable-assemblies",
    detail:"Category-level manufacturing/assembly illustration only. Populated PCB assembly is a different custom process requiring an exact PCB design, BOM, test fixture and quotation."
  },
  "Industrial 24V power supply": {
    name:"Industrial 24V power supply",label:"MEAN WELL SDR-120-24 industrial DIN-rail power supply",maker:"MEAN WELL",model:"SDR-120-24",kind:"controller",match:"example",
    url:"https://www.meanwell.com/Upload/PDF/SDR-120/SDR-120-SPEC.PDF",
    detail:"24V DC, 5A, 120W industrial DIN-rail reference. This exact unit and compliance profile may differ from the planning product."
  },
  "Pump VFD control subassembly": {
    name:"Pump VFD control subassembly",label:"AutomationDirect variable-frequency drives",maker:"AutomationDirect",model:"VFD product families",kind:"panel",match:"example",
    url:"https://www.automationdirect.com/adc/shopping/catalog/drives_-a-_soft_starters/ac_variable_frequency_drives_%28vfd%29",
    detail:"VFD catalog for AC pump speed control. The proposed subassembly would also require motor specification, panel wiring, protective devices and testing."
  },
  "RTX 5070 12GB GPU": {
    name:"RTX 5070 12GB GPU",label:"PNY RTX 5070 Triple Fan 12GB",maker:"PNY",model:"VCG507012TFXPB1",kind:"gpu",match:"example",
    url:"https://www.pny.com/geforce-rtx-5070-models?sku=VCG507012TFXPB1",
    detail:"12GB GDDR7 reference graphics card. The listed planning target does not represent a manufacturer quote for this exact board."
  }
};

export const catalogReferenceKeys: Record<string,string> = {
  "VCG50608DFXPB1-O":"RTX 5060 8GB GPU",
  "CT1000P3PSSD8":"Industrial SSD 1TB",
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
