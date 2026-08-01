// src/data/urls.js
export const URLS = {
  // Mes en curso (Agosto 2026)
  agosto: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=670064080&single=true&output=csv",
    label: "Agosto 2026",
    dias: 31,
    esActivo: true
  },
  // Históricos
  julio: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=51856544&single=true&output=csv",
    label: "Julio 2026",
    dias: 31,
    esActivo: false
  },
  junio: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=0&single=true&output=csv",
    label: "Junio 2026",
    dias: 30,
    esActivo: false
  }
};

// Lista de meses disponibles (para el selector)
export const MESES_DISPONIBLES = ['agosto', 'julio', 'junio'];