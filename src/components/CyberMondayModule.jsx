// src/components/CyberMondayModule.jsx
import React, { useState } from 'react';

export default function CyberMondayModule({ datos, datosCliengo, mes, productos = [] }) {
  const { 
    totalAcumulado = 0, 
    ritmoDiarioGlobalActualCelda = 0, 
    ritmoDiarioGlobalRequerido = 0 
  } = datos?.globales || {};
  
  const canales = datos?.canales || [];

  // Pestaña activa para el Top 5 de productos
  const [canalTopActivo, setCanalTopActivo] = useState('Mercado Libre');

  // 1. CÁLCULO NORMALIZADO DE RUN-RATE HORARIO (Jornada de 12 horas comerciales)
  const ahora = new Date();
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();
  const horaInicio = 8;
  const horaFin = 20;
  const horasTotalesJornada = horaFin - horaInicio; // 12 horas

  // Meta por hora requerida para cumplir el objetivo del día ($4.066.667 / 12 hs = $338.889/h)
  const metaHorariaEsperada = ritmoDiarioGlobalRequerido > 0 
    ? (ritmoDiarioGlobalRequerido / horasTotalesJornada) 
    : 0;

  // Velocidad horaria real derivada del ritmo diario efectivo de la empresa
  const ritmoRealPorHora = ritmoDiarioGlobalActualCelda > 0 
    ? (ritmoDiarioGlobalActualCelda / horasTotalesJornada) 
    : 0;

  const porcentajeCumplimientoHora = metaHorariaEsperada > 0 
    ? (ritmoRealPorHora / metaHorariaEsperada) * 100 
    : 0;

  const velocidadOptima = porcentajeCumplimientoHora >= 100;

  // 2. EXTRACCIÓN Y CRUCE DE ASESORES (Gabriela e Iván)
  const canalTelefonico = canales.find(c => {
    const n = (c.canal || '').toLowerCase();
    return n.includes('telefono') || n.includes('telefónica') || n === 'vtatel';
  });

  const vendedoresFacturacion = canalTelefonico?.vendedores || [];
  const asesoresCliengo = datosCliengo?.desempenoAsesores || [];

  const listaNombres = ['Gabriela', 'Ivan'];

  const metricasAsesores = listaNombres.map(nombre => {
    const vFact = vendedoresFacturacion.find(v => 
      (v.nombre || '').toLowerCase().includes(nombre.toLowerCase())
    );
    const facturado = vFact ? Number(vFact.acumulado || 0) : 0;

    const vCliengo = asesoresCliengo.find(a => 
      (a.nombre || '').toLowerCase().includes(nombre.toLowerCase())
    );
    const conversaciones = vCliengo ? Number(vCliengo.conversaciones || 0) : 0;

    const facturacionPorLead = conversaciones > 0 ? (facturado / conversaciones) : 0;

    return {
      nombre: nombre === 'Ivan' ? 'Iván' : nombre,
      facturado,
      conversaciones,
      facturacionPorLead
    };
  });

  metricasAsesores.sort((a, b) => b.facturado - a.facturado);

  // 3. CANALES PARA PESTAÑAS TOP 5
  const PESTANAS_PRODUCTOS = [
    { id: 'Mercado Libre', label: 'MeLi' },
    { id: 'Web Ámbito', label: 'Web' },
    { id: 'BAPRO', label: 'Bapro' },
    { id: 'Gabriela', label: 'Gabriela' },
    { id: 'Iván', label: 'Iván' },
  ];

  const top5Actual = (productos || [])
    .filter(p => p.canalNormalizado === canalTopActivo)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#c40050]/20 via-slate-900 to-slate-950 border-2 border-[#c40050]/50 p-4 sm:p-6 rounded-3xl shadow-[0_0_35px_rgba(196,0,80,0.25)] space-y-5">
      
      {/* DETALLE SUPERIOR BICOLOR */}
      <div className="absolute top-0 inset-x-0 h-1.5 flex">
        <div className="w-1/2 bg-[#c40050]"></div>
        <div className="w-1/2 bg-[#ffd100]"></div>
      </div>

      {/* HEADER CYBER CON BRANDING ÁMBITO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#c40050]/30 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#c40050] text-white rounded-full shadow-lg shadow-[#c40050]/40 animate-pulse whitespace-nowrap">
              ⚡ LIVE CYBER MONDAY
            </span>
            <span className="text-[11px] sm:text-xs text-amber-300 font-bold tracking-wide">
              2 al 8 de Noviembre • Ámbito Oficial
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Centro de Operaciones Cyber Monday
          </h2>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-[#ffd100]/40 text-xs shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffd100] animate-ping"></span>
          <span className="font-extrabold text-[#ffd100]">Monitoreo en Vivo</span>
        </div>
      </div>

      {/* FILA COMPACTA DE LOS 4 CANALES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {canales.slice(0, 4).map((c, idx) => {
          const acum = Number(c.acumulado || 0);
          const meta = Number(c.meta || 0);
          const pct = meta > 0 ? ((acum / meta) * 100).toFixed(1) : 0;
          const nombre = c.canal?.toUpperCase() || `CANAL ${idx + 1}`;

          return (
            <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black tracking-wider text-slate-400 truncate">{nombre}</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-indigo-300">
                  {pct}%
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base sm:text-lg font-black text-white">
                  ${acum.toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  meta: ${(meta / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-[#c40050] to-[#ffd100] rounded-full" 
                  style={{ width: `${Math.min(pct, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BLOQUE MEDIO: VELOCÍMETRO + ASESORES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* WIDGET 1: VELOCÍMETRO RUN-RATE HORARIO */}
        <div className="lg:col-span-5 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                ⏱️ Velocímetro Horario
              </span>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${
                velocidadOptima 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-[#ffd100]/20 text-[#ffd100] border border-[#ffd100]/40'
              }`}>
                {velocidadOptima ? '🟢 RITMO ÓPTIMO' : '⚠️ ACELERAR PAUTA'}
              </span>
            </div>

            <div className="my-2">
              <span className="text-3xl font-black text-white">
                ${Math.round(ritmoRealPorHora).toLocaleString('es-AR')}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">/ hora facturada</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800 my-2">
              <div 
                className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#c40050] to-[#ffd100]"
                style={{ width: `${Math.min(porcentajeCumplimientoHora, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Meta: <strong className="text-slate-200">${Math.round(metaHorariaEsperada).toLocaleString('es-AR')}/h</strong></span>
              <span className="font-black text-[#ffd100]">{porcentajeCumplimientoHora.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Ventana activa: 08:00 a 20:00 hs</span>
            <span>Hora {horaActual}:{minutosActuales < 10 ? `0${minutosActuales}` : minutosActuales}</span>
          </div>
        </div>

        {/* WIDGET 2: ASESORES */}
        <div className="lg:col-span-7 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                👥 Asesores en Venta Telefónica & WhatsApp
              </h3>
              <p className="text-[11px] text-slate-400">Cierre comercial cruzado con carga de Cliengo</p>
            </div>
            <span className="text-[10px] bg-[#c40050]/20 text-[#ff4d88] border border-[#c40050]/40 font-extrabold px-2.5 py-0.5 rounded-full">
              Live Ranking
            </span>
          </div>

          <div className="space-y-2.5">
            {metricasAsesores.map((asesor, idx) => {
              const medalla = idx === 0 ? '🥇' : '🥈';
              const esPrimero = idx === 0;

              return (
                <div 
                  key={asesor.nombre}
                  className={`p-3 rounded-xl flex items-center justify-between transition border ${
                    esPrimero 
                      ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-[#ffd100]/10 border-[#ffd100]/40 shadow-[0_0_15px_rgba(255,209,0,0.1)]' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{medalla}</span>
                    <div>
                      <span className="text-sm font-black text-slate-100 block">
                        {asesor.nombre}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {asesor.conversaciones} chats asignados
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm sm:text-base font-black block ${esPrimero ? 'text-[#ffd100]' : 'text-slate-100'}`}>
                      ${asesor.facturado.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Rendimiento: ${Math.round(asesor.facturacionPorLead).toLocaleString('es-AR')} / chat
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* TOP 5 PRODUCTOS DE CYBER MONDAY POR CANAL */}
      <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div>
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>🔥 Top 5 Artículos Más Vendidos</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                Ajuste en Tiempo Real
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Ranking en unidades para reponer stock o revisar promociones</p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            {PESTANAS_PRODUCTOS.map(p => (
              <button
                key={p.id}
                onClick={() => setCanalTopActivo(p.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  canalTopActivo === p.id 
                    ? 'bg-gradient-to-r from-[#c40050] to-[#ffd100] text-slate-950 shadow font-black' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          {top5Actual.length > 0 ? (
            top5Actual.map((item, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-850 hover:border-slate-700 px-3 py-2 rounded-xl flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2.5 truncate pr-3">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                    idx === 0 ? 'bg-[#ffd100] text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px] shrink-0">{item.codigo}</span>
                  <span className="font-medium text-slate-200 truncate">{item.detalle}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-white text-sm">
                    {item.cantidad.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">un.</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-slate-500 text-xs bg-slate-900/30 rounded-xl border border-dashed border-slate-850">
              Aún no se registraron ventas de {canalTopActivo} en este periodo.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}