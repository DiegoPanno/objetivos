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
  
  // Guardamos los productos agrupados por mes: { septiembre: [...], agosto: [...] }
  const [productosPorMes, setProductosPorMes] = useState({});

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

  const procesarProductosCSV = (csvText) => {
    try {
      if (!csvText) return [];
      const lineas = csvText.split('\n').map(l => l.replace(/\r/g, '')).filter(Boolean);
      if (lineas.length < 2) return [];

      const productos = [];

      lineas.slice(1).forEach(linea => {
        const cols = [];
        let actual = '';
        let enComillas = false;
        for (let i = 0; i < linea.length; i++) {
          const c = linea[i];
          if (c === '"') {
            enComillas = !enComillas;
          } else if (c === ',' && !enComillas) {
            cols.push(actual.trim().replace(/^"|"$/g, ''));
            actual = '';
          } else {
            actual += c;
          }
        }
        cols.push(actual.trim().replace(/^"|"$/g, ''));

        // Columnas provenientes de la hoja Ranking_Drive generada por QUERY:
        // Col 0: Vendedor/Canal | Col 1: Código | Col 2: Detalle | Col 3: Total Unidades
        const vendedor = (cols[0] || '').trim();
        const codigo = (cols[1] || '').trim();
        const detalle = (cols[2] || '').trim();
        const cantidad = limpiarNumero(cols[3]);

        if (detalle && cantidad !== 0) {
          let canalNormalizado = vendedor;
          const v = vendedor.toLowerCase();

          if (v.includes('gabriela')) canalNormalizado = 'Gabriela';
          else if (v.includes('ivan') || v.includes('iván')) canalNormalizado = 'Iván';
          else if (v.includes('mercado libre') || v.includes('meli')) canalNormalizado = 'Mercado Libre';
          else if (v.includes('provincia') || v.includes('bapro')) canalNormalizado = 'BAPRO';
          else if (v.includes('ambito') || v.includes('ámbito')) canalNormalizado = 'Web Ámbito';

          productos.push({
            vendedor,
            canalNormalizado,
            codigo,
            detalle,
            cantidad
          });
        }
      });

      return productos;
    } catch (err) {
      console.error('Error procesando CSV Productos:', err);
      return [];
    }
  };

  const procesarCliengoDesdeCSV = (csvText) => {
    try {
      if (!csvText) return null;

      const lineas = csvText.split('\n').map(l => l.replace(/\r/g, ''));

      let totalConversaciones = 0;
      let totalLeads = 0;
      let operadorHumano = 0;
      let ventaSucursal = 0;
      let ventaWeb = 0;
      let ventaTelefonica = 0;

      let dineroPresupuestado = 0;
      let dineroSucursal = 0;
      let dineroTelefonica = 0;
      let dineroWeb = 0;

      const resumenEtapas = [];
      const desempenoAsesores = [];
      const origenTraficoAds = [];
      const franjasHorarias = [];

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

      const tiposTraficoBuscados = [
        { clave: 'facebook ads', label: 'Facebook Ads' },
        { clave: 'instagram ads', label: 'Instagram Ads' },
        { clave: 'meta ads (sin url)', label: 'Meta Ads (Sin URL)' },
        { clave: 'meta ads', label: 'Meta Ads (Pauta)' },
        { clave: 'meta ads (pauta)', label: 'Meta Ads (Pauta)' },
        { clave: 'google ads', label: 'Google Ads' },
        { clave: 'google ads (pauta)', label: 'Google Ads' },
        { clave: 'orgánico / directo', label: 'Orgánico / Directo' },
        { clave: 'organico / directo', label: 'Orgánico / Directo' },
        { clave: 'orgánico', label: 'Orgánico / Directo' },
        { clave: 'organico', label: 'Orgánico / Directo' }
      ];

      const etapasPosibles = ['Respondidos', 'Otros', 'Nuevo', 'Presupuesto', 'En progreso', 'Venta', 'Ventas web', 'Con venta', 'Reclamos'];

      lineas.forEach((linea) => {
        const cols = [];
        let actual = '';
        let enComillas = false;
        for (let i = 0; i < linea.length; i++) {
          const c = linea[i];
          if (c === '"') {
            enComillas = !enComillas;
          } else if (c === ',' && !enComillas) {
            cols.push(actual.trim().replace(/^"|"$/g, ''));
            actual = '';
          } else {
            actual += c;
          }
        }
        cols.push(actual.trim().replace(/^"|"$/g, ''));

        const primerCol = cols[1] || cols[0] || '';
        const nombreEtapa = etapasPosibles.find(e => e.toLowerCase() === primerCol.toLowerCase());
        
        if (nombreEtapa) {
          const cantidad = limpiarNumero(cols[2] || cols[3]);
          if (cantidad > 0 && !resumenEtapas.some(e => e.nombre === nombreEtapa)) {
            resumenEtapas.push({ nombre: nombreEtapa, cantidad });
          }
        }

        cols.forEach((col, idx) => {
          const val = col.trim().toLowerCase();
          if (val === 'ivan' || val === 'iván' || val === 'gabriela') {
            const celdasRestantes = cols.slice(idx + 1).filter(c => c !== '');
            const conv = celdasRestantes[0] ? limpiarNumero(celdasRestantes[0]) : 0;
            const part = celdasRestantes[1] ? celdasRestantes[1].trim() : '0%';

            if (!desempenoAsesores.some(a => a.nombre.toLowerCase() === val)) {
              desempenoAsesores.push({
                nombre: col.trim(),
                conversaciones: conv,
                participacion: part
              });
            }
          }
        });

        cols.forEach((col, idx) => {
          const valCol = col.trim().toLowerCase();
          const match = tiposTraficoBuscados.find(t => t.clave === valCol);

          if (match) {
            const celdasDerecha = cols.slice(idx + 1).filter(c => c !== '');
            const cant = celdasDerecha[0] !== undefined ? limpiarNumero(celdasDerecha[0]) : 0;
            
            let porc = 0;
            if (celdasDerecha[1] && celdasDerecha[1].includes('%')) {
              porc = parseFloat(celdasDerecha[1].replace('%', '').replace(',', '.').trim()) || 0;
            } else if (totalConversaciones > 0) {
              porc = (cant / totalConversaciones) * 100;
            }

            const ventas = celdasDerecha[2] !== undefined ? limpiarNumero(celdasDerecha[2]) : 0;
            const tasaConv = celdasDerecha[3] ? celdasDerecha[3].trim() : '0,00%';
            const canalPreferido = celdasDerecha[4] ? celdasDerecha[4].trim() : 'Sin ventas';

            if (!origenTraficoAds.some(item => item.tipo.toLowerCase() === match.label.toLowerCase())) {
              origenTraficoAds.push({
                tipo: match.label,
                cantidad: cant,
                porcentaje: porc,
                ventasConcretadas: ventas,
                tasaConversion: tasaConv,
                canalPreferido: canalPreferido
              });
            }
          }
        });

        const textoLinea = cols.join(' ');
        const patronHorario = /(08:00 a 09:59|10:00 a 13:59|14:00 a 16:59|17:00 a 18:59|19:00 a 07:59)/i;
        const matchHora = textoLinea.match(patronHorario);

        if (matchHora) {
          const franjaNombre = matchHora[0];
          const idxFranja = cols.findIndex(c => patronHorario.test(c));
          if (idxFranja !== -1) {
            const celdasHorario = cols.slice(idxFranja + 1).filter(c => c !== '');
            const totalEntrantes = celdasHorario[0] !== undefined ? limpiarNumero(celdasHorario[0]) : 0;
            const ventasTel = celdasHorario[1] !== undefined ? limpiarNumero(celdasHorario[1]) : 0;
            const pctTel = celdasHorario[2] ? celdasHorario[2].trim() : '0%';

            if (!franjasHorarias.some(f => f.franja.toLowerCase() === franjaNombre.toLowerCase())) {
              franjasHorarias.push({
                franja: franjaNombre,
                totalConsultas: totalEntrantes,
                ventasTel: ventasTel,
                pctTel: pctTel
              });
            }
          }
        }

        const lineaUpper = linea.toUpperCase();
        if (lineaUpper.includes('DINERO PRESUPUESTADO')) {
          const idx = cols.findIndex(c => c.toUpperCase().includes('DINERO PRESUPUESTADO'));
          if (idx !== -1 && cols[idx + 1] !== undefined) {
            dineroPresupuestado = limpiarNumero(cols[idx + 1]);
          }
        }
        if (lineaUpper.includes('DINERO VENTA SUCURSAL')) {
          const idx = cols.findIndex(c => c.toUpperCase().includes('DINERO VENTA SUCURSAL'));
          if (idx !== -1 && cols[idx + 1] !== undefined) {
            dineroSucursal = limpiarNumero(cols[idx + 1]);
          }
        }
        if (lineaUpper.includes('DINERO VENTA TELEF')) {
          const idx = cols.findIndex(c => c.toUpperCase().includes('DINERO VENTA TELEF'));
          if (idx !== -1 && cols[idx + 1] !== undefined) {
            dineroTelefonica = limpiarNumero(cols[idx + 1]);
          }
        }
        if (lineaUpper.includes('DINERO VENTA WEB')) {
          const idx = cols.findIndex(c => c.toUpperCase().includes('DINERO VENTA WEB'));
          if (idx !== -1 && cols[idx + 1] !== undefined) {
            dineroWeb = limpiarNumero(cols[idx + 1]);
          }
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
        origenConversaciones: origenTraficoAds,
        franjasHorarias,
        dineroCliengo: {
          presupuestado: dineroPresupuestado,
          sucursal: dineroSucursal,
          telefonica: dineroTelefonica,
          web: dineroWeb,
          totalDerivado: dineroSucursal + dineroTelefonica + dineroWeb
        }
      };
    } catch (err) {
      console.error("Error procesando CSV Cliengo:", err);
      return null;
    }
  };

  const cargarTodosLosMeses = () => {
    setSincronizando(true);
    
    const clavesACargar = Object.keys(URLS);
    
    const promesas = clavesACargar.map(clave => {
      const url = URLS[clave]?.url;
      if (!url || url.includes('URL_CSV')) return Promise.resolve({ clave, ignorar: true });
      
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
        const nuevosProductos = {};
        let huboError = false;

        resultados.forEach(({ clave, csv, error, ignorar }) => {
          if (ignorar) return;

          if (error) {
            console.error(`Error en ${clave}:`, error);
            huboError = true;
            return;
          }
          
          if (clave.startsWith('productos_')) {
            const mesClave = clave.replace('productos_', '');
            nuevosProductos[mesClave] = procesarProductosCSV(csv);
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
        setProductosPorMes(nuevosProductos);
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
      let acumNum = limpiarNumero(canal.acumulado);

      const vendedoresCanal = esVentaTelefonica ? vendedores.map(v => ({
        nombre: v.canal,
        acumulado: limpiarNumero(v.acumulado),
      })) : [];

      if (esVentaTelefonica && acumNum === 0 && vendedoresCanal.length > 0) {
        acumNum = vendedoresCanal.reduce((acc, v) => acc + v.acumulado, 0);
      }
      
      const faltaFacturarRaw = canal.falta_facturar || canal.faltaFacturar || canal["falta_facturar"];
      const faltaFacturarFinal = (faltaFacturarRaw !== undefined && faltaFacturarRaw !== '')
        ? limpiarNumero(faltaFacturarRaw)
        : (metaNum - acumNum);

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
        vendedores: vendedoresCanal
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
          productosSemana={productosPorMes[mesSeleccionado] || []}
        />
      </main>

      <footer className="max-w-7xl mx-auto mt-16 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-900 pt-6">
        Fuerza equipo Pinturerías Ámbito • Sincronizado en tiempo real.
      </footer>
    </div>
  );
}