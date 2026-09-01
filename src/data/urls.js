// src/data/urls.js
export const URLS = {
  // 🔥 Mes en curso (Septiembre 2026 - 30 días)
  septiembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1487836025&single=true&output=csv",
    label: "Septiembre 2026",
    dias: 30,
    esActivo: true
  },
  // 🔥 Embudo Cliengo Septiembre
  funnel_septiembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1503179238&single=true&output=csv",
    label: "Embudo Cliengo Septiembre",
    esActivo: true
  },
  // 📚 Históricos
  agosto: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=670064080&single=true&output=csv",
    label: "Agosto 2026",
    dias: 31,
    esActivo: false
  },
  funnel_agosto: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=569478321&single=true&output=csv",
    label: "Embudo Cliengo Agosto",
    esActivo: false
  },
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

export const MESES_DISPONIBLES = ['septiembre', 'agosto', 'julio', 'junio'];