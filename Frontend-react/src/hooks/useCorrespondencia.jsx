import { useState, useEffect, useCallback } from "react";

// Hook para correspondencia general
export const useCorrespondencia = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-correspondencia/1`;
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      if (json?.data) {
        setDatos(json.data[0] || {});
      }
    } catch (err) {
      console.error("Error al obtener correspondencia:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return { datos, loading, refetch: fetchDatos };
};

// Hook para correspondencia filtrada por turnado
export const useTurnado = (id) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatos = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-correspondencia/2?turnado=${id}`;
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      if (json?.data) {
        setDatos(json.data[0] || {});
      }
    } catch (err) {
      console.error("Error al obtener correspondencia:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return { datos, loading, refetch: fetchDatos };
};
