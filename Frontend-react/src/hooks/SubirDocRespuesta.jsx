import React from "react";
import { showSuccess, showError } from "../utils/alerts";

const SubirDocRespuesta = ({ idCorrespondenciaOut, onClose, onUploadSuccess }) => {

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== "application/pdf") {
      showError("Por favor selecciona un archivo PDF válido.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}/deva/correspondencia/subir-soporte-cio/${idCorrespondenciaOut}`,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const data = await res.json();

      if (res.ok) {
        showSuccess("PDF subido correctamente");

        onUploadSuccess?.(); // refrescar tabla si lo necesitas
        onClose?.(); // cerrar modal
      } else {
        showError(data.error || "Error al subir el archivo");
      }

    } catch (error) {
      console.error(error);
      showError("Error al subir el archivo");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-report" style={{ maxWidth: "400px" }}>
        
        <h3>Subir soporte documental</h3>

        <label className="upload-label" style={{ cursor: "pointer" }}>
          📎 Seleccionar PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>

        <br />

        <button className="close-button" onClick={onClose}>
          ✖
        </button>

      </div>
    </div>
  );
};

export default SubirDocRespuesta;