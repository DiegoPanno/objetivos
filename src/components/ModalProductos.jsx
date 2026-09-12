// src/components/ModalProductos.jsx
import React, { useState } from 'react';

export default function ModalProductos({ isOpen, onClose, productos = [] }) {
  const [canalActivo, setCanalActivo] = useState('Gabriela');
  const [busqueda, setBusqueda] = useState('');

  if (!isOpen) return null;

  const CANALES = [
    { id: 'Gabriela', label: 'Gabriela (Tel)' },
    { id: 'Iván', label: 'Iván (Tel)' },
    { id: 'Mercado Libre', label: 'Mercado Libre' },
    { id: 'BAPRO', label: 'BAPRO' },
    { id: 'Web Ámbito', label: 'Web Ámbito' },
  ];

  // Filtrar productos por canal y texto de búsqueda, ordenados de mayor a menor
  const productosFiltrados = productos
    .filter(p => p.canalNormalizado === canalActivo)
    .filter(p => 
      p.detalle.toLowerCase().includes(busqueda.toLowerCase()) || 
      String(p.codigo).toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => b.cantidad - a.cantidad);

  const totalUnidades = productosFiltrados.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              🎨 Artículos Vendidos 
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Detalle clasificado por canal comercial y vendedor (ordenado de mayor a menor)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition"
          >
            ✕ Cerrar
          </button>
        </div>

        {/* SELECTOR DE CANALES Y BUSCADOR */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 space-y-4 bg-slate-900/40">
          <div className="flex flex-wrap gap-2">
            {CANALES.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setCanalActivo(c.id);
                  setBusqueda('');
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                  canalActivo === c.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <input 
              type="text"
              placeholder="🔍 Buscar por artículo o código..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-80"
            />
            <div className="text-xs text-slate-400 font-medium">
              Mostrando <span className="text-emerald-400 font-black">{totalUnidades.toLocaleString('es-AR')} un.</span> en <span className="text-slate-200 font-bold">{productosFiltrados.length} SKUs</span>
            </div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="overflow-y-auto p-4 sm:p-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-800 pb-2">
                <th className="pb-3 font-bold w-20">Código</th>
                <th className="pb-3 font-bold">Artículo / Detalle</th>
                <th className="pb-3 font-black text-right text-indigo-400 w-28">Unidades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/40 transition">
                    <td className="py-2.5 font-mono text-slate-400 text-xs">{item.codigo}</td>
                    <td className="py-2.5 font-medium text-slate-200">{item.detalle}</td>
                    <td className="py-2.5 text-right font-black text-white text-sm">
                      {item.cantidad.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron productos para este canal o búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}