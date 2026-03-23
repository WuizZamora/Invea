import { useState, useEffect } from "react";

const useSelectSub = (idEntrada) => {
    const [idSalida, setIdSalida] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSub = async () => {
            try {
                if (!idEntrada) {
                    setIdSalida(null);
                    setLoading(false);
                    return;
                }

                const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/personal/area-id_sub/${idEntrada}`;

                const response = await fetch(url, { credentials: 'include' });
                const result = await response.json();

                // ✅ AQUÍ ESTÁ LA CLAVE
                const id = result.data?.[0]?.ID_SUB ?? null;

                setIdSalida(id);

            } catch (error) {
                console.error("Error fetching sub:", error);
                setIdSalida(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSub();
    }, [idEntrada]);

    return { idSalida, loading };
};

export default useSelectSub;