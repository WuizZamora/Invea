import React, { useState, useEffect } from "react";
import "./Detalle.css";
import { showSuccess, showError, showConfirm } from "../utils/alerts";
import RespuestaTurnado from "./RespuestaTurnado";

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
                    <div className="detalle-bloque">
                        <div className="fila-arriba">
                        <span>
                            <strong>{item.NumDVSC ? "DVSC:" : "DEVA:"}</strong> {item.NumDVSC || item.NumDEVA}
                        </span>
                        <span>{formatearFecha(item.FechaIn)}</span>
                        
                        </div>
                        <div className="fila-arriba">
                        <span className={item.Caracter === "Urgente" ? "caracter-urgente" : "caracter-ordinario"}>
                            {item.Caracter}
                        </span>
                        <span>{item.Oficio}</span>
                        </div>
                        <br/>
                        <div className="fila-arriba">
                            <span><strong>Asunto:</strong> {item.Asunto}</span>
                            <span><strong>Motivo:</strong> {item.Motivo}</span>
                        </div> 
                        <div className="fila-arriba">
                            <span><strong>Turnado a:</strong> {item.Turnado}</span>
                        </div>      
                        <br/> 
                        <p><strong>Descripcion:</strong></p>
                        <p>{item.Descripcion}</p>
                        <br/>
                        <p>{item.Direccion}</p>

                        <strong>{item.Remitente}</strong>
                        <strong>{item.Cargo}</strong>
                    </div>
                </div>
                    <div className="detalle-visual-derecha">
                        <RespuestaTurnado />
                    </div>
                </div>

        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ModalTurnado;
