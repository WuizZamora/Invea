import { useState, useEffect, useCallback } from "react";

const useCorrespondencia = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-correspondencia`;

      const res = await fetch(url, {credentials: 'include'});
      const json = await res.json();
      setDatos(json.data[0]);
    } catch (err) {
      console.error("Error al obtener correspondencia:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return { datos, loading, refetch: fetchDatos };
};

export default useCorrespondencia;
