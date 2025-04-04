"use client";

import { useEffect } from 'react';

const Important = () => {
  useEffect(() => {
    // Mensaje principal con 2 estilos diferentes
    const mainStyle = [
      'font-size: 18px',
      'background: #546f01',
      'color: white',
      'padding: 10px 20px',
      'border-radius: 5px 0 0 5px'
    ].join(';');

    const secondStyle = [
      'font-size: 18px',
      'background: #ff6b6b',
      'color: white',
      'padding: 10px 15px',
      'border-radius: 0 5px 5px 0'
    ].join(';');

    console.log(
      '%c⚠️ No deberías estar aquí %c¡Sal de aquí!⚠️', 
      mainStyle, 
      secondStyle
    );

    // Función del easter egg mejorada
    const showSecret = () => {
      console.log('%c🚀 ¡Has superado la prueba!', 
        'font-size: 24px; color: #4ecdc4; font-weight: bold;');
      console.log(`%c
        ░█▀▀█ ░█▀▀▀█ ░█▀▀█ ─█▀▀█ ░█▀▀▀█ ░█▀▀█ 
        ░█▄▄▀ ░█──░█ ░█▄▄▀ ░█▄▄█ ─▀▀▀▄▄ ░█▄▄▀ 
        ░█─░█ ░█▄▄▄█ ░█─░█ ░█─░█ ░█▄▄▄█ ░█─░█
        https://youtu.be/dQw4w9WgXcQ?t=85
      `, 'color: #546f01; font-family: monospace; line-height: 1.5;');
      
      window.dispatchEvent(new Event('easterEggUnlocked'));
    };

    (window as any).openSesame = showSecret;

    return () => {
      delete (window as any).openSesame;
    };
  }, []);

  return null;
};

export default Important;