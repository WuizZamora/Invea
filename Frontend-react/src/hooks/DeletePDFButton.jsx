import React from "react";

const DeletePDFButton = ({ id, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const confirmacion = confirm("¿Estás seguro de que quieres eliminar el archivo PDF?");
    if (!confirmacion) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/borrar-soporte/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Archivo eliminado exitosamente");
        onDeleteSuccess?.(); // Notifica al padre para refrescar
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el archivo");
    }
  };

  return (
    <button className="button-table" onClick={handleDelete}>
      🗑️ Eliminar
    </button>
  );
};

export default DeletePDFButton;
