// src/components/IcommEmailModule.jsx
import React, { useState } from 'react';

export default function IcommEmailModule({ datosIcomm }) {
  const [ordenPor, setOrdenPor] = useState('fecha');
  const [mostrarRecomendacion, setMostrarRecomendacion] = useState(false);

  if (!datosIcomm || !datosIcomm.campanas || datosIcomm.campanas.length === 0) {
    return null;
  }

  const { campanas, totales } = datosIcomm;

  const campanasOrdenadas = [...campanas].sort((a, b) => {
    if (ordenPor === 'revenue') return b.revenue - a.revenue;
    if (ordenPor === 'openRate') return b.openRate - a.openRate;
    return 0;
  });

  // Detección dinámica de oportunidades según los números reales del mes
  const alertaRebote = totales.tasaRebote > 10;
  const alertaClics = totales.ctr < 1.0 || totales.ctor < 5.0;

  return (
    <section className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-5">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-800 pb-4">
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

        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-between xl:justify-end">
          {/* BOTÓN LLAMATIVO DE DIAGNÓSTICO Y RECOMENDACIONES */}
          <button
            onClick={() => setMostrarRecomendacion(!mostrarRecomendacion)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer border ${
              mostrarRecomendacion
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)]'
                : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span>💡 Sugerencia </span>
            <span className="text-[10px] ml-0.5">{mostrarRecomendacion ? '▲' : '▼'}</span>
          </button>

          {/* FILTROS DE ORDEN */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setOrdenPor('fecha')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                ordenPor === 'fecha' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🕒 Recientes
            </button>
            <button
              onClick={() => setOrdenPor('revenue')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                ordenPor === 'revenue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💰 Mayor Venta
            </button>
            <button
              onClick={() => setOrdenPor('openRate')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                ordenPor === 'openRate' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👁️ Apertura
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DESPLEGABLE DE RECOMENDACIÓN ESTRATÉGICA */}
      {mostrarRecomendacion && (
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-950 to-indigo-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                  Plan de Acción para Optimizar Conversión en Email
                </h3>
                <p className="text-[11px] text-slate-400">
                  Análisis automático sobre {totales.efectives.toLocaleString('es-AR')} envíos efectivos del período
                </p>
              </div>
            </div>
            <button
              onClick={() => setMostrarRecomendacion(false)}
              className="text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
            >
              ✕ Ocultar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 text-xs">
            {/* INSIGHT 1: CTR / CTOR */}
            <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-indigo-300 uppercase text-[11px]">
                  1. Subir CTR ({totales.ctr.toFixed(2)}%) y CTOR ({totales.ctor.toFixed(2)}%)
                </span>
                {alertaClics && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Oportunidad
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">
                En pinturería la compra es planificada: los asuntos genéricos (<em>"50% OFF y 12 cuotas"</em>) logran buena apertura (+21%), pero pocos clics internos (~2,2%).
              </p>
              <p className="text-emerald-300 font-semibold pt-1">
                ✓ Acción: Incluir bloques con productos gancho concretos (Látex 20L, Membrana, Cetol 4L) con botón directo a ficha.
              </p>
            </div>

            {/* INSIGHT 2: REBOTES */}
            <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-300 uppercase text-[11px]">
                  2. Limpiar Rebotes ({totales.tasaRebote.toFixed(1)}%)
                </span>
                {alertaRebote && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                    Crítico
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">
                Los envíos masivos (+25k contactos) disparan el rebote al ~28%, afectando la reputación del dominio frente a Gmail/Hotmail.
              </p>
              <p className="text-emerald-300 font-semibold pt-1">
                ✓ Acción: Excluir <em>Hard Bounces</em> históricos antes de las campañas de Navidad/Fiestas para subir entregabilidad al +94%.
              </p>
            </div>

            {/* INSIGHT 3: REFUERZO A APERTURADORES */}
            <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-cyan-300 uppercase text-[11px]">
                  3. Refuerzo a Aperturadores
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  Efectivo
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Los envíos segmentados a aperturadores alcanzan un <strong>CTOR de hasta 5,53%</strong> y duplican el rendimiento de clic frente a la base fría.
              </p>
              <p className="text-emerald-300 font-semibold pt-1">
                ✓ Acción: Disparar reenvío a las 48 hs a <code>AperturadoresSinCompra</code> cambiando el gancho (cuotas sin interés o envío express).
              </p>
            </div>
          </div>
        </div>
      )}

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