import React, { useState, useEffect } from "react";
import "./Detalle.css";
import { showSuccess, showError, showConfirm } from "../utils/alerts";

const ModalTurnado = ({ item, loading, error, onClose }) => {
    const [formData, setFormData] = useState({ ...item });
    const [TipoMensaje, setTipoMensaje] = useState("");

    const mostrarNombreCampo = (clave) => (clave === "FechaIn" ? "Fecha" : clave);
    const camposOcultos = ["Pk_IDCorrespondenciaIn", "Dependencia", "SoporteDocumental", ""];

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
    <div className="modal-overlay">
      <div className={`modal-content`}>
            <div className="detalle-visual-container">
                <div className="detalle-visual-izquierda card">
                    <h3 className="txt-izq">Detalles del registro</h3>
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
                    <div className="detalle-visual-derecha">
                        123
                    </div>
                </div>

        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ModalTurnado;
