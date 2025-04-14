"use client";

import { useEffect } from "react";

declare global {
  interface Window {
      openSesame?: () => void;
  }
}

const Important = () => {
  useEffect(() => {
      console.log("⚠️ No deberías estar aquí shu vayase");

      const showSecret = () => {
        const style = "color: yellow; font-weight: bold;";

        const lines = [
          "   / /_   __  __ ",
          "  / __ \\/ / / /",
          " / /_/ /  /_/ /  _    _    _",
          "/_.___/\\__, /",
          "      /____/          __",
          "  ____    (_)__  ____/ /___ _",
          " / __ \\  / / __ \\/ __  / __ `/",
          "/ /__/ / / /  ___/ /__/ / /_/ /",
          "\\____/_/ /\\___/\\__,_/\\__,_/",
          "     /___/",
          "",
          "   (_)   _______  _____        ",
          "  / / | / / ___ `/ __ \\       ",
          " / /| |/ / /__/ / / / /       ",
          "/_/ |___/\\__,_/_/ /_/        ",
          "",
          "       __      __         ",
          "  ____/ /_  __/ /________     ",
          " / __  / / / / / ___//  __\\    ",
          "/ /_/ / /_/ / / /__ /  __/    ",
          "\\__,_/\\__/_/\\____/\\___/     ",
          "",
          "        ___                   ",
          "   ____/ (_)__   ____   _____    ",
          "  / __  / / _ \\/ __  `/ ___ \\   ",
          " / /_/ / /  __/ /__/  / /__/ /   ",
          "\\__,_/_/\\___/\\__, /\\____/    ",
          "               /____/",
      ];
      lines.forEach(line => console.log(`%c${line}`, style));
      window.dispatchEvent(new Event("easterEggUnlocked"));
    
      };


      document.addEventListener("keydown", (event) => {
          if (event.ctrlKey && event.shiftKey && event.key === "S") {
              showSecret();
          }
      });

      window.openSesame = showSecret;

      return () => {
          delete window.openSesame;
      };
  }, []);

  return null;
};

export default Important;