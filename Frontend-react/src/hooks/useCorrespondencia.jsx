// src/hooks/useCorrespondencia.js
import { useState, useEffect } from "react";

const useCorrespondencia = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/ObtenerCorrespondenciaInterna")
      .then((res) => res.json())
      .then((res) => {
        setDatos(res.data[0]); // <- Asegúrate que `res.data` es el array con tus datos
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
