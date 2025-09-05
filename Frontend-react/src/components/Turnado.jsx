import React, { useState, useEffect, useCallback } from "react";
import FiltroCorrespondencia from "../hooks/FiltroCorrespondencia";
import "../css/Turnado.css";
import ModalTurnado from "../Modals/ModalTurnado";
import useCorrespondencia from "../hooks/useCorrespondencia";
import useDetalleOficio from "../hooks/useDetalleOficio";
import { useUsuario } from "../context/UserContext";

const Turnado = () => {
  const { usuario } = useUsuario();

    const {
    datos: datosOriginales,
    loading,
    refetch
    } = useCorrespondencia();
  const [datosFiltrados, setDatosFiltrados] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [resultadosPorPagina, setResultadosPorPagina] = useState(10);

  // Datos a mostrar - importante el orden de las condiciones
  const datosMostrar = datosFiltrados === null ? datosOriginales : 
                      datosFiltrados.length === 0 ? [] : 
                      datosFiltrados;
  // Conteo de estatus
  const conteoEstatus = datosMostrar.reduce(
    (acc, item) => {
      const estatus = item.Estatus?.toLowerCase();
      if (estatus === "pendiente") acc.pendiente += 1;
      else if (estatus === "en proceso") acc.enProceso += 1;
      else if (estatus === "terminado") acc.terminado += 1;
      return acc;
    },
    { pendiente: 0, enProceso: 0, terminado: 0 }
  );
  // Cálculos de paginación
  const totalPaginas = Math.ceil(datosMostrar.length / resultadosPorPagina);
  const indiceInicial = (paginaActual - 1) * resultadosPorPagina;
  const indiceFinal = indiceInicial + resultadosPorPagina;
  const datosPagina = datosMostrar.slice(indiceInicial, indiceFinal);
  {}
  const {
    detalle,
    error,
    obtenerDetalle,
    limpiarDetalle
  } = useDetalleOficio();

    const handleRespuestaSuccess = async () => {
    await refetch();      // 🔄 refresca la tabla
   // limpiarDetalle();     // ✅ opcional: cierra el modal
  };


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
  useEffect(() => {
  if (usuario) {
    refetch();
  }
}, [usuario]);


  return (
    <div className="table-card">
      Pendientes {usuario && <span className="animated-text">{usuario.username}</span>}
      <div className="row">
        <div className="col-md-7">
          <FiltroCorrespondencia 
            datos={datosOriginales} 
            onFiltrar={handleFiltrar} 
          />
        </div>
        <div className="col-md-3 leyenda-estatus">
          Estatus:
          <div className="items-estatus">
            <span>
              <span className="color-circulo pendiente"></span>
              Pendiente: {conteoEstatus.pendiente}
            </span>
            <span>
              <span className="color-circulo en-proceso"></span>
              En proceso: {conteoEstatus.enProceso}
            </span>
            <span>
              <span className="color-circulo terminado"></span>
              Terminado: {conteoEstatus.terminado}
            </span>
          </div>
        </div>
          <div className="col-md-2">
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
              <option value={20}>20</option>
              <option value={30}>30</option>
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
                <th>Num</th>
                <th>Oficio</th>
                <th>Fecha</th>
                <th>Asunto</th>
                <th>OP</th>
              </tr>
            </thead>
            <tbody>
              {datosPagina.map((item, index) => (
                <tr key={`${item.Pk_IDCorrespondenciaIn}-${index}`}>
                  <td className={`estatus-${item.Estatus?.toLowerCase()}`}>
                    {item.NumDVSC}
                  </td>
                  <td>
                    <span
                      style={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
                      onClick={() => obtenerDetalle(item.Pk_IDCorrespondenciaIn)}
                    >
                      {item.Oficio}
                    </span>
                    {item.Expediente ? (
                      <>
                      <br />
                      <strong>Exp:</strong>{item.Expediente}
                      </>
                    ) : null}
                  </td>
                  <td>{item.FechaDocumento}</td>
                  <td>{item.Asunto}</td>
                  <td>{item.OP ? (item.OP):("S/OP")}</td>
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
        <ModalTurnado
          item={detalle}
          onClose={limpiarDetalle}
          loading={loading}
          error={error}
          onSuccess={handleRespuestaSuccess}   // 👈 aquí le paso refetch
        />
      )}

    </div>
  );
};

export default Turnado;