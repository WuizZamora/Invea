import { showSuccess, showError } from "../utils/alerts";

const UploadPDFButton = ({ id, onUploadSuccess }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      showError("Por favor selecciona un archivo PDF válido.");
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
        showSuccess("Archivo subido exitosamente");
        onUploadSuccess?.(); // <- aquí se hace el refetch
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      showError("Error al subir el archivo");
    }
  };

  return (
    <label className="upload-label">
      📎 Subir PDF
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        style={{ display: "none" }}
      />
    </label>
  );
};

export default UploadPDFButton;