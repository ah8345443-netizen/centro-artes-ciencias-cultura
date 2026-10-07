export default function HomePage() {
  return (
    <main className="public-home">
      <header className="public-nav">
        <div className="portal-brand">
          <span className="brand-mark">E</span>
          <span><strong>EXANI Colima</strong><small>Preparación 2026</small></span>
        </div>
        <a className="button secondary" href="/login">Ingresar</a>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <span className="hero-kicker">EXANI I · EXANI II · práctica estratégica</span>
          <h1>Prepárate con una ruta clara, no con preguntas al azar sin contexto.</h1>
          <p>Una plataforma de práctica progresiva con diagnóstico, sesiones por tema, simulaciones aleatorias y análisis de resultados para saber exactamente qué reforzar.</p>
          <div className="actions">
            <a className="button primary large" href="/login">Entrar a mi plataforma</a>
            <a className="button ghost large" href="#metodo">Conocer el método</a>
          </div>
          <div className="trust-line"><span>227 reactivos autocorregibles</span><span>4 niveles didácticos</span><span>6 modos de simulación</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-card visual-main">
            <span className="mini-label">Tu siguiente sesión</span>
            <h3>Simulación estándar</h3>
            <p>30 reactivos · selección nueva en cada intento</p>
            <div className="mini-progress"><i style={{width:"68%"}} /></div>
            <div className="mini-stats"><span><b>MT</b>10</span><span><b>CL</b>6</span><span><b>RI</b>8</span><span><b>CI</b>6</span></div>
          </div>
          <div className="visual-card visual-float"><strong>N4</strong><span>Profundización</span></div>
        </div>
      </section>

      <section className="landing-stats">
        <article><strong>451</strong><span>actividades en la guía base</span></article>
        <article><strong>29</strong><span>temas matemáticos</span></article>
        <article><strong>4</strong><span>áreas de preparación</span></article>
        <article><strong>N1–N4</strong><span>progresión didáctica</span></article>
      </section>

      <section id="metodo" className="landing-section">
        <div className="section-intro"><span className="eyebrow">Arquitectura de estudio</span><h2>Una plataforma que te dice qué hacer después.</h2><p>No necesitas decidir entre cientos de ejercicios. El sistema separa diagnóstico, práctica, simulación y revisión.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-number">01</span><h3>Diagnostica</h3><p>Ubica tus áreas débiles con una sesión equilibrada y resultados por área.</p></article>
          <article className="feature-card"><span className="feature-number">02</span><h3>Refuerza</h3><p>Trabaja temas concretos con niveles N1 a N4 y retroalimentación explicada.</p></article>
          <article className="feature-card"><span className="feature-number">03</span><h3>Simula</h3><p>Cada intento se construye de nuevo a partir del banco, evitando memorizar un examen fijo.</p></article>
          <article className="feature-card"><span className="feature-number">04</span><h3>Corrige</h3><p>Revisa porcentajes, historial y temas con menor desempeño antes de volver a intentarlo.</p></article>
        </div>
      </section>

      <section className="areas-showcase">
        <div><span className="area-icon math">MT</span><strong>Matemáticas</strong><small>Álgebra · geometría · datos · probabilidad</small></div>
        <div><span className="area-icon reading">CL</span><strong>Comprensión lectora</strong><small>Información · inferencia · evidencia · alcance</small></div>
        <div><span className="area-icon writing">RI</span><strong>Redacción indirecta</strong><small>Coherencia · registro · concordancia · ortografía</small></div>
        <div><span className="area-icon science">CI</span><strong>Pensamiento científico</strong><small>Variables · diseño · datos · conclusiones</small></div>
      </section>

      <section className="landing-cta">
        <div><span className="eyebrow light">Preparación con seguimiento</span><h2>Empieza por tu nivel actual y haz visible tu avance.</h2></div>
        <a className="button light-button large" href="/login">Iniciar sesión</a>
      </section>

      <footer className="public-footer">Material independiente de apoyo. No es una publicación oficial de Ceneval ni de la Universidad de Colima.</footer>
    </main>
  );
}
