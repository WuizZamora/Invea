// src/hooks/useCorrespondencia.js
import { useState, useEffect } from "react";

const useCorrespondencia = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-correspondencia`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setDatos(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener correspondencia:", err);
        setLoading(false);
      });
  }, []);
  return { datos, loading };
};

export default useCorrespondencia;
