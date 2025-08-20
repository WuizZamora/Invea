import { useState, useEffect } from "react";

const useSelectObtenerPersonal = (refreshKey) => {
  const [opcionesPersonal, setOpcionesPersonal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonal = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/personal`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Verifica que result.data exista y sea un array
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Formato de respuesta inválido");
        }

        // Mapea los datos usando las propiedades correctas
        const opciones = result.data.map((persona) => ({
          value: persona.Pk_IDPersona, // ID como valor
          label: persona.Nombre,       // Nombre como etiqueta
          cargo: persona.Cargo,        // Cargo extra
        }));

        setOpcionesPersonal(opciones);
      } catch (error) {
        console.error("Error fetching personal:", error);
        setOpcionesPersonal([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonal();
  }, [refreshKey]); // 👈 vuelve a disparar cuando cambie refreshKey

  return { opcionesPersonal, loading };
};

export default useSelectObtenerPersonal;
