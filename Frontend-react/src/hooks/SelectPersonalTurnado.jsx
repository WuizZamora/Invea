import { useState, useEffect } from "react";

const useSelectPersonalTurnado = () => {
    const [opcionesTurnado, setOpcionesTurnado] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonal = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/personal/personal-turnado`, {credentials: 'include'});
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Verifica que result.data exista y sea un array
                if (!result.data || !Array.isArray(result.data)) {
                    throw new Error("Formato de respuesta inválido");
                }
                
                // Mapea los datos usando las propiedades correctas
                const opciones = result.data.map(persona => ({
                    value: persona.Pk_IDPersonalTurnado,
                    label: `${persona.Iniciales}-${persona.Nombre}`,
                }));

                setOpcionesTurnado(opciones);
            } catch (error) {
                console.error("Error fetching personal:", error);
                setOpcionesTurnado([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonal();
    }, []);

    return { opcionesTurnado, loading };
};

export default useSelectPersonalTurnado;