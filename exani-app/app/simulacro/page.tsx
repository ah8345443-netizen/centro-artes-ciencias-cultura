export default function SimulacroPage() {
  return (
    <main className="shell narrow">
      <section className="panel">
        <p className="eyebrow">Simulacro EXANI</p>
        <h1>Simulacro general</h1>
        <p>El motor quedará preparado para seleccionar reactivos por área, nivel y dificultad, registrar respuestas y calcular resultados.</p>
        <div className="stat-row"><div><strong>3</strong><span>Áreas</span></div><div><strong>1–3</strong><span>Niveles</span></div><div><strong>Auto</strong><span>Calificación</span></div></div>
        <button className="button primary full">Comenzar simulacro</button>
      </section>
    </main>
  );
}
