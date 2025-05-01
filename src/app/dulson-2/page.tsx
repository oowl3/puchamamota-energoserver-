'use client';

import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import Header_loguin from '../components/elements/header/Header_loguin';
import Header_menu from '../components/elements/header/Header_menu';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Filler, Legend);

const Dulson_2 = () => {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const chartData = {
    labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: 'Consumo Diario',
        data: [
          12000, 15000, 14000, 13000, 10000, 11000, 15000,
          18000, 20000, 19000, 17000, 16000, 18000, 17500,
          16500, 17000, 16000, 15000, 14500, 14000, 13500,
          13000, 12500, 12000, 11500, 13000, 11000, 10500,
          14000, 17000, 19000
        ],
        fill: true,
        borderColor: isDark ? '#A6D900' : '#A4BC00',
        backgroundColor: isDark ? 'rgba(166, 217, 0, 0.2)' : 'rgba(164, 188, 0, 0.2)',
        tension: 0.4,
        pointBackgroundColor: isDark ? '#A6D900' : '#A4BC00',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#ffffff' : '#111111',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kW',
          color: isDark ? '#ffffff' : '#111111',
        },
        ticks: {
          color: isDark ? '#ffffff' : '#111111',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Días del mes',
          color: isDark ? '#ffffff' : '#111111',
        },
        ticks: {
          color: isDark ? '#ffffff' : '#111111',
        },
      },
    },
  };

  return (
    <main className="sm:ml-[200px] mt-20 px-4 sm:px-8 w-full font-urbanist text-[var(--color-text)] min-h-screen">
      <div className="w-full px-4 py-6">

        <Header_menu />

        <section className="mb-10">
          <p className="text-sm text-[var(--color-v-4)] font-semibold">
            Consumo promedio de <span className="text-[var(--color-v-b)]">ENERO 2025</span>
          </p>
          <h2 className="text-5xl font-k2d text-[var(--color-v-b)] mt-2">16,000 KWh</h2>
          <p className="text-[var(--color-v-2)] text-sm font-semibold mt-1">⬆ 1.3% VS MES PASADO</p>

          <div className="h-60 mt-6 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-v-5)] shadow-sm p-4">
            <Line data={chartData} options={chartOptions} />
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

        {/* Gráficos adicionales y notificaciones */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
