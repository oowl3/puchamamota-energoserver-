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
  title: "Energoserver",
  description: "@Ojeda",
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
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Important/>
      </body>
    </html>
  );
}