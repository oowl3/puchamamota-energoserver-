"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

interface LogoProps extends Omit<ImageProps, "src" | "alt"> {
  forceTheme?: "light" | "dark";
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

//     ___      ___        ___        _____        ___     
//    /  /\    /  /\      /  /\      /  /::\      /  /\    
//   /  /::\  /  /:/     /  /:/_    /  /:/\:\    /  /::\   
//  /  /:/\:\/__/::\    /  /:/ /\  /  /:/  \:\  /  /:/\:\  
// /  /:/  \:\__\/\:\  /  /:/ /:/_/__/:/ \__\:|/  /:/~/::\ 
///__/:/ \__\:\ \  \:\/__/:/ /:/ /\  \:\ /  /:/__/:/ /:/\:\
//\  \:\ /  /:/  \__\:\  \:\/:/ /:/\  \:\  /:/\  \:\/:/__\/
// \  \:\  /:/   /  /:/\  \::/ /:/  \  \:\/:/  \  \::/     
//  \  \:\/:/   /__/:/  \  \:\/:/    \  \::/    \  \:\     
//   \  \::/    \__\/    \  \::/      \__\/      \  \:\    
//    \__\/               \__\/                   \__\/    

  return (
    <div className={`relative w-8 h-8 ${className} flex justify-center items-center`}>
      <Image
        src={isDark ? "/logo-b.svg" : "/logo-w.svg"}
        alt="Logo"
        fill
        className="object-contain"
        {...props}
      />
    </div>
  );
};


export default IconProp;