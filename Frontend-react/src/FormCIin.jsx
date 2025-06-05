import React, { useState, useEffect } from "react";
import "./White.css";
import Tabla from "./TablaCorrespodencia";
import useDireccionPorCP from "./hooks/CPInput";
import useSelectObtenerPersonal from "./hooks/SelectObtenerPersonal"; // Corregido
import Select from 'react-select'; // Importar Select
import { handleFormSubmit } from "./hooks/formSubmit";

const FormIn = () => {
  // Obtener opciones de personal
  const { opcionesPersonal, loading: loadingPersonal } = useSelectObtenerPersonal();
  const [cp, setCp] = useState("");
  const {
    colonias,
    colonia,
    setColonia,
    loading,
    alcaldia,
    setAlcaldia,
    direccionID
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
    NumDVSC: "",
    date: "",
    oficio: "",
    Fk_Personal_Remitente: "",
    descripcion: "",
    calle: "",
    NumC: "",
    Asunto: "",
    Motivo: "",
    Caracter: "",
    Fk_Personal_Turnado: ""
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const { success, result, error } = await handleFormSubmit(form, direccionID);
    if (success) {
      alert("Enviado correctamente");
    } else {
      alert("Error al enviar");
    }
  };

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
        <form onSubmit={onSubmit}>
          <div className="input-row">
            <label htmlFor="NumDVSC">#DVSC:</label>
            <input type="number" id="NumDVSC" name="NumDVSC" className="form-item" value={form.NumDVSC}
              onChange={handleChange} />

            <label htmlFor="date">Fecha de Recepción:</label>
            <input type="date" id="date" name="date" value={form.date} onChange={handleChange} />

            <label htmlFor="Oficio">Oficio:</label>
            <input type="text" id="Oficio" name="oficio" value={form.oficio} onChange={handleChange} />
          </div>

          {/* CAMPO REMITENTE (REEMPLAZAR) */}
          <div className="input-row">
            <label>Remitente:</label>
            <Select
              options={opcionesPersonal}
              value={opcionesPersonal.find(op => op.value === form.Fk_Personal_Remitente)}
              onChange={(selected) =>
                setForm(prev => ({
                  ...prev,
                  Fk_Personal_Remitente: selected ? selected.value : ""
                }))
              }
              isLoading={loadingPersonal}
              placeholder="Buscar remitente..."
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <label htmlFor="Asunto">Asunto:</label>
            <select id="Asunto" name="Asunto" value={form.Asunto} onChange={handleChange}>
              <option></option>
              <option value="REMITE INFORMACIÓN">REMITE INFORMACIÓN</option>
              <option value="SOLICITA INSPECCIÓN OCULAR">SOLICITA INSPECCIÓN OCULAR</option>
              <option value="SOLICITA VISITA DE VERIFICACIÓN">SOLICITA VISITA DE VERIFICACIÓN</option>
            </select>

          </div>

          <div className="input-row">
            <label htmlFor="Descripcion">Descripción:</label>
            <textarea id="Descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} />

            <label htmlFor="Motivo">Motivo:</label>
            <select id="Motivo" name="Motivo" value={form.Motivo} onChange={handleChange}>
              <option></option>
              <option value="ATENCIÓN CIUDADANA">ATENCIÓN CIUDADANA</option>
              <option value="AUDIENCIA CIUDADANA">AUDIENCIA CIUDADANA</option>
              <option value="CASA X CASA">CASA X CASA</option>
              <option value="INTERNOS">INTERNOS</option>
              <option value="REMITE INFORMACIÓN">REMITE INFORMACIÓN</option>
              <option value="MEDIOS DIGITALES">MEDIOS DIGITALES</option>
              <option value="OFICIALIA DE PARTES">OFICIALIA DE PARTES</option>
            </select>

            <label htmlFor="Caracter">Caracter:</label>
            <select id="Caracter" name="Caracter" value={form.Caracter} onChange={handleChange}>
              <option></option>
              <option value="ORDINARIO">ORDINARIO</option>
              <option value="URGENTE">URGENTE</option>
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
            <input type="text" id="Calle" name="calle" value={form.calle} onChange={handleChange} />

            <label htmlFor="NumC">#:</label>
            <input type="number" id="NumC" name="NumC" value={form.NumC} onChange={handleChange} />
          </div>

          <div className="input-row">
            <label htmlFor="Turnado">Turnado</label>
            <select id="Turnado" name="Fk_Personal_Turnado" value={form.Fk_Personal_Turnado} onChange={handleChange}>
              <option></option>
              <option value="619">CLAUDIA YVETTE MOLINA SÁNCHEZ</option>
            </select>
          </div>

          <button type="submit"
          // disabled={
          //   !form.NumDVSC ||
          //   !form.date ||
          //   !form.oficio ||
          //   !form.descripcion ||
          //   !form.Asunto ||
          //   !form.Motivo ||
          //   !form.Caracter ||
          //   !form.calle ||
          //   !form.NumC ||
          //   !form.Fk_Personal_Remitente ||
          //   !form.Fk_Personal_Turnado
          // }
          >Guardar</button>
        </form>
      </div>
      <Tabla />
    </div>
  );
};

export default FormIn;
