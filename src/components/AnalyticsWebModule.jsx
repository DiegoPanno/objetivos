// src/components/AnalyticsWebModule.jsx
import React, { useState } from 'react';

export default function AnalyticsWebModule({ datosAnalytics }) {
  const [pestanaActiva, setPestanaActiva] = useState('paginas');

  if (!datosAnalytics || (!datosAnalytics.canales?.length && !datosAnalytics.paginas?.length)) {
    return null;
  }

  const { canales = [], paginas = [] } = datosAnalytics;
  const totalSesiones = canales.reduce((acc, c) => acc + c.sesiones, 0);

  const canalesConTipo = canales.map(c => {
    const nombre = c.canal.toLowerCase();
    let categoria = 'Directo / Otros';
    let color = 'bg-slate-400';

    if (nombre.includes('paid') || nombre.includes('cross-network') || nombre.includes('display') || nombre.includes('cpc')) {
      categoria = 'Pauta / Ads';
      color = 'bg-amber-400';
    } else if (nombre.includes('organic')) {
      categoria = 'Orgánico';
      color = 'bg-emerald-400';
    }

    const pct = totalSesiones > 0 ? ((c.sesiones / totalSesiones) * 100).toFixed(1) : '0.0';
    return { ...c, categoria, color, pct };
  });

  const totalPauta = canalesConTipo.filter(c => c.categoria === 'Pauta / Ads').reduce((acc, c) => acc + c.sesiones, 0);
  const totalOrganico = canalesConTipo.filter(c => c.categoria === 'Orgánico').reduce((acc, c) => acc + c.sesiones, 0);
  const totalOtros = totalSesiones - (totalPauta + totalOrganico);

  const pctPauta = totalSesiones > 0 ? ((totalPauta / totalSesiones) * 100).toFixed(0) : 0;
  const pctOrg = totalSesiones > 0 ? ((totalOrganico / totalSesiones) * 100).toFixed(0) : 0;
  const pctOtros = totalSesiones > 0 ? ((totalOtros / totalSesiones) * 100).toFixed(0) : 0;

  return (
    <section className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-100 uppercase">
              Rendimiento Web en Vivo (Google Analytics 4)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoreo de tráfico, campañas de pauta y páginas/promociones con mayor interacción
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setPestanaActiva('paginas')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              pestanaActiva === 'paginas' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📄 Top URLs / Banners
          </button>
          <button
            onClick={() => setPestanaActiva('canales')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              pestanaActiva === 'canales' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Detalle Canales
          </button>
        </div>
      </div>

      {/* METRICAS PRINCIPALES DEL TRÁFICO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Sesiones Totales</span>
          <span className="text-xl sm:text-2xl font-black text-white">{totalSesiones.toLocaleString('es-AR')}</span>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex mt-2">
            <div className="bg-amber-400 h-full" style={{ width: `${pctPauta}%` }}></div>
            <div className="bg-emerald-400 h-full" style={{ width: `${pctOrg}%` }}></div>
            <div className="bg-slate-500 h-full" style={{ width: `${pctOtros}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Publicidad / Pauta</span>
          <span className="text-xl sm:text-2xl font-black text-amber-300">{totalPauta.toLocaleString('es-AR')}</span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">{pctPauta}% del tráfico</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Tráfico Orgánico</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-300">{totalOrganico.toLocaleString('es-AR')}</span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">{pctOrg}% del tráfico</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Directo y Referidos</span>
          <span className="text-xl sm:text-2xl font-black text-slate-200">{totalOtros.toLocaleString('es-AR')}</span>
          <span className="text-xs text-slate-500 font-bold block mt-0.5">{pctOtros}% del tráfico</span>
        </div>
      </div>

      {/* CONTENIDO SEGÚN PESTAÑA */}
      {pestanaActiva === 'paginas' ? (
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              🔥 URLs y Destinos Más Visitados
            </span>
            <span className="text-[11px] text-slate-500">Vistas de pantalla acumuladas</span>
          </div>

          <div className="space-y-2">
            {paginas.slice(0, 15).map((item, idx) => {
              const maxVistas = paginas[0]?.vistas || 1;
              const pctBarra = (item.vistas / maxVistas) * 100;
              const esCyber = item.url.includes('cybermonday');
              const esPromo = item.url.includes('banner') || item.url.includes('promo');

              return (
                <div key={idx} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-slate-800 text-slate-300 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-slate-200 truncate">{item.url}</span>
                      {esCyber && (
                        <span className="bg-[#c40050]/20 text-[#ff4d88] border border-[#c40050]/30 text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                          CYBER
                        </span>
                      )}
                      {esPromo && (
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                          PROMO
                        </span>
                      )}
                    </div>
                    <span className="font-black text-white shrink-0 text-sm">
                      {item.vistas.toLocaleString('es-AR')} <span className="text-[10px] font-normal text-slate-500">vistas</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${pctBarra}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              📌 Sesiones por Canal de Adquisición
            </span>
            <span className="text-[11px] text-slate-500">Distribución de canales GA4</span>
          </div>

          <div className="space-y-2">
            {canalesConTipo.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                  <span className="font-bold text-slate-200">{item.canal}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.categoria}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-white text-sm">
                    {item.sesiones.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 w-12 text-right">
                    {item.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}