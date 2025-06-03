import { useState, useEffect } from "react";

const useDireccionPorCP = (cp) => {
  const [colonias, setColonias] = useState([]);
  const [alcaldia, setAlcaldia] = useState("");
  const [colonia, setColonia] = useState("");
  const [loading, setLoading] = useState(false);
  const [direccionID, setDireccionID] = useState(null);

  useEffect(() => {
    if (!cp || cp.length !== 5) {
      setColonias([]);
      setAlcaldia("");
      setColonia("");
      return;
    }

    const fetchDireccion = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/direccion/${cp}`);
        const result = await res.json();
        const data = result.data;

        if (data.length === 1) {
          setDireccionID(data[0].Pk_IDAdress);
          setColonias(data);
          setColonia(data[0].Colonia);
          setAlcaldia(data[0].Alcaldia);
        } else if (data.length > 1) {
          setColonias(data);
          setColonia("");
          setAlcaldia("");
        } else {
          setColonias([]);
          setColonia("");
          setAlcaldia("");
        }
      } catch (error) {
        console.error(error);
        setColonias([]);
        setAlcaldia("");
        setColonia("");
      } finally {
        setLoading(false);
      }
    };

    fetchDireccion();
  }, [cp]);

  return { colonias, alcaldia, colonia, setColonia, setAlcaldia, loading, direccionID};
};

export default useDireccionPorCP;
