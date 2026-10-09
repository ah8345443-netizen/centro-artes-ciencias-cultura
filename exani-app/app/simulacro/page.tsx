"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import PortalNav from "../../components/portal-nav";

type Question = {
  session_id:string; item_position:number; question_id:string; code:string; area:string;
  topic_code:string; topic_name:string; difficulty:number; stimulus:string|null; prompt:string;
  option_a:string; option_b:string; option_c:string; option_d:string|null;
};

type Result = {
  session_id:string; correct:number; answered:number; total:number; percentage:number;
  areas:Record<string,{answered:number;correct:number;percentage:number}>;
};

const subjectNames:Record<string,string>={
  MT:"Matemáticas",
  CL:"Comprensión lectora",
  RI:"Redacción y lenguaje",
  CI:"Pensamiento científico",
  ALL:"Evaluación general",
};

const areaName:Record<string,string>={
  MT:"Matemáticas",CL:"Comprensión lectora",RI:"Redacción y lenguaje",CI:"Pensamiento científico"
};

export default function SimulacroPage(){
  const [area,setArea]=useState("MT");
  const [count,setCount]=useState(20);
  const [difficulty,setDifficulty]=useState<string>("all");
  const [topic,setTopic]=useState<string>("");
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
    const p=new URLSearchParams(window.location.search);
    const subject=(p.get("materia")||"MT").toUpperCase();
    if(subjectNames[subject])setArea(subject);
    const amount=Number(p.get("cantidad")||20);
    if(Number.isFinite(amount))setCount(Math.min(50,Math.max(5,amount)));
    const level=p.get("nivel");
    if(level&&["1","2","3"].includes(level))setDifficulty(level);
    const t=p.get("tema");
    if(t)setTopic(t.toUpperCase());
  },[]);

  const current=questions[index];
  const answeredCount=Object.keys(answers).length;
  const progress=questions.length?Math.round(answeredCount/questions.length*100):0;
  const options=useMemo(()=>current?[
    ["A",current.option_a],["B",current.option_b],["C",current.option_c],["D",current.option_d]
  ].filter(([,v])=>Boolean(v)):[],[current]);

  const title=topic?("Evaluación de "+topic):(subjectNames[area]||"Evaluación");
  const queryString=()=>{
    const p=new URLSearchParams();
    p.set("materia",area);p.set("cantidad",String(count));
    if(difficulty!=="all")p.set("nivel",difficulty);
    if(topic)p.set("tema",topic);
    return p.toString();
  };

  async function start(){
    setLoading(true);setMessage("");setResult(null);
    const supabase=createClient();
    const {data,error}=await supabase.rpc("start_evaluation",{
      requested_area:area==="ALL"?null:area,
      requested_count:count,
      requested_difficulty:difficulty==="all"?null:Number(difficulty),
      requested_topic:topic||null,
    });
    setLoading(false);
    if(error||!data?.length){
      setMessage(difficulty==="all"
        ?"No hay suficientes reactivos disponibles para esta configuración."
        :"No hay reactivos disponibles en ese nivel. Prueba con «Todos los niveles».");
      return;
    }
    const rows=data as unknown as Question[];
    setQuestions(rows);setSessionId(rows[0].session_id);setAnswers({});setIndex(0);setStarted(true);
  }

  async function choose(letter:string){
    if(!current)return;
    setAnswers(prev=>({...prev,[current.question_id]:letter}));
    const supabase=createClient();
    const {error}=await supabase.rpc("submit_simulation_answer",{
      requested_session_id:sessionId,
      requested_question_id:current.question_id,
      requested_option:letter,
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
        <span className="eyebrow light">Evaluación finalizada · {title}</span>
        <h1>{result.percentage}%</h1>
        <p>{result.correct} aciertos de {result.total} reactivos.</p>
        <div className="actions">
          <a className="button light-button" href="/resultados">Analizar resultados</a>
          <a className="button hero-secondary" href={"/simulacro?"+queryString()}>Nueva combinación</a>
        </div>
      </section>
      <section className="result-area-grid">
        {Object.entries(result.areas??{}).map(([a,value])=><article key={a}>
          <span className={"area-icon "+(a==="MT"?"math":a==="CL"?"reading":a==="RI"?"writing":"science")}>{a}</span>
          <div><strong>{Number(value.percentage)}%</strong><small>{areaName[a]??a} · {value.correct}/{value.answered}</small></div>
        </article>)}
      </section>
      <section className="simulation-note"><strong>Siguiente paso</strong><p>Revisa tus temas con menor porcentaje en Resultados. Puedes volver a evaluar la misma materia o practicar un tema específico antes del siguiente intento.</p></section>
    </div></main>
  }

  if(!started){
    return <main className="app-bg"><PortalNav/><div className="app-shell">
      <section className="start-simulation evaluation-config">
        <span className="eyebrow">Configurar evaluación</span>
        <h1>{title}</h1>
        <p>El sistema elegirá reactivos al azar de la materia seleccionada. Puedes ajustar la extensión y la dificultad antes de comenzar.</p>

        <div className="evaluation-config-grid">
          {!topic&&<label>Materia
            <select value={area} onChange={e=>setArea(e.target.value)}>
              <option value="MT">Matemáticas</option>
              <option value="CL">Comprensión lectora</option>
              <option value="RI">Redacción y lenguaje</option>
              <option value="CI">Pensamiento científico</option>
              <option value="ALL">Todas las materias</option>
            </select>
          </label>}
          <label>Cantidad de reactivos
            <select value={count} onChange={e=>setCount(Number(e.target.value))}>
              <option value={10}>10 reactivos</option>
              <option value={20}>20 reactivos</option>
              <option value={30}>30 reactivos</option>
              <option value={40}>40 reactivos</option>
              <option value={50}>50 reactivos</option>
            </select>
          </label>
          <label>Dificultad
            <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
              <option value="all">Todos los niveles</option>
              <option value="1">N1 · Fundamentos</option>
              <option value="2">N2 · Aplicación</option>
              <option value="3">N3 · Integración</option>
            </select>
          </label>
        </div>

        <div className="preflight-grid">
          <div><strong>Aleatoria</strong><span>Nueva combinación</span></div>
          <div><strong>{count}</strong><span>Reactivos solicitados</span></div>
          <div><strong>{difficulty==="all"?"N1–N3":"N"+difficulty}</strong><span>Dificultad</span></div>
        </div>
        <p className="evaluation-tip">Los retos N4 y problemas integradores están disponibles como actividades abiertas en la sección Materias.</p>
        {message&&<p className="error">{message}</p>}
        <button className="button primary large" disabled={loading} onClick={start}>{loading?"Construyendo evaluación...":"Comenzar evaluación"}</button>
        <a className="text-button block" href="/simulaciones">← Elegir otra materia</a>
      </section>
    </div></main>
  }

  return <main className="app-bg"><PortalNav/><div className="exam-shell">
    <header className="exam-header">
      <div><span className="eyebrow">{title}</span><strong>Reactivo {index+1} de {questions.length}</strong></div>
      <div className="exam-progress"><span>{answeredCount} respondidos</span><div className="progress"><div style={{width:progress+"%"}}/></div></div>
    </header>

    <div className="exam-layout">
      <section className="exam-question">
        <div className="question-meta"><span>{areaName[current.area]??current.area} · {current.topic_name}</span><span>N{current.difficulty}</span><span>{current.code}</span></div>
        {current.stimulus&&<div className="stimulus-box"><span>Texto o caso de referencia</span><p>{current.stimulus}</p></div>}
        <h1 className="question-prompt">{current.prompt}</h1>
        <div className="options exam-options">
          {options.map(([letter,value])=><button key={letter} type="button" className={"option "+(answers[current.question_id]===letter?"selected":"")} onClick={()=>choose(letter as string)}><strong>{letter}</strong><span>{value}</span></button>)}
        </div>
        {message&&<p className="error">{message}</p>}
        <div className="exam-actions">
          <button className="button secondary" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>Anterior</button>
          {index<questions.length-1
            ?<button className="button primary" onClick={()=>setIndex(i=>Math.min(questions.length-1,i+1))}>Siguiente</button>
            :<button className="button primary" disabled={finishing} onClick={finish}>{finishing?"Calculando...":"Finalizar evaluación"}</button>}
        </div>
      </section>

      <aside className="question-navigator">
        <div><strong>Navegador</strong><span>Puedes volver a cualquier reactivo antes de entregar.</span></div>
        <div className="number-grid">{questions.map((q,i)=><button key={q.question_id} className={(i===index?"current ":"")+(answers[q.question_id]?"answered":"")} onClick={()=>setIndex(i)}>{i+1}</button>)}</div>
        <div className="navigator-key"><span><i className="key-dot answered"/>Respondido</span><span><i className="key-dot current"/>Actual</span></div>
        {answeredCount===questions.length&&<button className="button primary full" disabled={finishing} onClick={finish}>{finishing?"Calculando...":"Entregar evaluación"}</button>}
      </aside>
    </div>
  </div></main>;
}
