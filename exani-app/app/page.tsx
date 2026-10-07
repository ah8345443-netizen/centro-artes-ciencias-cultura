export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Centro de Artes, Ciencias y Cultura</p>
        <h1>Plataforma EXANI 2026</h1>
        <p className="lead">
          Practica por área, resuelve simulacros y revisa tu progreso desde una sola plataforma.
        </p>
        <div className="actions">
          <a className="button primary" href="/login">Iniciar sesión</a>
          <a className="button secondary" href="/practica">Explorar práctica</a>
        </div>
      </section>
      <section className="grid">
        <article className="card"><span>CL</span><h2>Comprensión lectora</h2><p>Tipos de texto, idea principal, inferencias, intención y comprensión profunda.</p></article>
        <article className="card"><span>RI</span><h2>Redacción indirecta</h2><p>Coherencia, conectores, concordancia, cohesión, acentuación y puntuación.</p></article>
        <article className="card"><span>MT</span><h2>Matemáticas</h2><p>Fundamentos, razonamiento matemático y práctica progresiva por niveles.</p></article>
      </section>
    </main>
  );
}
