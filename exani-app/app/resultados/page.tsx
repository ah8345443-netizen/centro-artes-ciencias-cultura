"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import PortalNav from "../../components/portal-nav";

type Attempt={is_correct:boolean;questions:{area:string;topic_code:string;topic_name:string}[]|null};
type Session={id:string;title:string;mode:string;question_count:number;score:number|null;completed_at:string|null;created_at:string};
type TopicSummary={topic_code:string;topic_name:string;area:string;attempts:number;correct:number;percentage:number};

const meta:Record<string,{name:string;className:string}>={MT:{name:"Matemáticas",className:"math"},CL:{name:"Comprensión lectora",className:"reading"},RI:{name:"Redacción indirecta",className:"writing"},CI:{name:"Pensamiento científico",className:"science"}};

export default function ResultadosPage(){
 const [attempts,setAttempts]=useState<Attempt[]>([]);
 const [sessions,setSessions]=useState<Session[]>([]);
 const [topics,setTopics]=useState<TopicSummary[]>([]);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{(async()=>{
  const supabase=createClient();
  const [a,s,t]=await Promise.all([
   supabase.from("attempts").select("is_correct,questions(area,topic_code,topic_name)").order("created_at",{ascending:false}),
   supabase.from("simulation_sessions").select("id,title,mode,question_count,score,completed_at,created_at").order("created_at",{ascending:false}).limit(20),
   supabase.rpc("student_topic_summary")
  ]);
  setAttempts((a.data??[]) as Attempt[]);
  setSessions((s.data??[]) as Session[]);
  setTopics((t.data??[]) as unknown as TopicSummary[]);
  setLoading(false);
 })()},[]);

 const areas=useMemo(()=>["MT","CL","RI","CI"].map(code=>{
  const rows=attempts.filter(a=>a.questions?.[0]?.area===code);
  const correct=rows.filter(a=>a.is_correct).length;
  return {code,total:rows.length,correct,pct:rows.length?Math.round(correct/rows.length*100):0,...meta[code]};
 }),[attempts]);

 const completed=sessions.filter(s=>s.completed_at&&s.score!=null);
 const overall=attempts.length?Math.round(attempts.filter(a=>a.is_correct).length/attempts.length*100):0;
 const weakest=topics.filter(t=>Number(t.attempts)>=2).slice(0,5);

 return <main className="app-bg"><PortalNav/><div className="app-shell">
  <section className="page-heading split-heading"><div><span className="eyebrow">Analítica personal</span><h1>Resultados que te dicen qué estudiar.</h1><p>No te quedes solo con una calificación. Revisa tendencias por área, temas que requieren atención y tu historial de simulaciones.</p></div><div className="overall-score"><span>Precisión acumulada</span><strong>{loading?"—":overall+"%"}</strong><small>{attempts.length} respuestas</small></div></section>

  <section className="area-progress-grid">
   {areas.map(a=><article className="area-progress-card" key={a.code}><div className="area-progress-top"><span className={"area-icon "+a.className}>{a.code}</span><span className="area-score">{a.total?a.pct+"%":"—"}</span></div><h3>{a.name}</h3><p>{a.total?a.correct+" aciertos de "+a.total:"Sin datos todavía"}</p><div className="progress"><div style={{width:a.total?a.pct+"%":"0%"}}/></div></article>)}
  </section>

  <section className="results-layout">
   <div>
    <div className="section-bar"><div><span className="eyebrow">Historial</span><h2>Simulaciones</h2></div><a className="button secondary" href="/simulaciones">Nueva simulación</a></div>
    <div className="simulation-history">
     {completed.map(s=>{const pct=s.question_count&&s.score!=null?Math.round(s.score/s.question_count*100):0;return <article key={s.id}><div><strong>{s.title}</strong><span>{new Date(s.created_at).toLocaleDateString("es-MX",{day:"numeric",month:"short",year:"numeric"})}</span></div><div className="history-score"><strong>{pct}%</strong><span>{s.score}/{s.question_count}</span></div></article>})}
     {!completed.length&&!loading&&<div className="empty-state">Completa una simulación para comenzar tu historial.</div>}
    </div>
   </div>

   <aside className="weak-topics">
    <span className="eyebrow">Prioridad de repaso</span><h2>Temas a reforzar</h2><p>Se muestran temas con al menos dos respuestas registradas, ordenados desde el menor porcentaje.</p>
    <div className="weak-list">{weakest.map(t=><a href={"/practica/"+t.topic_code.toLowerCase()} key={t.topic_code}><div><strong>{t.topic_code}</strong><span>{t.topic_name}</span></div><b>{Number(t.percentage)}%</b></a>)}</div>
    {!weakest.length&&<div className="empty-state compact-empty">Aún necesitamos más respuestas para detectar una tendencia.</div>}
   </aside>
  </section>
 </div></main>
}
