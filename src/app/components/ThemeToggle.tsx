"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

  const getIcon = () => {
    switch (theme) {
      case "system":
        return "crop_square";
      case "dark":
        return "dark_mode";
      case "light":
        return "light_mode";
      default:
        return "settings_night_sight";
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => setTheme("system")}
        className={`text-[var(--color-v-2)] ${theme === "system" ? "opacity-100" : "opacity-50"}`}
      >
        <span className="material-icons">crop_square</span>
      </button>
      
      <button
        onClick={() => setTheme("light")}
        className={`text-[var(--color-v-2)] ${theme === "light" ? "opacity-100" : "opacity-50"}`}
      >
        <span className="material-icons">light_mode</span>
      </button>
      
      <button
        onClick={() => setTheme("dark")}
        className={`text-[var(--color-v-2)] ${theme === "dark" ? "opacity-100" : "opacity-50"}`}
      >
        <span className="material-icons">dark_mode</span>
      </button>
    </div>
  );
}