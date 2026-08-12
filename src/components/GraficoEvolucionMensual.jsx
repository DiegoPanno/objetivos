// src/components/GraficoEvolucionMensual.jsx
import React from 'react';

export default function GraficoEvolucionMensual({ 
  mesActual, 
  datosActuales,
  proyeccionFinalMes
}) {
  // 🔥 DATOS REALES
  const historicos = [
    { mes: 'Junio', facturado: 35748934 },
    { mes: 'Julio', facturado: 46013841 },
  ];

  const acumuladoActual = datosActuales?.totalAcumulado || 26015463;
  const proyeccion = proyeccionFinalMes || 67206613;

  const actual = {
    mes: mesActual?.label || 'Agosto',
    acumulado: acumuladoActual,
    proyeccion: proyeccion,
  };

  // Combinar datos para el gráfico
  const todosLosMeses = [
    ...historicos,
    { mes: actual.mes, facturado: actual.acumulado, esActual: true }
  ];

  // Encontrar el máximo valor para escalar (incluyendo proyección)
  const maxValor = Math.max(
    ...historicos.map(h => h.facturado),
    actual.acumulado,
    actual.proyeccion
  ) * 1.15;

  // Formatear a K (miles)
  const formatearK = (valor) => {
    if (valor >= 1000000) {
      return (valor / 1000000).toFixed(1) + 'M';
    }
    return (valor / 1000).toFixed(0) + 'K';
  };

  // Colores
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

      {/* GRÁFICO DE BARRAS */}
      <div className="flex items-end justify-around h-56 gap-4 px-2">
        {todosLosMeses.map((item, idx) => {
          const esActual = item.esActual || false;
          const altura = maxValor > 0 ? (item.facturado / maxValor) * 100 : 0;
          const color = colores[item.mes] || colores['Agosto'];
          
          // Calcular altura de la proyección (solo para agosto)
          const alturaProyeccion = esActual ? (actual.proyeccion / maxValor) * 100 : 0;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center max-w-[120px]">
              {/* NOMBRE DEL MES */}
              <span className={`text-xs font-bold mb-2`} style={{ color: color.text }}>
                {item.mes}
                {esActual && ' 🔥'}
              </span>

              {/* CONTENEDOR DE BARRAS */}
              <div className="relative w-full flex flex-col items-center justify-end h-44">
                {/* BARRA DE PROYECCIÓN (solo para agosto) */}
                {esActual && (
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
                    {/* ETIQUETA PROYECCIÓN */}
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-400/70 whitespace-nowrap">
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
                  {/* VALOR DENTRO DE LA BARRA (centrado) */}
                  <span 
                    className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-lg"
                    style={{ 
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      fontSize: altura > 25 ? '11px' : '0px',
                    }}
                  >
                    {altura > 25 && formatearK(item.facturado)}
                  </span>
                </div>

                {/* VALOR FUERA DE LA BARRA (si es muy pequeña) */}
                {altura <= 25 && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-200 whitespace-nowrap">
                    {formatearK(item.facturado)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    
    </div>
  );
}