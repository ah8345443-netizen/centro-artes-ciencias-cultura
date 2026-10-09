import PortalNav from "../../components/portal-nav";

const groups = [
  {key:"MT",title:"Matemáticas",description:"Aritmética, álgebra, geometría, medición, datos y probabilidad",className:"math",topics:[["MAT1","Jerarquía de operaciones"],["MAT2","Fracciones"],["MAT3","Porcentajes"],
    ["CM1","Productos notables"],["CM2","Factorización"],["CM3","Funciones lineales y no lineales"],["CM4","Ángulos y propiedades geométricas"],["CM5","Unidades de capacidad"],["CM6","Probabilidad e incertidumbre"],["CM7","Medidas de tendencia central"],["CM8","Binomio al cuadrado"],["CM9","Suma de cuadrados"],["CM10","Potenciación"],["CM11","Números racionales en la recta"],["CM12","Distancia y unidades de longitud"],["CM13","Desigualdad del triángulo"],["CM14","Espacio muestral"],["CM15","Probabilidad clásica"],["CM16","Máximo común divisor"],["CM17","Mínimo común múltiplo"],["CM19","Decimales y operaciones con fracciones"],["CM20","Congruencia de triángulos"],["CM23","Probabilidad clásica aplicada"],["CM24","Frecuencia estadística"],["MT1","Representación gráfica de funciones"],["MT2","Área y perímetro"],["MT3","Ecuaciones de primer grado"],["MT4","Binomios y polinomios"],["MT5","Modelos de perímetro, área y volumen"],["MT6","Teorema de Pitágoras"],["MT7","Probabilidad frecuencial"],["MT8","Sistemas de ecuaciones"]
  ]},
  {key:"CL",title:"Comprensión lectora",description:"Lectura, interpretación, inferencia y evaluación de evidencia",className:"reading",topics:[["LECT1","Tipos de texto"],["L1","La lectura académica como herramienta cognitiva"],["L2","Reducir el plástico en la escuela"],["L3","Aprendizaje significativo y comprensión profunda"],["L4","El reloj detenido"],["L5","Convocatoria y noticia"],["L6","Leer divulgación sin exceder la evidencia"]]},
  {key:"RI",title:"Redacción y lenguaje",description:"Coherencia, registro, conectores, concordancia y ortografía",className:"writing",topics:[["RED1","Conectores"],["T1","Conectores y coherencia"],["T2","Registro, precisión y cohesión"],["T3","Concordancia y construcciones verbales"],["T4","Ortografía, acentuación y puntuación"]]},
  {key:"CI",title:"Pensamiento científico",description:"3 bloques · variables, control, evidencia y conclusiones",className:"science",topics:[["C1","Preguntas, hipótesis y variables"],["C2","Diseño experimental y control"],["C3","Datos, evidencia y conclusiones"]]}
];

export default function PracticaPage(){
  return <main className="app-bg"><PortalNav/><div className="app-shell">
    <section className="page-heading"><span className="eyebrow">Materias y temas</span><h1>Elige una materia y después un tema.</h1><p>Puedes practicar cada tema de forma guiada o utilizarlo después para crear una evaluación específica. Los niveles N1–N4 avanzan desde fundamentos hasta desarrollo y argumentación.</p></section>
    <section className="level-strip"><div><strong>N1</strong><span>Fundamentos</span></div><div><strong>N2</strong><span>Aplicación</span></div><div><strong>N3</strong><span>Integración</span></div><div><strong>N4</strong><span>Profundización</span></div></section>\n    <a className="integrative-banner" href="/integradores"><div><span className="eyebrow light">Reto N4</span><h2>Problemas integradores</h2><p>8 situaciones abiertas para modelar, argumentar y comprobar.</p></div><strong>Entrar →</strong></a>
    <div className="curriculum-groups">
      {groups.map(g=><section className="curriculum-group" key={g.key}>
        <div className="curriculum-head"><span className={"area-icon "+g.className}>{g.key}</span><div><h2>{g.title}</h2><p>{g.description}</p></div></div>
        <div className="topic-grid">{g.topics.map(([code,name])=><a className="topic-card" href={"/practica/"+code.toLowerCase()} key={code}><span>{code}</span><strong>{name}</strong><small>Práctica guiada →</small></a>)}</div>
      </section>)}
    </div>
  </div></main>;
}
