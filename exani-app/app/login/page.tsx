"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <main className="shell narrow">
      <section className="panel">
        <p className="eyebrow">Acceso de estudiantes</p>
        <h1>Iniciar sesión</h1>
        <p>Esta pantalla quedará conectada a Supabase Auth cuando agreguemos las claves del proyecto.</p>
        <label>Correo electrónico</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alumno@correo.com" />
        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" />
        <button className="button primary full">Entrar</button>
        <a className="text-link" href="/">Volver al inicio</a>
      </section>
    </main>
  );
}
