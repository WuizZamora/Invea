import { toast } from "react-toastify";

const DeletePDFButton = ({ id, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar el archivo PDF?");
    if (!confirmacion) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/borrar-soporte/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Archivo eliminado exitosamente");
        onDeleteSuccess?.(); // <- aquí se hace el refetch
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar el archivo");
    }
  };

  return (
    <button className="button-table" onClick={handleDelete}>
      🗑️ Eliminar
    </button>
  );
};
export default DeletePDFButton;