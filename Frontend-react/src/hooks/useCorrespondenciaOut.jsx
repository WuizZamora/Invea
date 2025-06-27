import { useState, useEffect } from "react";

const useFetchCorrespondenciaOut = (idCorrespondencia) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idCorrespondencia) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-correspondencia-out/${idCorrespondencia}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Error al obtener los datos");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCorrespondencia]);

  return { data, loading, error };
};

export default useFetchCorrespondenciaOut;
