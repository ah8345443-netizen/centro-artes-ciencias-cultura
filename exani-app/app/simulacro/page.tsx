"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Question = {
  id: string; code: string; area: string; prompt: string; option_a: string; option_b: string;
  option_c: string; option_d: string | null; correct_option: string; explanation: string | null;
};

export default function SimulacroPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  async function start() {
    const supabase = createClient();
    const { data } = await supabase.from("questions").select("*").eq("is_active", true).limit(60);
    const shuffled = [...(data ?? [])].sort(() => Math.random() - 0.5).slice(0, 20) as Question[];
    setQuestions(shuffled);
    setStarted(true);
  }

  async function answer() {
    const q = questions[index];
    if (!q || !selected) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const correct = selected === q.correct_option;
    if (correct) setScore((s) => s + 1);
    await supabase.from("attempts").insert({
      user_id: user.id,
      question_id: q.id,
      selected_option: selected,
      is_correct: correct,
    });
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected("");
    }
  }

  if (!started) return (
    <main className="shell narrow"><section className="panel">
      <p className="eyebrow">Simulacro EXANI</p><h1>Simulacro general</h1>
      <p>Se seleccionarán hasta 20 reactivos disponibles de CL, RI y MT. Cada respuesta quedará registrada en tu historial.</p>
      <button className="button primary full" onClick={start}>Comenzar simulacro</button>
    </section></main>
  );

  if (finished) return (
    <main className="shell narrow"><section className="panel">
      <p className="eyebrow">Resultado</p><h1>{score} / {questions.length}</h1>
      <p>Tu resultado ya fue guardado. Puedes revisar tu desempeño por área en Resultados.</p>
      <a className="button primary full" href="/resultados">Ver resultados</a>
    </section></main>
  );

  const q=questions[index];
  const opts=[["A",q.option_a],["B",q.option_b],["C",q.option_c],["D",q.option_d]].filter(([,v])=>Boolean(v));
  return (
    <main className="shell narrow"><section className="panel">
      <div className="question-meta"><span>{q.area}</span><span>{q.code}</span><span>{index+1}/{questions.length}</span></div>
      <p className="question-prompt">{q.prompt}</p>
      <div className="options">{opts.map(([l,v])=><button key={l} className={`option ${selected===l?"selected":""}`} onClick={()=>setSelected(l as string)}><strong>{l}</strong><span>{v}</span></button>)}</div>
      <button className="button primary full" disabled={!selected} onClick={answer}>Guardar y continuar</button>
    </section></main>
  );
}
