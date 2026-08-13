// src/components/GraficoEvolucionMensual.jsx
import React from 'react';

export default function GraficoEvolucionMensual({ 
  mesActual, 
  datosActuales,
  proyeccionFinalMes,
  datosPorMes = {}
}) {
  // 1. Extraemos acumulados históricos o fallback
  const facturadoJunio = datosPorMes['junio']?.globales?.totalAcumulado || 35748934;
  const facturadoJulio = datosPorMes['julio']?.globales?.totalAcumulado || 46013841;

  const historicos = [
    { mes: 'Junio', facturado: facturadoJunio },
    { mes: 'Julio', facturado: facturadoJulio },
  ];

  // 2. Datos reales y proyección de Agosto
  const acumuladoActual = datosActuales?.globales?.totalAcumulado || datosActuales?.totalAcumulado || 0;
  const proyeccion = proyeccionFinalMes || 0;

  const actual = {
    mes: mesActual?.label ? mesActual.label.split(' ')[0] : 'Agosto',
    acumulado: acumuladoActual,
    proyeccion: proyeccion,
  };

  const todosLosMeses = [
    ...historicos,
    { mes: actual.mes, facturado: actual.acumulado, esActual: true }
  ];

  // 3. Definir escala máxima del gráfico
  const maxValorReal = Math.max(
    ...historicos.map(h => h.facturado),
    actual.acumulado,
    actual.proyeccion
  );

  const divisiones = 4;
  const maxEscala = Math.ceil((maxValorReal * 1.15) / 10000000) * 10000000 || 80000000;

  const formatearK = (valor) => {
    if (!valor) return '$0';
    if (valor >= 1000000) {
      return (valor / 1000000).toFixed(1) + 'M';
    }
    return (valor / 1000).toFixed(0) + 'K';
  };

  const colores = {
    'Junio': { bg: '#3b82f6', bgLight: '#3b82f640', text: '#60a5fa' },
    'Julio': { bg: '#06b6d4', bgLight: '#06b6d440', text: '#22d3ee' },
    'Agosto': { bg: '#10b981', bgLight: '#10b98140', text: '#34d399' },
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-6 text-center">
        📊 Evolución Mensual
      </h3>

      <div className="relative h-60 px-2">
        
        {/* LÍNEAS DE GRILLA HORIZONTALES UNIFORMES */}
        <div className="absolute inset-x-0 bottom-0 h-44 flex flex-col justify-between pointer-events-none z-0">
          {Array.from({ length: divisiones + 1 }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-full border-b border-slate-800/80 border-dashed"
            />
          ))}
        </div>

        {/* BARRAS DEL GRÁFICO */}
        <div className="relative z-10 flex items-end justify-around h-full gap-4">
          {todosLosMeses.map((item, idx) => {
            const esActual = item.esActual || false;
            const altura = maxEscala > 0 ? (item.facturado / maxEscala) * 100 : 0;
            const color = colores[item.mes] || colores['Agosto'];
            
            const alturaProyeccion = esActual && maxEscala > 0 ? (actual.proyeccion / maxEscala) * 100 : 0;
            const cabeTextoAdentro = altura > 22;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center max-w-[120px] h-full justify-end">
                {/* NOMBRE DEL MES */}
                <span className="text-base font-bold mb-2" style={{ color: color.text }}>
                  {item.mes}
                  {esActual && ' 🔥'}
                </span>

                {/* CONTENEDOR DE BARRAS */}
                <div className="relative w-full flex flex-col items-center justify-end h-44">
                  
                  {/* BARRA DE PROYECCIÓN (SOLO AGOSTO) */}
                  {esActual && actual.proyeccion > 0 && (
                    <div 
                      className="absolute w-full max-w-[60px] rounded-t-lg"
                      style={{ 
                        height: `${Math.max(alturaProyeccion, 2)}%`,
                        minHeight: '4px',
                        backgroundColor: color.bgLight,
                        border: `1px dashed ${color.bg}`,
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[12px] font-bold text-emerald-400/70 whitespace-nowrap">
                        Proy. {formatearK(actual.proyeccion)}
                      </span>
                    </div>
                  )}

                  {/* BARRA PRINCIPAL */}
                  <div 
                    className="w-full max-w-[60px] rounded-t-lg transition-all duration-1000 relative"
                    style={{ 
                      height: `${Math.max(altura, 2)}%`,
                      minHeight: '4px',
                      backgroundColor: color.bg,
                      opacity: esActual ? 1 : 0.85,
                      zIndex: 10,
                    }}
                  >
                    {/* VALOR SI CABE ADENTRO */}
                    {cabeTextoAdentro && (
                      <span 
                        className="absolute inset-0 flex items-center justify-center text-[15px] font-black text-white drop-shadow-lg"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        {formatearK(item.facturado)}
                      </span>
                    )}

                    {/* VALOR SI NO CABE ADENTRO (POSICIONADO JUSTO ARRIBA DE LA BARRA COLOR) */}
                    {!cabeTextoAdentro && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[15px] font-bold text-slate-200 whitespace-nowrap">
                        {formatearK(item.facturado)}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}