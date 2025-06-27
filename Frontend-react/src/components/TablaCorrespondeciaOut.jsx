import React from "react";
import useFetchCorrespondenciaOut from "../hooks/useCorrespondenciaOut";

const TablaCorrespondenciaOut = ({ idCorrespondencia }) => {
  const { data, loading, error } = useFetchCorrespondenciaOut(idCorrespondencia);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  // Asegúrate que data.data exista y sea arreglo
  const registros = data?.data ?? [];

  if (registros.length === 0) return <p>No hay registros OUT disponibles.</p>;

  return (
    <div className="table-container">
      <h4>Historial de respuesta</h4>
      <table className="tabla-registro">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Oficio</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((fila, index) => (
            <tr key={index}>
              <td>{new Date(fila.FechaOut).toLocaleDateString("es-MX")}</td>
              <td>{fila.Accion}</td>
              <td>
                {fila.SoporteDocumental ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <a
                        href={`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${fila.SoporteDocumental}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {fila.Oficio}
                    </a>
                    </div>
                ) : (
                    <span>{fila.Oficio}</span>
                )}
              </td>
              <td>{fila.Descripcion}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default TablaCorrespondenciaOut;
