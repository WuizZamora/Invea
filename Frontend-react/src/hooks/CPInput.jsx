import { useState, useEffect } from "react";

const useDireccionPorCP = (cp) => {
  const [colonias, setColonias] = useState([]);
  const [alcaldia, setAlcaldia] = useState("");
  const [colonia, setColonia] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cp.length !== 5) {
      setColonias([]);
      setAlcaldia("");
      setColonia("");
      return;
    }

    const fetchDireccion = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/ObtenerDireccion/${cp}`);
        const result = await res.json();
        const data = result.data;

        if (data.length === 1) {
          setColonias(data); // ⚠️ Mantenemos la colonia en el array
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

  return { colonias, alcaldia, colonia, setColonia, setAlcaldia, loading };
};

export default useDireccionPorCP;
