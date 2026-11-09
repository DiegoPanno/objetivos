// src/components/CyberMondayModule.jsx
import React, { useState } from 'react';

// 🔒 HISTÓRICO CONSOLIDADO EXACTO - CYBER MONDAY (2 AL 8 DE NOVIEMBRE 2026)
const HISTORICO_CYBER_MONDAY = {
  totalAcumulado: 48531457,
  ritmoRealPorHora: 449365,
  metaHorariaEsperada: 338889,
  porcentajeCumplimientoHora: 132.6,
  canales: [
    { canal: 'WEB', acumulado: 19625323, meta: 18000000, porcentaje: 109.0 },
    { canal: 'MERCADO LIBRE', acumulado: 21195988, meta: 58000000, porcentaje: 36.5 },
    { canal: 'BAPRO', acumulado: 1981852, meta: 12000000, porcentaje: 16.5 },
    { canal: 'VTA.TELEFONO.', acumulado: 5728294, meta: 34000000, porcentaje: 16.8 }
  ],
  asesores: [
    { nombre: 'Iván', facturado: 4067855, conversaciones: 116, facturacionPorLead: 35068 },
    { nombre: 'Gabriela', facturado: 1660439, conversaciones: 140, facturacionPorLead: 11860 }
  ],
  // 📦 TOP 5 ARTÍCULOS MÁS VENDIDOS POR CANAL (CIERRE OFICIAL)
  rankingsPorCanal: {
    'Mercado Libre': [
      { codigo: '414', detalle: 'PINCEL VENCEDOR CERDA BLANCA Nº 10', cantidad: 35 },
      { codigo: '2', detalle: 'PINCEL VENCEDOR CERDA BLANCA Nº 20', cantidad: 23 },
      { codigo: '', detalle: 'CETOL CLASSIC VINTAGE SATIN.(Blanco) 4 L', cantidad: 20 },
      { codigo: '42', detalle: 'LIXA BLANCA NOFIL A275 Nº 180 (PQ)', cantidad: 20 },
      { codigo: '', detalle: 'CETOL BELLEZA NATURAL 4 L', cantidad: 16 }
    ],
    'Web Ámbito': [
      { codigo: '10180', detalle: 'ALBALATEX MATE 10 L', cantidad: 41 },
      { codigo: '10181', detalle: 'ALBALATEX MATE 20 L', cantidad: 21 },
      { codigo: '', detalle: 'ALBA CONSTRUCTOR LATEX INT/EXT.MATE (Blanco) 20 L', cantidad: 16 },
      { codigo: '65058', detalle: 'KUWAIT AEROSOL METALIZADO (Oro) 440 cc', cantidad: 12 },
      { codigo: '10453', detalle: 'ANTIHONGO ALBA INTERIOR 4 L', cantidad: 11 }
    ],
    'BAPRO': [
      { codigo: '4055', detalle: 'RODILLO ROSARPIN ANTIGOTA T40 22 cm (PQ)', cantidad: 4 },
      { codigo: '4028', detalle: 'PINCEL ROSARPIN SERIE 1462 N° 15 (PQ)', cantidad: 2 },
      { codigo: '4074', detalle: 'ROSARPIN MANTA ELASTICA (Venda) 1 m x 25 m', cantidad: 2 },
      { codigo: '18013', detalle: 'BRIK-COL LADRILLOS (Natural) 20 L', cantidad: 2 },
      { codigo: '4032', detalle: 'PINCEL ROSARPIN SERIE 170 N° 10 (PQ)', cantidad: 1 }
    ],
    'Gabriela': [
      { codigo: '51101', detalle: 'T2 AGUJA 6 x 1 TOOLISTER', cantidad: 200 },
      { codigo: '51216', detalle: 'T1 AGUJA 8 x 9/16 Z', cantidad: 200 },
      { codigo: '51207', detalle: 'TEL MADERA 8 x 1.1/2 D', cantidad: 70 },
      { codigo: '51208', detalle: 'TARUGO CON TOPE N° 8', cantidad: 70 },
      { codigo: '51702', detalle: 'CANTONERA 2.6 m - PRADECON', cantidad: 30 }
    ],
    'Iván': [
      { codigo: '9716', detalle: 'DENVER LATEX EXT.INT.c/POLIUR.(Negro) 20 L', cantidad: 9 },
      { codigo: '4626', detalle: 'MEMBRANA POLIURETANICA SUPERCAPA (Blanco) 20 Kg', cantidad: 7 },
      { codigo: '4055', detalle: 'RODILLO ROSARPIN ANTIGOTA T40 22 cm (PQ)', cantidad: 5 },
      { codigo: '4080', detalle: 'RODILLO ROSARPIN ANTIGOTA PROF.T50 22 cm (PQ)', cantidad: 4 },
      { codigo: '4082', detalle: 'RODILLO ROSARPIN HILADO T50 R-PREMIUM 22 cm (PQ)', cantidad: 4 }
    ]
  }
};

