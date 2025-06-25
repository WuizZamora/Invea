import React from "react";

const DetalleVisual = ({ item, camposOcultos, mostrarNombreCampo }) => {
  const soporte = item.SoporteDocumental;
  const soporteUrl =
    soporte &&
    `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${soporte}`;


    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "";

        const fecha = new Date(fechaISO);

        const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };

    return fecha.toLocaleString("es-MX", opciones);
    };
    
  return (
    <div className="detalle-visual-container">
      <div className="detalle-visual-izquierda card">
        <ul>
          {Object.entries(item).map(([clave, valor]) => {
            if (
              camposOcultos.includes(clave) ||
                valor === null ||
                valor === undefined ||
                valor === ""
              )
            return null;

            const esFecha = clave.toLowerCase().includes("fecha");
            const valorFormateado = esFecha ? formatearFecha(valor) : valor.toString();

            return (
              <li key={clave} className="detalle-campo">
                <strong>{mostrarNombreCampo(clave)}:</strong> {valorFormateado}
              </li>
            );
          })}
        </ul>
      </div>

      {soporte && (
        <div className="detalle-visual-derecha">
          <iframe
            src={soporteUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default DetalleVisual;
