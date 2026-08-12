// src/components/ResumenEjecutivo.jsx
import React from 'react';

export default function ResumenEjecutivo({ datosCliengo, mesLabel }) {
  if (!datosCliengo) {
    return (
      <div className="mt-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-200">📊 Resumen Ejecutivo - Cliengo</h2>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{mesLabel}</span>
        </div>
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-slate-400">Cargando datos de Cliengo...</p>
        </div>
      </div>
    );
  }

  const {
    totalConversaciones = 0,
    totalLeads = 0,
    operadorHumano = 0,
    ventaSucursal = 0,
    ventaWeb = 0,
    ventaTelefonica = 0,
    resumenEtapas = [],
    desempenoAsesores = [],
    origenConversaciones = []
  } = datosCliengo;

  const totalVentas = ventaTelefonica + ventaSucursal + ventaWeb;
  const tasaConversion = totalLeads > 0 ? ((totalVentas / totalLeads) * 100).toFixed(1) : 0;
  const asesoresOrdenados = [...desempenoAsesores].sort((a, b) => b.conversaciones - a.conversaciones);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-slate-200">📊 Resumen Ejecutivo - Cliengo</h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{mesLabel}</span>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Conversaciones</span>
          <div className="text-2xl font-black text-slate-100 mt-1">{totalConversaciones}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-base text-slate-500">Leads:</span>
            <span className="text-base font-semibold text-cyan-400">{totalLeads}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ventas Telefónicas</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{ventaTelefonica}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-base text-slate-500">Sucursal:</span>
            <span className="text-base font-semibold text-amber-400">{ventaSucursal}</span>
            <span className="text-base text-slate-500 mx-1">|</span>
            <span className="text-base text-slate-500">Web:</span>
            <span className="text-base font-semibold text-indigo-400">{ventaWeb}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ventas Totales</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalVentas}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-base text-slate-500">Conversión:</span>
            <span className="text-base font-semibold text-emerald-400">{tasaConversion}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Intervención de vendedor</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{operadorHumano}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-base text-slate-500">del total:</span>
            <span className="text-base font-semibold text-blue-400">
              {totalConversaciones > 0 ? ((operadorHumano / totalConversaciones) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        
      </div>

      {/* ETAPAS Y ASESORES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">🔄 Etapas del Embudo</h3>
          <div className="space-y-3">
            {resumenEtapas.slice(0, 8).map((etapa, idx) => {
              const porcentaje = totalConversaciones > 0 
                ? ((etapa.cantidad / totalConversaciones) * 100).toFixed(1) 
                : 0;
              const colores = [
                'bg-emerald-500', 
                'bg-blue-500', 
                'bg-amber-500', 
                'bg-purple-500',
                'bg-pink-500',
                'bg-cyan-500'
              ];
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{etapa.nombre}</span>
                    <span className="text-slate-400">{etapa.cantidad} ({porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colores[idx % colores.length]}`}
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">👥 Desempeño por Asesor</h3>
          <div className="space-y-4">
            {asesoresOrdenados.slice(0, 4).map((asesor, idx) => {
              const porcentaje = totalConversaciones > 0 
                ? ((asesor.conversaciones / totalConversaciones) * 100).toFixed(1) 
                : 0;
              const colores = ['bg-emerald-400', 'bg-cyan-400', 'bg-blue-400', 'bg-purple-400'];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="font-semibold text-slate-200">{asesor.nombre}</span>
                      <span className="text-slate-400">{asesor.conversaciones} conversaciones</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colores[idx % colores.length]}`}
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-300 w-14 text-right">{porcentaje}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ORIGEN DE CONVERSACIONES */}
      {origenConversaciones.length > 0 && (
        <div className="mt-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📱 Origen de Conversaciones</h3>
          <div className="flex flex-wrap gap-3">
            {origenConversaciones.map((origen, idx) => {
              const colores = ['bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 
                               'bg-blue-500/20 text-blue-400 border-blue-500/30',
                               'bg-amber-500/20 text-amber-400 border-amber-500/30',
                               'bg-purple-500/20 text-purple-400 border-purple-500/30'];
              return (
                <div key={idx} className={`px-4 py-2 rounded-full border ${colores[idx % colores.length]}`}>
                  <span className="text-xs font-medium">{origen.nombre}</span>
                  <span className="text-xs font-bold ml-2">{origen.cantidad}</span>
                  <span className="text-xs text-slate-400 ml-1">({origen.porcentaje.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}