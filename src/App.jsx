// src/App.jsx
import React, { useState, useEffect } from 'react';
import { URLS, MESES_DISPONIBLES } from './data/urls';
import MesModule from './components/MesModule';

export default function App() {
  const [mesSeleccionado, setMesSeleccionado] = useState('septiembre');
  const [datosPorMes, setDatosPorMes] = useState({});
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');
  const [datosCliengoPorMes, setDatosCliengoPorMes] = useState({});

  const limpiarNumero = (valor) => {
    if (!valor && valor !== 0) return 0;
    if (typeof valor === 'number') return valor;
    
    // Soporta valores negativos con signo de moneda, ej: "- $24.200.000" o "-$24.200.000"
    const texto = String(valor).trim();
    const esNegativo = texto.startsWith('-') || texto.includes('(');
    const limpio = texto.replace(/[^0-9]/g, '');
    const numero = Number(limpio);
    
    if (isNaN(numero)) return 0;
    return esNegativo ? -numero : numero;
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
    
    const mesesACargar = [...MESES_DISPONIBLES, 'funnel_agosto', 'funnel_septiembre'];
    
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
        const nuevosCliengo = {};
        let huboError = false;

        resultados.forEach(({ clave, csv, error }) => {
          if (error) {
            console.error(`Error en ${clave}:`, error);
            huboError = true;
            return;
          }
          
          if (clave.startsWith('funnel_')) {
            const nombreMes = clave.replace('funnel_', '');
            nuevosCliengo[nombreMes] = procesarCliengoDesdeCSV(csv);
            return;
          }
          
          const diasDelMes = URLS[clave]?.dias || 30;
          nuevosDatos[clave] = procesarMes(csv, diasDelMes);
        });

        setDatosCliengoPorMes(nuevosCliengo);
        setDatosPorMes(nuevosDatos);

        if (huboError) {
          setError('Algunos datos no pudieron cargarse correctamente');
        } else {
          setError(null);
        }

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
    if (lineas.length === 0) return { canales: [], vendedores: [], globales: {} };

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
      'mercado libre',
      'bapro', 
      'vtatel',
      'vta.telefono.',
      'vta.telefono',
      'venta telefonica',
      'telefónica'
    ];

    const canalesPrincipales = filas.filter(f => {
      const canal = (f.canal || '').trim().toLowerCase();
      const id = (f.id || '').trim().toLowerCase();
      
      const esCanalValido = CANALES_PERMITIDOS.some(permitido => 
        canal.includes(permitido) || id.includes(permitido)
      );
      
      const esExcluido = 
        canal.includes('ritmo') ||
        canal.includes('ranking') ||
        canal.includes('total') ||
        canal === 'gabriela' ||
        canal === 'iván' ||
        canal === 'ivan' ||
        canal.includes('conversaciones') ||
        canal.includes('leads') ||
        canal.includes('etapa') ||
        canal.includes('asesor') ||
        canal.includes('origen') ||
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(canal);

      return esCanalValido && !esExcluido;
    });

    const vendedores = filas.filter(f => {
      const canal = (f.canal || '').trim().toLowerCase();
      return canal === 'gabriela' || canal === 'iván' || canal === 'ivan';
    });

    const canalesConVendedores = canalesPrincipales.map(canal => {
      const canalTexto = (canal.canal || '').toLowerCase();
      const esVentaTelefonica = canalTexto.includes('vta.telefono') || 
                                canalTexto.includes('telefónica') ||
                                canalTexto.includes('vtatel');
      
      const metaNum = limpiarNumero(canal.meta || canal["Objetivo del mes"] || canal["objetivo del mes"]);
      const acumNum = limpiarNumero(canal.acumulado);
      
      // Si la celda falta_facturar viene informada la limpiamos; si no, la calculamos directamente
      const faltaFacturarRaw = canal.falta_facturar || canal.faltaFacturar || canal["falta_facturar"];
      const faltaFacturarFinal = (faltaFacturarRaw !== undefined && faltaFacturarRaw !== '')
        ? limpiarNumero(faltaFacturarRaw)
        : (acumNum - metaNum);

      return {
        ...canal,
        canal: canal.canal || canal.id || '',
        acumulado: acumNum,
        meta: metaNum,
        actualdiario: limpiarNumero(canal.actualdiario),
        requeridodiario: limpiarNumero(canal.requeridodiario),
        litros: limpiarNumero(canal.litros),
        margen: limpiarNumero(canal.margen),
        Visitas: limpiarNumero(canal.Visitas || canal.visitas),
        Pedidos: limpiarNumero(canal.Pedidos || canal.pedidos),
        "ticket promedio": limpiarNumero(canal["ticket promedio"] || canal["ticket promedic"]),
        faltaFacturar: faltaFacturarFinal,
        vendedores: esVentaTelefonica ? vendedores.map(v => ({
          nombre: v.canal,
          acumulado: limpiarNumero(v.acumulado),
        })) : []
      };
    });

    let totalAcumulado = 0;
    let totalMeta = 0;
    let totalActualDiario = 0;
    let diaDeVenta = 1;

    filas.forEach(c => {
      const diaRaw = c["día de venta"] || c["dia de venta"] || c["Dia de venta"];
      if (diaRaw) {
        const diaNumero = parseInt(String(diaRaw).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(diaNumero) && diaNumero > 0) {
          diaDeVenta = diaNumero;
        }
      }
    });

    canalesConVendedores.forEach(c => {
      totalAcumulado += c.acumulado;
      totalMeta += c.meta;
      totalActualDiario += c.actualdiario;
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
          datosCliengo={datosCliengoPorMes[mesSeleccionado] || null}
          datosPorMes={datosPorMes}
        />
      </main>

      <footer className="max-w-7xl mx-auto mt-16 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-900 pt-6">
        Fuerza equipo Pinturerías Ámbito • Sincronizado en tiempo real.
      </footer>
    </div>
  );
}