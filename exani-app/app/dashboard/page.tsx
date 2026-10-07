"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import LogoutButton from "../../components/logout-button";

type Attempt = { is_correct: boolean; questions: { area: string } | null };
type Profile = { full_name: string; role: string; access_status: string; access_expires_at: string | null };

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const [{ data: p }, { data: a }] = await Promise.all([
        supabase.from("profiles").select("full_name,role,access_status,access_expires_at").eq("id", user.id).single(),
        supabase.from("attempts").select("is_correct, questions(area)")
      ]);
      setProfile(p as Profile | null);
      setAttempts((a ?? []) as Attempt[]);
      setLoading(false);
    };
    load();
  }, []);

  const areas = useMemo(() => ["CL","RI","MT"].map((code) => {
    const rows=attempts.filter((a)=>a.questions?.area===code);
    const correct=rows.filter((a)=>a.is_correct).length;
    return { code, total: rows.length, progress: rows.length ? Math.round(correct/rows.length*100) : 0 };
  }), [attempts]);

  if (loading) return <main className="shell"><section className="panel"><p>Cargando panel...</p></section></main>;

  const expired = profile?.access_expires_at && new Date(profile.access_expires_at) < new Date();
  if (!profile || profile.access_status !== "active" || expired) {
    return <main className="shell narrow"><section className="panel">
      <p className="eyebrow">Acceso</p><h1>Cuenta sin acceso activo</h1>
      <p>Tu cuenta está bloqueada, vencida o pendiente de activación. Contacta al centro para habilitarla.</p>
      <LogoutButton />
    </section></main>;
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div><p className="eyebrow">Panel del alumno</p><h1>Hola, {profile.full_name}</h1></div>
        <div className="actions compact">
          {profile.role === "admin" && <a className="button secondary" href="/admin">Administración</a>}
          <LogoutButton />
        </div>
      </div>
      <section className="grid">
        {areas.map((area) => (
          <article className="card" key={area.code}>
            <span>{area.code}</span>
            <h2>{area.total ? `${area.progress}%` : "Sin datos"}</h2>
            <p>{area.total} respuestas registradas</p>
            <div className="progress"><div style={{ width: `${area.progress}%` }} /></div>
          </article>
        ))}
      </section>
      <section className="panel">
        <h2>Continuar estudiando</h2>
        <div className="actions">
          <a className="button primary" href="/practica">Práctica por tema</a>
          <a className="button secondary" href="/simulacro">Simulacro</a>
          <a className="button secondary" href="/resultados">Resultados</a>
        </div>
      </section>
    </main>
  );
}
