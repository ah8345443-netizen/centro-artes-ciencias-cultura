import PortalNav from "../../components/portal-nav";

const mathFoundation = [
  ["MAT1","Jerarquía de operaciones"],["MAT2","Fracciones"],["MAT3","Porcentajes"],
  ["CM1","Productos notables"],["CM2","Factorización"],["CM3","Funciones lineales y no lineales"],
  ["CM4","Ángulos y propiedades geométricas"],["CM5","Unidades de capacidad"],["CM6","Probabilidad e incertidumbre"],
  ["CM7","Medidas de tendencia central"],["CM8","Binomio al cuadrado"],["CM9","Suma de cuadrados"],
  ["CM10","Potenciación"],["CM11","Números racionales en la recta"],["CM12","Distancia y unidades de longitud"],
  ["CM13","Desigualdad del triángulo"],["CM14","Espacio muestral"],["CM15","Probabilidad clásica"],
  ["CM16","Máximo común divisor"],["CM17","Mínimo común múltiplo"],["CM19","Decimales y operaciones con fracciones"],
  ["CM20","Congruencia de triángulos"],["CM23","Probabilidad clásica aplicada"],["CM24","Frecuencia estadística"],
  ["MT1","Representación gráfica de funciones"],["MT2","Área y perímetro"],["MT3","Ecuaciones de primer grado"],
  ["MT4","Binomios y polinomios"],["MT5","Modelos de perímetro, área y volumen"],["MT6","Teorema de Pitágoras"],
  ["MT7","Probabilidad frecuencial"],["MT8","Sistemas de ecuaciones"]
];

const secondaryMath = [
  ["SEC01","Fracciones y decimales"],["SEC02","Enteros, orden y densidad"],["SEC03","Operaciones, divisibilidad y MCD/MCM"],
  ["SEC04","Potencias, raíces y notación científica"],["SEC05","Razones, proporciones y porcentajes"],["SEC06","Sucesiones aritméticas"],
  ["SEC07","Sucesiones cuadráticas"],["SEC08","Lenguaje algebraico, áreas y volúmenes"],["SEC09","Operaciones algebraicas y productos notables"],
  ["SEC10","Ecuaciones lineales y desigualdades"],["SEC11","Sistemas de ecuaciones 2×2"],["SEC12","Ecuaciones cuadráticas"],
  ["SEC13","Proporcionalidad directa e inversa"],["SEC14","Funciones y razones de cambio"],["SEC15","Rectas, ángulos y triángulos"],
  ["SEC16","Simetría, congruencia y semejanza"],["SEC17","Perímetros, áreas y figuras compuestas"],["SEC18","Cuerpos: superficies y volúmenes"],
  ["SEC19","Teorema de Pitágoras"],["SEC20","Trigonometría elemental"],["SEC21","Gráficas y organización de datos"],
  ["SEC22","Media, mediana, moda y dispersión"],["SEC23","Espacio muestral y probabilidad"],["SEC24","Eventos, independencia y repaso integral"]
];

const highSchoolMath = [
  ["BAC01","Población, muestra y tipos de datos"],["BAC02","Tablas, histogramas y dispersión"],["BAC03","Conjuntos, conteo y combinatoria"],
  ["BAC04","Probabilidad condicional y finanzas"],["BAC05","Polinomios y productos notables"],["BAC06","Factorización y fracciones algebraicas"],
  ["BAC07","Ecuaciones, sistemas y cuadráticas"],["BAC08","Semejanza, triángulos y trigonometría"],["BAC09","Coordenadas, distancia y pendiente"],
  ["BAC10","Recta y circunferencia"],["BAC11","Parábola, elipse e hipérbola"],["BAC12","Modelación con funciones"],
  ["BAC13","Dominio, rango e inversas"],["BAC14","Funciones polinomiales y transformaciones"],["BAC15","Funciones racionales y asíntotas"],
  ["BAC16","Exponenciales, logaritmos y sucesiones"],["BAC17","Límites: aproximación y cálculo"],["BAC18","Continuidad y límites laterales"],
  ["BAC19","Derivadas: razón de cambio y reglas"],["BAC20","Derivadas trigonométricas y optimización"],["BAC21","Antiderivadas e integral indefinida"],
  ["BAC22","Sustitución e integración por partes"],["BAC23","Integral definida y teorema fundamental"],["BAC24","Volúmenes de revolución e integración aplicada"]
];

