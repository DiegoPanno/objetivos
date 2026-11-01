// src/components/GraficoEvolucionMensual.jsx
import React from 'react';

const formatearMontoCorto = (monto) => {
  if (!monto && monto !== 0) return '$0';
  const valor = Number(monto);
  if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1)}M`;
  }
  if (valor >= 1000) {
    return `${Math.round(valor / 1000)}K`;
  }
  return `$${valor}`;
};

export default function GraficoEvolucionMensual({
  mesActual,
  datosActuales,
  proyeccionFinalMes = 0,
  datosPorMes = {}
}) {
  // Configuración de meses con su paleta de colores individual original
  const mesesOrdenados = [
    { 
      clave: 'junio', 
      label: 'Junio', 
      corto: 'Jun',
      colorBarra: 'from-blue-600 to-blue-400' 
    },
    { 
      clave: 'julio', 
      label: 'Julio', 
      corto: 'Jul',
      colorBarra: 'from-cyan-600 to-cyan-400' 
    },
    { 
      clave: 'agosto', 
      label: 'Agosto', 
      corto: 'Ago',
      colorBarra: 'from-purple-600 to-purple-400' 
    },
    { 
      clave: 'septiembre', 
      label: 'Septiembre', 
      corto: 'Sep',
      colorBarra: 'from-sky-600 to-sky-400' 
    },
    { 
      clave: 'octubre', 
      label: 'Octubre', 
      corto: 'Oct',
      colorBarra: 'from-indigo-500 to-violet-400' 
    },
    { 
      clave: 'noviembre', 
      label: 'Noviembre', 
      corto: 'Nov',
      colorBarra: 'from-emerald-600 to-teal-400' 
    },
  ];

  // Extraer valores de cada mes
  const datosBarras = mesesOrdenados.map((m) => {
    const esMesActual = m.clave === 'noviembre';
    
    let facturado = 0;
    if (esMesActual) {
      facturado = datosActuales?.globales?.totalAcumulado || 0;
    } else {
      facturado = datosPorMes[m.clave]?.globales?.totalAcumulado || 0;
    }

    return {
      ...m,
      esMesActual,
      facturado,
      proyeccion: esMesActual ? proyeccionFinalMes : 0,
    };
  });

  const maxFacturado = Math.max(
    ...datosBarras.map((d) => Math.max(d.facturado, d.proyeccion)),
    100000000
  );

  return (
    <section className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xl w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-100 uppercase">
            Evolución Mensual
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          Últimos 6 meses
        </span>
      </div>

      {/* ÁREA DE GRÁFICO */}
      <div className="w-full">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-3 items-end h-52 sm:h-60 w-full pt-8 pb-2">
          {datosBarras.map((m) => {
            const porcentajeAltura = Math.min(Math.max((m.facturado / maxFacturado) * 100, 4), 100);
            const porcentajeAlturaProy = m.esMesActual
              ? Math.min(Math.max((m.proyeccion / maxFacturado) * 100, 4), 100)
              : 0;

            return (
              <div key={m.clave} className="flex flex-col items-center h-full justify-end relative group">
                
                {/* ETIQUETA FLOTANTE CON EL MONTO FACTURADO */}
                <div className="mb-1.5 text-center flex flex-col items-center">
                  {m.esMesActual && m.proyeccion > 0 && (
                    <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-400 whitespace-nowrap leading-tight">
                      Proy. {formatearMontoCorto(m.proyeccion)}
                    </span>
                  )}
                  <span
                    className={`text-[10px] sm:text-xs font-black whitespace-nowrap leading-tight ${
                      m.esMesActual ? 'text-emerald-300' : 'text-slate-100'
                    }`}
                  >
                    {formatearMontoCorto(m.facturado)}
                  </span>
                </div>

                {/* CONTENEDOR DE LA BARRA */}
                <div className="w-full max-w-[42px] sm:max-w-[48px] h-full flex items-end justify-center relative">
                  
                  {/* BARRA DE PROYECCIÓN DE FONDO (SÓLO NOVIEMBRE) */}
                  {m.esMesActual && (
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg bg-emerald-500/15 border-t-2 border-dashed border-emerald-400/60 transition-all duration-1000 pointer-events-none"
                      style={{ height: `${porcentajeAlturaProy}%` }}
                    ></div>
                  )}

                  {/* BARRA CON SU COLOR INDIVIDUAL */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-1000 bg-gradient-to-t ${m.colorBarra} ${
                      m.esMesActual ? 'shadow-[0_0_15px_rgba(16,185,129,0.35)]' : 'hover:brightness-110'
                    }`}
                    style={{ height: `${porcentajeAltura}%` }}
                  ></div>
                </div>

                {/* ETIQUETA DEL MES RESPONSIVE */}
                <span
                  className={`mt-2 font-bold tracking-tight text-center leading-none ${
                    m.esMesActual
                      ? 'text-emerald-300 font-extrabold text-[11px] sm:text-xs'
                      : 'text-slate-300 text-[10px] sm:text-xs'
                  }`}
                >
                  <span className="sm:hidden">{m.corto}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-500 pt-3 border-t border-slate-800/80 mt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-indigo-500 inline-block"></span>
          <span>Histórico cerrado</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-emerald-400 inline-block"></span>
          <span>Noviembre en curso</span>
        </span>
      </div>
    </section>
  );
}