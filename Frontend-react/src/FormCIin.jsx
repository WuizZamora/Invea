import React, { useState, useEffect } from "react";
import "./App.css";
import Tabla from "./TablaCorrespodencia";
import useDireccionPorCP from "./hooks/CPInput";

const FormIn = () => {

  const [cp, setCp] = useState("");
const {
  colonias,
  colonia,
  setColonia,
  loading,
  alcaldia,
  setAlcaldia,
} = useDireccionPorCP(cp);

  
  useEffect(() => {
    if (colonias.length === 1) {
      const unica = colonias[0];
      if (colonia !== unica.Colonia) {
        setColonia(unica.Colonia);
      }
      if (alcaldia !== unica.Alcaldia) {
        setAlcaldia(unica.Alcaldia);
      }
    }
  }, [colonias, colonia, alcaldia]);

  useEffect(() => {
    if (!cp) {
      setColonia("");
      setAlcaldia("");
    }
  }, [cp]);

  const [form, setForm] = useState({
    oficio: "",
    descripcion: "",
    calle: ""

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  return (

    <div className="form-container">
      <div className="form-card">
        <h2>Correspondencia Interna Entrada</h2>
        <form>
          <div className="input-row">
            <label htmlFor="name">#DVSC:</label>
            <input type="number" id="NumDVSC" name="NumDVSC"/>

            <label htmlFor="date">Fecha de Recepción:</label>
            <input type="date" id="date" name="date" />

            <label htmlFor="Oficio">Oficio:</label>
            <input type="text" id="Oficio" name="oficio"  value={form.oficio} onChange={handleChange}/>
          </div>

          <div className="input-row">
            <label htmlFor="Nombre">Remitente:</label>
            <input type="text" id="Nombre" name="Nombre" />

            <label htmlFor="Cargo">Cargo:</label>
            <input type="text" id="Cargo" name="Cargo" />

            <label htmlFor="Asunto">Asunto:</label>
            <select id="Asunto" name="Asunto">
              <option value="">REMITE INFORMACIÓN</option>
              <option value="">SOLICITA INSPECCIÓN OCULAR</option>
              <option value="">SOLICITA VISITA DE VERIFICACIÓN</option>
            </select>

          </div>

          <div className="input-row">
            <label htmlFor="Descripcion">Descripción:</label>
            <textarea id="Descripcion" name="descripcion" value={form.descripcion} onChange={handleChange}/>

            <label htmlFor="Motivo">Motivo:</label>
            <select id="Motivo" name="Motivo">
              <option value="">ATENCIÓN CIUDADANA</option>
              <option value="">AUDIENCIA CIUDADANA</option>
              <option value="">CASA X CASA</option>
              <option value="">INTERNOS</option>
              <option value="">REMITE INFORMACIÓN</option>
              <option value="">MEDIOS DIGITALES</option>
              <option value="">OFICIALIA DE PARTES</option>
            </select>

            <label htmlFor="Caracter">Caracter:</label>
            <select id="Caracter" name="Caracter">
              <option value="">ORDINARIO</option>
              <option value="">URGENTE</option>
            </select>
          </div>

          <div className="input-row">
          <label htmlFor="CP">Código Postal:</label>
          <input
            type="text"
            id="CP"
            name="CP"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
          />

          <label htmlFor="Colonia">Colonia:</label>
          {colonias.length > 0 ? (
            <select
              id="Colonia"
              name="Colonia"
              value={colonia}
              onChange={(e) => {
                const selectedColonia = colonias.find(c => c.Colonia === e.target.value);
                setColonia(selectedColonia?.Colonia || "");
                setAlcaldia(selectedColonia?.Alcaldia || ""); // <-- Aquí actualizas la Alcaldía
              }}
            >
              <option value="">-- Selecciona colonia --</option>
              {colonias.map((c) => (
                <option key={c.Pk_IDAdress} value={c.Colonia}>
                  {c.Colonia}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="Colonia"
              name="Colonia"
              value={colonia}
              readOnly
            />
          )}

          {loading && <p>Cargando colonias...</p>}

          <label htmlFor="Alcaldia">Alcaldía:</label>
          <input
            type="text"
            id="Alcaldia"
            name="Alcaldia"
            value={alcaldia}
            readOnly
          />

            <label htmlFor="Calle">Calle:</label>
            <input type="text" id="Calle" name="calle" value={form.calle} onChange={handleChange}/>
            
            <label htmlFor="NumC">#:</label>
            <input type="number" id="NumC" name="NumC" />
          </div>

          <div className="input-row">
            <label htmlFor="Turnado">Turnado</label>
            <select id="Turnado" name="Turnado">
            </select>
          </div>

          <button type="submit">Guardar</button>
        </form>
      </div>
      <Tabla />
    </div>
  );
};

export default FormIn;
