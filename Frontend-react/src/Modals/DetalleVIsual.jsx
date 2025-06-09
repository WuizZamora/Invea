import React from "react";// Asegúrate de tener este archivo o inclúyelo en el global

const DetalleVisual = ({ item, camposOcultos, mostrarNombreCampo }) => {
  const soporte = item.SoporteDocumental;
  const soporteUrl =
    soporte &&
    `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${soporte}`;

  return (
    <div className="detalle-visual-container">
      <div className="detalle-visual-izquierda card">
        <ul>
            {Object.entries(item).map(([clave, valor]) => {
                if (camposOcultos.includes(clave)) return null;

                return (
                <li key={clave} className="detalle-campo">
                    <strong>{mostrarNombreCampo(clave)}:</strong>{" "}
                    {valor?.toString()}
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
