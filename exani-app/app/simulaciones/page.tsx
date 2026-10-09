"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import PortalNav from "../../components/portal-nav";

type Subject={area:string;subject_name:string;question_count:number;topic_count:number;open_activity_count:number};

const meta:Record<string,{className:string;description:string}> = {
  MT:{className:"math",description:"Aritmética, álgebra, funciones, geometría, estadística y probabilidad."},
  CL:{className:"reading",description:"Comprensión, inferencia, intención, relaciones textuales y evaluación de evidencia."},
  RI:{className:"writing",description:"Coherencia, conectores, registro, concordancia, ortografía y puntuación."},
  CI:{className:"science",description:"Hipótesis, variables, diseño experimental, datos y conclusiones."},
};

export default function SimulacionesPage(){
  const [subjects,setSubjects]=useState<Subject[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const supabase=createClient();
    const {data}=await supabase.rpc("subject_catalog");
    setSubjects((data??[]) as unknown as Subject[]);
    setLoading(false);
  })()},[]);

  return <main className="app-bg"><PortalNav/><div className="app-shell">
    <section className="page-heading split-heading">
      <div><span className="eyebrow">Simulador de evaluación</span><h1>Primero elige una materia.</h1><p>Después podrás seleccionar la cantidad de reactivos y el nivel. Cada evaluación se construye aleatoriamente, por lo que un nuevo intento no repite necesariamente la misma combinación.</p></div>
      <div className="random-badge"><strong>Selección aleatoria</strong><span>Evaluaciones diferentes en cada intento</span></div>
    </section>

    {loading?<section className="panel"><p>Cargando materias...</p></section>:<section className="subject-evaluation-grid">
      {subjects.map(s=><article className="subject-evaluation-card" key={s.area}>
        <div className="subject-evaluation-head">
          <span className={"area-icon "+meta[s.area].className}>{s.area}</span>
          <div><h2>{s.subject_name}</h2><p>{meta[s.area].description}</p></div>
        </div>
        <div className="subject-stats"><span><strong>{s.question_count}</strong> reactivos</span><span><strong>{s.topic_count}</strong> temas</span><span><strong>{s.open_activity_count}</strong> actividades abiertas</span></div>
        <div className="evaluation-actions">
          <a className="button secondary" href={"/simulacro?materia="+s.area+"&cantidad=10"}>10 reactivos</a>
          <a className="button secondary" href={"/simulacro?materia="+s.area+"&cantidad=20"}>20 reactivos</a>
          <a className="button primary" href={"/simulacro?materia="+s.area+"&cantidad=30"}>Evaluación amplia</a>
        </div>
        <a className="text-button block" href={"/practica#"+s.area}>Ver temas de esta materia →</a>
      </article>)}
    </section>}

    <section className="mixed-evaluation">
      <div><span className="eyebrow light">Evaluación general</span><h2>Combinar todas las materias</h2><p>Genera una evaluación aleatoria con reactivos de las cuatro áreas.</p></div>
      <a className="button light-button" href="/simulacro?materia=ALL&cantidad=30">Crear evaluación mixta</a>
    </section>
  </div></main>
}
