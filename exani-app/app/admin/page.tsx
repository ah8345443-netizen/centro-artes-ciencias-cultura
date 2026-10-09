"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  role: "admin" | "teacher" | "student";
  access_status: "active" | "blocked" | "expired";
  course: "EXANI I" | "EXANI II" | "AMBOS" | null;
  access_expires_at: string | null;
};

type Question = {
  id: string;
  code: string;
  area: "CL" | "RI" | "MT" | "CI";
  topic_code: string;
  topic_name: string;
  difficulty: number;
  stimulus: string | null;
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string | null;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string | null;
  is_active: boolean;
};

type Attempt = {
  user_id: string;
  is_correct: boolean;
  created_at: string;
  questions: { area: string; topic_code: string; topic_name: string }[] | null;
};

type Summary = {
  total_users: number;
  active_users: number;
  blocked_users: number;
  total_questions: number;
  total_attempts: number;
  accuracy: number;
};

type QuestionForm = {
  id: string;
  code: string;
  area: "CL" | "RI" | "MT" | "CI";
  topic_code: string;
  topic_name: string;
  difficulty: number;
  stimulus: string;
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  is_active: boolean;
};

const emptyQuestion: QuestionForm = {
  id: "",
  code: "",
  area: "MT",
  topic_code: "",
  topic_name: "",
  difficulty: 1,
  stimulus: "",
  prompt: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "A",
  explanation: "",
  is_active: true,
};

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "questions" | "results">("users");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    course: "EXANI II",
    access_status: "active",
    access_expires_at: "",
  });

  const [questionForm, setQuestionForm] = useState<QuestionForm>({ ...emptyQuestion });

  async function load() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: me } = await supabase
      .from("profiles")
      .select("role,access_status")
      .eq("id", user.id)
      .single();

    if (me?.role !== "admin" || me?.access_status !== "active") {
      window.location.href = "/dashboard";
      return;
    }

    const [profilesRes, questionsRes, attemptsRes, summaryRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,full_name,email,role,access_status,course,access_expires_at")
        .order("created_at", { ascending: false }),
      supabase.rpc("admin_list_questions"),
      supabase
        .from("attempts")
        .select("user_id,is_correct,created_at,questions(area,topic_code,topic_name)")
        .order("created_at", { ascending: false }),
      supabase.rpc("admin_dashboard_summary"),
    ]);

    if (profilesRes.error || questionsRes.error || attemptsRes.error || summaryRes.error) {
      setMessage("Algunos datos administrativos no pudieron cargarse.");
    }

    setProfiles((profilesRes.data ?? []) as unknown as Profile[]);
    setQuestions((questionsRes.data ?? []) as unknown as Question[]);
    setAttempts((attemptsRes.data ?? []) as unknown as Attempt[]);
    setSummary(((summaryRes.data ?? [])[0] ?? null) as unknown as Summary | null);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function patchProfile(id: string, patch: Partial<Profile>) {
    setProfiles((items) => items.map((p) => p.id === id ? { ...p, ...patch } : p));
  }

  async function saveProfile(profile: Profile) {
    setSaving(true);
    setMessage("");
    setSuccess("");
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        access_status: profile.access_status,
        course: profile.course,
        access_expires_at: profile.access_expires_at || null,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (error) {
      setMessage("No fue posible guardar los cambios del usuario.");
      return;
    }
    setSuccess("Acceso actualizado correctamente.");
  }

  async function createStudent(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setSuccess("");
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: {
        ...newUser,
        access_expires_at: newUser.access_expires_at
          ? new Date(newUser.access_expires_at + "T23:59:59").toISOString()
          : null,
      },
    });

    setSaving(false);
    if (error || data?.error) {
      const detail = data?.error ? String(data.error) : error?.message;
      setMessage(detail?.toLowerCase().includes("already") ? "Ese correo ya está registrado." : "No fue posible crear al alumno.");
      return;
    }

    setSuccess("Alumno creado. Ya puede iniciar sesión con el correo y contraseña temporal.");
    setNewUser({ full_name: "", email: "", password: "", course: "EXANI II", access_status: "active", access_expires_at: "" });
    setShowNewUser(false);
    await load();
  }

  function editQuestion(q: Question) {
    setQuestionForm({
      id: q.id,
      code: q.code,
      area: q.area,
      topic_code: q.topic_code,
      topic_name: q.topic_name,
      difficulty: q.difficulty,
      stimulus: q.stimulus ?? "",
      prompt: q.prompt,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d ?? "",
      correct_option: q.correct_option,
      explanation: q.explanation ?? "",
      is_active: q.is_active,
    });
    setShowQuestionForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveQuestion(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setSuccess("");
    const supabase = createClient();
    const { error } = await supabase.rpc("admin_save_question", {
      requested_id: questionForm.id || null,
      requested_code: questionForm.code.trim().toUpperCase(),
      requested_area: questionForm.area,
      requested_topic_code: questionForm.topic_code.trim().toUpperCase(),
      requested_topic_name: questionForm.topic_name.trim(),
      requested_difficulty: Number(questionForm.difficulty),
      requested_stimulus: questionForm.stimulus.trim(),
      requested_prompt: questionForm.prompt.trim(),
      requested_option_a: questionForm.option_a.trim(),
      requested_option_b: questionForm.option_b.trim(),
      requested_option_c: questionForm.option_c.trim(),
      requested_option_d: questionForm.option_d.trim(),
      requested_correct_option: questionForm.correct_option,
      requested_explanation: questionForm.explanation.trim(),
      requested_is_active: questionForm.is_active,
    });

    setSaving(false);
    if (error) {
      setMessage(error.message.includes("duplicate") ? "El código del reactivo ya existe." : "No fue posible guardar el reactivo.");
      return;
    }

    setSuccess(questionForm.id ? "Reactivo actualizado." : "Reactivo creado.");
    setQuestionForm({ ...emptyQuestion });
    setShowQuestionForm(false);
    await load();
  }

  async function toggleQuestion(q: Question) {
    const supabase = createClient();
    const { error } = await supabase.rpc("admin_set_question_active", {
      requested_id: q.id,
      requested_active: !q.is_active,
    });
    if (error) {
      setMessage("No fue posible cambiar el estado del reactivo.");
      return;
    }
    setQuestions((items) => items.map((item) => item.id === q.id ? { ...item, is_active: !item.is_active } : item));
  }

  const studentResults = useMemo(() => {
    return profiles
      .filter((p) => p.role !== "admin")
      .map((p) => {
        const rows = attempts.filter((a) => a.user_id === p.id);
        const correct = rows.filter((a) => a.is_correct).length;
        const byArea = ["MT", "CL", "RI", "CI"].map((area) => {
          const areaRows = rows.filter((a) => a.questions?.[0]?.area === area);
          const areaCorrect = areaRows.filter((a) => a.is_correct).length;
          return {
            area,
            total: areaRows.length,
            pct: areaRows.length ? Math.round(areaCorrect / areaRows.length * 100) : 0,
          };
        });
        return {
          profile: p,
          total: rows.length,
          correct,
          pct: rows.length ? Math.round(correct / rows.length * 100) : 0,
          byArea,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [profiles, attempts]);

  if (loading) {
    return <main className="shell admin-shell"><section className="panel"><p>Cargando administración...</p></section></main>;
  }

  return (
    <main className="shell admin-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Administración</p>
          <h1 className="admin-heading">Plataforma EXANI</h1>
          <p className="muted-large">Gestiona alumnos, reactivos y resultados desde un solo lugar.</p>
        </div>
        <div className="actions compact"><a className="button secondary" href="/admin/docentes">Docentes</a><a className="button secondary" href="/dashboard">Volver al panel</a></div>
      </div>

      <section className="admin-tabs" aria-label="Secciones de administración">
        <button className={tab === "users" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("users")}>Alumnos</button>
        <button className={tab === "questions" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("questions")}>Reactivos</button>
        <button className={tab === "results" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("results")}>Resultados</button>
      </section>

      {message && <p className="error">{message}</p>}
      {success && <p className="success">{success}</p>}

      {summary && (
        <section className="admin-metrics">
          <article><strong>{summary.total_users}</strong><span>Usuarios</span></article>
          <article><strong>{summary.active_users}</strong><span>Activos</span></article>
          <article><strong>{summary.total_questions}</strong><span>Reactivos</span></article>
          <article><strong>{summary.total_attempts}</strong><span>Respuestas</span></article>
          <article><strong>{Number(summary.accuracy || 0)}%</strong><span>Precisión global</span></article>
        </section>
      )}

      {tab === "users" && (
        <>
          <div className="section-bar">
            <div><h2>Alumnos y accesos</h2><p>Asigna curso, estado y vencimiento.</p></div>
            <button className="button primary" onClick={() => setShowNewUser((v) => !v)}>
              {showNewUser ? "Cancelar" : "Nuevo alumno"}
            </button>
          </div>

          {showNewUser && (
            <form className="panel admin-form" onSubmit={createStudent}>
              <h2>Crear alumno</h2>
              <div className="form-grid">
                <label>Nombre completo<input required value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} /></label>
                <label>Correo<input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} /></label>
                <label>Contraseña temporal<input type="password" minLength={8} required value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} /></label>
                <label>Curso<select value={newUser.course} onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}><option>EXANI I</option><option>EXANI II</option><option>AMBOS</option></select></label>
                <label>Estado<select value={newUser.access_status} onChange={(e) => setNewUser({ ...newUser, access_status: e.target.value })}><option value="active">Activo</option><option value="blocked">Bloqueado</option></select></label>
                <label>Vence<input type="date" value={newUser.access_expires_at} onChange={(e) => setNewUser({ ...newUser, access_expires_at: e.target.value })} /></label>
              </div>
              <button className="button primary" disabled={saving}>{saving ? "Creando..." : "Crear alumno"}</button>
            </form>
          )}

          <section className="admin-list">
            {profiles.map((u) => (
              <article className="admin-user" key={u.id}>
                <div className="admin-user-main">
                  <div>
                    <strong>{u.full_name}</strong>
                    <span>{u.email ?? "Sin correo"}</span>
                    <small>{u.role}</small>
                  </div>
                  <span className={`status-pill ${u.access_status}`}>{u.access_status}</span>
                </div>
                <div className="admin-user-controls">
                  <label>Curso
                    <select disabled={u.role === "admin"} value={u.course ?? ""} onChange={(e) => patchProfile(u.id, { course: (e.target.value || null) as Profile["course"] })}>
                      <option value="">Sin asignar</option><option value="EXANI I">EXANI I</option><option value="EXANI II">EXANI II</option><option value="AMBOS">Ambos</option>
                    </select>
                  </label>
                  <label>Estado
                    <select disabled={u.role === "admin"} value={u.access_status} onChange={(e) => patchProfile(u.id, { access_status: e.target.value as Profile["access_status"] })}>
                      <option value="active">Activo</option><option value="blocked">Bloqueado</option><option value="expired">Vencido</option>
                    </select>
                  </label>
                  <label>Vencimiento
                    <input disabled={u.role === "admin"} type="date" value={u.access_expires_at ? u.access_expires_at.slice(0, 10) : ""} onChange={(e) => patchProfile(u.id, { access_expires_at: e.target.value ? new Date(e.target.value + "T23:59:59").toISOString() : null })} />
                  </label>
                  {u.role !== "admin" && <button className="button secondary" disabled={saving} onClick={() => saveProfile(u)}>Guardar</button>}
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {tab === "questions" && (
        <>
          <div className="section-bar">
            <div><h2>Banco de reactivos</h2><p>{questions.filter((q) => q.is_active).length} activos de {questions.length} registrados.</p></div>
            <button className="button primary" onClick={() => { setQuestionForm({ ...emptyQuestion }); setShowQuestionForm((v) => !v); }}>
              {showQuestionForm ? "Cancelar" : "Nuevo reactivo"}
            </button>
          </div>

          {showQuestionForm && (
            <form className="panel admin-form" onSubmit={saveQuestion}>
              <h2>{questionForm.id ? "Editar reactivo" : "Nuevo reactivo"}</h2>
              <div className="form-grid">
                <label>Código<input required value={questionForm.code} onChange={(e) => setQuestionForm({ ...questionForm, code: e.target.value })} placeholder="MT5-001" /></label>
                <label>Área<select value={questionForm.area} onChange={(e) => setQuestionForm({ ...questionForm, area: e.target.value as Question["area"] })}><option>CL</option><option>RI</option><option>MT</option><option>CI</option></select></label>
                <label>Código de tema<input required value={questionForm.topic_code} onChange={(e) => setQuestionForm({ ...questionForm, topic_code: e.target.value })} placeholder="MT5" /></label>
                <label>Nombre del tema<input required value={questionForm.topic_name} onChange={(e) => setQuestionForm({ ...questionForm, topic_name: e.target.value })} /></label>
                <label>Dificultad<select value={questionForm.difficulty} onChange={(e) => setQuestionForm({ ...questionForm, difficulty: Number(e.target.value) })}><option value={1}>Nivel 1</option><option value={2}>Nivel 2</option><option value={3}>Nivel 3</option><option value={4}>Nivel 4</option></select></label>
                <label>Respuesta correcta<select value={questionForm.correct_option} onChange={(e) => setQuestionForm({ ...questionForm, correct_option: e.target.value as Question["correct_option"] })}><option>A</option><option>B</option><option>C</option><option>D</option></select></label>
              </div>
              <label>Texto o caso de referencia<textarea rows={4} value={questionForm.stimulus} onChange={(e) => setQuestionForm({ ...questionForm, stimulus: e.target.value })} placeholder="Opcional: lectura, caso, tabla descrita o contexto compartido" /></label>
              <label>Enunciado<textarea required rows={4} value={questionForm.prompt} onChange={(e) => setQuestionForm({ ...questionForm, prompt: e.target.value })} /></label>
              <div className="form-grid">
                <label>Opción A<input required value={questionForm.option_a} onChange={(e) => setQuestionForm({ ...questionForm, option_a: e.target.value })} /></label>
                <label>Opción B<input required value={questionForm.option_b} onChange={(e) => setQuestionForm({ ...questionForm, option_b: e.target.value })} /></label>
                <label>Opción C<input required value={questionForm.option_c} onChange={(e) => setQuestionForm({ ...questionForm, option_c: e.target.value })} /></label>
                <label>Opción D<input value={questionForm.option_d} onChange={(e) => setQuestionForm({ ...questionForm, option_d: e.target.value })} /></label>
              </div>
              <label>Explicación<textarea rows={3} value={questionForm.explanation} onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })} /></label>
              <label className="checkbox-line"><input type="checkbox" checked={questionForm.is_active} onChange={(e) => setQuestionForm({ ...questionForm, is_active: e.target.checked })} /> Reactivo activo</label>
              <button className="button primary" disabled={saving}>{saving ? "Guardando..." : "Guardar reactivo"}</button>
            </form>
          )}

          <section className="question-admin-list">
            {questions.map((q) => (
              <article className="question-admin-card" key={q.id}>
                <div>
                  <span className="code-badge">{q.code}</span>
                  <span className="level-badge">Nivel {q.difficulty}</span>
                  {!q.is_active && <span className="inactive-badge">Inactivo</span>}
                </div>
                <h3>{q.topic_name}</h3>
                <p>{q.prompt}</p>
                <small>Correcta: {q.correct_option}</small>
                <div className="row-actions">
                  <button className="mini-button" onClick={() => editQuestion(q)}>Editar</button>
                  <button className={q.is_active ? "mini-button danger-button" : "mini-button"} onClick={() => toggleQuestion(q)}>{q.is_active ? "Desactivar" : "Activar"}</button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {tab === "results" && (
        <>
          <div className="section-bar">
            <div><h2>Resultados por alumno</h2><p>Desempeño acumulado a partir de respuestas registradas.</p></div>
          </div>
          <section className="results-admin-list">
            {studentResults.map((r) => (
              <article className="result-admin-card" key={r.profile.id}>
                <div className="result-head">
                  <div><strong>{r.profile.full_name}</strong><span>{r.profile.course ?? "Sin curso"}</span></div>
                  <div className="result-score"><strong>{r.pct}%</strong><span>{r.total} respuestas</span></div>
                </div>
                <div className="area-mini-grid">
                  {r.byArea.map((a) => <div key={a.area}><strong>{a.area}</strong><span>{a.total ? a.pct + "%" : "Sin datos"}</span><small>{a.total} intentos</small></div>)}
                </div>
              </article>
            ))}
            {studentResults.length === 0 && <section className="panel"><p>Aún no hay alumnos para mostrar.</p></section>}
          </section>
        </>
      )}
    </main>
  );
}
