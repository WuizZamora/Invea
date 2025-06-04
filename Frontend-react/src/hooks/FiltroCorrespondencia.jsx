import React, { useState, useEffect } from "react";

const FiltroCorrespondencia = ({ datos, onFiltrar }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  useEffect(() => {
    if (!terminoBusqueda) {
      onFiltrar(datos);
      return;
    }

    const terminos = terminoBusqueda.split(',').map(t => t.trim().toLowerCase());
    
    let resultados = [...datos];
    
    // Aplicar cada término como un filtro adicional
    terminos.forEach(termino => {
      if (!termino) return;
      
      resultados = resultados.filter(item => {
        return (
          (item.NumDVSC?.toString().toLowerCase().includes(termino)) ||
          (item.Oficio?.toLowerCase().includes(termino)) ||
          (item.Remitente?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termino.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) ||
          (item.Motivo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termino.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) ||
          (item.Direccion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termino.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
        );
      });
    });

    onFiltrar(resultados);
  }, [terminoBusqueda, datos, onFiltrar]);

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