import type { Metadata } from "next";
import { K2D, Urbanist } from "next/font/google";
import { Providers } from "./components/providers";
import Important from "./components/important";
import "./globals.css";

const k2d = K2D({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-k2d",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: {
    default: "Energoserver | Mide y optimiza tu consumo energético",
    template: "%s | Energoserver"
  },
  authors: [{ name: 'Ojeda' }],
  description: "Sistema de monitoreo energético en tiempo real. Controla tu consumo eléctrico, reduce costos y mejora la eficiencia energética.",
  keywords: ["energoserver", "monitoreo energético", "ahorro energía", "consumo eléctrico", "eficiencia energética"],
  metadataBase: new URL('https://www.energoserver.mx'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Energoserver | Soluciones de eficiencia energética",
    description: "Monitorea y optimiza tu consumo de energía en tiempo real con nuestra plataforma",
    url: 'https://www.energoserver.mx',
    siteName: 'Energoserver',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Energoserver - Dashboard de monitoreo energético',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  }
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${k2d.variable} ${urbanist.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=person_apron" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Energoserver",
            "url": "https://www.energoserver.mx",
            "logo": "https://www.energoserver.mx/favicon.ico",
            "description": "Mide y optimiza la energía en tiempo real",
            "sameAs": [
              "https://facebook.com/energoserver",
            ]
          })}
        </script>
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Important/>
      </body>
    </html>
  );
}