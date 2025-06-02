import React from "react";
import useCorrespondencia from "./hooks/useCorrespondencia";
import "./Tabla.css";

const Tabla = () => {
  const { datos, loading } = useCorrespondencia();

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="form-card">
      <h2>Tabla de Registros</h2>
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
          {datos.map((item) => (
            <tr>
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
  );
};

export default Tabla;
