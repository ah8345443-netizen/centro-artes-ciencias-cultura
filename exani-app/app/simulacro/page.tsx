"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import PortalNav from "../../components/portal-nav";

type Question = {
  session_id: string;
  item_position: number;
  question_id: string;
  code: string;
  area: string;
  topic_code: string;
  topic_name: string;
  difficulty: number;
  stimulus: string | null;
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string | null;
};

type Result = {
  session_id: string;
  correct: number;
  answered: number;
  total: number;
  percentage: number;
  areas: Record<string,{answered:number;correct:number;percentage:number}>;
};

const modeMeta: Record<string,{title:string;description:string}> = {
  quick:{title:"Simulación rápida",description:"12 reactivos para una sesión breve."},
  diagnostic:{title:"Diagnóstico aleatorio",description:"24 reactivos para obtener una línea base de las cuatro áreas."},
  standard:{title:"Simulación estándar",description:"30 reactivos con una distribución equilibrada de las áreas."},
  intensive:{title:"Simulación intensiva",description:"50 reactivos para entrenar concentración y resistencia."},
  math:{title:"Reto matemático",description:"30 reactivos aleatorios de los 29 temas matemáticos."},
  advanced:{title:"Nivel avanzado",description:"24 reactivos centrados en integración y mayor demanda cognitiva."},
};

const areaName:Record<string,string>={MT:"Matemáticas",CL:"Lectura",RI:"Redacción",CI:"Ciencia"};

