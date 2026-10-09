import "./globals.css";

export const metadata = {
  title: "Simulador de Evaluación Académica",
  description: "Plataforma de evaluación por materias, temas y niveles con selección aleatoria de reactivos, resultados y seguimiento del aprendizaje.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
