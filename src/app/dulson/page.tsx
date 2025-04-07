'use client';

import React from 'react';
import Header_loguin from '../components/elements/header/Header_loguin';

function Dulson() {
  // Datos estáticos
  const idiomas = [
    { id: 1, nombre: 'Español' },
    { id: 2, nombre: 'English' },
    { id: 3, nombre: 'Français' }
  ];

  const tarifas = [
    { id: 1, nombre: 'Básica' },
    { id: 2, nombre: 'Intermedia' },
    { id: 3, nombre: 'Premium' }
  ];

  return (
    <main className="sm:ml-[200px] mt-20 px-4 sm:px-8 w-full font-urbanist text-[var(--color-text)] min-h-screen">
      <div className="absolute inset-0 border-l-8 border-r-8 px-6 py-10 w-full" style={{ borderColor: "var(--color-v-4)" }}>
        <div className="relative z-10">
          <Header_loguin/>
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
                  {idiomas.map((idioma) => (
                    <option key={idioma.id} value={idioma.id}>
                      {idioma.nombre}
                    </option>
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
                  {tarifas.map((tarifa) => (
                    <option key={tarifa.id} value={tarifa.id}>
                      {tarifa.nombre}
                    </option>
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

              {/* Botón de Guardar */}
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