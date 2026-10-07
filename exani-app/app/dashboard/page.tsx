const areas = [
  { code: "CL", name: "Comprensión lectora", progress: 76 },
  { code: "RI", name: "Redacción indirecta", progress: 68 },
  { code: "MT", name: "Matemáticas", progress: 61 },
];

export default function DashboardPage() {
  return (
    <main className="shell">
      <div className="topbar">
        <div><p className="eyebrow">Panel del alumno</p><h1>Mi progreso</h1></div>
        <a className="button secondary" href="/practica">Practicar</a>
      </div>
      <section className="grid">
        {areas.map((area) => (
          <article className="card" key={area.code}>
            <span>{area.code}</span>
            <h2>{area.name}</h2>
            <strong className="score">{area.progress}%</strong>
            <div className="progress"><div style={{ width: `${area.progress}%` }} /></div>
          </article>
        ))}
      </section>
      <section className="panel">
        <h2>Accesos rápidos</h2>
        <div className="actions">
          <a className="button primary" href="/practica">Práctica por tema</a>
          <a className="button secondary" href="/simulacro">Simulacro</a>
          <a className="button secondary" href="/resultados">Resultados</a>
        </div>
      </section>
    </main>
  );
}
