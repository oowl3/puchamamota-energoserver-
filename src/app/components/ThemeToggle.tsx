"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "./elements.css";


export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="material-icons text-[var(--color-v-2)]">
        settings_night_sight
      </span>
    );
  }

  return (
    <div className="lex gap-2 items-center rounded-full">
      <button
        onClick={() => setTheme("system")}
        className={`text-[var(--color-v-b)] ${theme === "system" ? "opacity-100" : "opacity-50"}`}
      >
        <span className="material-icons">crop_square</span>
      </button>
      
      <button
        onClick={() => setTheme("light")}
        className={`text-[var(--color-v-b)] ${theme === "light" ? "opacity-100" : "opacity-50"}`}
      >
        <span className="material-icons">light_mode</span>
      </button>
      
      <button
        onClick={() => setTheme("dark")}
        className={`text-[var(--color-v-b)] ${theme === "dark" ? "opacity-100" : "opacity-50"}`}
      >
        <span className="material-icons">dark_mode</span>
      </button>
    </div>
  );
}