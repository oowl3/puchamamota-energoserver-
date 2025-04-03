"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Header_home = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) return null;

  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--color-bg)] backdrop-blur-md shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <img
              src={isDark ? "/logo-b.svg" : "/logo-w.svg"}
              alt="Logo"
              className="h-full w-full transition-opacity duration-300"
            />
          </div>

          <h3 className="font-bold uppercase tracking-wider font-k2d text-[var(--color-text)]">
            ENERGOSERVER
          </h3>
        </div>

        <button
          className="border-2 font-medium px-6 py-2 rounded-full transition-all duration-300 hover:bg-[var(--color-v-2)] hover:border-transparent"
          style={{
            borderColor: "var(--color-v-2)",
            color: "var(--color-text)",
          }}
        >
          <span className="text-sm">Comenzar</span>
        </button>
      </div>
    </header>
  );
};

export default Header_home;
