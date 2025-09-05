import React, { useState, useEffect } from "react";
import "./Detalle.css";
import { showSuccess, showError, showConfirm } from "../utils/alerts";
import RespuestaTurnado from "./RespuestaTurnado";
import VisorPDF from "../utils/VisorPDF";
import TablaCorrespondenciaOut from "../components/TablaCorrespondeciaOut";
import { useUsuario } from "../context/UserContext";

const ModalTurnado = ({ item, onClose, onSuccess }) => {
    
    const { usuario } = useUsuario();
    const [refetchOut, setRefetchOut] = useState(false);
    const [mostrarRespuesta, setMostrarRespuesta] = useState(true);

  return (
    <div className="modal-overlay">
      <div className={`modal-content-turnado`}>
<div className="detalle-visual-container">
  {/* Detalle del lado izquierdo o derecho dependiendo del usuario */}
  <div className={usuario.id === 5 ? "detalle-visual-derecha card" : "detalle-visual-izquierda card"}>
    <div className="col-md-12">
      <h3 className="txt-izq">Detalles del registro</h3>
      <div className="detalle-bloque">
        <div className="fila-arriba">
          <span>
            <strong>{item.NumDVSC ? "DVSC:" : "DEVA:"}</strong> {item.NumDVSC || item.NumDEVA}
          </span>
          <span>{item.FechaDocumento}</span>
        </div>
        <div className="fila-arriba">
          <span className={item.Caracter === "Urgente" ? "caracter-urgente" : "caracter-ordinario"}>
            {item.Caracter}
          </span>
          <span>{item.Oficio}</span>
        </div>
        <div className="fila-arriba">
          {item.OP && <span><strong>OP:</strong> {item.OP}</span>}
          {item.Expediente && <span><strong>Exp:</strong> {item.Expediente}</span>}
        </div>
        <br />
        <div className="fila-arriba">
          <span><strong>Asunto:</strong> {item.Asunto}</span>
          <span><strong>Motivo:</strong> {item.Motivo}</span>
        </div>
        <div className="fila-arriba">
          <span><strong>Turnado a:</strong> {item.Turnado}</span>
        </div>
        <br />
        <p><strong>Descripcion:</strong></p>
        <p>{item.Descripcion}</p>
        <br />
        <p>{item.TipoInmueble}:{item.Denominacion}</p>
        <p>{item.Direccion}</p>
        <strong>{item.Remitente}</strong>
        <strong>{item.Cargo}</strong>
      </div>
    </div>

    {/* Botón para ver PDF (sigue estando aquí en ambos casos) */}
    {item.SoporteDocumental && (
      <div
        style={{ display: "flex", alignItems: "left", gap: "0.5rem", cursor: "pointer", marginTop: "0.5rem" }}
        onClick={() => setMostrarRespuesta(false)}
      >
        <img src="/PDF.png" alt="Ver PDF" className="pdf" style={{ width: "24px" }} />
        <span>Ver Soporte Documental</span>
      </div>
    )}

    <br />

    {/* Historial solo si el usuario.id !== 5 (izquierda) */}
    {usuario.id !== 5 && (
      <>
        <h5>Historial de Respuestas</h5>
        <TablaCorrespondenciaOut
          idCorrespondencia={item.Pk_IDCorrespondenciaIn}
          key={refetchOut}
        />
      </>
    )}
  </div>

  {/* Sección derecha (cuando usuario.id !== 5), o si es 5, aquí va la tabla o el visor PDF */}
  {usuario.id !== 5 ? (
    <div className="detalle-visual-derecha">
      {mostrarRespuesta ? (
        <RespuestaTurnado
          idCorrespondencia={item.Pk_IDCorrespondenciaIn}
          onSuccess={() => {
            // 🔄 refresca tabla interna de respuestas
            setRefetchOut(prev => !prev);

            // 🔄 refresca Turnado (padre)
            if (onSuccess) onSuccess();
          }}
        />
      ) : (
        <VisorPDF
          url={`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${item.SoporteDocumental}`}
          onClose={() => setMostrarRespuesta(true)}
        />
      )}
    </div>
  ) : (
    mostrarRespuesta ? (
      <div className="detalle-visual-izquierda card">
        <h5>Historial de Respuestas</h5>
        <TablaCorrespondenciaOut
          idCorrespondencia={item.Pk_IDCorrespondenciaIn}
          key={refetchOut}
        />
      </div>
    ) : (
      <div className="detalle-visual-izquierda card">
        <VisorPDF
          url={`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${item.SoporteDocumental}`}
          onClose={() => setMostrarRespuesta(true)}
        />
      </div>
    )
  )}
</div>


        <button className="close-boton" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ModalTurnado;
