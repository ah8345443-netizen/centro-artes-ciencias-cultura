import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Simulador de Evaluación Académica",
    short_name: "Simulador Académico",
    description: "Evaluaciones por materia, tema y nivel con reactivos aleatorios y seguimiento de resultados.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#183bdb",
    icons: [],
  };
}
