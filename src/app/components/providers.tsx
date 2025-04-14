"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Mejor práctica para hidratación
  }

  return (
    <SessionProvider
      basePath="/api/auth" // Corrige la ruta base
      refetchInterval={5 * 60} // 5 minutos
      refetchOnWindowFocus={false} // Evita recargas innecesarias
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="energoserver-theme" // Namespace único
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}