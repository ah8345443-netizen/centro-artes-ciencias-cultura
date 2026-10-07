"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Question = {
  id: string;
  code: string;
  topic_code: string;
  topic_name: string;
  difficulty: number;
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string | null;
  correct_option: string;
  explanation: string | null;
};

export default function TopicPracticePage({ params }: { params: Promise<{ codigo: string }> }) {
  const [topicCode, setTopicCode] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then(({ codigo }) => setTopicCode(codigo.toUpperCase()));
  }, [params]);

  useEffect(() => {
    if (!topicCode) return;
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_code", topicCode)
        .eq("is_active", true)
        .order("difficulty", { ascending: true });
      if (error) setMessage("No fue posible cargar los reactivos.");
      setQuestions((data ?? []) as Question[]);
      setLoading(false);
    };
    load();
  }, [topicCode]);

  const q = questions[index];
  const options = useMemo(() => q ? [
    ["A", q.option_a],
    ["B", q.option_b],
    ["C", q.option_c],
    ["D", q.option_d],
  ].filter(([, value]) => Boolean(value)) : [], [q]);

  async function checkAnswer() {
    if (!q || !selected) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const correct = selected === q.correct_option;
    await supabase.from("attempts").insert({
      user_id: user.id,
      question_id: q.id,
      selected_option: selected,
      is_correct: correct,
    });
    setChecked(true);
  }

  function next() {
    setSelected("");
    setChecked(false);
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  if (loading) return <main className="shell narrow"><section className="panel"><p>Cargando práctica...</p></section></main>;
  if (!q) return <main className="shell narrow"><section className="panel"><p className="eyebrow">{topicCode}</p><h1>Próximamente</h1><p>Aún no hay reactivos cargados para este tema.</p><a className="button secondary" href="/practica">Volver</a></section></main>;

  return (
    <main className="shell narrow">
      <section className="panel">
        <div className="question-meta"><span>{q.code}</span><span>Nivel {q.difficulty}</span><span>{index + 1}/{questions.length}</span></div>
        <h1 className="question-title">{q.topic_name}</h1>
        <p className="question-prompt">{q.prompt}</p>

        <div className="options">
          {options.map(([letter, value]) => (
            <button
              key={letter}
              type="button"
              className={`option ${selected === letter ? "selected" : ""}`}
              onClick={() => !checked && setSelected(letter as string)}
            >
              <strong>{letter}</strong><span>{value}</span>
            </button>
          ))}
        </div>

        {!checked ? (
          <button className="button primary full" disabled={!selected} onClick={checkAnswer}>Comprobar respuesta</button>
        ) : (
          <div className={selected === q.correct_option ? "feedback correct" : "feedback incorrect"}>
            <strong>{selected === q.correct_option ? "Correcto" : `Respuesta correcta: ${q.correct_option}`}</strong>
            <p>{q.explanation ?? "Revisa el procedimiento y vuelve a intentarlo."}</p>
            {index < questions.length - 1 ? (
              <button className="button primary" onClick={next}>Siguiente reactivo</button>
            ) : (
              <a className="button primary" href="/resultados">Ver resultados</a>
            )}
          </div>
        )}
        {message && <p className="error">{message}</p>}
      </section>
    </main>
  );
}
