"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

interface LogoProps {
  forceTheme?: "light" | "dark";
  className?: string;
  [key: string]: any;
}

const IconProp = ({ forceTheme, className = "", ...props }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = forceTheme 
    ? forceTheme === "dark"
    : theme === "dark" || resolvedTheme === "dark";

  return (
    <img
      src={isDark ? "/logo-b.svg" : "/logo-w.svg"}
      alt="Logo"
      className={`h-full w-full transition-opacity duration-300 ${className}`}
      {...props}
    />
  );
};

export default IconProp;