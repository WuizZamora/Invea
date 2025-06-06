import React, { useState, useEffect } from "react";
import "./White.css";
import Tabla from "./TablaCorrespodencia";
import useSelectObtenerPersonal from "./hooks/SelectObtenerPersonal";
import Select from 'react-select';
import { handleFormSubmit } from "./hooks/formSubmit";
import useDireccionPorAlcaldia from "./hooks/AlcaldiaIinput";

const FormIn = () => {
  // Obtener opciones de personal
  const { opcionesPersonal, loading: loadingPersonal } = useSelectObtenerPersonal();
  
  // Usar solo el hook de alcaldía
  const {
    alcaldias,
    colonias,
    cp,
    selectedAlcaldia,
    setSelectedAlcaldia,
    selectedColonia,
    setSelectedColonia,
    loading,
    direccionID
  } = useDireccionPorAlcaldia();

  // Convertir a formato para react-select
  const opcionesAlcaldias = alcaldias.map(alcaldia => ({
    value: alcaldia,
    label: alcaldia
  }));

  const opcionesColonias = colonias.map(colonia => ({
    value: colonia,
    label: colonia
  }));

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
    setTimeout(() => {
      window.location.reload();
    }, 1000);      
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
              className="select-remitente"
              classNamePrefix="react-select"
            />

            <label htmlFor="Asunto">Asunto:</label>
            <select id="Asunto" name="Asunto" value={form.Asunto} onChange={handleChange}>
              <option></option>
              <option value="REMITE INFORMACIÓN">REMITE INFORMACIÓN</option>
              <option value="SOLICITA INSPECCIÓN OCULAR">SOLICITA INSPECCIÓN OCULAR</option>
              <option value="SOLICITA VISITA DE VERIFICACIÓN">SOLICITA VISITA DE VERIFICACIÓN</option>
              <option value="REPOSICIÓN DE SELLOS DE CLAUSURA">REPOSICIÓN DE SELLOS CLAUSURA</option>
              <option value="REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES">REPOSICIÓN DE SELLOS MEDIDAS CAUTELARES</option>
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
              <option value="CASA POR CASA">CASA POR CASA</option>
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
            <label htmlFor="Alcaldia">Alcaldía:</label>
            <Select
              id="Alcaldia"
              name="Alcaldia"
              options={opcionesAlcaldias}
              value={opcionesAlcaldias.find(op => op.value === selectedAlcaldia)}
              onChange={(selected) => {
                setSelectedAlcaldia(selected ? selected.value : "");
                setSelectedColonia(""); // Resetear colonia al cambiar alcaldía
              }}
              placeholder="Buscar alcaldía..."
              isSearchable
              isLoading={loading}
              noOptionsMessage={() => "No se encontraron alcaldías"}
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <label htmlFor="Colonia">Colonia:</label>
            <Select
              id="Colonia"
              name="Colonia"
              options={opcionesColonias}
              value={opcionesColonias.find(op => op.value === selectedColonia)}
              onChange={(selected) => {
                setSelectedColonia(selected ? selected.value : "");
              }}
              placeholder={selectedAlcaldia ? "Buscar colonia..." : "Primero selecciona alcaldía"}
              isSearchable
              isLoading={loading}
              isDisabled={!selectedAlcaldia}
              noOptionsMessage={() => "No se encontraron colonias"}
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <label htmlFor="CP">Código Postal:</label>
            <input
              type="text"
              id="CP"
              name="CP"
              value={cp}
              readOnly
            />

            {loading && <p>Cargando datos...</p>}

            <label htmlFor="Calle">Calle:</label>
            <input type="text" id="Calle" name="calle" value={form.calle} onChange={handleChange}/>
            
            <label htmlFor="NumC">#:</label>
            <input type="number" id="NumC" name="NumC" value={form.NumC} onChange={handleChange}/>
          </div>

          <div className="input-row">
            <label>Turnado:</label>
            <Select
              options={opcionesPersonal}
              value={opcionesPersonal.find(op => op.value === form.Fk_Personal_Turnado)}
              onChange={(selected) =>
                setForm(prev => ({
                  ...prev,
                  Fk_Personal_Turnado: selected ? selected.value : ""
                }))
              }
              isLoading={loadingPersonal}
              placeholder="Buscar turnado..."
              isSearchable
              className="select-remitente"
              classNamePrefix="react-select"
            />
          </div>

          <button type="submit"
            className="save-button"
            disabled={
            !form.NumDVSC ||
            !form.date ||
            !form.oficio ||
            !form.descripcion ||
            !form.Asunto ||
            !form.Motivo ||
            !form.Caracter ||
            !form.calle ||
            !form.NumC ||
            !form.Fk_Personal_Remitente ||
            !form.Fk_Personal_Turnado
           }
          >Guardar</button>
        </form>
      </div>
      <Tabla />
    </div>
  );
};

export default FormIn;
