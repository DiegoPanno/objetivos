import React, { useState, useEffect } from 'react';

export default function App() {
  const [canales, setCanales] = useState([]);
  const [totalesGlobales, setTotalesGlobales] = useState({
    totalAcumulado: 0,
    totalMeta: 0,
    ritmoDiarioGlobalRequerido: 0,
    ritmoDiarioGlobalActualCelda: 0 
  });
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');

  // Función para traer los datos en vivo desde Google Drive
  const traerDatosDeGoogle = () => {
    setSincronizando(true);
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?output=csv")
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo conectar con Google Drive.");
        return response.text();
      })
      .then((text) => {
        const lineas = text.split("\n").map(linea => linea.trim()).filter(Boolean);
        const cabeceras = lineas[0].split(",");
        
        const filasProcesadas = lineas.slice(1).map((linea) => {
          const valores = linea.split(",");
          const objeto = {};
          cabeceras.forEach((cabecera, i) => {
            const clave = cabecera.replace("\r", "").trim();
            objeto[clave] = valores[i] ? valores[i].replace("\r", "").trim() : "";
          });
          return objeto;
        });

        const canalesIndividuales = filasProcesadas.slice(0, 4);
        const filaOcho = filasProcesadas[6] || {}; 
        const filaDos = filasProcesadas[0] || {}; 

        setTotalesGlobales({
          totalAcumulado: limpiarNumero(filaOcho["acumulado"] || filaOcho[cabeceras[4]]), 
          totalMeta: limpiarNumero(filaDos["Objetivo del mes"] || filaDos[cabeceras[8]]), 
          ritmoDiarioGlobalRequerido: limpiarNumero(filaDos["Objetivo diario gupal"] || filaDos[cabeceras[9]]), 
          ritmoDiarioGlobalActualCelda: limpiarNumero(filaOcho["actualdiario"] || filaOcho[cabeceras[2]]) 
        });

        setCanales(canalesIndividuales);
        setError(null);
        setCargando(false);
        setSincronizando(false);
        
        // Seteamos la estampa de tiempo actual argentina (Mar del Plata)
        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const fechaFormateada = ahora.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        setUltimaActualizacion(`${fechaFormateada} a las ${horaFormateada}`);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setCargando(false);
        setSincronizando(false);
      });
  };

  // Traer datos de forma automática al abrir la pantalla
  useEffect(() => {
    traerDatosDeGoogle();
  }, []);

  const limpiarNumero = (valor) => {
    if (!valor) return 0;
    const limpio = String(valor)
      .replace(/\$/g, '')
      .replace(/\./g, '')
      .replace(/\s/g, '')
      .trim();
    const numero = Number(limpio);
    return isNaN(numero) ? 0 : numero;
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wide text-slate-300">Conectando directo con Google Drive...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-rose-400 font-sans p-4">
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl max-w-md text-center">
          <span className="text-3xl block mb-2">⚠️</span>
          <p className="font-bold text-lg text-white mb-1">Error de sincronización</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button 
            onClick={traerDatosDeGoogle}
            className="bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-rose-600 transition"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  const { totalAcumulado, totalMeta, ritmoDiarioGlobalRequerido, ritmoDiarioGlobalActualCelda } = totalesGlobales;
  const porcentajeGlobal = totalMeta > 0 ? ((totalAcumulado / totalMeta) * 100).toFixed(1) : 0;
  
  const porcentajeDiarioAlcanzado = ritmoDiarioGlobalRequerido > 0 ? (ritmoDiarioGlobalActualCelda / ritmoDiarioGlobalRequerido) * 100 : 0;
  const porcentajeQueFalta = 100 - porcentajeDiarioAlcanzado;
  const objetivoDiarioCumplido = porcentajeDiarioAlcanzado >= 100;
  const brechaEnPlata = ritmoDiarioGlobalRequerido - ritmoDiarioGlobalActualCelda;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-8 font-sans">
      
      {/* HEADER DINÁMICO ESTIMULANTE */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-800 pb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="w-full lg:w-auto flex flex-col sm:flex-row justify-between sm:items-center lg:items-start lg:flex-col gap-4 lg:gap-1">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                🚀 Panel de Ritmo Diario
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Junio 2026 • Pinturerías Ámbito
              </p>
            </div>
            
            {/* Control Auxiliar de Sincronización Manual */}
            <div className="flex flex-col gap-1.5 bg-slate-900/40 border border-slate-800/60 p-3 rounded-2xl self-start sm:self-auto">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={traerDatosDeGoogle}
                  disabled={sincronizando}
                  className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition active:scale-95 border border-slate-700/50 flex items-center justify-center ${sincronizando ? 'animate-spin cursor-not-allowed' : ''}`}
                  title="Sincronizar planillas ahora"
                >
                  🔄
                </button>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block tracking-wider">Último refresco</span>
                  <span className="text-xs font-semibold text-slate-300">{ultimaActualizacion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Termómetro de Presión Comercial Grupal */}
          <div className="w-full lg:max-w-xl bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-3.5">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Ritmo del Equipo</span>
                <span className="text-2xl font-black text-white">
                  ${ritmoDiarioGlobalActualCelda.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-400">/ día</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">Meta Obligatoria</span>
                <span className="text-xl font-bold text-slate-300">
                  ${ritmoDiarioGlobalRequerido.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Barra de Progreso de Carrera */}
            <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-1000 shadow-lg ${
                  objetivoDiarioCumplido 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/20' 
                    : 'bg-gradient-to-r from-amber-500 via-orange-400 to-cyan-500 shadow-orange-500/20'
                }`}
                style={{ width: `${Math.min(porcentajeDiarioAlcanzado, 100)}%` }}
              ></div>
            </div>

            {/* Texto de Aliento Puro de Venta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-1.5 border-t border-slate-800/60 pt-2">
              <span className={`font-black uppercase tracking-wide flex items-center gap-1 ${objetivoDiarioCumplido ? 'text-emerald-400' : 'text-amber-400'}`}>
                {objetivoDiarioCumplido && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                {porcentajeDiarioAlcanzado.toFixed(1)}% Alcanzado
              </span>
              <span className="font-medium text-slate-300">
                {objetivoDiarioCumplido 
                  ? '🎉 ¡Ritmo superado! Sostener esta marcha para blindar el mes.' 
                  : `Falta solo un ${porcentajeQueFalta.toFixed(1)}% ($${brechaEnPlata.toLocaleString('es-AR')}) para quebrar el día.`
                }
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* TERMÓMETRO GLOBAL DEL GRUPO (PROGRESO MENSUAL ACUMULADO) */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-300">Progreso Consolidado del Mes</h2>
              <p className="text-xs text-slate-400">Avance hacia el gran objetivo comercial de Junio</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">{porcentajeGlobal}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-6 rounded-2xl overflow-hidden p-1 border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl transition-all duration-1000 ease-out shadow-lg shadow-indigo-500/30"
              style={{ width: `${Math.min(porcentajeGlobal, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/60 text-center sm:text-left">
            <div>
              <span className="text-xs text-slate-400 block">Llevamos Facturado (E8)</span>
              <span className="text-lg sm:text-xl font-bold text-slate-100">${totalAcumulado.toLocaleString('es-AR')}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Meta Final Junio (I2)</span>
              <span className="text-lg sm:text-xl font-bold text-slate-400">${totalMeta.toLocaleString('es-AR')}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
              <span className="text-xs text-purple-400 font-medium block">Eficiencia de Canales</span>
              <span className="text-sm font-bold text-white">4 Canales Operativos</span>
            </div>
          </div>
        </section>

        {/* TARJETAS INDIVIDUALES POR CANAL */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-200">Enfoque por Canal de Venta</h2>
            <p className="text-xs text-slate-400">Promedio diario actual frente al requerido de cada sector</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {canales.map((c) => {
              const acum = limpiarNumero(c.acumulado);
              const metaCanal = limpiarNumero(c.meta);
              const diarioActual = limpiarNumero(c.actualdiario);
              const diarioReq = limpiarNumero(c.requeridodiario);

              const cumplimientoCanal = metaCanal > 0 ? ((acum / metaCanal) * 100).toFixed(1) : 0;
              const enRitmo = diarioActual >= diarioReq;
              const brechaDiaria = diarioReq - diarioActual;

              // Parche nativo visual para "VENTA TELEFÓNICA" a un solo renglón
              const nombreCanalAMostrar = c.canal === "VENTA TELEFÓNICA" ? "VTA TELEFÓNICA" : c.canal;

              return (
                <div 
                  key={c.id || c.canal} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-slate-700 transition duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold tracking-wider text-slate-100 group-hover:text-indigo-400 transition uppercase text-sm sm:text-base truncate" title={c.canal}>
                        {nombreCanalAMostrar}
                      </h3>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        enRitmo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${enRitmo ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        {enRitmo ? 'En Ritmo' : 'Empujar'}
                      </span>
                    </div>

                    <div className="mb-5 bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Progreso Mes</span>
                        <span className="font-bold text-slate-200">{cumplimientoCanal}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${enRitmo ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(cumplimientoCanal, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* BLOQUE DE MÉTRICAS INTERNAS */}
                    <div className="space-y-2.5 text-xs sm:text-sm border-b border-slate-800 pb-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Ritmo de Hoy:</span>
                        <span className="font-semibold text-slate-100">${diarioActual.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Ritmo Requerido:</span>
                        <span className="font-semibold text-cyan-400">${diarioReq.toLocaleString('es-AR')}</span>
                      </div>
                    </div>

                    {/* ACUMULADO DEL MES DEL CANAL */}
                    <div className="flex justify-between items-center text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-850">
                      <span className="text-slate-400 font-medium">Llevamos del Mes:</span>
                      <span className="font-bold text-indigo-300">${acum.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  {/* MENSAJE CON LOS VALORES TOTALMENTE FORMATEADOS A PESOS */}
                  <div className={`mt-5 p-3 rounded-xl text-xs font-medium text-center transition ${
                    enRitmo ? 'bg-emerald-500/5 text-emerald-300 border border-emerald-500/10' : 'bg-blue-500/5 text-blue-300 border border-blue-500/10'
                  }`}>
                    {enRitmo 
                      ? '🎯 Sosteniendo esta constancia el canal cierra en verde impecable.' 
                      : `Desafío de hoy: Sumar $${brechaDiaria.toLocaleString('es-AR')} para equilibrar el ritmo.`
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
      
      <footer className="max-w-7xl mx-auto mt-16 text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
        Fuerza equipo • Sincronizado en tiempo real.
      </footer>
    </div>
  );
}