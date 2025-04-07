'use client';

import React from 'react';
import Header_loguin from '../components/elements/header/Header_loguin';

const Dulson_2 = () => {
  return (
    <main className="sm:ml-[200px] mt-20 px-4 sm:px-8 w-full font-urbanist text-[var(--color-text)] min-h-screen">
      <div className="w-full px-4 py-6">

        <Header_loguin />

        {/* Título y consumo promedio */}
        <section className="mb-10">
          <p className="text-sm text-[var(--color-v-4)] font-semibold">Consumo promedio de <span className="text-[var(--color-v-b)]">ENERO 2025</span></p>
          <h2 className="text-5xl font-k2d text-[var(--color-v-b)] mt-2">16,000 KWh</h2>
          <p className="text-[var(--color-v-2)] text-sm font-semibold mt-1">⬆ 1.3% VS MES PASADO</p>

          {/* Simulación gráfica (decorativa) */}
          <div className="h-40 mt-4 rounded-lg bg-gradient-to-t from-[var(--color-v-2)]/30 to-transparent relative">
            <div className="absolute bottom-0 w-full h-1/3 bg-[var(--color-v-2)]/60 rounded-b-lg" />
          </div>
        </section>

        {/* Botones de vista */}
        <div className="flex justify-end gap-2 mb-6">
          <button className="bg-[var(--color-v-2)] text-[var(--color-bg)] px-5 py-1 rounded-full text-sm font-semibold shadow">General</button>
          <button className="border border-[var(--color-v-2)] text-[var(--color-v-2)] px-5 py-1 rounded-full text-sm font-semibold shadow-sm">Grupo / Específico</button>
        </div>

        {/* Indicadores de consumo */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
          <div className="bg-[var(--color-v-6)] p-6 rounded-2xl shadow-md">
            <h3 className="text-base font-medium text-[var(--color-v-4)]">Consumo actual</h3>
            <p className="text-4xl font-bold text-[var(--color-v-1)] mt-2">500 <span className="text-sm">KW</span></p>
          </div>
          <div className="bg-[var(--color-v-6)] p-6 rounded-2xl shadow-md">
            <h3 className="text-base font-medium text-[var(--color-v-4)]">Consumo mayor</h3>
            <p className="text-4xl font-bold text-[var(--color-v-1)] mt-2">18,000 <span className="text-sm">KW</span></p>
          </div>
          <div className="bg-[var(--color-v-6)] p-6 rounded-2xl shadow-md">
            <h3 className="text-base font-medium text-[var(--color-v-4)]">Consumo menor</h3>
            <p className="text-4xl font-bold text-[var(--color-v-1)] mt-2">7,000 <span className="text-sm">KW</span></p>
          </div>
        </section>

        {/* Gráficos y notificaciones */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grupos con mayor consumo */}
          <div className="bg-[var(--color-bg)] p-6 border border-[var(--color-v-5)] rounded-2xl shadow-sm">
            <h4 className="text-base font-bold text-[var(--color-v-4)] mb-4">Grupos con mayor consumo</h4>
            <div className="w-full flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-[10px] border-[var(--color-v-2)] border-t-[var(--color-v-4)] border-r-[var(--color-v-1)] border-b-[var(--color-v-5)]" />
            </div>
            <ul className="text-sm space-y-1 text-[var(--color-text)] font-medium">
              <li><span className="text-[var(--color-v-2)]">•</span> Lavandería</li>
              <li><span className="text-[var(--color-v-4)]">•</span> Cocina</li>
              <li><span className="text-[var(--color-v-1)]">•</span> Generales</li>
              <li><span className="text-[var(--color-v-5)]">•</span> Otros</li>
            </ul>
          </div>

          {/* Dispositivos con mayor consumo */}
          <div className="bg-[var(--color-bg)] p-6 border border-[var(--color-v-5)] rounded-2xl shadow-sm">
            <h4 className="text-base font-bold text-[var(--color-v-4)] mb-4">Dispositivos con mayor consumo</h4>
            <div className="w-full flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-[10px] border-[var(--color-v-4)] border-t-[var(--color-v-1)] border-r-[var(--color-v-2)] border-b-[var(--color-v-5)]" />
            </div>
            <ul className="text-sm space-y-1 text-[var(--color-text)] font-medium">
              <li><span className="text-[var(--color-v-4)]">•</span> Calentador</li>
              <li><span className="text-[var(--color-v-1)]">•</span> Refrigerador</li>
              <li><span className="text-[var(--color-v-5)]">•</span> Lavadora</li>
              <li><span className="text-[var(--color-v-2)]">•</span> Otros</li>
            </ul>
          </div>

          {/* Notificaciones recientes */}
          <div className="bg-[var(--color-bg)] p-6 border border-[var(--color-v-5)] rounded-2xl shadow-sm">
            <h4 className="text-base font-bold text-[var(--color-v-4)] mb-4">Notificaciones recientes</h4>
            <ul className="text-sm space-y-3 text-[var(--color-v-2)] font-semibold">
              <li className="flex items-center gap-2">• El consumo aumentó</li>
              <li className="flex items-center gap-2">• Se registró un pico</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dulson_2;
