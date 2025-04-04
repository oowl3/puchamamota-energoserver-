import React from 'react';

const Navbar_home = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[200px] px-4 py-8 border-r-4 border-[var(--color-v-1)]">
      <nav className="flex flex-col justify-between h-full items-center">
        {['Inicio', '¿Qué hace?', 'Utilidades', 'Comprar'].map((item, index) => (
          <div
            key={item}
            className="flex flex-col items-center h-32 justify-center relative w-full group"
          >
            {/* Contenedor de texto */}
            <div className="h-[120px] w-[120px] flex items-center justify-center">
              <h6 className="rotate-[-90deg] whitespace-nowrap transform text-base font-medium tracking-wider">
                {item}
              </h6>
            </div>

            {/* Línea separadora centrada */}
            {index < 3 && (
              <div className="absolute bottom-0 translate-y-[calc(100%+2px)] w-2 h-px bg-[var(--color-v-1)] rotate-90 transform origin-center" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navbar_home;

