import React, { useState, useEffect, useCallback } from "react";
import useCorrespondencia from "../hooks/useCorrespondencia";
import FiltroCorrespondencia from "../hooks/FiltroCorrespondencia";
import UploadPDFButton from "../hooks/UploadPDFButton";
import DeletePDFButton from "../hooks/DeletePDFButton";
import "../css/Tabla.css";
import  ModalDetalle from "../Modals/ModalDetalle";
import useDetalleOficio from "../hooks/useDetalleOficio";

const Tabla = () => {
  const { datos: datosOriginales, loading } = useCorrespondencia();
  const [datosFiltrados, setDatosFiltrados] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [resultadosPorPagina, setResultadosPorPagina] = useState(10);

  // Datos a mostrar - importante el orden de las condiciones
  const datosMostrar = datosFiltrados === null ? datosOriginales : 
                      datosFiltrados.length === 0 ? [] : 
                      datosFiltrados;

  // Cálculos de paginación
  const totalPaginas = Math.ceil(datosMostrar.length / resultadosPorPagina);
  const indiceInicial = (paginaActual - 1) * resultadosPorPagina;
  const indiceFinal = indiceInicial + resultadosPorPagina;
  const datosPagina = datosMostrar.slice(indiceInicial, indiceFinal);
  {}
  const {
    detalle,
    loading: loadingDetalle,
    error,
    obtenerDetalle,
    limpiarDetalle
  } = useDetalleOficio();

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
    <div className="table-card">
      <h4>Tabla de Registros</h4>
      <div className="row">
        <div className="col-md-7">
          <FiltroCorrespondencia 
            datos={datosOriginales} 
            onFiltrar={handleFiltrar} 
          />
        </div>
          <div className="col-md-5">
          <div className="contenedor-filas-por-pagina">
            <label htmlFor="filasPorPagina">Filas por página:</label>
            <select
              id="filasPorPagina"
              value={resultadosPorPagina}
              onChange={(e) => {
                setResultadosPorPagina(parseInt(e.target.value));
                setPaginaActual(1); // reinicia la paginación
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
      
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
                <th>OP</th>
                <th>Soporte documental</th>
              </tr>
            </thead>
            <tbody>
              {datosPagina.map((item, index) => (
                <tr key={`${item.Pk_IDCorrespondenciaIn}-${index}`}>
                  <td>{item.NumDVSC}</td>
                  <td
                    style={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
                    onClick={() => obtenerDetalle(item.Pk_IDCorrespondenciaIn)}
                  >
                    {item.Oficio}
                  </td>
                  <td>{item.Remitente}</td>
                  <td>{item.Motivo}</td>
                  <td>{item.Direccion}</td>
                  <td>{item.OP ? (item.OP):("S/OP")}</td>
                  <td>
                    {item.SoporteDocumental ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <a href={`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${item.SoporteDocumental}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src="/PDF.png"
                            alt="Ver PDF"
                            className="pdf"
                            style={{ width: "24px", cursor: "pointer" }}
                          />
                        </a>
                          <DeletePDFButton
                            id={item.Pk_IDCorrespondenciaIn}
                            onDeleteSuccess={() => window.location.reload()} // o actualizar estado
                          />
                      </div>
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
          
        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter(num => 
            num === 1 || 
            num === totalPaginas || 
            Math.abs(num - paginaActual) <= 2
          )
          .map((num, i, arr) => {
            const prevNum = arr[i - 1];
            return (
              <React.Fragment key={num}>
                {prevNum && num - prevNum > 1 && <span className="ellipsis">...</span>}
                <button
                  onClick={() => cambiarPagina(num)}
                  className={paginaActual === num ? 'active' : ''}
                >
                  {num}
                </button>
              </React.Fragment>
            );
          })}
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
      {/* Muestra el Modal de Detallos de Oficio */}
      {detalle && (
        <ModalDetalle
          item={detalle}
          onClose={limpiarDetalle}
          loading={loading}
          error={error}
        />
      )}

    </div>
  );
};

export default Tabla;