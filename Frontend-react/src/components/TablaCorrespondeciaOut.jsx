import React from "react";
import useFetchCorrespondenciaOut from "../hooks/useCorrespondenciaOut";

const TablaCorrespondenciaOut = ({ idCorrespondencia }) => {
  const { data, loading, error } = useFetchCorrespondenciaOut(idCorrespondencia);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  // Asegúrate que data.data exista y sea arreglo
  const registros = data?.data ?? [];

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";

    const fecha = new Date(fechaISO);

    const opciones = {
      day: "2-digit",
      month: "2-digit"
    };

    return fecha.toLocaleString("es-MX", opciones);
  };

  if (registros.length === 0) return <p>No hay Respuestas para este registro, disponibles.</p>;

  return (
    <div className="table-container">
      <table className="tabla-registro">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Oficio</th>
          </tr>
        </thead>
        <tbody>
  {registros.map((fila, index) => (
    <React.Fragment key={index}>
      <tr title={fila.Descripcion}>
        <td>{formatearFecha(fila.FechaOut)}</td>
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
      </tr>
      <tr>
        <td colSpan={3} style={{ background: "#f9f9f9", fontStyle: "italic" }}>
          <div 
            style={{
              maxWidth: "30rem", // o el ancho que prefieras
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "default"
            }}
            title={fila.Descripcion} // Esto mostrará el texto completo al pasar el mouse
          >
            {fila.Descripcion}
          </div>
        </td>
      </tr>
    </React.Fragment>
  ))}
</tbody>
      </table>
    </div>
  );
};


export default TablaCorrespondenciaOut;
