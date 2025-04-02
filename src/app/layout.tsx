import type { Metadata } from "next";
import { K2D, Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers"; // Asegúrate de que la ruta sea correcta

// Configurar K2D (fuente estática con múltiples pesos/estilos)
const k2d = K2D({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-k2d",
});

// Configurar Urbanist (fuente variable)
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Energoserver",
  description: "@Ojeda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${k2d.variable} ${urbanist.variable}`}
      suppressHydrationWarning // Necesario para evitar warnings de hidratación
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}