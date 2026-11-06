/** Standalone economic model visual, distinct from the geography/sourcing diagrams. */
export function ProfitEngineDiagram() {
  const engines = [
    {step:"01 / DISTRIBUTE",title:"Trade",headline:"Capital velocity",description:"Repeat B2B purchasing and inventory turns",label:"Wholesale supply",tone:"copper"},
    {step:"02 / ENGINEER",title:"Build",headline:"Product differentiation",description:"Configured controls, panels and assemblies",label:"Industrial products",tone:"green"},
    {step:"03 / SUPPORT",title:"Serve",headline:"Account depth",description:"Commissioning, configuration and lifecycle services",label:"Integration revenue",tone:"sage"},
  ];
  return (
    <section className="iv-economic-map" aria-label="Three economic engines of the electronics investment strategy">
      <div className="iv-economic-head">
        <div><span className="iv-eyebrow">Business architecture / Operating leverage</span><h3>One platform. Three sources of value.</h3></div>
        <div className="iv-economic-number">01 — 03</div>
      </div>
      <div className="iv-engine-steps">
        {engines.map((item,i)=>(
          <article className={"iv-engine iv-engine-"+item.tone} key={item.step}>
            <span className="iv-engine-step">{item.step}</span>
            <div className="iv-engine-rule" />
            <strong>{item.title}</strong>
            <h4>{item.headline}</h4>
            <p>{item.description}</p>
            <div className="iv-engine-bottom"><span>{item.label}</span><b aria-hidden="true">{i===2?"03":"0"+(i+1)}</b></div>
          </article>
        ))}
      </div>
      <p className="iv-economic-note">The distribution platform establishes customer access; engineered products and services broaden the value created per customer relationship.</p>
    </section>
  );
}
