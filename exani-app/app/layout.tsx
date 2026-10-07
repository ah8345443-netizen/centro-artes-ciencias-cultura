import "./globals.css";

export const metadata = {
  title: "EXANI Colima 2026 | Plataforma de preparación",
  description: "Plataforma de preparación EXANI I y EXANI II con práctica progresiva, simulaciones aleatorias y seguimiento del aprendizaje.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
