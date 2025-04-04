"use client";

import { useEffect } from "react";

const Important = () => {
  useEffect(() => {
    // Estilos para el mensaje principal
    const mainStyle = [
      "font-size: 18px",
      "background: #546f01",
      "color: white",
      "padding: 10px 20px",
      "border-radius: 5px 0 0 5px"
    ].join(";");

    // Mensaje de advertencia
    console.log(
      "⚠️ No deberías estar aquí",
      mainStyle
    );

    // Función que muestra el arte ASCII
    const showSecret = () => {
      const style = "color: green; font-weight: bold;";

      const lines = [
        "   / /_   __  __ ",
        "  / __ \\/ / / /",
        " / /_/ /  /_/ /  _    _    _",
        "/_.___/\\__, /  (_)  (_)  (_)",
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
        "               /____/"
      ];

      lines.forEach(line => console.log(`%c${line}`, style));

      // Dispara el evento personalizado
      window.dispatchEvent(new Event("easterEggUnlocked"));
    };

    // Atajo de teclado para activarlo (Ctrl + Shift + S)
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "S") {
        showSecret();
      }
    });

    // También puede activarse desde consola
    (window as any).openSesame = showSecret;

    // Limpieza al desmontar
    return () => {
      delete (window as any).openSesame;
    };
  }, []);

  return null; // No renderiza nada visualmente
};

export default Important;
