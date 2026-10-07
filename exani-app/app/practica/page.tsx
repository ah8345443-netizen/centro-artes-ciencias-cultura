const temas = [
  ["CL1", "Tipos de texto"],
  ["CL2", "Idea principal"],
  ["CL3", "Identificación de información"],
  ["CL4", "Inferencias"],
  ["CL5", "Intención del autor"],
  ["RI1", "Conectores"],
  ["RI2", "Coherencia textual"],
  ["RI3", "Registro lingüístico"],
  ["MT1", "Jerarquía de operaciones"],
  ["MT2", "Fracciones"],
  ["MT3", "Porcentajes"],
  ["MT4", "Razones y proporciones"]
];

export default function PracticaPage() {
  return (
    <main className="shell">
      <div className="topbar"><div><p className="eyebrow">Práctica por tema</p><h1>Elige qué quieres reforzar</h1></div><a className="button secondary" href="/dashboard">Mi progreso</a></div>
      <section className="topic-list">
        {temas.map(([code, name]) => (
          <a className="topic" href={`/practica/${code.toLowerCase()}`} key={code}>
            <strong>{code}</strong><span>{name}</span><em>Niveles 1–3</em>
          </a>
        ))}
      </section>
    </main>
  );
}
