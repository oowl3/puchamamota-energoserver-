import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "rappicard.mx",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com", // <- Nuevo dominio requerido
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com", // <- Nuevo dominio requerido
      },
    ],
  },
};

export default nextConfig;