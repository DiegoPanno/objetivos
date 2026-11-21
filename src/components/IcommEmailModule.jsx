// src/components/IcommEmailModule.jsx
import React, { useState } from 'react';

export default function IcommEmailModule({ datosIcomm }) {
  const [ordenPor, setOrdenPor] = useState('fecha');

  if (!datosIcomm || !datosIcomm.campanas || datosIcomm.campanas.length === 0) {
    return null;
  }

  const { campanas, totales } = datosIcomm;

  const campanasOrdenadas = [...campanas].sort((a, b) => {
    if (ordenPor === 'revenue') return b.revenue - a.revenue;
    if (ordenPor === 'openRate') return b.openRate - a.openRate;
    return 0;
  });

  return (
    <section className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-100 uppercase">
              Email Marketing & Automatización (icomm)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rendimiento de envíos, tasa de apertura, clics y facturación atribuida
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setOrdenPor('fecha')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              ordenPor === 'fecha' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🕒 Recientes
          </button>
          <button
            onClick={() => setOrdenPor('revenue')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              ordenPor === 'revenue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💰 Mayor Venta
          </button>
          <button
            onClick={() => setOrdenPor('openRate')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              ordenPor === 'openRate' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            👁️ Mejor Apertura
          </button>
        </div>
      </div>

      {/* KPIs PRINCIPALES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
            Facturación Atribuida
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-300">
            ${totales.revenue.toLocaleString('es-AR')}
          </span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">
            {totales.adquisitions} compras directas
          </span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Correos Efectivos
          </span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {totales.efectives.toLocaleString('es-AR')}
          </span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">
            Entregabilidad: {totales.tasaEntrega.toFixed(1)}%
          </span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
            Open Rate Único
          </span>
          <span className="text-xl sm:text-2xl font-black text-cyan-300">
            {totales.openRate.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">
            {totales.uViews.toLocaleString('es-AR')} aperturas únicas
          </span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
            CTR / CTOR
          </span>
          <span className="text-xl sm:text-2xl font-black text-indigo-300">
            {totales.ctr.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">
            CTOR: {totales.ctor.toFixed(2)}% ({totales.uClicks} clics)
          </span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850 col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
            Tasa de Rebote
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-300">
            {totales.tasaRebote.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">
            {totales.bounces.toLocaleString('es-AR')} rebotados
          </span>
        </div>
      </div>

      {/* LISTADO DE ENVÍOS / CAMPAÑAS */}
      <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            📨 Detalle por Envío ({campanasOrdenadas.length} campañas activas)
          </span>
          <span className="text-[11px] text-slate-500">Métricas calculadas sobre correos efectivos</span>
        </div>

        <div className="space-y-2.5">
          {campanasOrdenadas.map((c, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {c.fechaCorta}
                  </span>
                  <span className="text-xs font-extrabold text-indigo-300 truncate">
                    {c.configuration}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate">{c.subject}</p>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:gap-5 w-full lg:w-auto text-right border-t lg:border-t-0 border-slate-800 pt-2 lg:pt-0 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-500 block">Efectivos</span>
                  <span className="text-xs font-bold text-slate-200">{c.efectives.toLocaleString('es-AR')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Open Rate</span>
                  <span className="text-xs font-black text-cyan-400">{c.openRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CTR</span>
                  <span className="text-xs font-black text-indigo-400">{c.ctr.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Facturado</span>
                  <span className={`text-xs font-black ${c.revenue > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    ${c.revenue.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
