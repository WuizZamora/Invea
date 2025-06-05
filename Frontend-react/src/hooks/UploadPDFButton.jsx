import React from "react";

const UploadPDFButton = ({ id, onUploadSuccess }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/subir-soporte/${id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Archivo subido exitosamente");
        onUploadSuccess?.(); // Notifica al padre
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir el archivo");
    }
  };

  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={handleUpload}
      style={{ cursor: "pointer" }}
    />
  );
};

export default UploadPDFButton;
