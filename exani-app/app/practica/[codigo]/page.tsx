"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import PortalNav from "../../../components/portal-nav";

type Question = {
  id:string; code:string; area:string; topic_code:string; topic_name:string; difficulty:number;
  stimulus:string|null; prompt:string; option_a:string; option_b:string; option_c:string; option_d:string|null;
  source_label:string|null; source_page:number|null;
};
type Exercise = {id:string;code:string;difficulty:number;prompt:string;hint:string|null;guidance:string|null;source_kind:string};
type Feedback = {is_correct:boolean;correct_option:string;explanation:string|null};

export default function TopicPracticePage({params}:{params:Promise<{codigo:string}>}) {
  const [topicCode,setTopicCode]=useState("");
  const [questions,setQuestions]=useState<Question[]>([]);
  const [exercises,setExercises]=useState<Exercise[]>([]);
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState("");
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [correct,setCorrect]=useState(0);
  const [answered,setAnswered]=useState(0);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");
  const [hintOpen,setHintOpen]=useState<string|null>(null);

  useEffect(()=>{params.then(({codigo})=>setTopicCode(codigo.toUpperCase()))},[params]);

  useEffect(()=>{
    if(!topicCode)return;
    (async()=>{
      const supabase=createClient();
      const [qRes,eRes]=await Promise.all([
        supabase.rpc("get_practice_questions",{requested_topic:topicCode,requested_limit:100}),
        supabase.from("study_exercises").select("id,code,difficulty,prompt,hint,guidance,source_kind").eq("topic_code",topicCode).eq("is_active",true).order("difficulty",{ascending:true}).order("sort_order",{ascending:true})
      ]);
      if(qRes.error)setMessage("No fue posible cargar los reactivos.");
      const shuffled=[...(qRes.data??[])].sort(()=>Math.random()-.5);
      setQuestions(shuffled as unknown as Question[]);
      setExercises((eRes.data??[]) as Exercise[]);
      setLoading(false);
    })();
  },[topicCode]);

  const q=questions[index];
  const options=useMemo(()=>q?[["A",q.option_a],["B",q.option_b],["C",q.option_c],["D",q.option_d]].filter(([,v])=>Boolean(v)):[],[q]);
  const finished=questions.length>0&&index>=questions.length;

  async function check(){
    if(!q||!selected||feedback)return;
    const supabase=createClient();
    const {data,error}=await supabase.rpc("submit_question_answer",{requested_question_id:q.id,requested_option:selected});
    if(error||!data?.[0]){setMessage("No fue posible guardar tu respuesta.");return;}
    const fb=data[0] as unknown as Feedback;
    setFeedback(fb);setAnswered(v=>v+1);if(fb.is_correct)setCorrect(v=>v+1);
  }

  function next(){setSelected("");setFeedback(null);setMessage("");setIndex(v=>v+1)}

  if(loading)return <main className="app-bg"><PortalNav/><div className="app-shell narrow"><section className="panel"><p>Cargando sesión...</p></section></div></main>;
  if(!questions.length&&!exercises.length)return <main className="app-bg"><PortalNav/><div className="app-shell narrow"><section className="panel"><span className="eyebrow">{topicCode}</span><h1>Tema en preparación</h1><p>Aún no hay actividades cargadas para este código.</p><a className="button secondary" href="/practica">Volver al temario</a></section></div></main>;

  if(finished)return <main className="app-bg"><PortalNav/><div className="app-shell">
    <section className="result-hero compact-result"><span className="eyebrow light">Sesión completada · {topicCode}</span><h1>{answered?Math.round(correct/answered*100):0}%</h1><p>{correct} aciertos de {answered} reactivos. La próxima vez el orden cambiará.</p><div className="actions"><a className="button light-button" href={"/practica/"+topicCode.toLowerCase()}>Nueva sesión</a><a className="button hero-secondary" href="/practica">Otro tema</a></div></section>
    {exercises.length>0&&<section className="development-section"><div className="section-intro small"><span className="eyebrow">Sube el nivel</span><h2>Ejercicios de desarrollo</h2><p>Resuélvelos en tu cuaderno. Aquí importa el procedimiento, no solo elegir una opción.</p></div><div className="development-list">{exercises.map(e=><article key={e.id}><div><span className="level-badge">N{e.difficulty}</span><span className="code-badge">{e.source_kind==="challenge"?"Reto":e.source_kind==="integrative"?"Integrador":"Desarrollo"}</span></div><p>{e.prompt}</p>{(e.hint||e.guidance)&&<><button className="text-button" onClick={()=>setHintOpen(hintOpen===e.id?null:e.id)}>{hintOpen===e.id?"Ocultar apoyo":"Ver pista o criterio"}</button>{hintOpen===e.id&&<div className="hint-box">{e.hint||e.guidance}</div>}</>}</article>)}</div></section>}
  </div></main>;

  return <main className="app-bg"><PortalNav/><div className="app-shell">
    <div className="topic-session-head"><div><span className="eyebrow">Sesión por tema · {topicCode}</span><h1>{q?.topic_name??topicCode}</h1><p>Reactivos en orden aleatorio con retroalimentación inmediata.</p></div><div className="session-score"><span>Avance</span><strong>{index+1}/{questions.length}</strong><small>{correct} correctos</small></div></div>

    <div className="topic-session-layout">
      <section className="exam-question practice-question">
        <div className="question-meta"><span>{q.area} · {q.code}</span><span>N{q.difficulty}</span></div>
        {q.stimulus&&<div className="stimulus-box"><span>Texto o caso de referencia</span><p>{q.stimulus}</p></div>}
        <h2 className="question-prompt">{q.prompt}</h2>
        <div className="options">
          {options.map(([letter,value])=><button key={letter} className={"option "+(selected===letter?"selected":"")} disabled={Boolean(feedback)} onClick={()=>setSelected(letter as string)}><strong>{letter}</strong><span>{value}</span></button>)}
        </div>
        {!feedback?<button className="button primary full" disabled={!selected} onClick={check}>Comprobar respuesta</button>:<div className={feedback.is_correct?"feedback correct":"feedback incorrect"}><strong>{feedback.is_correct?"Respuesta correcta":"Respuesta correcta: "+feedback.correct_option}</strong><p>{feedback.explanation??"Revisa el razonamiento y vuelve a intentarlo en otra sesión."}</p><button className="button primary" onClick={next}>{index===questions.length-1?"Terminar sesión":"Siguiente reactivo"}</button></div>}
        {message&&<p className="error">{message}</p>}
      </section>

      <aside className="session-sidebar">
        <span className="eyebrow">Cómo trabajar</span>
        <h3>No memorices la letra.</h3>
        <p>Antes de comprobar, intenta explicar por qué elegiste esa opción. Si fallas, identifica si fue por concepto, lectura, cálculo, condición omitida o justificación.</p>
        <div className="mini-levels"><span><b>N1</b> Fundamentos</span><span><b>N2</b> Aplicación</span><span><b>N3</b> Integración</span><span><b>N4</b> Profundización</span></div>
      </aside>
    </div>
  </div></main>;
}
