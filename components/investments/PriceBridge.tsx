/** Interactive, scenario-based cost-to-resale visualization for the India product catalog. */
export function PriceBridge({
  product, netSale, acquisition, freight, financePct,
}:{
  product:string;netSale:number;acquisition:number;freight:number;financePct:number;
}) {
  const finance=netSale*financePct/100;
  const contribution=netSale-acquisition-freight-finance;
  const range=Math.max(netSale,acquisition+freight+finance,1);
  const segments=[
    {label:"Acquisition",value:acquisition,color:"var(--iv-orange,#b65e34)"},
    {label:"Logistics",value:freight,color:"#91b59a"},
    {label:"Finance / returns",value:finance,color:"#d1b18d"},
  ];
  const fmt=(n:number)=>"₹"+Math.round(n).toLocaleString("en-IN");
  return (
    <section className="iv-price-bridge" aria-label={"Modeled price composition for "+product}>
      <div className="iv-price-top">
        <div><span className="iv-eyebrow">Trade economics / Selected product</span><h3>{product}</h3></div>
        <div className="iv-price-topvalue"><strong>{fmt(netSale)}</strong><span>Modeled net resale value / unit</span></div>
      </div>
      <div className="iv-price-track" aria-label="Illustrative cost composition compared to net selling price">
        {segments.map((segment)=>(
          <span key={segment.label} className="iv-price-segment" style={{width:(segment.value/range*100)+"%",background:segment.color}} title={segment.label+": "+fmt(segment.value)}/>
        ))}
        {contribution>0&&<span className="iv-price-segment iv-price-positive" style={{width:(contribution/range*100)+"%"}} title={"Illustrative contribution: "+fmt(contribution)}/>}
      </div>
      <div className="iv-price-legend">
        {segments.map(segment=><div key={segment.label}><span style={{background:segment.color}}/><div><small>{segment.label}</small><strong>{fmt(segment.value)}</strong></div></div>)}
        <div className={contribution>=0?"iv-price-result":"iv-price-result iv-price-negative"}><span/><div><small>Contribution / unit</small><strong>{fmt(contribution)}</strong></div></div>
      </div>
      <p className="iv-price-disclosure">Illustrative commercial scenario using acquisition targets, adjustable GST and logistics assumptions; not a supplier quote or guaranteed resale margin.</p>
    </section>
  );
}
