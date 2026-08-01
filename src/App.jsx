// src/App.jsx
import React, { useState, useEffect } from 'react';
import { URLS, MESES_DISPONIBLES } from './data/urls';
import MesModule from './components/MesModule';

export default function App() {
  const [mesSeleccionado, setMesSeleccionado] = useState('agosto');
  const [datosPorMes, setDatosPorMes] = useState({});
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');

  const cargarTodosLosMeses = () => {
    setSincronizando(true);
    const promesas = MESES_DISPONIBLES.map(clave => {
      const url = URLS[clave].url;
      return fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Error cargando ${clave}`);
          return res.text();
        })
        .then(csvText => ({ clave, csv: csvText }))
        .catch(err => ({ clave, error: err }));
    });

    Promise.all(promesas)
      .then(resultados => {
        const nuevosDatos = {};
        let huboError = false;

        resultados.forEach(({ clave, csv, error }) => {
          if (error) {
            console.error(`Error en ${clave}:`, error);
            huboError = true;
            return;
          }
          const diasDelMes = URLS[clave].dias;
          nuevosDatos[clave] = procesarMes(csv, diasDelMes);
        });

        if (huboError) {
          setError('Algunos meses no pudieron cargarse correctamente');
        } else {
          setError(null);
        }

        setDatosPorMes(nuevosDatos);
        setCargando(false);
        setSincronizando(false);
        
        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setUltimaActualizacion(`${ahora.toLocaleDateString('es-AR')} a las ${horaFormateada}`);
      })
      .catch(err => {
        console.error(err);
        setError('Error de comunicación al sincronizar con Google Sheets.');
        setCargando(false);
        setSincronizando(false);
      });
  };

  useEffect(() => {
    cargarTodosLosMeses();
  }, []);

  const limpiarNumero = (valor) => {
    if (!valor) return 0;
    const limpio = String(valor).replace(/\$/g, '').replace(/\./g, '').replace(/\s/g, '').trim();
    const numero = Number(limpio);
    return isNaN(numero) ? 0 : numero;
  };

  const procesarMes = (csvText, diasDelMes) => {
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

    // 🔥 IDENTIFICAR canales PRINCIPALES (los que tienen requeridodiario o meta)
    // y que NO son vendedores, ni totales, ni fechas
    const canalesPrincipales = filas.filter(f => {
      const canal = f.canal?.trim() || '';
      const esVacio = canal === '';
      const esTotal = canal === 'Ritmo Actual' || canal === 'Ritmo Actual de...' || canal.includes('Ritmo');
      const esFecha = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(canal); // Detecta fechas como "15/07/2026"
      const esVendedor = canal === 'Gabriela' || canal === 'Iván' || canal === 'Ivan';
      const esIdNoDeseado = f.id === 'total' || f.id === 'Ritmo Actual' || f.id === 'Ranking';
      
      // Un canal principal es aquel que tiene requeridodiario O meta,
      // y no es ninguna de las exclusiones anteriores
      const tieneRequerido = f.requeridodiario && f.requeridodiario !== '';
      const tieneMeta = f.meta && f.meta !== '';
      
      return !esVacio && 
             !esTotal && 
             !esFecha && 
             !esVendedor && 
             !esIdNoDeseado &&
             (tieneRequerido || tieneMeta);
    });

    // 🔥 IDENTIFICAR vendedores (Gabriela e Iván)
    const vendedores = filas.filter(f => {
      const canal = f.canal?.trim() || '';
      return canal === 'Gabriela' || canal === 'Iván' || canal === 'Ivan';
    });

    // 🔥 Unir canales principales con sus vendedores
    const canalesConVendedores = canalesPrincipales.map(canal => {
      const esVentaTelefonica = canal.canal?.toLowerCase().includes('vta.telefono') || 
                                canal.canal?.toLowerCase().includes('telefónica') ||
                                canal.canal?.toLowerCase() === 'vtatel';
      
      if (esVentaTelefonica) {
        return {
          ...canal,
          vendedores: vendedores.map(v => ({
            nombre: v.canal,
            acumulado: v.acumulado || '0',
          }))
        };
      }
      return canal;
    });

    // 🔥 Calcular totales SOLO de canales principales (excluyendo vendedores)
    let totalAcumulado = 0;
    let totalMeta = 0;
    let totalActualDiario = 0;
    let diaDeVenta = 1;

    canalesPrincipales.forEach(c => {
      const acum = limpiarNumero(c.acumulado);
      const meta = limpiarNumero(c.meta || c["Objetivo del mes"]);
      const actualDiario = limpiarNumero(c.actualdiario);
      
      totalAcumulado += acum;
      totalMeta += meta;
      totalActualDiario += actualDiario;
      
      if (c["día de venta"]) {
        diaDeVenta = limpiarNumero(c["día de venta"]);
      }
    });

    const metaDiariaRequerida = diasDelMes > 0 ? totalMeta / diasDelMes : 0;

    return {
      canales: canalesConVendedores,
      vendedores: vendedores,
      globales: {
        totalAcumulado: totalAcumulado,
        totalMeta: totalMeta,
        ritmoDiarioGlobalRequerido: metaDiariaRequerida,
        ritmoDiarioGlobalActualCelda: totalActualDiario,
        diaDeVenta: diaDeVenta || 1
      }
    };
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base font-semibold tracking-wide text-slate-300">Cargando panel comercial interactivo...</p>
      </div>
    );
  }

  const mesActual = URLS[mesSeleccionado];
  const datosActuales = datosPorMes[mesSeleccionado] || { canales: [], globales: {} };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-8 font-sans antialiased">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-800 pb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              🚀 Panel de Ritmo Diario
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mt-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start">
              {MESES_DISPONIBLES.map(clave => {
                const mes = URLS[clave];
                const esActivo = mes.esActivo;
                const isSelected = mesSeleccionado === clave;
                return (
                  <button
                    key={clave}
                    onClick={() => setMesSeleccionado(clave)}
                    className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mes.label} {esActivo && '🔥'}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <button
              onClick={cargarTodosLosMeses}
              disabled={sincronizando}
              className={`p-2.5 rounded-xl bg-slate-800 text-slate-200 transition ${sincronizando ? 'animate-spin' : ''}`}
            >
              🔄
            </button>
            <div className="text-xs">
              <span className="text-slate-500 uppercase font-bold block tracking-wider">Último refresco</span>
              <span className="font-bold text-slate-200">{ultimaActualizacion}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}
        
        <MesModule 
          mes={mesActual}
          datos={datosActuales}
          esActivo={mesActual.esActivo}
          ultimaActualizacion={ultimaActualizacion}
        />
      </main>

      <footer className="max-w-7xl mx-auto mt-16 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-900 pt-6">
        Fuerza equipo Pinturerías Ámbito • Sincronizado en tiempo real.
      </footer>
    </div>
  );
}