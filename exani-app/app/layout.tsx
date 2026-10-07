import "./globals.css";

export const metadata = {
  title: "Plataforma EXANI 2026",
  description: "Preparación EXANI I y EXANI II del Centro de Artes, Ciencias y Cultura",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
