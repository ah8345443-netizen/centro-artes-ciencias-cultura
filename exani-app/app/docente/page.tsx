"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import PortalNav from "../../components/portal-nav";

type Student = {
  student_id:string;
  full_name:string;
  email:string|null;
  course:string|null;
  total_attempts:number;
  correct_attempts:number;
  accuracy:number;
  mt_accuracy:number;
  cl_accuracy:number;
  ri_accuracy:number;
  ci_accuracy:number;
  last_activity:string|null;
};

type Topic = {
  topic_code:string;
  topic_name:string;
  area:string;
  attempts:number;
  correct:number;
  percentage:number;
};

const areaMeta:Record<string,{name:string;className:string}> = {
  MT:{name:"Matemáticas",className:"math"},
  CL:{name:"Comprensión lectora",className:"reading"},
  RI:{name:"Redacción indirecta",className:"writing"},
  CI:{name:"Pensamiento científico",className:"science"},
};

export default function DocentePage(){
  const [students,setStudents]=useState<Student[]>([]);
  const [selected,setSelected]=useState<Student|null>(null);
  const [topics,setTopics]=useState<Topic[]>([]);
  const [loading,setLoading]=useState(true);
  const [detailLoading,setDetailLoading]=useState(false);
  const [message,setMessage]=useState("");

  useEffect(()=>{(async()=>{
    const supabase=createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}

    const {data:profile}=await supabase.from("profiles").select("role,access_status,access_expires_at").eq("id",user.id).single();
    const expired=profile?.access_expires_at&&new Date(profile.access_expires_at)<new Date();
    if(profile?.role!=="teacher"||profile?.access_status!=="active"||expired){
      window.location.href="/dashboard";
      return;
    }

    const {data,error}=await supabase.rpc("teacher_roster_summary");
    if(error)setMessage("No fue posible cargar tu grupo.");
    setStudents((data??[]) as unknown as Student[]);
    setLoading(false);
  })()},[]);

  async function openStudent(student:Student){
    setSelected(student);
    setDetailLoading(true);
    setMessage("");
    const supabase=createClient();
    const {data,error}=await supabase.rpc("teacher_student_topic_summary",{requested_student_id:student.student_id});
    setDetailLoading(false);
    if(error){setMessage("No fue posible cargar el detalle de este alumno.");return;}
    setTopics((data??[]) as unknown as Topic[]);
  }

  const summary=useMemo(()=>{
    const total=students.length;
    const active=students.filter(s=>s.total_attempts>0).length;
    const avg=total?Math.round(students.reduce((sum,s)=>sum+Number(s.accuracy||0),0)/total):0;
    const needs=students.filter(s=>s.total_attempts>=5&&Number(s.accuracy)<60).length;
    return {total,active,avg,needs};
  },[students]);

  const weakest=useMemo(()=>topics.filter(t=>t.attempts>=2).sort((a,b)=>Number(a.percentage)-Number(b.percentage)).slice(0,6),[topics]);

  if(loading)return <main className="app-bg"><PortalNav/><div className="app-shell"><section className="panel"><p>Cargando panel docente...</p></section></div></main>;

  return <main className="app-bg">
    <PortalNav/>
    <div className="app-shell">
      <section className="teacher-hero">
        <div><span className="eyebrow light">Panel docente</span><h1>Seguimiento del grupo</h1><p>Consulta desempeño, detecta necesidades de refuerzo y acompaña a tus alumnos sin modificar sus accesos administrativos.</p></div>
        <a className="button light-button" href="/dashboard">Mi panel personal</a>
      </section>

      {message&&<p className="error">{message}</p>}

      <section className="teacher-metrics">
        <article><strong>{summary.total}</strong><span>Alumnos asignados</span></article>
        <article><strong>{summary.active}</strong><span>Con actividad</span></article>
        <article><strong>{summary.avg}%</strong><span>Precisión media</span></article>
        <article><strong>{summary.needs}</strong><span>Requieren atención</span></article>
      </section>

      <section className="teacher-layout">
        <div>
          <div className="section-bar"><div><span className="eyebrow">Grupo</span><h2>Alumnos asignados</h2></div></div>
          <div className="teacher-student-list">
            {students.map(s=><button key={s.student_id} className={"teacher-student-card "+(selected?.student_id===s.student_id?"selected":"")} onClick={()=>openStudent(s)}>
              <div className="student-avatar">{s.full_name.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()}</div>
              <div className="student-main"><strong>{s.full_name}</strong><span>{s.course??"Sin curso asignado"}</span><small>{s.total_attempts} respuestas · {s.last_activity?new Date(s.last_activity).toLocaleDateString("es-MX"):"sin actividad"}</small></div>
              <div className="student-accuracy"><strong>{Number(s.accuracy)}%</strong><span>aciertos</span></div>
            </button>)}
            {!students.length&&<div className="empty-state">Todavía no tienes alumnos asignados. Un administrador debe asignarlos desde Administración → Docentes.</div>}
          </div>
        </div>

        <aside className="teacher-detail">
          {!selected?<div className="teacher-placeholder"><span className="eyebrow">Detalle</span><h2>Selecciona un alumno</h2><p>Verás su desempeño por área y los temas que requieren más atención.</p></div>:<>
            <span className="eyebrow">Alumno seleccionado</span>
            <h2>{selected.full_name}</h2>
            <p className="teacher-email">{selected.email??"Sin correo registrado"}</p>

            <div className="teacher-area-grid">
              {[
                ["MT",selected.mt_accuracy],["CL",selected.cl_accuracy],["RI",selected.ri_accuracy],["CI",selected.ci_accuracy]
              ].map(([code,pct])=><div key={String(code)}><span className={"area-icon "+areaMeta[String(code)].className}>{code}</span><strong>{Number(pct)}%</strong><small>{areaMeta[String(code)].name}</small></div>)}
            </div>

            <div className="teacher-detail-section">
              <h3>Temas prioritarios</h3>
              {detailLoading?<p className="muted-large">Cargando...</p>:<div className="teacher-topic-list">
                {weakest.map(t=><a href={"/practica/"+t.topic_code.toLowerCase()} key={t.topic_code}><div><strong>{t.topic_code}</strong><span>{t.topic_name}</span></div><b>{Number(t.percentage)}%</b></a>)}
                {!weakest.length&&<div className="empty-state compact-empty">Aún no hay suficientes respuestas para detectar una tendencia.</div>}
              </div>}
            </div>
          </>}
        </aside>
      </section>
    </div>
  </main>
}
