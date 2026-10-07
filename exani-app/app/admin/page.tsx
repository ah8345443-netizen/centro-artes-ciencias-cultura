"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  access_status: "active" | "blocked" | "expired";
  course: string | null;
  access_expires_at: string | null;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (me?.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,role,access_status,course,access_expires_at")
      .order("created_at", { ascending: false });

    if (error) setMessage("No fue posible cargar los usuarios.");
    setProfiles((data ?? []) as Profile[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: Profile["access_status"]) {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ access_status: status }).eq("id", id);
    if (error) {
      setMessage("No fue posible actualizar el acceso.");
      return;
    }
    setProfiles((items) => items.map((p) => p.id === id ? { ...p, access_status: status } : p));
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div><p className="eyebrow">Administración</p><h1>Usuarios y accesos</h1></div>
        <a className="button secondary" href="/dashboard">Panel alumno</a>
      </div>

      {message && <p className="error">{message}</p>}

      <section className="panel">
        {loading ? <p>Cargando usuarios...</p> : (
          <div className="table">
            <div className="table-head"><span>Alumno</span><span>Curso</span><span>Estado</span><span>Acción</span></div>
            {profiles.map((u) => (
              <div className="table-row" key={u.id}>
                <span><strong>{u.full_name}</strong><small className="muted">{u.role}</small></span>
                <span>{u.course ?? "Sin asignar"}</span>
                <span>{u.access_status}</span>
                <span className="row-actions">
                  {u.access_status !== "active" && <button className="mini-button" onClick={() => setStatus(u.id, "active")}>Activar</button>}
                  {u.access_status === "active" && u.role !== "admin" && <button className="mini-button danger-button" onClick={() => setStatus(u.id, "blocked")}>Bloquear</button>}
                </span>
              </div>
            ))}
            {profiles.length === 0 && <p>No hay usuarios registrados todavía.</p>}
          </div>
        )}
      </section>
    </main>
  );
}
