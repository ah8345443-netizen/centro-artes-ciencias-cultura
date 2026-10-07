"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import PortalNav from "../../components/portal-nav";

type Exercise={id:string;code:string;area:string;topic_name:string;prompt:string;hint:string|null;guidance:string|null;source_page:number|null};

export default function IntegradoresPage(){
 const [items,setItems]=useState<Exercise[]>([]);
 const [open,setOpen]=useState<string|null>(null);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{(async()=>{
  const supabase=createClient();
  const {data}=await supabase.from("study_exercises").select("id,code,area,topic_name,prompt,hint,guidance,source_page").eq("source_kind","integrative").eq("is_active",true).order("sort_order",{ascending:true});
  setItems((data??[]) as Exercise[]);setLoading(false);
 })()},[]);

 return <main className="app-bg"><PortalNav/><div className="app-shell">
  <section className="page-heading split-heading"><div><span className="eyebrow">Profundización N4</span><h1>Problemas integradores.</h1><p>Estas situaciones mezclan contenidos y exigen construir un procedimiento, justificar decisiones y reconocer límites. No se resuelven adivinando una opción.</p></div><div className="random-badge"><strong>8 situaciones</strong><span>Modelación · argumentación · evidencia</span></div></section>
  {loading?<section className="panel"><p>Cargando problemas...</p></section>:<section className="integrative-list">
   {items.map((e,i)=><article key={e.id} className="integrative-card">
    <div className="integrative-index"><span>{String(i+1).padStart(2,"0")}</span><small>{e.area} · N4</small></div>
    <div className="integrative-body"><span className="eyebrow">{e.topic_name}</span><h2>{e.prompt}</h2>
      {e.hint&&<button className="button secondary" onClick={()=>setOpen(open===e.id?null:e.id)}>{open===e.id?"Ocultar apoyo":"Necesito una pista"}</button>}
      {open===e.id&&<div className="integrative-guidance"><strong>Pista</strong><p>{e.hint}</p>{e.guidance&&<><strong>Criterio de revisión</strong><p>{e.guidance}</p></>}</div>}
    </div>
   </article>)}
  </section>}
  <section className="simulation-note"><strong>Cómo usarlos</strong><p>Resuelve primero en papel sin abrir la pista. Después compara tu razonamiento con el criterio de revisión. El objetivo es explicar y comprobar, no memorizar el resultado.</p></section>
 </div></main>
}
