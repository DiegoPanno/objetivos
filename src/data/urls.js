// src/data/urls.js
export const URLS = {
// 🔥 Mes en curso (Noviembre 2026 - 30 días)
  noviembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=304409415&single=true&output=csv",
    label: "Noviembre 2026",
    dias: 30,
    esActivo: true
  },
  funnel_noviembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=235343499&single=true&output=csv",
    label: "Embudo Cliengo Noviembre",
    esActivo: true
  },
  ranking_noviembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=313334652&single=true&output=csv",
    label: "Ranking Productos Noviembre"
  },
  // 📚 Históricos
  octubre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1162219836&single=true&output=csv",
    label: "Octubre 2026",
    dias: 31,
    esActivo: false
  },
  funnel_octubre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=580337007&single=true&output=csv",
    label: "Embudo Cliengo Octubre",
    esActivo: false
  },
  ranking_octubre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1052015353&single=true&output=csv",
    label: "Ranking Productos Octubre"
  },

  septiembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1487836025&single=true&output=csv",
    label: "Septiembre 2026",
    dias: 30,
    esActivo: false
  },
  funnel_septiembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1503179238&single=true&output=csv",
    label: "Embudo Cliengo Septiembre",
    esActivo: false
  },
  ranking_septiembre: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1562560297&single=true&output=csv",
    label: "Ranking Productos Septiembre"
  },

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
  ranking_agosto: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsWab9k64Wx8d8ptY_UPXRfYHgGMLCsfsuXiw64lXzML0B8D6e_QV4MI0uv73B-2pdEBowq80mib2W/pub?gid=1256762036&single=true&output=csv",
    label: "Ranking Productos Agosto"
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

export const MESES_DISPONIBLES = ['noviembre', 'octubre', 'septiembre', 'agosto', 'julio', 'junio'];