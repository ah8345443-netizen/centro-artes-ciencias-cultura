import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plataforma EXANI 2026",
    short_name: "EXANI 2026",
    description: "Práctica, simulacros y seguimiento EXANI.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#183bdb",
    icons: [],
  };
}
