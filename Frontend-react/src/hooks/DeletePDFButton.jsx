import { showConfirm, showSuccess, showError } from "../utils/alerts";

const DeletePDFButton = ({ id, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const confirmacion = await showConfirm(
      "¿Estás seguro de que quieres eliminar el archivo PDF?",
      "Esta acción no se puede deshacer.",
      "Sí, eliminar",
      "Cancelar"
    );
    if (!confirmacion) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/borrar-soporte/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await res.json();

      if (res.ok) {
        showSuccess("Archivo eliminado exitosamente");
        setTimeout(1500);
        onDeleteSuccess?.(); // <- aquí se hace el refetch
      } else {
        showError("Error: " + (data.error || "No se pudo eliminar el archivo"));
      }
    } catch (err) {
      console.error(err);
      showError("Error al eliminar el archivo");
    }
  };

  return (
    <span 
      className="icon-trash" 
      onClick={handleDelete} 
      role="button" 
      aria-label="Eliminar"
    >
      🗑️
    </span>
  );
};
export default DeletePDFButton;