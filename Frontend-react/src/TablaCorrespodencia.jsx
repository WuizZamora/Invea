import React, { useState } from "react";
import useCorrespondencia from "./hooks/useCorrespondencia";
import FiltroCorrespondencia from "./hooks/FiltroCorrespondencia";
import "./Tabla.css";

const Tabla = () => {
  const { datos: datosOriginales, loading } = useCorrespondencia();
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="form-card">
      <h2>Tabla de Registros</h2>
      
      {/* Agregamos el componente de filtro */}
      <FiltroCorrespondencia 
        datos={datosOriginales} 
        onFiltrar={setDatosFiltrados} 
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
            {(datosFiltrados.length > 0 ? datosFiltrados : datosOriginales).map((item, index) => (
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
    </div>
  );
};

export default Tabla;