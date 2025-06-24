import { useState, useEffect } from "react";

const useDireccionPorAlcaldia = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [alcaldias, setAlcaldias] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [selectedAlcaldia, setSelectedAlcaldia] = useState("");
  const [selectedColonia, setSelectedColonia] = useState("");
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(false);
  const [direccionID, setDireccionID] = useState(null);

  // Cargar todas las direcciones al inicio
  useEffect(() => {
    const fetchDirecciones = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/direccion`, {credentials: 'include'});
        const result = await res.json();
        setDirecciones(result);
        
        // Extraer alcaldías únicas
        const alcaldiasUnicas = [...new Set(result.map(item => item.Alcaldia))];
        setAlcaldias(alcaldiasUnicas);
      } catch (error) {
        console.error(error);
        setDirecciones([]);
        setAlcaldias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDirecciones();
  }, []);

  // Filtrar colonias cuando se selecciona una alcaldía
  useEffect(() => {
    if (!selectedAlcaldia) {
      setColonias([]);
      setSelectedColonia("");
      setCp("");
      return;
    }

    const coloniasFiltradas = direcciones
      .filter(item => item.Alcaldia === selectedAlcaldia)
      .map(item => item.Colonia);
    
    setColonias([...new Set(coloniasFiltradas)]); // Eliminar duplicados
    setSelectedColonia("");
    setCp("");
  }, [selectedAlcaldia, direcciones]);

  // Obtener CP cuando se selecciona una colonia
  useEffect(() => {
    if (!selectedColonia || !selectedAlcaldia) {
      setCp("");
      setDireccionID(null);
      return;
    }

    const direccionEncontrada = direcciones.find(
      item => item.Alcaldia === selectedAlcaldia && item.Colonia === selectedColonia
    );

    if (direccionEncontrada) {
      setCp(direccionEncontrada.CP);
      setDireccionID(direccionEncontrada.Pk_IDAdress);
    } else {
      setCp("");
      setDireccionID(null);
    }
  }, [selectedColonia, selectedAlcaldia, direcciones]);

  return { 
    direcciones,
    alcaldias,
    colonias,
    cp,
    selectedAlcaldia,
    setSelectedAlcaldia,
    selectedColonia,
    setSelectedColonia,
    loading,
    direccionID
  };
};

export default useDireccionPorAlcaldia;