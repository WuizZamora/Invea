import React, { useState, useEffect, useCallback } from "react";
import useCorrespondencia from "./hooks/useCorrespondencia";
import FiltroCorrespondencia from "./hooks/FiltroCorrespondencia";
import UploadPDFButton from "./hooks/UploadPDFButton";
import "./Tabla.css";

const Tabla = () => {
  const { datos: datosOriginales, loading } = useCorrespondencia();
  const [datosFiltrados, setDatosFiltrados] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 10;

  // Datos a mostrar - importante el orden de las condiciones
  const datosMostrar = datosFiltrados === null ? datosOriginales : 
                      datosFiltrados.length === 0 ? [] : 
                      datosFiltrados;

  // Cálculos de paginación
  const totalPaginas = Math.ceil(datosMostrar.length / resultadosPorPagina);
  const indiceInicial = (paginaActual - 1) * resultadosPorPagina;
  const indiceFinal = indiceInicial + resultadosPorPagina;
  const datosPagina = datosMostrar.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
  setPaginaActual(nuevaPagina);
  };

  // Función de filtrado mejorada
  const handleFiltrar = useCallback((resultados) => {
    setDatosFiltrados(resultados);
    setPaginaActual(1);
  }, []);

  // Ajustar página actual si es necesario
  useEffect(() => {
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      setPaginaActual(totalPaginas);
    }
  }, [totalPaginas, paginaActual]);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="form-card">
      <h2>Tabla de Registros</h2>
      
      <FiltroCorrespondencia 
        datos={datosOriginales} 
        onFiltrar={handleFiltrar} 
      />
      
      <div className="table-container">
        {datosMostrar.length === 0 ? (
          <div className="sin-resultados">
            {datosFiltrados === null ? "Cargando datos..." : "No se encontraron resultados"}
          </div>
        ) : (
          <table className="tabla-registro">
            <thead>
              <tr>
                <th>#DVSC</th>
                <th>Oficio</th>
                <th>Remitente</th>
                <th>Motivo</th>
                <th>Dirección</th>
                <th>Soporte documental</th>
              </tr>
            </thead>
            <tbody>
              {datosPagina.map((item, index) => (
                <tr key={`${item.Pk_IDCorrespondenciaIn}-${index}`}>
                  <td>{item.NumDVSC}</td>
                  <td>{item.Oficio}</td>
                  <td>{item.Remitente}</td>
                  <td>{item.Motivo}</td>
                  <td>{item.Direccion}</td>
                  <td>
                    {item.SoporteDocumental ? (
                      <a href=${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}{item.SoporteDocumental} target="_blank" rel="noopener noreferrer">
                        <img
                          src="/PDF.png"
                          alt="Ver PDF"
                          style={{ width: "24px", cursor: "pointer" }}
                        />
                      </a>
                    ) : (
                      <UploadPDFButton
                        id={item.Pk_IDCorrespondenciaIn}
                        onUploadSuccess={() => window.location.reload()} // o actualizar estado
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mostrar controles de paginación solo si hay resultados */}
      {datosMostrar.length > 0 && totalPaginas > 1 && (
        <div className="paginacion">
          <button 
            onClick={() => cambiarPagina(paginaActual - 1)} 
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => cambiarPagina(num)}
              className={paginaActual === num ? 'active' : ''}
            >
              {num}
            </button>
          ))}
          
          <button 
            onClick={() => cambiarPagina(paginaActual + 1)} 
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Mostrar contador solo si hay resultados */}
      {datosMostrar.length > 0 && (
        <div className="contador-resultados">
          Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, datosMostrar.length)} de {datosMostrar.length} resultados
        </div>
      )}
    </div>
  );
};

export default Tabla;