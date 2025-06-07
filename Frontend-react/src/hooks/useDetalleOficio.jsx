import { useState } from "react";

const useDetalleOficio = () => {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerDetalle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-correspondencia-id/${id}`
      );
      const data = await res.json();
      const info = data.data?.[0]?.[0];
      setDetalle(info);
    } catch (err) {
      console.error("Error al obtener detalle:", err);
      setError("Ocurrió un error al cargar el detalle.");
    } finally {
      setLoading(false);
    }
  };

  return {
    detalle,
    loading,
    error,
    obtenerDetalle,
    limpiarDetalle: () => setDetalle(null),
  };
};

export default useDetalleOficio;
