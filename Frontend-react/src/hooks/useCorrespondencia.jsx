import { useState, useEffect, useCallback } from "react";
import { useUsuario } from "../context/UserContext";

const useCorrespondencia = () => {
  const { usuario } = useUsuario();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatos = useCallback(async () => {
    if (!usuario) return;

    setLoading(true);

    try {
      let url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}`;
      if (usuario.nivel === 1 || usuario.nivel === 3) { // Correspondencia completa
        url += "/correspondencia/obtener-correspondencia/1";
      } else if (usuario.nivel === 2 && usuario.id) { // Correspondencia para Turnar
        url += `/correspondencia/obtener-correspondencia/2?turnado=${usuario.id}`;
      } else  if (usuario.nivel === 4 && usuario.idLCP) { // Correspondecia Turnada
        url += `/correspondencia/obtener-correspondencia/4?turnado=${usuario.idLCP}`;
      }

      const res = await fetch(url, { credentials: 'include' });
      const json = await res.json();
      setDatos(json.data[0] || []);
    } catch (err) {
      console.error("Error al obtener correspondencia:", err);
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return { datos, loading, refetch: fetchDatos };
};

export default useCorrespondencia;