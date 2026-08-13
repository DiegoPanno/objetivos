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
  const [datosCliengo, setDatosCliengo] = useState(null);

  const limpiarNumero = (valor) => {
    if (!valor) return 0;
    const limpio = String(valor).replace(/\$/g, '').replace(/\./g, '').replace(/\s/g, '').replace(/%/g, '').trim();
    const numero = Number(limpio);
    return isNaN(numero) ? 0 : numero;
  };

  const procesarCliengoDesdeCSV = (csvText) => {
    if (!csvText) return null;

    const lineas = csvText.split('\n').map(l => l.replace(/\r/g, ''));

    let totalConversaciones = 0;
    let totalLeads = 0;
    let operadorHumano = 0;
    let ventaSucursal = 0;
    let ventaWeb = 0;
    let ventaTelefonica = 0;

    const resumenEtapas = [];
    const desempenoAsesores = [];
    const origenConversaciones = [];

    // 1. EXTRAER TOTALES SUPERIORES
    const idxFilaCabecera = lineas.findIndex(l => l.toUpperCase().includes('TOTAL CONVERSACIONES'));
    if (idxFilaCabecera !== -1 && lineas[idxFilaCabecera + 1]) {
      const filaValores = lineas[idxFilaCabecera + 1].split(',').map(v => v.trim());
      const numeros = filaValores.map(v => limpiarNumero(v)).filter(v => v > 0);
      
      totalConversaciones = numeros[0] || 0;
      totalLeads = numeros[1] || 0;
      operadorHumano = numeros[2] || 0;
      ventaSucursal = numeros[3] || 0;
      ventaWeb = numeros[4] || 0;
      ventaTelefonica = numeros[5] || 0;
    }

    // 2. PARSEO POR ZONAS/BLOQUES
    let leyendoAsesores = false;
    let leyendoOrigen = false;

    lineas.forEach((linea) => {
      const cols = linea.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      const textoFila = cols.join(' ').toUpperCase();

      // --- A. RESUMEN POR ETAPAS ---
      const etapasPosibles = ['Respondidos', 'Otros', 'Nuevo', 'Presupuesto', 'En progreso', 'Venta', 'Ventas web', 'Con venta', 'Reclamos'];
      const primerCol = cols[1] || cols[0] || '';
      const nombreEtapa = etapasPosibles.find(e => e.toLowerCase() === primerCol.toLowerCase());
      
      if (nombreEtapa) {
        const cantidad = limpiarNumero(cols[2] || cols[3]);
        if (cantidad > 0 && !resumenEtapas.some(e => e.nombre === nombreEtapa)) {
          resumenEtapas.push({ nombre: nombreEtapa, cantidad });
        }
      }

      // --- B. DESEMPEÑO POR ASESOR ---
      if (textoFila.includes('DESEMPEÑO POR ASESOR')) {
        leyendoAsesores = true;
        leyendoOrigen = false;
        return;
      }

      if (textoFila.includes('ORIGEN DE ENTRADA')) {
        leyendoAsesores = false;
        leyendoOrigen = true;
        return;
      }

      if (leyendoAsesores) {
        cols.forEach((col, idx) => {
          const val = col.trim();
          if (val.toLowerCase() === 'ivan' || val.toLowerCase() === 'iván' || val.toLowerCase() === 'gabriela') {
            const convCelda = cols.slice(idx + 1).find(c => limpiarNumero(c) > 0);
            const partCelda = cols.slice(idx + 2).find(c => limpiarNumero(c) > 0);

            const conversaciones = convCelda ? limpiarNumero(convCelda) : 0;
            const participacion = partCelda ? limpiarNumero(partCelda) : 0;

            if (!desempenoAsesores.some(a => a.nombre.toLowerCase() === val.toLowerCase())) {
              desempenoAsesores.push({
                nombre: val,
                conversaciones,
                participacion
              });
            }
          }
        });
      }

      // --- C. ORIGEN DE CONVERSACIONES ---
      if (leyendoOrigen) {
        const origenesPosibles = ['WhatsApp - Sitio Web', 'WhatsApp - Sit', 'Instagram', 'Manual / Otro'];
        cols.forEach((col, idx) => {
          const val = col.trim();
          const origenEncontrado = origenesPosibles.find(o => o.toLowerCase() === val.toLowerCase());
          
          if (origenEncontrado) {
            const cantCelda = cols.slice(idx + 1).find(c => limpiarNumero(c) > 0);
            const porcCelda = cols.slice(idx + 2).find(c => limpiarNumero(c) > 0);

            const cantidad = cantCelda ? limpiarNumero(cantCelda) : 0;
            const porcentaje = porcCelda ? limpiarNumero(porcCelda) : 0;

            const nombreNormalizado = origenEncontrado.toLowerCase().includes('whatsapp') 
              ? 'WhatsApp - Sitio Web' 
              : origenEncontrado;

            if (!origenConversaciones.some(o => o.nombre.toLowerCase() === nombreNormalizado.toLowerCase())) {
              origenConversaciones.push({
                nombre: nombreNormalizado,
                cantidad,
                porcentaje
              });
            }
          }
        });
      }
    });

    return {
      totalConversaciones,
      totalLeads,
      operadorHumano,
      ventaSucursal,
      ventaWeb,
      ventaTelefonica,
      resumenEtapas,
      desempenoAsesores,
      origenConversaciones
    };
  };

  const cargarTodosLosMeses = () => {
    setSincronizando(true);
    
    const mesesACargar = [...MESES_DISPONIBLES, 'funnel_agosto'];
    
    const promesas = mesesACargar.map(clave => {
      const url = URLS[clave]?.url;
      if (!url) return Promise.resolve({ clave, error: new Error(`URL no encontrada para ${clave}`) });
      
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
        let cliengoData = null;

        resultados.forEach(({ clave, csv, error }) => {
          if (error) {
            console.error(`Error en ${clave}:`, error);
            huboError = true;
            return;
          }
          
          if (clave === 'funnel_agosto') {
            cliengoData = procesarCliengoDesdeCSV(csv);
            return;
          }
          
          const diasDelMes = URLS[clave]?.dias || 31;
          nuevosDatos[clave] = procesarMes(csv, diasDelMes);
        });

        setDatosCliengo(cliengoData);

        if (huboError) {
          setError('Algunos datos no pudieron cargarse correctamente');
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

    const CANALES_PERMITIDOS = [
      'web', 
      'meli', 
      'bapro', 
      'vtatel',
      'Vta.Telefono.',
      'MERCADO LIBRE',
      'BAPRO',
      'WEB'
    ];

    const canalesPrincipales = filas.filter(f => {
      const canal = f.canal?.trim() || '';
      const id = f.id?.trim() || '';
      
      const esCanalPermitido = CANALES_PERMITIDOS.some(permitido => 
        canal.toLowerCase().includes(permitido.toLowerCase()) ||
        id.toLowerCase().includes(permitido.toLowerCase())
      );
      
      const esExcluido = 
        canal === 'Ritmo Actual' ||
        canal === 'Ritmo Actual de...' ||
        canal.includes('Ritmo') ||
        canal === 'Ranking' ||
        canal === '15/07/2026' ||
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(canal) ||
        canal === 'Gabriela' ||
        canal === 'Iván' ||
        canal === 'Ivan' ||
        canal.includes('CONVERSACIONES') ||
        canal.includes('LEADS') ||
        canal.includes('Etapa') ||
        canal.includes('Asesor') ||
        canal.includes('ORIGEN') ||
        canal === 'Resumen por etapa del embudo' ||
        canal === 'Desempeño por asesor' ||
        canal === 'Origen de entrada de conversación' ||
        id === 'total' ||
        id === 'Ritmo Actual' ||
        id === 'Ranking';

      return esCanalPermitido && !esExcluido;
    });

    let canalesFinal = canalesPrincipales;
    if (canalesPrincipales.length === 0) {
      canalesFinal = filas.filter(f => {
        const canal = f.canal?.trim() || '';
        const esVacio = canal === '';
        const esTotal = canal === 'Ritmo Actual' || canal === 'Ritmo Actual de...' || canal.includes('Ritmo');
        const esFecha = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(canal);
        const esVendedor = canal === 'Gabriela' || canal === 'Iván' || canal === 'Ivan';
        const esIdNoDeseado = f.id === 'total' || f.id === 'Ritmo Actual' || f.id === 'Ranking';
        const esCliengo = canal.includes('CONVERSACIONES') || canal.includes('LEADS') || 
                          canal.includes('Etapa') || canal.includes('Asesor') || 
                          canal.includes('ORIGEN') || canal === 'Resumen por etapa del embudo' ||
                          canal === 'Desempeño por asesor' || canal === 'Origen de entrada de conversación';
        
        const tieneRequerido = f.requeridodiario && f.requeridodiario !== '';
        const tieneMeta = f.meta && f.meta !== '';
        
        return !esVacio && 
               !esTotal && 
               !esFecha && 
               !esVendedor && 
               !esIdNoDeseado &&
               !esCliengo &&
               (tieneRequerido || tieneMeta);
      });
      canalesFinal = canalesFinal.slice(0, 4);
    }

    const vendedores = filas.filter(f => {
      const canal = f.canal?.trim() || '';
      return canal === 'Gabriela' || canal === 'Iván' || canal === 'Ivan';
    });

    const canalesConVendedores = canalesFinal.map(canal => {
      const esVentaTelefonica = canal.canal?.toLowerCase().includes('vta.telefono') || 
                                canal.canal?.toLowerCase().includes('telefónica') ||
                                canal.canal?.toLowerCase() === 'vtatel';
      
      if (esVentaTelefonica) {
        return {
          ...canal,
          vendedores: vendedores.map(v => ({
            nombre: v.canal,
            acumulado: v.acumulado || '0',
          })),
        };
      }
      return canal;
    });

    let totalAcumulado = 0;
    let totalMeta = 0;
    let totalActualDiario = 0;
    let diaDeVenta = 1;

    canalesFinal.forEach(c => {
      const acum = limpiarNumero(c.acumulado);
      const meta = limpiarNumero(c.meta || c["Objetivo del mes"]);
      const actualDiario = limpiarNumero(c.actualdiario);
      
      totalAcumulado += acum;
      totalMeta += meta;
      totalActualDiario += actualDiario;
      
      if (c["día de venta"]) {
        const diaRaw = String(c["día de venta"]).trim();
        const diaNumero = parseInt(diaRaw.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(diaNumero) && diaNumero > 0) {
          diaDeVenta = diaNumero;
        }
      }
    });

    const metaDiariaRequerida = diasDelMes > 0 ? totalMeta / diasDelMes : 0;

    return {
      canales: canalesConVendedores.slice(0, 4),
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
          datosCliengo={datosCliengo}
          datosPorMes={datosPorMes}
        />
      </main>

      <footer className="max-w-7xl mx-auto mt-16 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-900 pt-6">
        Fuerza equipo Pinturerías Ámbito • Sincronizado en tiempo real.
      </footer>
    </div>
  );
}