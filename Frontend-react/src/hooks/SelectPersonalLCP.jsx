import { useState, useEffect } from "react";

const useSelectLCP = (idUsuario, idLCP) => {
    const [opcionesLCP, setOpcionesLCP] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonal = async () => {
            try {
                let id = null;

                if (idLCP) {
                    id = idLCP;
                } else if (idUsuario) {
                    id = idUsuario;
                }

                if (!id) {
                    console.warn("No se recibió ningún ID válido");
                    setOpcionesLCP([]);
                    setLoading(false);
                    return;
                }

                const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/personal/lcp-turnado/${id}`;

                const response = await fetch(url, { credentials: 'include' });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (!result.data || !Array.isArray(result.data)) {
                    throw new Error("Formato de respuesta inválido");
                }

                const opciones = result.data.map(persona => ({
                    value: persona.Pk_IDLCPTurnado,
                    label: persona.Nombre,
                }));

                setOpcionesLCP(opciones);
            } catch (error) {
                console.error("Error fetching personal:", error);
                setOpcionesLCP([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonal();
    }, [idUsuario, idLCP]);

    return { opcionesLCP, loading };
};

export default useSelectLCP;
