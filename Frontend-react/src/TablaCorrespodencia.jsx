import React, { useState } from "react";
import useCorrespondencia from "./hooks/useCorrespondencia";
import FiltroCorrespondencia from "./hooks/FiltroCorrespondencia";
import "./Tabla.css";

const Tabla = () => {
  const { datos: datosOriginales, loading } = useCorrespondencia();
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 10;

  if (loading) return <p>Cargando datos...</p>;

  // Calcular los datos a mostrar
  const datosMostrar = datosFiltrados.length > 0 ? datosFiltrados : datosOriginales;
  const totalPaginas = Math.ceil(datosMostrar.length / resultadosPorPagina);
  const indiceInicial = (paginaActual - 1) * resultadosPorPagina;
  const indiceFinal = indiceInicial + resultadosPorPagina;
  const datosPagina = datosMostrar.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleFiltrar = (datos) => {
    setDatosFiltrados(datos);
    setPaginaActual(1); // Resetear a primera página al filtrar
  };

  return (
    <div className="form-card">
      <h2>Tabla de Registros</h2>
      
      <FiltroCorrespondencia 
        datos={datosOriginales} 
        onFiltrar={handleFiltrar} 
      />
      
      <div className="table-container">
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
              <tr key={index}>
                <td>{item.NumDVSC}</td>
                <td>{item.Oficio}</td>
                <td>{item.Remitente}</td>
                <td>{item.Motivo}</td>
                <td>{item.Direccion}</td>
                <td>
                  {item.SoporteDocumental
                    ? item.SoporteDocumental
                    : <button onClick={() => handleUpload()}>Subir Documento</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {totalPaginas > 1 && (
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

      <div className="contador-resultados">
        Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, datosMostrar.length)} de {datosMostrar.length} resultados
      </div>
    </div>
  );
};

export default Tabla;