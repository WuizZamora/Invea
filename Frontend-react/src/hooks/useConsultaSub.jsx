import { useEffect, useState } from 'react';

export default function useConsultaSub() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/obtener-dashboard-sub`;
        const res = await fetch(url, {credentials: 'include'});
        const json = await res.json();

        if (res.ok) {
          setData(json.data);
        } else {
          setError(json.error || 'Error desconocido');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
