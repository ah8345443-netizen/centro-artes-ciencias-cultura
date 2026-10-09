"use client";

import { usePathname } from "next/navigation";

const links = [
  ["/dashboard", "Inicio"],
  ["/simulaciones", "Evaluaciones"],
  ["/practica", "Materias"],
  ["/resultados", "Resultados"],
];

export default function PortalNav() {
  const pathname = usePathname();
  return (
    <header className="portal-nav">
      <a className="portal-brand" href="/dashboard">
        <span className="brand-mark">E</span>
        <span><strong>Simulador Académico</strong><small>Centro de Artes, Ciencias y Cultura</small></span>
      </a>
      <nav>
        {links.map(([href,label]) => (
          <a key={href} href={href} className={pathname.startsWith(href) ? "nav-link active" : "nav-link"}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
