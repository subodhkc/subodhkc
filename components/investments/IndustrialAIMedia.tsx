import Link from "next/link";

const shortUrl = "https://youtube.com/shorts/kK95JMg7elU";
const originalInfographicUrl = "https://drive.google.com/file/d/1ht2flNKvy3y22aVOyRQ-uiYZZa1NY3kL/view?usp=drivesdk";
const reportUrl = "https://notebook.google.com/notebook/4d51f73a-5b5c-4c11-b3df-87c84cdcf972/artifact/42475799-7ff5-4b75-82e0-508b99d2ac3a";

const engines = [
  {name:"Engine A / Distribution",margin:"12%",subtitle:"Target wholesale gross margin",product:"GPUs, compute, sensors and electronic components",value:"Inventory turnover, supplier access and customer acquisition",color:"#6fc1ed",accent:"#153f55"},
  {name:"Engine B / Customization",margin:"28%",subtitle:"Target configured-hardware gross margin",product:"Edge AI kits, engineered control panels and integrated hardware",value:"Application engineering and repeatable integration",color:"#f99434",accent:"#633d19"},
  {name:"Engine C / Services",margin:"35%",subtitle:"Target service gross margin",product:"Commissioning, deployment, maintenance and technical support",value:"Customer continuity and recurring lifecycle contracts",color:"#53c991",accent:"#164a34"}
];
const stack = [
 {step:"01",name:"Physical sensing",detail:"Sensors and gateways capture machine and environmental data."},
 {step:"02",name:"Edge compute",detail:"GPUs and accelerators execute low-latency AI inference."},
 {step:"03",name:"Control execution",detail:"PLCs, panels and validated interfaces connect decisions to machinery."}
];

export function IndustrialAIMedia({compact=false}:{compact?:boolean}) {
 return <section id="industrial-margin-model" aria-labelledby="industrial-margin-heading" style={{padding:"30px 0 45px",color:"#edf6f4"}}>
  <div style={{maxWidth:1200,margin:"0 auto"}}>
   <div style={{fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"#b0e2c8",marginBottom:10}}>Industrial AI / Visual investment thesis</div>
   <h2 id="industrial-margin-heading" style={{fontSize:"clamp(25px,3vw,38px)",fontFamily:"Georgia,serif",lineHeight:1.14,margin:"0 0 12px"}}>From distribution to high-value industrial AI hardware</h2>
   <p style={{fontSize:15,lineHeight:1.7,color:"#bad0d0",maxWidth:930,marginBottom:23}}>A three-engine progression: build supply and distribution access, configure application-specific industrial hardware, then expand into commissioning and lifecycle services. Margin figures are illustrative business-model targets, not achieved results or supplier quotations.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12}}>
    {engines.map(e=><article key={e.name} style={{border:"1px solid #38545c",borderRadius:15,overflow:"hidden",background:"#152a31"}}>
      <div style={{background:e.accent,padding:"14px 18px",borderBottom:"3px solid "+e.color}}><strong style={{fontSize:17,color:"#fff"}}>{e.name}</strong></div>
      <div style={{padding:18}}>
        <div style={{fontSize:43,fontWeight:750,color:e.color,lineHeight:1.1}}>{e.margin}</div><div style={{fontSize:12,color:"#c7d9dd",marginBottom:18}}>{e.subtitle}</div>
        <div style={{display:"flex",gap:4,alignItems:"end",height:46,marginBottom:17}}>{[26,37,46,57,70,83].map((h,i)=><span key={i} style={{height:h+"%",flex:1,background:e.color,opacity:0.35+i*0.11,borderRadius:"3px 3px 0 0"}}/>)}</div>
        <p style={{fontSize:14,lineHeight:1.55,margin:"0 0 10px"}}><strong>Products:</strong> {e.product}</p><p style={{fontSize:13,lineHeight:1.6,color:"#b1c8c9",margin:0}}><strong>Value driver:</strong> {e.value}</p>
      </div>
    </article>)}
   </div>
   {!compact&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:14}}>
    {stack.map(x=><div key={x.step} style={{border:"1px solid #36525a",borderRadius:12,padding:18,background:"#10242b"}}><span style={{fontSize:27,color:"#91c7ee",fontWeight:700,marginRight:12}}>{x.step}</span><strong style={{fontSize:16}}>{x.name}</strong><p style={{fontSize:13,lineHeight:1.55,color:"#b5c9ca",margin:"8px 0 0"}}>{x.detail}</p></div>)}
   </div>}
   <p style={{margin:"14px 0 6px"}}><a href={originalInfographicUrl} target="_blank" rel="noopener noreferrer" style={{color:"#a4e5c7",textDecoration:"underline",fontSize:14}}>View original industrial AI margin infographic (PNG) ↗</a></p>
   <p style={{fontSize:12,color:"#a5bdbc",margin:"0 0 8px"}}>Original image hosted on Google Drive; availability to visitors depends on its sharing settings.</p>
   <p style={{fontSize:12,color:"#a5bdbc",lineHeight:1.6,margin:"12px 0 24px"}}>Illustrative gross-margin targets: wholesale 12%, customized solutions 28%, technical services 35%. Actual outcomes depend on landed cost, pricing, labor utilization, installation scope, warranty obligations and customer contracts. A mix of these businesses does not imply a 35% consolidated margin.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))",gap:16,alignItems:"start"}}>
    <div style={{border:"1px solid #36525a",background:"#11252c",padding:18,borderRadius:14}}>
      <strong style={{display:"block",fontSize:17,marginBottom:8}}>Industrial AI in 60 seconds</strong>
      <div style={{maxWidth:250,margin:"0 auto 12px",aspectRatio:"9 / 16",maxHeight:340,background:"#08171d",borderRadius:10,overflow:"hidden"}}>
       <iframe title="Industrial AI hardware investment short video" src="https://www.youtube-nocookie.com/embed/kK95JMg7elU" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{height:"100%",width:"100%",border:0}}/>
      </div><a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{color:"#a8e0cb",textDecoration:"underline"}}>Watch the Short on YouTube</a>
    </div>
    <div style={{border:"1px solid #36525a",background:"#11252c",padding:22,borderRadius:14}}>
     <div style={{fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:"#9dceb9",marginBottom:8}}>Explore the model</div>
     <h3 style={{fontFamily:"Georgia,serif",fontSize:24,margin:"0 0 9px"}}>Interactive investment report</h3>
     <p style={{fontSize:14,lineHeight:1.7,color:"#b7cccb"}}>Open the companion interactive report to explore the distribution-to-engineering investment narrative and supporting research in NotebookLM.</p>
     <a href={reportUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"12px 16px",borderRadius:8,color:"#08221b",background:"#a4e5c7",fontWeight:700,textDecoration:"none",margin:"6px 0 16px"}}>Open interactive report ↗</a>
     <p style={{fontSize:12,color:"#a8bec0",lineHeight:1.6}}>Hosted externally on NotebookLM. Access may depend on the notebook owner's sharing permissions. AI-generated research material requires independent verification before investment decisions.</p>
     <Link href="/investments/nepal-india-electronics#engineering-economics" style={{color:"#a4e5c7",textDecoration:"underline",fontSize:13}}>Review the website financial model ↗</Link>
    </div>
   </div>
  </div>
 </section>;
}
