import React, { useState, useEffect } from 'react';

export default function App() {
  const [mesSeleccionado, setMesSeleccionado] = useState('julio'); // 'julio' o 'junio'
  const [datosJulio, setDatosJulio] = useState({ canales: [], globales: {} });
  const [datosJunio, setDatosJunio] = useState({ canales: [], globales: {} });
  
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');

  const traerDatosDeGoogle = () => {
    setSincronizando(true);

    // Tus links CSV exactos por pestañas
    const urlJulio = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=51856544&single=true&output=csv";
    const urlJunio = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=0&single=true&output=csv";

    Promise.all([
      fetch(urlJulio).then(res => { if (!res.ok) throw new Error("Error en Julio"); return res.text(); }),
      fetch(urlJunio).then(res => { if (!res.ok) throw new Error("Error en Junio"); return res.text(); })
    ])
      .then(([csvJulio, csvJunio]) => {
        
        // Función para procesar la estructura de cada pestaña
        const procesarMes = (csvText) => {
          const lineas = csvText.split("\n").map(l => l.trim()).filter(Boolean);
          const cabeceras = lineas[0].split(",").map(c => c.replace("\r", "").trim());
          
          const filas = lineas.slice(1).map((linea) => {
            const valores = linea.split(",");
            const objeto = {};
            cabeceras.forEach((cab, i) => {
              objeto[cab] = valores[i] ? valores[i].replace("\r", "").trim() : "";
            });
            return objeto;
          });

          return {
            canales: filas.slice(0, 4),
            globales: {
              totalAcumulado: limpiarNumero(filas[6]?.["acumulado"]),
              totalMeta: limpiarNumero(filas[0]?.["Objetivo del mes"]),
              ritmoDiarioGlobalRequerido: limpiarNumero(filas[0]?.["Objective diario gupal"] || filas[0]?.["Objetivo diario gupal"]),
              ritmoDiarioGlobalActualCelda: limpiarNumero(filas[6]?.["actualdiario"]),
              diaDeVenta: limpiarNumero(filas[0]?.["día de venta"]) || 1
            }
          };
        };

        setDatosJulio(procesarMes(csvJulio));
        setDatosJunio(procesarMes(csvJunio));

        setError(null);
        setCargando(false);
        setSincronizando(false);
        
        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setUltimaActualizacion(`${ahora.toLocaleDateString('es-AR')} a las ${horaFormateada}`);
      })
      .catch((err) => {
        console.error(err);
        setError("Error de comunicación al sincronizar las pestañas con Google Sheets.");
        setCargando(false);
        setSincronizando(false);
      });
  };

  useEffect(() => {
    traerDatosDeGoogle();
  }, []);

  const limpiarNumero = (valor) => {
    if (!valor) return 0;
    const limpio = String(valor).replace(/\$/g, '').replace(/\./g, '').replace(/\s/g, '').trim();
    const numero = Number(limpio);
    return isNaN(numero) ? 0 : numero;
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wide text-slate-300">Cargando panel comercial interactivo...</p>
      </div>
    );
  }

  // Selección de datos según el mes activo en la UI
  const datosActivos = mesSeleccionado === 'julio' ? datosJulio : datosJunio;
  const { totalAcumulado, totalMeta, ritmoDiarioGlobalRequerido, ritmoDiarioGlobalActualCelda, diaDeVenta } = datosActivos.globales;
  const canalesActivos = datosActivos.canales;

  const porcentajeGlobal = totalMeta > 0 ? ((totalAcumulado / totalMeta) * 100).toFixed(1) : 0;
  const porcentajeDiarioAlcanzado = ritmoDiarioGlobalRequerido > 0 ? (ritmoDiarioGlobalActualCelda / ritmoDiarioGlobalRequerido) * 100 : 0;
  const porcentajeQueFalta = 100 - porcentajeDiarioAlcanzado;
  const objetivoDiarioCumplido = porcentajeDiarioAlcanzado >= 100;
  const brechaEnPlata = ritmoDiarioGlobalRequerido - ritmoDiarioGlobalActualCelda;

  // Matemática predictiva adaptada al mes seleccionado (Julio 31 días, Junio 30 días)
  const diasTotalesMes = mesSeleccionado === 'julio' ? 31 : 30;
  const promedioRealPorDia = totalAcumulado / diaDeVenta;
  const proyeccionFinalMes = promedioRealPorDia * diasTotalesMes;
  const brechaMetaFinal = proyeccionFinalMes - totalMeta;
  const seAlcanzaObjetivo = brechaMetaFinal >= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-8 font-sans antialiased">
      
      {/* HEADER CON SELECTOR DE PERIODO */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-800 pb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              🚀 Panel de Ritmo Diario
            </h1>
            
            {/* BOTONES MULTIMES */}
            <div className="flex items-center gap-2 mt-3 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
              <button
                onClick={() => setMesSeleccionado('julio')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${mesSeleccionado === 'julio' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Julio 2026 (Activo)
              </button>
              <button
                onClick={() => setMesSeleccionado('junio')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${mesSeleccionado === 'junio' ? 'bg-slate-800 text-slate-100 shadow border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Junio 2026 (Histórico)
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <button
              onClick={traerDatosDeGoogle}
              disabled={sincronizando}
              className={`p-2 rounded-xl bg-slate-800 text-slate-200 transition ${sincronizando ? 'animate-spin' : ''}`}
            >
              🔄
            </button>
            <div className="text-[11px]">
              <span className="text-slate-500 uppercase font-bold block">Último refresco</span>
              <span className="text-xs font-semibold text-slate-300">{ultimaActualizacion}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* CONTROL DE RITMO DIARIO */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl max-w-3xl">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Ritmo Diario ({mesSeleccionado.toUpperCase()})
              </span>
              <span className="text-2xl font-black text-white">
                ${ritmoDiarioGlobalActualCelda.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-400">/ día</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">Meta Requerida</span>
              <span className="text-xl font-bold text-slate-300">
                ${ritmoDiarioGlobalRequerido.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                objetivoDiarioCumplido ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-cyan-500'
              }`}
              style={{ width: `${Math.min(porcentajeDiarioAlcanzado, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span className={`font-black uppercase ${objetivoDiarioCumplido ? 'text-emerald-400' : 'text-amber-400'}`}>
              {porcentajeDiarioAlcanzado.toFixed(1)}% Alcanzado
            </span>
            <span>
              {objetivoDiarioCumplido 
                ? '🎉 ¡Ritmo diario superado!' 
                : `Falta solo un ${porcentajeQueFalta.toFixed(1)}% ($${brechaEnPlata.toLocaleString('es-AR')})`
              }
            </span>
          </div>
        </section>

        {/* PROGRESO MENSUAL CONSOLIDADO */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-200">Progreso Consolidado del Mes ({mesSeleccionado.toUpperCase()})</h2>
              <p className="text-xs text-slate-400 mt-0.5">Métricas de facturación acumulada del periodo seleccionado</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">{porcentajeGlobal}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-6 rounded-2xl overflow-hidden p-1 border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl transition-all duration-1000"
              style={{ width: `${Math.min(porcentajeGlobal, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-sm">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Total Facturado Acumulado</span>
              <span className="text-xl font-black text-slate-100">${totalAcumulado.toLocaleString('es-AR')}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Meta Mensual Establecida</span>
              <span className="text-xl font-black text-slate-300">${totalMeta.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* AJUSTE PREDICTIVO GLOBAL O TOTAL CERRADO */}
          <div className={`p-3 rounded-xl border text-xs font-semibold ${seAlcanzaObjetivo ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-rose-500/5 border-rose-500/10 text-rose-400'}`}>
            <span className="text-slate-400 font-normal uppercase text-[10px] tracking-wide block mb-0.5">
              {mesSeleccionado === 'julio' ? `Proyectado según facturación actual (Día ${diaDeVenta}/${diasTotalesMes}):` : 'Resultado Final de Cierre del Periodo:'}
            </span>
            <span className="text-sm font-bold text-white mr-2">
              ${(mesSeleccionado === 'julio' ? proyeccionFinalMes : totalAcumulado).toLocaleString('es-AR', {maximumFractionDigits:0})}
            </span>
            {mesSeleccionado === 'julio' ? (
              seAlcanzaObjetivo 
                ? `🟢 ¡Superando la meta por +$${brechaMetaFinal.toLocaleString('es-AR', {maximumFractionDigits:0})}!`
                : `⚠️ Nos quedamos cortos por -$${Math.abs(brechaMetaFinal).toLocaleString('es-AR', {maximumFractionDigits:0})}`
            ) : (
              `Meta de Junio cerrada exitosamente al ${porcentajeGlobal}%`
            )}
          </div>
        </section>

        {/* TARJETAS DE ENFOQUE POR CANAL */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-200">Enfoque por Canal de Venta ({mesSeleccionado.toUpperCase()})</h2>
            <p className="text-xs text-slate-400">Promedio diario actual frente al requerido de cada sector comercial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {canalesActivos.map((c, idx) => {
              const acum = limpiarNumero(c.acumulado);
              const metaCanal = limpiarNumero(c.meta);
              const diarioActual = limpiarNumero(c.actualdiario);
              const diarioReq = limpiarNumero(c.requeridodiario);
              const cantPedidos = limpiarNumero(c.Pedidos);
              const ticketProm = limpiarNumero(c["ticket promedio"]);
              const visitas = limpiarNumero(c.Visitas);
              
              // 🧮 CÁLCULO DE CONVERSIÓN EN TIEMPO REAL REALIZADO POR CÓDIGO
              // Evita errores de parsing por comas o strings defectuosos del CSV
              const conversionCalculada = visitas > 0 ? ((cantPedidos / visitas) * 100).toFixed(2) : "0.00";

              const cumplimientoCanal = metaCanal > 0 ? ((acum / metaCanal) * 100).toFixed(1) : 0;
              const enRitmo = diarioActual >= diarioReq;
              const brechaDiaria = diarioReq - diarioActual;

              const nombreCanalAMostrar = c.canal === "Vta.Telefono." ? "VENTA TELEFÓNICA" : c.canal.toUpperCase();

              return (
                <div key={c.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold tracking-wider text-slate-100 text-sm truncate">{nombreCanalAMostrar}</h3>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        enRitmo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {enRitmo ? 'En Ritmo' : 'Empujar'}
                      </span>
                    </div>

                    <div className="mb-4 bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Progreso Mes</span>
                        <span className="font-bold text-slate-200">{cumplimientoCanal}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${enRitmo ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(cumplimientoCanal, 100)}%` }} ></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-b border-slate-800/60 pb-3 mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ritmo:</span>
                        <span className="font-semibold text-slate-200">${diarioActual.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Requerido:</span>
                        <span className="font-semibold text-cyan-400">${diarioReq.toLocaleString('es-AR')}</span>
                      </div>
                    </div>

                    {/* GRIDS TRANSACCIONALES */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] mb-3 border-b border-slate-800/60 pb-3">
                      <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850/60">
                        <span className="text-slate-500 block mb-0.5">Pedidos</span>
                        <span className="font-bold text-slate-200">{cantPedidos.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850/60">
                        <span className="text-slate-500 block mb-0.5">Ticket Prom.</span>
                        <span className="font-bold text-teal-400">${ticketProm.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850/60">
                        <span className="text-slate-500 block mb-0.5">Visitas</span>
                        <span className="font-bold text-amber-400">{visitas.toLocaleString('es-AR')}</span>
                      </div>
                      
                      {/* RENDERIZADO DE CONVERSIÓN PURA DESDE LA MATEMÁTICA INTERNA */}
                      <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850/60">
                        <span className="text-slate-500 block mb-0.5">Conversión</span>
                        <span className="font-bold text-emerald-400">
                          {conversionCalculada}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-850">
                      <span className="text-slate-400 font-medium">Acumulado Mes:</span>
                      <span className="font-bold text-indigo-300">${acum.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  <div className={`mt-4 p-2.5 rounded-xl text-xs font-medium text-center transition ${enRitmo ? 'bg-emerald-500/5 text-emerald-300' : 'bg-blue-500/5 text-blue-300'}`}>
                    {enRitmo ? '🎯 Objetivo en cumplimiento.' : `Falta sumar $${brechaDiaria.toLocaleString('es-AR')} hoy.`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-16 text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
        Fuerza equipo Pinturerías Ámbito • Sincronizado en tiempo real.
      </footer>
    </div>
  );
}