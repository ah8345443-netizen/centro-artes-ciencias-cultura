(function(){
"use strict";
var WA="523123039724";
var catalog={
"Primaria":[
"Sumas, restas, multiplicaciones y divisiones","Fracciones y números decimales","Porcentajes básicos","Jerarquía de operaciones","Múltiplos y divisores","Problemas razonados","Razones y proporciones sencillas","Medidas, perímetros y áreas","Geometría y figuras","Gráficas y tablas de datos"],
"Secundaria":[
"Fracciones y decimales","Números enteros y su orden","Divisibilidad, MCD y MCM","Potencias, raíces y notación científica","Razones, proporciones y porcentajes","Sucesiones aritméticas","Sucesiones cuadráticas","Lenguaje algebraico, áreas y volúmenes","Operaciones algebraicas y productos notables","Ecuaciones lineales y desigualdades","Sistemas de ecuaciones lineales","Ecuaciones cuadráticas","Proporcionalidad directa e inversa","Funciones y razones de cambio","Rectas, ángulos y triángulos","Simetría, congruencia y semejanza","Perímetros, áreas y figuras compuestas","Superficies y volúmenes","Teorema de Pitágoras","Trigonometría elemental","Gráficas y organización de datos","Media, mediana, moda y dispersión","Espacio muestral y probabilidad","Eventos y probabilidad independiente"],
"Bachillerato":[
"Población, muestra y tipos de datos","Tablas, histogramas y dispersión","Conjuntos, conteo y combinatoria","Probabilidad condicional y finanzas","Polinomios y productos notables","Factorización y fracciones algebraicas","Ecuaciones, sistemas y cuadráticas","Semejanza, triángulos y trigonometría","Coordenadas, distancia y pendiente","Recta y circunferencia","Parábola, elipse e hipérbola","Modelación con funciones","Dominio, rango y funciones inversas","Funciones polinomiales y transformaciones","Funciones racionales y asíntotas","Exponenciales, logaritmos y sucesiones","Límites: aproximación y cálculo","Continuidad y límites laterales","Derivadas: razón de cambio y reglas","Derivadas trigonométricas y optimización","Antiderivadas e integral indefinida","Sustitución e integración por partes","Integral definida y teorema fundamental del cálculo","Volúmenes de revolución e integración aplicada"]
};
var state={level:"Secundaria",topics:[]};
var grid=document.getElementById("topicGrid"),search=document.getElementById("searchTopic"),count=document.getElementById("selectionCount"),summaryTopics=document.getElementById("summaryTopics");
function value(name){var el=document.querySelector('input[name="'+name+'"]:checked');return el?el.value:"";}
function render(){
document.getElementById("summaryLevel").textContent=state.level;
var filter=(search.value||"").toLocaleLowerCase("es").trim();
grid.replaceChildren();
var visible=0;
catalog[state.level].forEach(function(topic){
if(!topic.toLocaleLowerCase("es").includes(filter))return;
visible++;
var label=document.createElement("label");label.className="topic-chip"+(state.topics.includes(topic)?" selected":"");
var cb=document.createElement("input");cb.type="checkbox";cb.value=topic;cb.checked=state.topics.includes(topic);
cb.addEventListener("change",function(){
state.topics=cb.checked?state.topics.concat([topic]):state.topics.filter(function(t){return t!==topic});
render();
});
var span=document.createElement("span");span.textContent=topic;label.append(cb,span);grid.appendChild(label);
});
if(!visible){var empty=document.createElement("p");empty.style.color="#788696";empty.textContent="No encontramos ese tema. Prueba otra palabra.";grid.appendChild(empty)}
count.textContent=state.topics.length+" tema"+(state.topics.length===1?" elegido":"s elegidos");
summaryTopics.replaceChildren();
if(!state.topics.length){var t=document.createElement("span");t.className="placeholder";t.textContent="Elige al menos un tema.";summaryTopics.append(t)}
state.topics.forEach(function(topic){var t=document.createElement("span");t.textContent=topic;summaryTopics.append(t)});
document.querySelectorAll("[data-level]").forEach(function(b){var a=b.dataset.level===state.level;b.classList.toggle("active",a);b.setAttribute("aria-pressed",String(a))});
document.getElementById("summaryDays").textContent=value("days").replace("Lunes, martes y miércoles","Lun · Mar · Mié").replace("Jueves, viernes y sábado","Jue · Vie · Sáb");
document.getElementById("summaryTime").textContent=value("time");
}
function setLevel(level){
if(!catalog[level])return;
state.level=level;state.topics=[];search.value="";render();
}
document.querySelectorAll("[data-level]").forEach(function(b){b.addEventListener("click",function(){setLevel(b.dataset.level)})});
document.querySelectorAll("[data-level-link]").forEach(function(b){b.addEventListener("click",function(){setLevel(b.dataset.levelLink);document.getElementById("inscripcion").scrollIntoView({behavior:"smooth",block:"start"})})});
search.addEventListener("input",render);
document.getElementById("clearTopics").addEventListener("click",function(){state.topics=[];render()});
document.querySelectorAll('input[name="days"],input[name="time"]').forEach(function(el){el.addEventListener("change",render)});
var menu=document.getElementById("navMenu"),nav=document.getElementById("nav");
menu.addEventListener("click",function(){var open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")})});
function validate(){if(state.topics.length)return true;var error=document.getElementById("formError");error.hidden=false;error.textContent="Selecciona al menos un tema para continuar.";document.getElementById("topicGrid").scrollIntoView({behavior:"smooth",block:"center"});return false}
function data(){return{
name:document.getElementById("studentName").value.trim(),
grade:document.getElementById("studentGrade").value.trim(),
notes:document.getElementById("learningNotes").value.trim(),
level:state.level,topics:state.topics.slice(),days:value("days"),time:value("time")
}}
document.getElementById("sendWhatsapp").addEventListener("click",function(){
if(!validate())return;
document.getElementById("formError").hidden=true;
var d=data(),lines=[
"¡Hola, Prepárate+! Me interesa el PAQUETE DE 6 CLASES EN LÍNEA por $350 MXN.",
"",
"Nivel: "+d.level,
"Grado/semestre: "+(d.grade||"Por confirmar"),
"Nombre: "+(d.name||"Por confirmar"),
"Temas que deseo reforzar:",
d.topics.map(function(t,i){return(i+1)+". "+t}).join("\n"),
"",
"Días que prefiero: "+d.days,
"Horario que prefiero: "+d.time+" (Colima, UTC−6)",
"Guía personalizada por temas incluida.",
d.notes?"Necesidad o comentario: "+d.notes:"",
"",
"¿Hay cupo? Quisiera confirmar el grupo, las fechas y la forma de pago."
].filter(function(s){return s!==null});
var url="https://wa.me/"+WA+"?text="+encodeURIComponent(lines.join("\n"));
window.location.href=url;
});
function escaped(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
document.getElementById("printPlan").addEventListener("click",function(){
if(!validate())return;
var d=data(),topicHtml=d.topics.map(function(t){return"<li>"+escaped(t)+"</li>"}).join("");
var slots=["Comprender las ideas principales y detectar dificultades","Explicación guiada y ejercicios básicos","Práctica estructurada y discusión de errores","Resolución de problemas de aplicación","Ejercicios de mayor reto y repaso","Integración, comprobación y recomendaciones de estudio"];
var plan=slots.map(function(t,i){var subject=d.topics[i%d.topics.length];return"<tr><td>Sesión "+(i+1)+"</td><td>"+escaped(subject)+"</td><td>"+escaped(t)+"</td></tr>"}).join("");
var markup='<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>Plan preliminar Prepárate+</title><style>body{font:15px/1.55 Arial,sans-serif;max-width:840px;margin:35px auto;padding:20px;color:#112742}header{border-bottom:5px solid #eabf3b;margin-bottom:28px}h1{font-size:30px;margin:0}h2{font-size:20px;margin-top:30px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #dbe1e8;padding:11px;text-align:left;font-size:13px}th{background:#eef2f8}p{margin:8px 0}.muted{color:#647386}.note{background:#fff5dc;padding:15px;margin-top:25px}button{padding:12px 20px;background:#09213c;color:white;border:0;border-radius:8px;cursor:pointer}@media print{button{display:none}}</style></head><body><header><h1>PREPÁRATE+</h1><p>Plan de estudio preliminar · Paquete de seis clases</p></header><p><b>Nivel:</b> '+escaped(d.level)+' · <b>Nombre:</b> '+escaped(d.name||"Por confirmar")+' · <b>Grado:</b> '+escaped(d.grade||"Por confirmar")+'</p><p><b>Días:</b> '+escaped(d.days)+' · <b>Horario:</b> '+escaped(d.time)+' (UTC−6)</p><p><b>Inversión:</b> $350 MXN · <b>Modalidad:</b> 100 % en línea</p><h2>Temas de interés</h2><ol>'+topicHtml+'</ol><h2>Propuesta de organización</h2><table><thead><tr><th>Clase</th><th>Enfoque propuesto</th><th>Actividad</th></tr></thead><tbody>'+plan+'</tbody></table><div class="note"><b>Importante:</b> Este documento es una vista previa del plan, no es la guía digital definitiva. Los contenidos, la distribución y el horario se confirman con el docente. La guía personalizada con explicaciones y ejercicios se prepara una vez confirmada la inscripción y los temas.</div><p class="muted">6 clases de 2 horas, 3 días por semana durante 2 semanas. El grupo y las fechas están sujetos a confirmación.</p><button onclick="window.print()">Guardar como PDF / imprimir</button></body></html>';
var w=window.open("","_blank");if(!w){alert("Permite ventanas emergentes para visualizar tu plan.");return}w.document.open();w.document.write(markup);w.document.close();
});
render();
})();