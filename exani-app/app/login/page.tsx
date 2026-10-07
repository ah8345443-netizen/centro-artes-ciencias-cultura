"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="shell narrow">
      <form className="panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Acceso de estudiantes</p>
        <h1>Iniciar sesión</h1>
        <p>Ingresa con la cuenta autorizada por el centro.</p>
        <label>Correo electrónico</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alumno@correo.com" />
        <label>Contraseña</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        {error && <p className="error">{error}</p>}
        <button className="button primary full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <a className="text-link" href="/">Volver al inicio</a>
      </form>
    </main>
  );
}
