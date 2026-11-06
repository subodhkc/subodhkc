"use client";

import {useState} from "react";
import {competitionDescription,competitionMethodology,productReferences,type ProductRefInfo} from "@/lib/investments/product-references";

type Kind=ProductRefInfo["kind"];

export function ProductThumbnail({kind,image,alt}:{kind:Kind;image?:string;alt:string}){
  const [failed,setFailed]=useState(false);
  if(image&&!failed)return <img className="iv-product-photo" src={image} alt={alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>;
  return <svg className="iv-product-vector" viewBox="0 0 112 88" role="img" aria-label={"Illustrative "+kind+" product image"}>
    <defs><linearGradient id={"iv-prod-bg-"+kind} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f7faf5"/><stop offset="1" stopColor="#dce9de"/></linearGradient></defs>
    <rect width="112" height="88" rx="10" fill={"url(#iv-prod-bg-"+kind+")"}/>
    {kind==="gpu"?
      <g transform="translate(8 20) rotate(-5 48 24)"><rect x="5" y="7" width="95" height="46" rx="5" fill="#355b4d"/><rect x="9" y="12" width="85" height="35" rx="3" fill="#2c403e"/>{[33,70].map(x=><g key={x}><circle cx={x} cy="29" r="15" fill="#1b2e2f" stroke="#739d82"/><circle cx={x} cy="29" r="3" fill="#abbca9"/>{Array.from({length:6},(_,i)=><path key={i} d="M 0 -4 L 3 -13 L -3 -10 Z" transform={"translate("+x+" 29) rotate("+(i*60)+")"} fill="#7a9990"/>)}</g>)}<rect x="22" y="53" width="59" height="4" rx="1" fill="#caa469"/></g>:
    kind==="ssd"?
      <g transform="translate(10 27) rotate(-6 47 18)"><rect width="92" height="32" rx="5" fill="#284e3e"/><rect x="8" y="6" width="43" height="20" rx="2" fill="#142f29"/><rect x="57" y="7" width="15" height="13" rx="1" fill="#64927c"/><rect x="75" y="8" width="12" height="11" rx="1" fill="#64927c"/><rect x="4" y="32" width="80" height="4" fill="#c4a166"/>{Array.from({length:9},(_,i)=><rect key={i} x={8+i*8} y="33" width="4" height="3" fill="#f4db91"/>)}</g>:
    kind==="harness"?
      <g fill="none" strokeLinecap="round" strokeWidth="4">{["#5a8871","#d3a16e","#496d89","#6b786a"].map((color,i)=><path key={i} d={"M 14 "+(24+i*10)+" C 35 "+(10+i*7)+", 65 "+(76-i*7)+", 90 "+(22+i*10)} stroke={color}/>)}
        <rect x="7" y="17" width="14" height="50" rx="3" fill="#2b453e" stroke="#7c9b84" strokeWidth="1"/><rect x="86" y="17" width="16" height="50" rx="3" fill="#324b44" stroke="#9eb4a2" strokeWidth="1"/></g>:
    kind==="sensor"?
      <g><rect x="24" y="11" width="64" height="65" rx="7" fill="#e7eee8" stroke="#668c73" strokeWidth="2"/><rect x="33" y="18" width="46" height="21" rx="4" fill="#2b5943"/>{[39,50,61,72].map(x=><rect key={x} x={x} y="25" width="5" height="8" fill="#b4d39e"/>)}<path d="M35 52 H77 M35 60 H77 M35 68 H77" stroke="#b18c5d" strokeWidth="3"/></g>:
    kind==="controller"?
      <g><rect x="16" y="13" width="80" height="61" rx="7" fill="#e1e8df" stroke="#527a63" strokeWidth="2"/><rect x="25" y="21" width="63" height="22" rx="3" fill="#224d3e"/><path d="M32 33h47" stroke="#85b39a" strokeWidth="2"/>{[33,48,63,78].map(x=><circle key={x} cx={x} cy="55" r="5" fill="#87ae98"/>)}<rect x="40" y="68" width="32" height="4" fill="#a37b59"/></g>:
    kind==="panel"?
      <g><rect x="23" y="8" width="66" height="74" rx="4" fill="#e4e9df" stroke="#4e7764" strokeWidth="2"/><rect x="31" y="15" width="50" height="58" rx="3" fill="#f6f7f0" stroke="#90b3a0"/>{[23,36,49].map(y=><g key={y}><rect x="36" y={y} width="20" height="8" rx="1" fill="#5a9674"/><rect x="61" y={y} width="14" height="8" rx="1" fill="#c8a879"/><path d={"M57 "+(y+4)+" H60"} stroke="#31583f"/></g>)}</g>:
    kind==="gateway"||kind==="computer"||kind==="edge"?
      <g><rect x="28" y="13" width="57" height="65" rx="8" fill="#2d4e43" stroke="#698875" strokeWidth="2"/><rect x="34" y="21" width="45" height="13" rx="2" fill="#446d5b"/><rect x="39" y="43" width="15" height="13" rx="2" fill="#141f20" stroke="#adc1af"/><rect x="60" y="43" width="15" height="13" rx="2" fill="#141f20" stroke="#adc1af"/>{[43,54,65].map(x=><circle key={x} cx={x} cy="65" r="2" fill="#abcbaa"/>)}</g>:
      <g><rect x="16" y="14" width="80" height="56" rx="4" fill="#dfe9df" stroke="#537961"/></g>}
    <path d="M9 78H103" stroke="#a9c1ad" strokeWidth="1" strokeDasharray="2 4"/>
  </svg>;
}

export function ProductReferenceCell({productName,number,compact=false,referenceKey}:{productName:string;number?:number;compact?:boolean;referenceKey?:string}){
  const item=productReferences[referenceKey||productName];
  if(!item)return <strong>{productName}</strong>;
  return <div className={"iv-prod-ref "+(compact?"iv-prod-compact":"")}>
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="iv-prod-thumb-link"
       onClick={e=>e.stopPropagation()} title={"Open reference: "+item.label}>
      <ProductThumbnail kind={item.kind} image={item.image} alt={item.label+" — representative reference product photograph"}/>
    </a>
    <div className="iv-prod-details">
      <strong>{number?number+". ":""}{productName}</strong>
      <span className="iv-prod-model">Reference example · {item.maker} / {item.model}</span>
      <div className="iv-prod-actions">
        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>View product reference ↗</a>
        <details onClick={e=>e.stopPropagation()}><summary>Details</summary><div className="iv-prod-popover"><strong>{item.label}</strong><p>{item.detail}</p><span>Reference example · Not a quoted or confirmed purchase item</span></div></details>
      </div>
    </div>
  </div>;
}

export function CompetitionPressure({value,mini=false}:{value:number;mini?:boolean}){
  const info=competitionDescription(value);
  return <div className={"iv-competition iv-comp-"+info.tone+(mini?" iv-competition-mini":"")} title={info.meaning} aria-label={value+" out of 5 competition pressure: "+info.label+". "+info.meaning}>
    <div className="iv-comp-meter" aria-hidden="true">{[1,2,3,4,5].map(level=><i key={level} className={level<=value?"filled":""}/>)}</div>
    <div className="iv-comp-label"><strong>{info.label}</strong><small>{value}/5 rivalry</small></div>
  </div>;
}

export function CompetitionLegend(){
  return <div className="iv-comp-legend" aria-label="Competition score guide">
    <div><strong>How to read competition</strong><p>Lower score = less direct rivalry. Higher score = more sellers and stronger price pressure.</p></div>
    <div className="iv-comp-legend-scale">{[[1,"Very low"],[2,"Low"],[3,"Moderate"],[4,"High"],[5,"Very high"]].map(([n,label])=><div key={n}><b>{n}/5</b><span>{label}</span></div>)}</div>
    <small>{competitionMethodology}</small>
  </div>;
}
