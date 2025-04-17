import React from 'react';

const Navbar_home = () => {
  return (
    <div className="hidden md:block fixed left-0 top-0 h-screen w-[5rem] px-2 py-8 border-r-2 border-[var(--color-v-1)]">
      <nav className="flex flex-col justify-between h-full items-center">
        {['Inicio', '¿Qué hace?', 'Utilidades', 'Comprar'].map((item, index) => (
          <div
            key={item}
            className="flex flex-col items-center h-32 justify-center relative group"
          >
            <div className="h-[5rem] w-[2.5rem] flex items-center justify-center">
              <h6 className="rotate-[-90deg] whitespace-nowrap transform text-base font-urbanist font-medium tracking-wider">
                {item}
              </h6>
            </div>

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