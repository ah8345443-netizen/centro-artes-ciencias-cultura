export default function HomePage() {
  return (
    <main className="public-home">
      <header className="public-nav">
        <div className="portal-brand">
          <span className="brand-mark">S</span>
          <span><strong>Simulador Académico</strong><small>Centro de Artes, Ciencias y Cultura</small></span>
        </div>
        <a className="button secondary" href="/login">Ingresar</a>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <span className="hero-kicker">Evaluación por materias · temas · niveles</span>
          <h1>Evalúa lo que sabes y descubre exactamente qué necesitas reforzar.</h1>
          <p>Un simulador académico con evaluaciones aleatorias, práctica por tema, niveles de dificultad y resultados detallados en Matemáticas, Comprensión lectora, Redacción y Pensamiento científico.</p>
          <div className="actions">
            <a className="button primary large" href="/login">Entrar al simulador</a>
            <a className="button ghost large" href="#materias">Ver materias</a>
          </div>
          <div className="trust-line"><span>424 reactivos autocorregibles</span><span>648 actividades activas</span><span>4 niveles de dificultad</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-card visual-main">
            <span className="mini-label">Evaluación personalizada</span>
            <h3>Elige tu materia</h3>
            <p>Selecciona cantidad, nivel y tema antes de comenzar.</p>
            <div className="mini-progress"><i style={{width:"74%"}} /></div>
            <div className="mini-stats"><span><b>MT</b>Matemáticas</span><span><b>CL</b>Lectura</span><span><b>RI</b>Redacción</span><span><b>CI</b>Ciencia</span></div>
          </div>
          <div className="visual-card visual-float"><strong>N1–N4</strong><span>Dificultad gradual</span></div>
        </div>
      </section>

      <section className="landing-stats">
        <article><strong>648</strong><span>actividades disponibles</span></article>
        <article><strong>424</strong><span>reactivos autocorregibles</span></article>
        <article><strong>4</strong><span>materias principales</span></article>
        <article><strong>N1–N4</strong><span>niveles de dificultad</span></article>
      </section>

      <section id="materias" className="landing-section">
        <div className="section-intro"><span className="eyebrow">Materias</span><h2>Elige qué quieres evaluar.</h2><p>Cada materia tiene sus propios temas y puede generar evaluaciones nuevas mediante selección aleatoria.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><span className="area-icon math">MT</span><h3>Matemáticas</h3><p>Aritmética, álgebra, funciones, geometría, medición, estadística y probabilidad.</p></article>
          <article className="feature-card"><span className="area-icon reading">CL</span><h3>Comprensión lectora</h3><p>Localización de información, interpretación, inferencia, intención y evaluación de evidencia.</p></article>
          <article className="feature-card"><span className="area-icon writing">RI</span><h3>Redacción y lenguaje</h3><p>Conectores, coherencia, registro, concordancia, ortografía y puntuación.</p></article>
          <article className="feature-card"><span className="area-icon science">CI</span><h3>Pensamiento científico</h3><p>Hipótesis, variables, diseño experimental, análisis de datos y conclusiones.</p></article>
        </div>
      </section>

      <section className="areas-showcase">
        <div><span className="feature-number">01</span><strong>Elige materia</strong><small>Selecciona el área que quieres evaluar.</small></div>
        <div><span className="feature-number">02</span><strong>Configura la evaluación</strong><small>Define cantidad de reactivos y nivel.</small></div>
        <div><span className="feature-number">03</span><strong>Resuelve</strong><small>Cada intento genera una combinación diferente.</small></div>
        <div><span className="feature-number">04</span><strong>Analiza</strong><small>Consulta porcentaje, historial y temas débiles.</small></div>
      </section>

      <section className="landing-cta">
        <div><span className="eyebrow light">Evaluación con seguimiento</span><h2>Practica por tema o mide tu dominio con una evaluación completa.</h2></div>
        <a className="button light-button large" href="/login">Comenzar</a>
      </section>

      <footer className="public-footer">Plataforma educativa del Centro de Artes, Ciencias y Cultura.</footer>
    </main>
  );
}
