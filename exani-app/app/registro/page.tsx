"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function RegistroPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: "https://exani-colima-2026.vercel.app/login",
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setMessage("Cuenta creada. Tu acceso queda pendiente de aprobación por el administrador.");
    } else {
      setMessage("Cuenta creada. Revisa tu correo para confirmar la cuenta y después inicia sesión.");
    }

    setLoading(false);
  }

  return (
    <main className="shell narrow">
      <form className="panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Registro de estudiantes</p>
        <h1>Crear cuenta</h1>
        <p>Tu cuenta se crea bloqueada. Un administrador debe activarla antes de que puedas acceder a los reactivos.</p>

        <label>Nombre completo</label>
        <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre y apellidos" />

        <label>Correo electrónico</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />

        <label>Contraseña</label>
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />

        {errorMessage && <p className="error">{errorMessage}</p>}
        {message && <p className="success">{message}</p>}

        <button className="button primary full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <a className="text-link" href="/login">Ya tengo cuenta</a>
      </form>
    </main>
  );
}
