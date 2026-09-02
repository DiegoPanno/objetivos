// src/components/MesModule.jsx
import React from 'react';
import ResumenEjecutivo from './ResumenEjecutivo';
import GraficoEvolucionMensual from './GraficoEvolucionMensual';

const limpiarNumero = (valor) => {
  if (!valor && valor !== 0) return 0;
  if (typeof valor === 'number') return valor;
  const texto = String(valor).trim();
  const esNegativo = texto.startsWith('-') || texto.includes('(');
  const limpio = texto.replace(/[^0-9]/g, '');
  const numero = Number(limpio);
  if (isNaN(numero)) return 0;
  return esNegativo ? -numero : numero;
};

export default function MesModule({ 
  mes, 
  datos, 
  esActivo,
  ultimaActualizacion,
  datosCliengo,
  datosPorMes = {} 
}) {
  const { 
    totalAcumulado = 0, 
    totalMeta = 0, 
    ritmoDiarioGlobalRequerido = 0, 
    ritmoDiarioGlobalActualCelda = 0, 
    diaDeVenta = 1 
  } = datos.globales || {};

  const canalesActivos = datos.canales || [];
  const diasTotalesMes = mes?.dias || 30;

  // Suma directa de litros de los canales
  const sumaLitrosCanales = canalesActivos.reduce((acc, c) => acc + limpiarNumero(c.litros), 0);

  const totalLitrosFinal = (datos.globales?.totalLitros && limpiarNumero(datos.globales.totalLitros) > 0)
    ? limpiarNumero(datos.globales.totalLitros)
    : sumaLitrosCanales;

  const porcentajeGlobal = totalMeta > 0 ? ((totalAcumulado / totalMeta) * 100).toFixed(1) : 0;
  const porcentajeDiarioAlcanzado = ritmoDiarioGlobalRequerido > 0 ? (ritmoDiarioGlobalActualCelda / ritmoDiarioGlobalRequerido) * 100 : 0;
  const porcentajeQueFalta = 100 - porcentajeDiarioAlcanzado;
  const objetivoDiarioCumplido = porcentajeDiarioAlcanzado >= 100;
  const brechaEnPlata = ritmoDiarioGlobalRequerido - ritmoDiarioGlobalActualCelda;

  const promedioRealPorDia = diaDeVenta > 0 ? totalAcumulado / diaDeVenta : 0;
  const proyeccionFinalMes = promedioRealPorDia * diasTotalesMes;
  const brechaMetaFinal = proyeccionFinalMes - totalMeta;
  const seAlcanzaObjetivo = brechaMetaFinal >= 0;

  return (
    <div className="space-y-8">
      {/* CONTROL DE RITMO DIARIO */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl max-w-3xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Ritmo Diario {esActivo ? '🔥' : '(Histórico)'}
            </span>
            <span className="text-3xl font-black text-white">
              ${ritmoDiarioGlobalActualCelda?.toLocaleString('es-AR') || 0} <span className="text-xs font-normal text-slate-400">/ día</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">Meta Requerida</span>
            <span className="text-2xl font-black text-slate-200">
              ${ritmoDiarioGlobalRequerido?.toLocaleString('es-AR') || 0}
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-2.5">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              objetivoDiarioCumplido ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-cyan-500'
            }`}
            style={{ width: `${Math.min(porcentajeDiarioAlcanzado, 100)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-slate-400">
          <span className={`font-black uppercase tracking-wide ${objetivoDiarioCumplido ? 'text-emerald-400' : 'text-amber-400'}`}>
            {porcentajeDiarioAlcanzado.toFixed(1)}% Alcanzado
          </span>
          <span className="font-semibold">
            {objetivoDiarioCumplido 
              ? '🎉 ¡Ritmo diario superado!' 
              : `Falta solo un ${porcentajeQueFalta.toFixed(1)}% ($${brechaEnPlata?.toLocaleString('es-AR') || 0})`
            }
          </span>
        </div>
      </section>

      {/* 📈 GRÁFICO DE EVOLUCIÓN MENSUAL */}
      {esActivo && (
        <GraficoEvolucionMensual 
          mesActual={mes}
          datosActuales={datos}
          proyeccionFinalMes={proyeccionFinalMes}
          datosPorMes={datosPorMes}
        />
      )}

      {/* PROGRESO MENSUAL CONSOLIDADO */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-200">Progreso Consolidado {mes?.label || ''}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {esActivo ? 'Métricas de facturación acumulada del periodo' : 'Resultado final del periodo histórico'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-black text-indigo-400">{porcentajeGlobal}%</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 h-7 rounded-2xl overflow-hidden p-1 border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl transition-all duration-1000"
            style={{ width: `${Math.min(porcentajeGlobal, 100)}%` }}
          ></div>
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-sm sm:text-base">
          <div>
            <span className="text-xs sm:text-sm text-slate-400 block mb-0.5 font-medium">Total Facturado</span>
            <span className="text-2xl font-black text-slate-100">${totalAcumulado?.toLocaleString('es-AR') || 0}</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-slate-400 block mb-0.5 font-medium">Meta Mensual</span>
            <span className="text-2xl font-black text-slate-300">${totalMeta?.toLocaleString('es-AR') || 0}</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-slate-400 block mb-0.5 font-medium">📦 Total Litros (4 Canales)</span>
            <span className="text-2xl font-black text-cyan-400">
              {totalLitrosFinal.toLocaleString('es-AR', { maximumFractionDigits: 0 })} L
            </span>
          </div>
        </div>

        {esActivo && (
          <div className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold ${seAlcanzaObjetivo ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-rose-500/5 border-rose-500/10 text-rose-400'}`}>
            <span className="text-slate-400 font-normal uppercase text-xs tracking-wide block mb-1">
              Proyectado según facturación actual (Día {diaDeVenta || 1}/{diasTotalesMes}):
            </span>
            <span className="text-base sm:text-lg font-black text-white mr-2">
              ${proyeccionFinalMes?.toLocaleString('es-AR', { maximumFractionDigits: 0 }) || 0}
            </span>
            {seAlcanzaObjetivo 
              ? `🟢 ¡Superando la meta por +$${brechaMetaFinal?.toLocaleString('es-AR', { maximumFractionDigits: 0 }) || 0}!`
              : `⚠️ Nos quedaríamos cortos por -$${Math.abs(brechaMetaFinal || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
            }
          </div>
        )}

        {!esActivo && (
          <div className="p-4 rounded-xl border border-slate-700/30 bg-slate-800/20 text-slate-300 text-xs sm:text-sm">
            <span className="font-semibold">📊 Periodo cerrado</span>
            <span className="block text-slate-400 mt-1">Resultado final del mes {mes?.label || ''}</span>
          </div>
        )}
      </section>

      {/* TARJETAS DE ENFOQUE POR CANAL */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-200">Enfoque por Canal de Venta</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {esActivo ? 'Promedio diario actual frente al requerido de cada sector' : 'Desempeño final por canal'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {canalesActivos.map((c, idx) => {
            const acum = limpiarNumero(c.acumulado);
            const metaCanal = limpiarNumero(c.meta || c["Objetivo del mes"]);
            const diarioActual = limpiarNumero(c.actualdiario);
            const diarioReq = limpiarNumero(c.requeridodiario);
            const cantPedidos = limpiarNumero(c.Pedidos);
            const ticketProm = limpiarNumero(c["ticket promedio"]);
            const visitas = limpiarNumero(c.Visitas);
            
            const margen = limpiarNumero(c.margen);
            const litros = limpiarNumero(c.litros);
            const faltaFacturar = limpiarNumero(c.faltaFacturar);
            
            const esVentaTelefonica = c.canal?.toLowerCase().includes('vta.telefono') || 
                                      c.canal?.toLowerCase().includes('telefónica') ||
                                      c.canal?.toLowerCase() === 'vtatel' ||
                                      c.canal?.toLowerCase() === 'vtatelefono';
            
            let vendedores = [];
            if (esVentaTelefonica && c.vendedores) {
              vendedores = c.vendedores
                .map(v => ({
                  nombre: v.nombre || v.canal,
                  venta: limpiarNumero(v.acumulado)
                }))
                .filter(v => v.venta > 0);
            }
            
            vendedores.sort((a, b) => b.venta - a.venta);

            const conversionCalculada = visitas > 0 ? ((cantPedidos / visitas) * 100).toFixed(2) : "0.00";
            const cumplimientoCanal = metaCanal > 0 ? ((acum / metaCanal) * 100).toFixed(1) : 0;
            const enRitmo = diarioActual >= diarioReq;
            const brechaDiaria = diarioReq - diarioActual;

            // Cálculos precisos de Share
            const shareVentas = totalAcumulado > 0 ? ((acum / totalAcumulado) * 100).toFixed(1) : "0.0";
            const shareObjetivo = totalMeta > 0 ? ((metaCanal / totalMeta) * 100).toFixed(1) : "0.0";
            
            const nombreCanalAMostrar = c.canal === "Vta.Telefono." ? "VENTA TELEFÓNICA" : 
                                         c.canal === "vtatel" ? "VENTA TELEFÓNICA" :
                                         c.canal === "vtaTelefono" ? "VENTA TELEFÓNICA" :
                                         c.canal?.toUpperCase() || '';

            return (
              <div key={c.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold tracking-wider text-slate-100 text-base truncate">{nombreCanalAMostrar}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      enRitmo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {enRitmo ? 'En Ritmo' : 'Empujar'}
                    </span>
                  </div>

                  <div className="mb-4 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                    <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-1.5">
                      <span className="font-medium">Progreso Mes</span>
                      <span className="font-black text-slate-100">{cumplimientoCanal}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${enRitmo ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(cumplimientoCanal, 100)}%` }} ></div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm border-b border-slate-800/60 pb-3 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ritmo:</span>
                      <span className="font-bold text-slate-100">${diarioActual.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requerido:</span>
                      <span className="font-bold text-cyan-400">${diarioReq.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-4 border-b border-slate-800/60 pb-3.5">
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-slate-400 block mb-0.5 text-xs font-semibold">Pedidos</span>
                      <span className="font-black text-slate-100 text-sm sm:text-base">{cantPedidos.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-slate-400 block mb-0.5 text-xs font-semibold">Ticket Prom.</span>
                      <span className="font-black text-teal-400 text-xs sm:text-sm">${ticketProm.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-slate-400 block mb-0.5 text-xs font-semibold">Visitas</span>
                      <span className="font-black text-amber-400 text-sm sm:text-base">{visitas.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-slate-400 block mb-0.5 text-xs font-semibold">Conversión</span>
                      <span className="font-black text-emerald-400 text-sm sm:text-base">
                        {conversionCalculada}%
                      </span>
                    </div>
                  </div>

                  {/* MÉTRICAS: Margen y Litros */}
                  <div className="grid grid-cols-2 gap-2 mb-4 border-b border-slate-800/60 pb-3.5">
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-slate-400 block mb-0.5 text-[10px] font-semibold">💰 Margen Bruto</span>
                      <span className="font-black text-sm text-slate-100">
                        ${margen.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-slate-400 block mb-0.5 text-[10px] font-semibold">📦 Litros</span>
                      <span className="font-black text-slate-100 text-sm">
                        {litros.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  {/* MONTO ACUMULADO Y SHARES */}
                  <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-400 font-semibold">Acumulado Mes:</span>
                      <span className="font-black text-indigo-300">${acum.toLocaleString('es-AR')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-1.5">
                      <span className="text-slate-400 font-medium">Share Ventas:</span>
                      <span className="font-black text-purple-300">{shareVentas}% del total</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-1.5">
                      <span className="text-slate-400 font-medium">Share Objetivo:</span>
                      <span className="font-black text-cyan-300">{shareObjetivo}% de meta</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-1.5">
                      <span className="text-slate-400 font-medium">Falta facturar:</span>
                      <span className={`font-black ${faltaFacturar <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ${Math.abs(faltaFacturar).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        {faltaFacturar <= 0 && acum > 0 && ' ✅'}
                      </span>
                    </div>
                    
                    {/* VENDEDORES */}
                    {esVentaTelefonica && vendedores.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/60">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          👥 Vendedores
                        </span>
                        {vendedores.map((v, vIdx) => {
                          const porcentajeVendedor = acum > 0 ? ((v.venta / acum) * 100).toFixed(1) : 0;
                          return (
                            <div key={vIdx} className="flex justify-between items-center py-1.5 border-b border-slate-800/30 last:border-0">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${vIdx === 0 ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
                                <span className="text-xs font-semibold text-slate-200">{v.nombre}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-100">
                                  ${v.venta.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-xs text-slate-400 w-12 text-right">
                                  {porcentajeVendedor}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/60">
                          <span className="text-xs font-bold text-cyan-400">Total Vendedores</span>
                          <span className="text-xs font-bold text-slate-100">
                            ${vendedores.reduce((sum, v) => sum + v.venta, 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`mt-4 p-3 rounded-xl text-xs sm:text-sm font-semibold text-center transition ${enRitmo ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'}`}>
                  {enRitmo ? '🎯 Objetivo en cumplimiento.' : `Falta sumar $${brechaDiaria.toLocaleString('es-AR')} hoy.`}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 📊 MÓDULO CLIENGO */}
      {datosCliengo && (
        <ResumenEjecutivo 
          datosCliengo={datosCliengo} 
          mesLabel={mes?.label || ''}
        />
      )}

      {esActivo && !datosCliengo && (
        <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <p className="text-xs text-amber-400">
            ⚠️ Datos de Cliengo no disponibles para {mes?.label || ''}. Verifica que la pestaña esté publicada.
          </p>
        </div>
      )}
    </div>
  );
}