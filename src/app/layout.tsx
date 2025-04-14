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
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Important/>
      </body>
    </html>
  );
}