import React from "react";
import "../Tabla.css"; // opcional

const ModalDetalle = ({ item, loading, error, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Detalles del registro</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
<ul>
  {Object.entries(item).map(([clave, valor]) => {
    if (clave === "SoporteDocumental") {
      if (!valor) return null;

      return (
        <li key={clave}>
          <strong>Soporte documental:</strong>{" "}
          <a
            href={`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${valor}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/PDF.png"
              alt="Ver PDF"
              style={{ width: "24px", cursor: "pointer", verticalAlign: "middle" }}
            />
          </a>
        </li>
      );
    }

    return (
      <li key={clave}>
        <strong>{clave}:</strong> {valor?.toString()}
      </li>
    );
  })}
</ul>

        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalDetalle;