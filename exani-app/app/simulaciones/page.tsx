import PortalNav from "../../components/portal-nav";

const modes=[
  {mode:"quick",badge:"12 reactivos",title:"Simulación rápida",desc:"Una sesión corta para estudiar sin perder continuidad.",mix:"5 MT · 3 CL · 2 RI · 2 CI",time:"15–20 min",tone:"quick"},
  {mode:"diagnostic",badge:"24 reactivos",title:"Diagnóstico aleatorio",desc:"Una fotografía inicial equilibrada para decidir qué reforzar primero.",mix:"12 MT · 4 CL · 4 RI · 4 CI",time:"35–40 min",tone:"diagnostic"},
  {mode:"standard",badge:"30 reactivos",title:"Simulación estándar",desc:"La sesión principal de práctica con distribución inspirada en la evaluación final de la guía.",mix:"10 MT · 6 CL · 8 RI · 6 CI",time:"45–55 min",tone:"standard"},
  {mode:"intensive",badge:"50 reactivos",title:"Simulación intensiva",desc:"Entrenamiento largo para resistencia, concentración y control del tiempo.",mix:"20 MT · 10 CL · 10 RI · 10 CI",time:"75–90 min",tone:"intensive"},
  {mode:"math",badge:"30 reactivos",title:"Reto matemático",desc:"Sesión exclusiva de matemáticas con temas mezclados y selección aleatoria.",mix:"29 temas disponibles",time:"45–60 min",tone:"math"},
  {mode:"advanced",badge:"24 reactivos",title:"Nivel avanzado",desc:"Prioriza reactivos N3 y de mayor exigencia para integración e interpretación. Los retos N4 abiertos están en Problemas integradores.",mix:"N3 · alta exigencia · todas las áreas",time:"40–55 min",tone:"advanced"}
];

export default function SimulacionesPage(){
 return <main className="app-bg"><PortalNav/><div className="app-shell">
  <section className="page-heading split-heading"><div><span className="eyebrow">Centro de simulaciones</span><h1>Cada intento es diferente.</h1><p>El sistema crea una nueva combinación aleatoria desde el banco activo. No estudias un examen fijo: entrenas la habilidad de resolver situaciones nuevas.</p></div><div className="random-badge"><strong>Selección aleatoria</strong><span>Nuevo orden y combinación en cada sesión</span></div></section>
  <section className="simulation-grid">{modes.map(m=><article className={"simulation-card "+m.tone} key={m.mode}><div className="simulation-top"><span>{m.badge}</span><small>{m.time}</small></div><h2>{m.title}</h2><p>{m.desc}</p><div className="simulation-mix">{m.mix}</div><a className="button primary full" href={"/simulacro?modo="+m.mode}>Comenzar</a></article>)}</section>
  <section className="simulation-note"><strong>¿Cuál elegir?</strong><p>Si es tu primera vez, comienza con <b>Diagnóstico aleatorio</b>. Para seguimiento regular usa <b>Simulación estándar</b>. Si ya dominas lo básico, usa <b>Nivel avanzado</b>.</p></section>
 </div></main>
}