const otherSubjects = [
  {
    key:"CL",title:"Comprensión lectora",className:"reading",
    description:"Tipos de texto, interpretación, inferencia, intención y evaluación de evidencia.",
    topics:[["LECT1","Tipos de texto"],["L1","La lectura académica como herramienta cognitiva"],["L2","Reducir el plástico en la escuela"],["L3","Aprendizaje significativo y comprensión profunda"],["L4","El reloj detenido"],["L5","Convocatoria y noticia"],["L6","Leer divulgación sin exceder la evidencia"]]
  },
  {
    key:"RI",title:"Redacción y lenguaje",className:"writing",
    description:"Conectores, coherencia, registro, concordancia, ortografía y puntuación.",
    topics:[["RED1","Conectores"],["T1","Conectores y coherencia"],["T2","Registro, precisión y cohesión"],["T3","Concordancia y construcciones verbales"],["T4","Ortografía, acentuación y puntuación"]]
  },
  {
    key:"CI",title:"Pensamiento científico",className:"science",
    description:"Hipótesis, variables, diseño experimental, análisis de datos y conclusiones.",
    topics:[["C1","Preguntas, hipótesis y variables"],["C2","Diseño experimental y control"],["C3","Datos, evidencia y conclusiones"]]
  }
];

function TopicGrid({topics}:{topics:string[][]}) {
  return <div className="topic-grid">{topics.map(([code,name])=>
    <a className="topic-card" href={"/practica/"+code.toLowerCase()} key={code}>
      <span>{code}</span><strong>{name}</strong><small>Práctica y evaluación →</small>
    </a>
  )}</div>;
}

export default function PracticaPage(){
  return <main className="app-bg"><PortalNav/><div className="app-shell">
    <section className="page-heading">
      <span className="eyebrow">Materias y temas</span>
      <h1>Elige una materia y después un tema.</h1>
      <p>El catálogo conserva los temas anteriores y añade los recorridos completos de secundaria y bachillerato. Puedes practicar con retroalimentación o crear una evaluación aleatoria de un tema.</p>
    </section>

    <section className="level-strip">
      <div><strong>N1</strong><span>Fundamentos</span></div>
      <div><strong>N2</strong><span>Aplicación</span></div>
      <div><strong>N3</strong><span>Integración</span></div>
      <div><strong>N4</strong><span>Desarrollo y argumentación</span></div>
    </section>

    <a className="integrative-banner" href="/integradores">
      <div><span className="eyebrow light">Profundización</span><h2>Problemas integradores</h2><p>Situaciones abiertas para modelar, argumentar y comprobar.</p></div>
      <strong>Entrar →</strong>
    </a>

    <section className="curriculum-group" id="MT">
      <div className="curriculum-head">
        <span className="area-icon math">MT</span>
        <div><h2>Matemáticas</h2><p>80 temas disponibles: fundamentos, secundaria y bachillerato.</p></div>
      </div>

      <div className="curriculum-subsection">
        <div className="subsection-heading"><div><span className="eyebrow">Banco previo</span><h3>Fundamentos y temas existentes</h3></div><span className="topic-count">{mathFoundation.length} temas</span></div>
        <TopicGrid topics={mathFoundation}/>
      </div>

      <div className="curriculum-subsection">
        <div className="subsection-heading"><div><span className="eyebrow">Secundaria</span><h3>Matemáticas para secundaria</h3></div><span className="topic-count">24 temas</span></div>
        <TopicGrid topics={secondaryMath}/>
      </div>

      <div className="curriculum-subsection">
        <div className="subsection-heading"><div><span className="eyebrow">Bachillerato</span><h3>Matemáticas para bachillerato</h3></div><span className="topic-count">24 temas</span></div>
        <TopicGrid topics={highSchoolMath}/>
      </div>
    </section>

    <div className="curriculum-groups other-subjects">
      {otherSubjects.map(g=><section className="curriculum-group" id={g.key} key={g.key}>
        <div className="curriculum-head"><span className={"area-icon "+g.className}>{g.key}</span><div><h2>{g.title}</h2><p>{g.description}</p></div></div>
        <TopicGrid topics={g.topics}/>
      </section>)}
    </div>
  </div></main>;
}
