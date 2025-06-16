import React, { useState, useEffect, useCallback } from "react";

const FiltroCorrespondencia = ({ datos, onFiltrar }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

    // Función de filtrado memoizada
  const filtrarDatos = useCallback((terminos, datos) => {
    if (!Array.isArray(datos)) return []; // ← Previene errores si datos no es array
    
    const normalize = (text) => 
      (text || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let resultados = [...datos];
    
    terminos.forEach(termino => {
      if (!termino) return;
      
      resultados = resultados.filter(item => {
        const terminoNormalizado = normalize(termino);
          
        return (
          normalize(item.NumDVSC).includes(terminoNormalizado) ||
          normalize(item.Oficio).includes(terminoNormalizado) ||
          normalize(item.Remitente).includes(terminoNormalizado) ||
          normalize(item.Motivo).includes(terminoNormalizado) ||
          normalize(item.Direccion).includes(terminoNormalizado) ||
          normalize(item.OP).includes(terminoNormalizado) ||
          normalize(item.Descripcion).includes(terminoNormalizado) 
        );
      });
      console.log("Resultados parciales:", resultados);
    });
    
    return resultados;
  }, []);

  useEffect(() => {
    // No ejecutar filtro si no hay término de búsqueda
  if (!terminoBusqueda.trim()) {
    onFiltrar(null); // <- BUENO: se interpreta como "sin filtro"
    return;
  }

    const terminos = terminoBusqueda
    .split(/[\s,]+/) // divide por comas o espacios
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);

    const resultadosFiltrados = filtrarDatos(terminos, datos);
    onFiltrar(resultadosFiltrados);
    
  }, [terminoBusqueda, datos, filtrarDatos]);

  return (
    <div className="filtro-container">
      <input
        type="text"
        placeholder="Buscar... (usa comas para agregar más criterios de busqueda)"
        value={terminoBusqueda}
        onChange={(e) => setTerminoBusqueda(e.target.value)}
        className="filtro-input"
      />
      {terminoBusqueda.includes(',') && (
        <div className="filtro-info">
          Filtros aplicados: {terminoBusqueda.split(',').filter(t => t.trim()).length}
        </div>
      )}
    </div>
  );
};

export default FiltroCorrespondencia;