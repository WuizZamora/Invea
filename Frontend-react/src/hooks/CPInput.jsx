import React, { useState, useEffect } from "react";
import "../App.css";

const CPInput = ({ cp, setCp, setAlcaldia, setColonia }) => {
  const [colonias, setColonias] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cuando cambia el cp, hacemos la consulta al backend
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
        if (!res.ok) throw new Error("Error en la consulta");
        const result = await res.json();
        const data = result.data;

        if (data.length === 1) {
          // Solo un registro, llenamos directamente
          setAlcaldia(data[0].Alcaldia);
          setColonia(data[0].Colonia);
          setColonias([]);
        } else if (data.length > 1) {
          // Más de uno, dejamos elegir al usuario
          setColonias(data);
          setAlcaldia("");  // vaciamos para que el usuario elija colonia
          setColonia("");
        } else {
          // No hay datos para ese CP
          setAlcaldia("");
          setColonia("");
          setColonias([]);
        }
      } catch (error) {
        console.error(error);
        setAlcaldia("");
        setColonia("");
        setColonias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDireccion();
  }, [cp]);

  return (
    <div>
      <label htmlFor="CP">Codigo Postal</label>
    <input
        type="text"
        id="CP"
        name="CP"
        value={cp}
        onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,5}$/.test(value)) setCp(value);
        }}
        placeholder="Ej. 12345"
        className="CP"
    />


      {loading && <p>Cargando...</p>}

      {colonias.length > 1 ? (
        <label>
          Colonia:
          <select
            className="Colonia"
            onChange={(e) => {
              const selected = colonias.find(
                (c) => c.Colonia === e.target.value
              );
              setColonia(selected?.Colonia || "");
              setAlcaldia(selected?.Alcaldia || "");
            }}
          >
            <option value="">-- Seleccione colonia --</option>
            {colonias.map((c) => (
              <option key={c.Pk_IDAdress} value={c.Colonia}>
                {c.Colonia}
              </option>
            ))}
          </select>
        </label>
      ) : colonias.length === 1 ? (
        <p>Colonia: {colonias[0].Colonia}</p>
      ) : null}
    </div>
  );
};

export default CPInput;