export default function SimulacroPage() {
  const [mode,setMode]=useState("standard");
  const [questions,setQuestions]=useState<Question[]>([]);
  const [sessionId,setSessionId]=useState("");
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [started,setStarted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [finishing,setFinishing]=useState(false);
  const [result,setResult]=useState<Result|null>(null);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    const value=new URLSearchParams(window.location.search).get("modo");
    if(value&&modeMeta[value])setMode(value);
  },[]);

  const current=questions[index];
  const answeredCount=Object.keys(answers).length;
  const progress=questions.length?Math.round(answeredCount/questions.length*100):0;
  const options=useMemo(()=>current?[
    ["A",current.option_a],["B",current.option_b],["C",current.option_c],["D",current.option_d]
  ].filter(([,v])=>Boolean(v)):[],[current]);

  async function start(){
    setLoading(true);setMessage("");setResult(null);
    const supabase=createClient();
    const {data,error}=await supabase.rpc("start_simulation",{requested_mode:mode});
    setLoading(false);
    if(error||!data?.length){setMessage("No fue posible construir la simulación. Intenta de nuevo.");return;}
    const rows=data as unknown as Question[];
    setQuestions(rows);
    setSessionId(rows[0].session_id);
    setAnswers({});
    setIndex(0);
    setStarted(true);
  }

  async function choose(letter:string){
    if(!current)return;
    setAnswers(prev=>({...prev,[current.question_id]:letter}));
    const supabase=createClient();
    const {error}=await supabase.rpc("submit_simulation_answer",{
      requested_session_id:sessionId,
      requested_question_id:current.question_id,
      requested_option:letter
    });
    if(error)setMessage("La respuesta no se pudo sincronizar. Vuelve a seleccionarla.");
    else setMessage("");
  }

  async function finish(){
    if(answeredCount<questions.length){setMessage("Responde todos los reactivos antes de finalizar.");return;}
    setFinishing(true);setMessage("");
    const supabase=createClient();
    const {data,error}=await supabase.rpc("finish_simulation",{requested_session_id:sessionId});
    setFinishing(false);
    if(error||!data){setMessage("No fue posible calcular el resultado.");return;}
    setResult(data as unknown as Result);
  }

  if(result){
    return <main className="app-bg"><PortalNav/><div className="app-shell">
      <section className="result-hero">
        <span className="eyebrow light">Simulación finalizada</span>
        <h1>{result.percentage}%</h1>
        <p>{result.correct} aciertos de {result.total} reactivos.</p>
        <div className="actions"><a className="button light-button" href="/resultados">Analizar resultados</a><a className="button hero-secondary" href={"/simulacro?modo="+mode}>Nueva combinación</a></div>
      </section>
      <section className="result-area-grid">
        {Object.entries(result.areas??{}).map(([area,value])=><article key={area}><span className={"area-icon "+(area==="MT"?"math":area==="CL"?"reading":area==="RI"?"writing":"science")}>{area}</span><div><strong>{Number(value.percentage)}%</strong><small>{areaName[area]??area} · {value.correct}/{value.answered}</small></div></article>)}
      </section>
      <section className="simulation-note"><strong>Siguiente paso</strong><p>Revisa los temas con menor porcentaje en Resultados y trabaja una sesión por tema antes de repetir la simulación. Al repetirla, recibirás una combinación nueva.</p></section>
    </div></main>
  }

  if(!started){
    const meta=modeMeta[mode];
    return <main className="app-bg"><PortalNav/><div className="app-shell">
      <section className="start-simulation">
        <span className="eyebrow">Preparar sesión</span>
        <h1>{meta.title}</h1>
        <p>{meta.description} Los reactivos se seleccionan aleatoriamente al iniciar y quedan asociados a esta sesión.</p>
        <div className="preflight-grid"><div><strong>Aleatorio</strong><span>Combinación nueva</span></div><div><strong>N1–N4</strong><span>Dificultad progresiva</span></div><div><strong>4 áreas</strong><span>Según modalidad</span></div></div>
        {message&&<p className="error">{message}</p>}
        <button className="button primary large" disabled={loading} onClick={start}>{loading?"Construyendo sesión...":"Comenzar ahora"}</button>
        <a className="text-button block" href="/simulaciones">← Elegir otra modalidad</a>
      </section>
    </div></main>
  }

  return <main className="app-bg"><PortalNav/><div className="exam-shell">
    <header className="exam-header">
      <div><span className="eyebrow">{modeMeta[mode].title}</span><strong>Reactivo {index+1} de {questions.length}</strong></div>
      <div className="exam-progress"><span>{answeredCount} respondidos</span><div className="progress"><div style={{width:progress+"%"}}/></div></div>
    </header>

    <div className="exam-layout">
      <section className="exam-question">
        <div className="question-meta"><span>{current.area} · {current.topic_code}</span><span>N{current.difficulty}</span><span>{current.code}</span></div>
        {current.stimulus&&<div className="stimulus-box"><span>Texto o caso de referencia</span><p>{current.stimulus}</p></div>}
        <h1 className="question-prompt">{current.prompt}</h1>
        <div className="options exam-options">
          {options.map(([letter,value])=><button key={letter} type="button" className={"option "+(answers[current.question_id]===letter?"selected":"")} onClick={()=>choose(letter as string)}><strong>{letter}</strong><span>{value}</span></button>)}
        </div>
        {message&&<p className="error">{message}</p>}
        <div className="exam-actions">
          <button className="button secondary" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>Anterior</button>
          {index<questions.length-1?<button className="button primary" onClick={()=>setIndex(i=>Math.min(questions.length-1,i+1))}>Siguiente</button>:<button className="button primary" disabled={finishing} onClick={finish}>{finishing?"Calculando...":"Finalizar simulación"}</button>}
        </div>
      </section>

      <aside className="question-navigator">
        <div><strong>Navegador</strong><span>Puedes volver a cualquier reactivo antes de finalizar.</span></div>
        <div className="number-grid">{questions.map((q,i)=><button key={q.question_id} className={(i===index?"current ":"")+(answers[q.question_id]?"answered":"")} onClick={()=>setIndex(i)}>{i+1}</button>)}</div>
        <div className="navigator-key"><span><i className="key-dot answered"/>Respondido</span><span><i className="key-dot current"/>Actual</span></div>
        {answeredCount===questions.length&&<button className="button primary full" disabled={finishing} onClick={finish}>{finishing?"Calculando...":"Entregar sesión"}</button>}
      </aside>
    </div>
  </div></main>;
}
