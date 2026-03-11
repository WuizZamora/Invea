import React from "react";
import useFetchCorrespondenciaOut from "../hooks/useCorrespondenciaOut";
import SubirDocRespuesta from "../hooks/SubirDocRespuesta";

import { useState } from "react";


const TablaCorrespondenciaOut = ({ idCorrespondencia }) => {
  const [idUpload, setIdUpload] = useState(null);
  const { data, loading, error, refetch } = useFetchCorrespondenciaOut(idCorrespondencia);

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
    <>
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
                      <a
                        href={`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${fila.SoporteDocumental}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fila.Oficio}
                      </a>
                    ) : (
                      <span
                        style={{ cursor: "pointer", fontSize: "18px" }}
                        title="Subir documento"
                        onClick={() => setIdUpload(fila.Pk_IDCorrespondenciaOut)}
                      >
                        {fila.Oficio} 📤
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3} style={{ background: "#f9f9f9", fontStyle: "italic" }}>
                    <div
                      style={{
                        maxWidth: "30rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                      title={fila.Descripcion}
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

      {idUpload && (
        <SubirDocRespuesta
          idCorrespondenciaOut={idUpload}
          onClose={() => setIdUpload(null)}
          onUploadSuccess={refetch}
        />
      )}
    </>
  );
};


export default TablaCorrespondenciaOut;
