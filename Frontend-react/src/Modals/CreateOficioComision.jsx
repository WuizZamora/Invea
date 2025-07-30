import React, { useState } from "react";
import { showConfirm, showSuccess, showError } from "../utils/alerts";

const CreateOficioComision = ({ isOpen, onClose, idCorrespondencia, refetch }) => {
  const [oficio, setOficio] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    const confirmar = await showConfirm(
      "¿Asignar Oficio?",
      "Confirma que los datos del oficio sean correctos.",
      "Asignar",
      "Cancelar"
    );

    if (!confirmar) return;

    setEnviando(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/oficio-comision`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Fk_IDCorrespondenciaIn: idCorrespondencia,
            Oficio: oficio,
            Observaciones: observaciones,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showSuccess("Oficio Asignado");
        setTimeout(() => {
          onClose();
          refetch();
        }, 1500);
      } else {
        showError(result?.mensaje || "Error al asignar Oficio");
      }
    } catch (error) {
      showError("Error al asignar Oficio");
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Asignar Oficio de Comisión</h2>
        <div className="form-group">
          <label className="form-label">Oficio</label>
          <input
            type="text"
            value={oficio}
            onChange={(e) => setOficio(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Observaciones</label>
          <textarea
          className="form-control"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>
        </div><br />
        <div className="modal-buttons">
          <button
            className="save-button"
            onClick={handleSubmit}
            disabled={enviando}
          >
            Enviar
          </button>
          <button  className="close-button" onClick={onClose} disabled={enviando}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOficioComision;
