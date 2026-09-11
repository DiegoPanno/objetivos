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
    origenConversaciones = [],
    franjasHorarias = [],
    dineroCliengo = { presupuestado: 0, sucursal: 0, telefonica: 0, web: 0, totalDerivado: 0 }
  } = datosCliengo;

  const totalVentas = ventaTelefonica + ventaSucursal + ventaWeb;
  const tasaConversion = totalLeads > 0 ? ((totalVentas / totalLeads) * 100).toFixed(1) : 0;
  const asesoresOrdenados = [...desempenoAsesores].sort((a, b) => (b.conversaciones || 0) - (a.conversaciones || 0));

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-200">📊 Resumen Ejecutivo - Cliengo</h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{mesLabel}</span>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Conversaciones</span>
          <div className="text-2xl font-black text-slate-100 mt-1">{totalConversaciones}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-500">Leads calificados:</span>
            <span className="text-xs font-semibold text-cyan-400">{totalLeads}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ventas Telefónicas</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{ventaTelefonica}</div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="text-slate-500">Sucursal:</span>
            <span className="font-semibold text-amber-400">{ventaSucursal}</span>
            <span className="text-slate-600 mx-1">|</span>
            <span className="text-slate-500">Web:</span>
            <span className="font-semibold text-indigo-400">{ventaWeb}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ventas Totales</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalVentas}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-500">Tasa de Cierre:</span>
            <span className="text-xs font-semibold text-emerald-400">{tasaConversion}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Intervención Humana</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{operadorHumano}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-500">del total:</span>
            <span className="text-xs font-semibold text-blue-400">
              {totalConversaciones > 0 ? ((operadorHumano / totalConversaciones) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 💵 IMPACTO ECONÓMICO Y DERIVACIÓN DE DINERO */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Impacto en Facturación
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              💵 Dinero Presupuestado y Derivado a Canales
            </h3>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Total Gestionado: ${((dineroCliengo?.totalDerivado || 0) + (dineroCliengo?.presupuestado || 0)).toLocaleString('es-AR')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* PRESUPUESTADO */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-amber-400">Cotizado / En Cartera</span>
              <span className="text-[10px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20 font-bold">Pipeline</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              ${(dineroCliengo?.presupuestado || 0).toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Presupuestos activos en seguimiento</span>
          </div>

          {/* SUCURSALES */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-cyan-400">Derivado a Sucursales</span>
              <span className="text-[10px] bg-cyan-400/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-400/20 font-bold">Mostrador</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-300">
              ${(dineroCliengo?.sucursal || 0).toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Tráfico digital cerrado en locales</span>
          </div>

          {/* VENTA TELEFÓNICA */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-purple-400">Venta Telefónica</span>
              <span className="text-[10px] bg-purple-400/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-400/20 font-bold">Cierres</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-300">
              ${(dineroCliengo?.telefonica || 0).toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Cerrado por asesores del canal</span>
          </div>

          {/* VENTA WEB */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-400">Venta Web (E-commerce)</span>
              <span className="text-[10px] bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">Online</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300">
              ${(dineroCliengo?.web || 0).toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Completados en la tienda web</span>
          </div>
        </div>
      </div>

      {/* 🎯 TABLA EXPANDIDA: ORIGEN DE TRÁFICO (ADS vs ORGÁNICO) & ATRIBUCIÓN DE VENTAS */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              🎯 Origen de Tráfico (Pauta vs Orgánico) & Conversión de Ventas
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Atribución directa por campaña, volumen de chats y canal preferido de cierre
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            Fuente: Sheet 2
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-2.5 font-bold">Tipo de Tráfico</th>
                <th className="pb-2.5 font-bold text-center">Conversaciones</th>
                <th className="pb-2.5 font-bold text-center">% del Tráfico</th>
                <th className="pb-2.5 font-bold text-center text-emerald-400">Ventas Concretadas</th>
                <th className="pb-2.5 font-bold text-center text-teal-300">Tasa Conv. %</th>
                <th className="pb-2.5 font-bold text-right text-indigo-400">Canal Preferido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {origenConversaciones.length > 0 ? (
                origenConversaciones.map((row, idx) => {
                  const textoTipo = String(row?.tipo || row?.nombre || '').trim();
                  const tipoLower = textoTipo.toLowerCase();
                  const cantidad = row?.cantidad ?? 0;
                  const porcentaje = row?.porcentaje ?? 0;
                  const ventas = row?.ventasConcretadas ?? 0;
                  const tasa = row?.tasaConversion ?? '0,00%';
                  const canalPref = row?.canalPreferido ?? 'Sin ventas';

                  const esOrganico = tipoLower.includes('orgánico') || tipoLower.includes('organico') || tipoLower.includes('directo');
                  const esFb = tipoLower.includes('facebook');
                  const esIg = tipoLower.includes('instagram');
                  const esGoogle = tipoLower.includes('google');

                  let dotColor = 'bg-cyan-400';
                  if (esOrganico) dotColor = 'bg-emerald-400';
                  else if (esFb) dotColor = 'bg-blue-500';
                  else if (esIg) dotColor = 'bg-pink-500';
                  else if (esGoogle) dotColor = 'bg-amber-400';

                  return (
                    <tr key={idx} className="hover:bg-slate-850/40 transition">
                      <td className="py-3 font-semibold text-slate-200 flex items-center gap-2 text-xs sm:text-sm">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></span>
                        {textoTipo || 'Sin especificar'}
                      </td>
                      <td className="py-3 text-center font-bold text-slate-100 text-xs sm:text-sm">
                        {cantidad}
                      </td>
                      <td className="py-3 text-center font-medium text-slate-400 text-xs sm:text-sm">
                        {typeof porcentaje === 'number' ? `${porcentaje.toFixed(2)}%` : porcentaje}
                      </td>
                      <td className="py-3 text-center font-black text-emerald-400 text-xs sm:text-sm">
                        {ventas}
                      </td>
                      <td className="py-3 text-center font-bold text-teal-300 text-xs sm:text-sm">
                        {tasa}
                      </td>
                      <td className="py-3 text-right font-extrabold text-indigo-300 text-xs sm:text-sm">
                        {canalPref}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-xs text-slate-500">
                    Cargando datos de atribución publicitaria...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🕒 MÓDULO DE DEMANDA HORARIA TELEFÓNICA (08:00 A 19:00 HS) */}
      {franjasHorarias.length > 0 && (
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                Distribución de Carga Telefónica
              </span>
              <h3 className="text-base font-black text-white mt-0.5">Horarios de Mayor Demanda</h3>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Jornada Comercial 08:00 a 19:00 hs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {franjasHorarias.map((f, idx) => {
              const esPico = f.franja.includes("10:00") || f.franja.includes("13:59");
              const maxConsultas = Math.max(...franjasHorarias.map(h => h.totalConsultas || 1));
              const porcentajeVisual = maxConsultas > 0 ? (f.totalConsultas / maxConsultas) * 100 : 0;

              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition ${
                    esPico 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-slate-950/60 border-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">{f.franja}</span>
                      {esPico && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          🔥 Pico
                        </span>
                      )}
                    </div>

                    <div className="my-2">
                      <span className="text-2xl font-black text-white">{f.totalConsultas}</span>
                      <span className="text-xs text-slate-400 block">consultas entrantes</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          esPico ? 'bg-amber-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.max(porcentajeVisual, 5)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Cierres Tel:</span>
                    <span className="font-bold text-cyan-300">
                      {f.ventasTel} <span className="text-slate-500 font-normal">({f.pctTel})</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILA DE 2 TABLAS: ETAPAS | ASESORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TABLA 1: ETAPAS DEL EMBUDO */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">🔄 Etapas del Embudo</h3>
          <div className="space-y-3">
            {resumenEtapas.slice(0, 8).map((etapa, idx) => {
              const cantidad = etapa?.cantidad || 0;
              const porcentaje = totalConversaciones > 0 
                ? ((cantidad / totalConversaciones) * 100).toFixed(1) 
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
                    <span className="text-slate-300">{etapa?.nombre || 'Etapa'}</span>
                    <span className="text-slate-400">{cantidad} ({porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colores[idx % colores.length]}`}
                      style={{ width: `${Math.min(Number(porcentaje), 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TABLA 2: DESEMPEÑO POR ASESOR */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">👥 Desempeño por Asesor</h3>
          <div className="space-y-4">
            {asesoresOrdenados.slice(0, 4).map((asesor, idx) => {
              const conv = asesor?.conversaciones || 0;
              const porcentaje = totalConversaciones > 0 
                ? ((conv / totalConversaciones) * 100).toFixed(1) 
                : 0;
              const colores = ['bg-emerald-400', 'bg-cyan-400', 'bg-blue-400', 'bg-purple-400'];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="font-semibold text-slate-200">{asesor?.nombre || 'Asesor'}</span>
                      <span className="text-slate-400">{conv} conversaciones</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colores[idx % colores.length]}`}
                        style={{ width: `${Math.min(Number(porcentaje), 100)}%` }}
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
    </div>
  );
}