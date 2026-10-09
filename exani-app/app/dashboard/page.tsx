"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import LogoutButton from "../../components/logout-button";
import PortalNav from "../../components/portal-nav";

type Attempt = { is_correct: boolean; questions: { area: string; topic_code: string; topic_name: string }[] | null };
type Profile = { full_name: string; role: string; access_status: string; course: string | null; access_expires_at: string | null };
type Session = { id:string; title:string; mode:string; question_count:number; score:number|null; completed_at:string|null; created_at:string };

const areaMeta: Record<string,{name:string;className:string}> = {
  MT:{name:"Matemáticas",className:"math"},
  CL:{name:"Comprensión lectora",className:"reading"},
  RI:{name:"Redacción indirecta",className:"writing"},
  CI:{name:"Pensamiento científico",className:"science"},
};

export default function DashboardPage() {
  const [profile,setProfile]=useState<Profile|null>(null);
  const [attempts,setAttempts]=useState<Attempt[]>([]);
  const [sessions,setSessions]=useState<Session[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const supabase=createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    const [{data:p},{data:a},{data:s}]=await Promise.all([
      supabase.from("profiles").select("full_name,role,access_status,course,access_expires_at").eq("id",user.id).single(),
      supabase.from("attempts").select("is_correct,questions(area,topic_code,topic_name)"),
      supabase.from("simulation_sessions").select("id,title,mode,question_count,score,completed_at,created_at").order("created_at",{ascending:false}).limit(4)
    ]);
    setProfile(p as Profile|null); setAttempts((a??[]) as Attempt[]); setSessions((s??[]) as Session[]); setLoading(false);
  })()},[]);

  const areas=useMemo(()=>["MT","CL","RI","CI"].map(code=>{
    const rows=attempts.filter(a=>a.questions?.[0]?.area===code);
    const correct=rows.filter(a=>a.is_correct).length;
    return {code,total:rows.length,pct:rows.length?Math.round(correct/rows.length*100):0,...areaMeta[code]};
  }),[attempts]);

  const weakest=useMemo(()=>{
    const grouped:Record<string,{name:string,total:number,correct:number}>={};
    attempts.forEach(a=>{const q=a.questions?.[0]; if(!q)return; grouped[q.topic_code]??={name:q.topic_name,total:0,correct:0}; grouped[q.topic_code].total++; if(a.is_correct)grouped[q.topic_code].correct++;});
    return Object.entries(grouped).filter(([,v])=>v.total>=2).map(([code,v])=>({code,...v,pct:Math.round(v.correct/v.total*100)})).sort((a,b)=>a.pct-b.pct)[0];
  },[attempts]);

  if(loading)return <main className="app-bg"><PortalNav/><div className="app-shell"><section className="panel"><p>Cargando tu espacio...</p></section></div></main>;

  const expired=profile?.access_expires_at&&new Date(profile.access_expires_at)<new Date();
  if(!profile||profile.access_status!=="active"||expired)return <main className="app-bg"><div className="app-shell narrow"><section className="panel"><p className="eyebrow">Acceso</p><h1>Cuenta sin acceso activo</h1><p>Tu acceso está bloqueado, vencido o pendiente de activación.</p><LogoutButton/></section></div></main>;

  const firstName=profile.full_name.split(" ")[0];
  return <main className="app-bg">
    <PortalNav/>
    <div className="app-shell">
      <section className="dashboard-hero">
        <div><span className="eyebrow light">Tu espacio de preparación</span><h1>Hola, {firstName}.</h1><p>Hoy puedes practicar un tema concreto o medir tu desempeño con una simulación nueva.</p>
          <div className="actions"><a className="button light-button" href="/simulaciones">Crear evaluación</a><a className="button hero-secondary" href="/practica">Explorar temario</a></div>
        </div>
        <div className="hero-account"><span>Nivel asignado</span><strong>{profile.course??"General"}</strong><small>{attempts.length} respuestas registradas</small></div>
      </section>

      <div className="dashboard-toolbar">
        <div><span className="eyebrow">Resumen</span><h2>Tu desempeño por área</h2></div>
        <div className="actions compact">{profile.role==="admin"&&<a className="button secondary" href="/admin">Administración</a>}<LogoutButton/></div>
      </div>

      <section className="area-progress-grid">
        {areas.map(a=><article className="area-progress-card" key={a.code}>
          <div className="area-progress-top"><span className={"area-icon "+a.className}>{a.code}</span><span className="area-score">{a.total?a.pct+"%":"—"}</span></div>
          <h3>{a.name}</h3><p>{a.total?a.total+" respuestas registradas":"Aún sin actividad"}</p>
          <div className="progress"><div style={{width:a.total?a.pct+"%":"0%"}}/></div>
        </article>)}
      </section>

      <section className="dashboard-grid">
        <article className="focus-card">
          <span className="eyebrow">Siguiente recomendación</span>
          <h2>{weakest?"Refuerza "+weakest.code:"Empieza con un diagnóstico"}</h2>
          <p>{weakest?weakest.name+" tiene actualmente "+weakest.pct+"% de aciertos. Una sesión enfocada puede ayudarte a detectar el tipo de error.":"Obtén una línea base de matemáticas, lectura, redacción y pensamiento científico."}</p>
          <a className="button primary" href={weakest?"/practica/"+weakest.code.toLowerCase():"/simulacro?modo=diagnostic"}>{weakest?"Practicar este tema":"Hacer diagnóstico"}</a>
        </article>
        <article className="route-card">
          <span className="eyebrow">Ruta sugerida</span><h2>Seis etapas para avanzar</h2>
          <div className="study-route"><span>Bases numéricas</span><i/><span>Álgebra</span><i/><span>Funciones</span><i/><span>Geometría</span><i/><span>Datos y azar</span><i/><span>Repaso</span></div>
        </article>
      </section>

      <section className="recent-section">
        <div className="section-bar"><div><span className="eyebrow">Historial</span><h2>Evaluaciones recientes</h2></div><a className="text-button" href="/resultados">Ver todos los resultados →</a></div>
        <div className="recent-list">
          {sessions.map(s=><article key={s.id}><div><strong>{s.title}</strong><span>{new Date(s.created_at).toLocaleDateString("es-MX")}</span></div><div><strong>{s.completed_at&&s.score!=null?s.score+"/"+s.question_count:"En progreso"}</strong><span>{s.question_count} reactivos</span></div></article>)}
          {!sessions.length&&<div className="empty-state">Aún no has realizado evaluaciones. Elige una materia para comenzar.</div>}
        </div>
      </section>
    </div>
  </main>;
}