export default function CyberMondayModule() {
  const [canalTopActivo, setCanalTopActivo] = useState('Mercado Libre');

  const {
    canales,
    asesores,
    ritmoRealPorHora,
    metaHorariaEsperada,
    porcentajeCumplimientoHora,
    rankingsPorCanal
  } = HISTORICO_CYBER_MONDAY;

  const PESTANAS_PRODUCTOS = [
    { id: 'Mercado Libre', label: 'MeLi' },
    { id: 'Web Ámbito', label: 'Web' },
    { id: 'BAPRO', label: 'Bapro' },
    { id: 'Gabriela', label: 'Gabriela' },
    { id: 'Iván', label: 'Iván' },
  ];

  const top5Actual = rankingsPorCanal[canalTopActivo] || [];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#c40050]/20 via-slate-900 to-slate-950 border-2 border-[#c40050]/50 p-4 sm:p-6 rounded-3xl shadow-[0_0_35px_rgba(196,0,80,0.25)] space-y-5">
      
      {/* DETALLE SUPERIOR BICOLOR */}
      <div className="absolute top-0 inset-x-0 h-1.5 flex">
        <div className="w-1/2 bg-[#c40050]"></div>
        <div className="w-1/2 bg-[#ffd100]"></div>
      </div>

      {/* HEADER CYBER CONSOLIDADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#c40050]/30 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#c40050] text-white rounded-full shadow-lg shadow-[#c40050]/40 whitespace-nowrap">
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

        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-slate-700 text-xs shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="font-extrabold text-slate-200">Histórico Cerrado</span>
        </div>
      </div>

      {/* FILA COMPACTA DE LOS 4 CANALES (CONGELADOS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {canales.map((c, idx) => (
          <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-black tracking-wider text-slate-400 truncate">{c.canal}</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-indigo-300">
                {c.porcentaje.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base sm:text-lg font-black text-white">
                ${c.acumulado.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                meta: ${(c.meta / 1000000).toFixed(0)}M
              </span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-[#c40050] to-[#ffd100] rounded-full" 
                style={{ width: `${Math.min(c.porcentaje, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* BLOQUE MEDIO: VELOCÍMETRO + ASESORES (CONGELADOS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* WIDGET 1: VELOCÍMETRO HORARIO DE CIERRE */}
        <div className="lg:col-span-5 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                ⏱️ Velocímetro Horario
              </span>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 RITMO ÓPTIMO
              </span>
            </div>

            <div className="my-2">
              <span className="text-3xl font-black text-white">
                ${ritmoRealPorHora.toLocaleString('es-AR')}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">/ hora facturada</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800 my-2">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#c40050] to-[#ffd100]"
                style={{ width: `${Math.min(porcentajeCumplimientoHora, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Meta: <strong className="text-slate-200">${metaHorariaEsperada.toLocaleString('es-AR')}/h</strong></span>
              <span className="font-black text-[#ffd100]">{porcentajeCumplimientoHora.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Ventana activa: 08:00 a 20:00 hs</span>
            <span className="text-emerald-400 font-bold">✓ Cierre de campaña</span>
          </div>
        </div>

        {/* WIDGET 2: ASESORES CONGELADOS */}
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
            {asesores.map((asesor, idx) => {
              const medalla = idx === 0 ? '🥇' : '🥈';
              const esPrimero = idx === 0;

              return (
                <div 
                  key={asesor.nombre}
                  className={`p-3 rounded-xl flex items-center justify-between transition border ${
                    esPrimero 
                      ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-[#ffd100]/10 border-[#ffd100]/40 shadow-[0_0_15px_rgba(255,209,0,0.1)]' 
                      : 'bg-slate-900/80 border-slate-800'
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
                      Rendimiento: ${asesor.facturacionPorLead.toLocaleString('es-AR')} / chat
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* TOP 5 PRODUCTOS DE CYBER MONDAY POR CANAL (CIERRE CONGELADO) */}
      <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div>
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>🔥 Top 5 Artículos Más Vendidos</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                Ranking Final del Evento
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Unidades vendidas durante la Cyber Week (2 al 8 de Noviembre)</p>
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
                  {item.codigo && (
                    <span className="font-mono text-slate-400 text-[11px] shrink-0">{item.codigo}</span>
                  )}
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
              Sin registros para este canal durante el evento.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}