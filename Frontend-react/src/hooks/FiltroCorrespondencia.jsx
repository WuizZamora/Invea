import React, { useState, useEffect } from "react";

const FiltroCorrespondencia = ({ datos, onFiltrar }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  useEffect(() => {
    if (!terminoBusqueda) {
      onFiltrar(datos);
      return;
    }

    const terminos = terminoBusqueda.split(',').map(t => t.trim().toLowerCase());
    
    const datosFiltrados = datos.filter(item => {
      // Verificar si alguno de los términos coincide con algún campo
      return terminos.some(termino => {
        if (!termino) return false;
        
        return (
          (item.NumDVSC?.toString().toLowerCase().includes(termino)) ||
          (item.Oficio?.toLowerCase().includes(termino)) ||
          (item.Remitente?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termino.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) ||
          (item.Motivo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termino.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) ||
          (item.Direccion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termino.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
        );
      });
    });

    onFiltrar(datosFiltrados);
  }, [terminoBusqueda, datos, onFiltrar]);

  return (
    <div className="filtro-container">
      <input
        type="text"
        placeholder="Buscar... (puedes usar comas para múltiples criterios)"
        value={terminoBusqueda}
        onChange={(e) => setTerminoBusqueda(e.target.value)}
        className="filtro-input"
      />
    </div>
  );
};

export default FiltroCorrespondencia;