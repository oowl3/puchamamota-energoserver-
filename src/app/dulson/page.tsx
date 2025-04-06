'use client';

import React, { useEffect, useState } from 'react';

function Dulson() {
  const [idiomas, setIdiomas] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch('/api/lista_idioma').then(res => res.json()).then(data => setIdiomas(data));
    fetch('/api/lista_tarifa').then(res => res.json()).then(data => setTarifas(data));
  }, []);

  if (!isClient) return null;

  return (
    <main className="sm:ml-[200px] mt-20 px-4 sm:px-8 w-full font-urbanist text-[var(--color-text)] min-h-screen">
      {/* Barra lateral fija de los lados */}
      <div className="absolute inset-0 border-l-8 border-r-8 px-6 py-10 w-full" style={{ borderColor: "var(--color-v-4)" }}>
        <div className="relative z-10">
          <h1 className="text-4xl font-k2d tracking-widest mb-2" style={{ color: "var(--color-v-1)" }}>
            E N E R G O S E R V E R
          </h1>
          <p className="text-lg mb-10">Completa tu registro, llenando el siguiente formulario:</p>

          {/* Sección 1: Datos personales */}
          <section className="mb-10 border-t border-b py-6">
            <h2 className="text-lg font-semibold mb-6">Datos personales:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-1">Nombre(s)</label>
                <input type="text" className="form-input w-full" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="block mb-1">Apellidos</label>
                <input type="text" className="form-input w-full" placeholder="Ambos apellidos" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block mb-1">Edad</label>
                <input type="number" className="form-input w-full" placeholder="Ej.(20)" />
              </div>
              <div>
                <label className="block mb-1">Género</label>
                <select className="form-input w-full">
                  <option>Seleccionar</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Idioma Preferido</label>
                <select className="form-input w-full">
                  <option>Seleccionar</option>
                  {idiomas.map((idioma: any) => (
                    <option key={idioma.id} value={idioma.id}>{idioma.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Sección 2: Consumo eléctrico */}
          <section className="mb-10 border-b py-6">
            <h2 className="text-lg font-semibold mb-6">Datos de Consumo Eléctrico:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Consumo del último mes:</label>
                <input type="number" className="form-input w-full" placeholder="Ej.(500) kWh" />
              </div>
              <div>
                <label className="block mb-1">Tarifa:</label>
                <select className="form-input w-full">
                  <option>Seleccionar</option>
                  {tarifas.map((tarifa: any) => (
                    <option key={tarifa.id} value={tarifa.id}>{tarifa.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Sección 3: Contacto */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-6">Datos de Contacto:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block mb-1">Teléfono</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇲🇽 +52</span>
                  <input type="tel" className="form-input w-full" placeholder="5523456789" />
                </div>
              </div>

              {/* Botón a la derecha */}
              <div className="flex justify-end">
                <button
                  className="rounded-full w-32 h-32 text-xl font-semibold shadow-md transition duration-300 hover:opacity-80"
                  style={{ backgroundColor: "var(--color-v-4)", color: "var(--color-bg)" }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Dulson;
