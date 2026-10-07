"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Attempt = { is_correct: boolean; questions: { area: string; topic_code: string; topic_name: string } | null };

export default function ResultadosPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load=async()=>{
      const supabase=createClient();
      const { data }=await supabase.from("attempts").select("is_correct, questions(area,topic_code,topic_name)").order("created_at",{ascending:false});
      setAttempts((data ?? []) as Attempt[]);
      setLoading(false);
    };
    load();
  },[]);

  const summary=useMemo(()=>{
    const map:Record<string,{total:number;correct:number}>={};
    for(const a of attempts){
      const area=a.questions?.area ?? "Otro";
      map[area] ??= {total:0,correct:0};
      map[area].total++;
      if(a.is_correct) map[area].correct++;
    }
    return map;
  },[attempts]);

  return <main className="shell">
    <div className="topbar"><div><p className="eyebrow">Resultados</p><h1>Mi desempeño</h1></div><a className="button secondary" href="/dashboard">Regresar</a></div>
    {loading ? <section className="panel"><p>Cargando...</p></section> :
    <section className="grid">
      {Object.entries(summary).map(([area,s])=><article className="card" key={area}><span>{area}</span><h2>{Math.round((s.correct/s.total)*100)}%</h2><p>{s.correct} aciertos de {s.total} intentos</p></article>)}
      {attempts.length===0 && <article className="card"><h2>Aún no hay intentos</h2><p>Resuelve una práctica para comenzar a medir tu progreso.</p></article>}
    </section>}
  </main>;
}
