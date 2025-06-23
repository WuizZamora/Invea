import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/White.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import Tabla from "./TablaCorrespodencia";
import useSelectObtenerPersonal from "../hooks/SelectObtenerPersonal";
import Select from 'react-select';
import { handleFormSubmit } from "../hooks/formSubmit";
import useDireccionPorAlcaldia from "../hooks/AlcaldiaIinput";
import useSelectPersonalTurnado from "../hooks/SelectPersonalTurnado";
import { showSuccess, showError } from "../utils/alerts";

const FormIn = () => {
  // Obtener opciones de personal
  const { opcionesPersonal, loading: loadingPersonal } = useSelectObtenerPersonal();
  const { opcionesTurnado, loading: loadingTurnado } = useSelectPersonalTurnado();
  
  const [Otro, setOtro] = useState(false);
  const opcionesConOtro = [...opcionesPersonal, {label: "OTRO", value: "0"}]
 // Cantidad de caracteres para la Descripciòn
  const DESCRIPCION_MAX = 255;
  
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

  const opcionesAsunto = [
    { value: "REMITE INFORMACIÓN", label: "REMITE INFORMACIÓN" },
    { value: "SOLICITA INSPECCIÓN OCULAR", label: "SOLICITA INSPECCIÓN OCULAR" },
    { value: "SOLICITA VISITA DE VERIFICACIÓN", label: "SOLICITA VISITA DE VERIFICACIÓN" },
    { value: "REPOSICIÓN DE SELLOS DE CLAUSURA", label: "REPOSICIÓN DE SELLOS CLAUSURA" },
    { value: "REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES", label: "REPOSICIÓN DE SELLOS MEDIDAS CAUTELARES" },
    { value: "SOLICITA INFORMACIÓN", label: "SOLICITA INFORMACIÓN" },
    { value: "NOTIFICACIÓN", label: "NOTIFICACIÓN" },
    { value: "AMPARO", label: "AMPARO" },
    { value: "JUICIO DE NULIDAD", label: "JUICIO DE NULIDAD" }
  ];

  const opcionesMotivo = [
    { value: "ATENCIÓN CIUDADANA", label: "ATENCIÓN CIUDADANA" },
    { value: "ANUNCIOS", label: "ANUNCIOS" },
    { value: "AUDIENCIA CIUDADANA", label: "AUDIENCIA CIUDADANA" },
    { value: "CASA POR CASA", label: "CASA POR CASA" },
    { value: "INTERNOS", label: "INTERNOS" },
    { value: "REMITE INFORMACIÓN", label: "REMITE INFORMACIÓN" },
    { value: "MEDIOS DIGITALES", label: "MEDIOS DIGITALES" },
    { value: "OFICIALIA DE PARTES", label: "OFICIALIA DE PARTES" },
    { value: "PAOT", label: "PAOT" },
    { value: "CARPETA DE INVESTIGACIÓN", label: "CARPETA DE INVESTIGACIÓN" },
    { value: "NOTIFICACIÓN CON SANCIÓN", label: "NOTIFICACIÓN CON SANCIÓN" },
     { value: "NOTIFICACIÓN SIN SANCIÓN", label: "NOTIFICACIÓN SIN SANCIÓN" }
  ];

  const opcionesCaracter = [
    { value: "ORDINARIO", label: "ORDINARIO" },
    { value: "URGENTE", label: "URGENTE" },
  ];


  const [form, setForm] = useState({
    NumDVSC: "",
    Num: 1,
    date: new Date().toISOString().slice(0, 16),
    oficio: "",
    Fk_Personal_Remitente: "",
    Nombre: "",
    Cargo:"",
    Dependencia: "",
    descripcion: "",
    calle: "",
    NumC: "",
    Asunto: "",
    Motivo: "",
    Caracter: "",
    Fk_Personal_Turnado: ""
  });

  //Funcion para controlar el estado de Radio
  const handleRadioChange = (e) => {
    const valor = parseInt(e.target.value);
    setForm(prev => ({
      ...prev,
      Num: valor
    }));
  };


//Funcion para enviar el formulario al Back
  const onSubmit = async (e) => {
    e.preventDefault();
    const { success, result, error } = await handleFormSubmit(form, direccionID);
    if (success) {
      showSuccess('Datos Guardados correctamente!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);      
    } else {
      showError(error || 'Error al guardar los datos')
    }
  };

// Funcion para convertir a Mayusculas
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
        <h4>Captura de Correspondencia Interna</h4>
        <form onSubmit={onSubmit}>

          <div className="row">
            <div className="col-md-1">
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value={1}
                  checked={form.Num === 1}
                  onChange={handleRadioChange}
                />
                DVSC
              </label>
            </div>
            <div className="col-md-1">
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value={2}
                  checked={form.Num === 2}
                  onChange={handleRadioChange}
                />
                DEVA
              </label>
            </div>
            <div className="col-md-1">
              <label htmlFor="NumDVSC">#{form.Num === 1 ? "DVSC" : "DEVA"}:</label>
              <input type="text" id="NumDVSC" name="NumDVSC" className="form-item" value={form.NumDVSC}
                maxLength={7}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // solo dígitos
                  setForm(prev => ({
                    ...prev,
                    NumDVSC: value
                  }));
                }}
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="date">Fecha de Captura:</label>
              <input type="datetime-local" id="date" name="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label htmlFor="Oficio">Oficio:</label>
              <input type="text" id="Oficio" name="oficio" value={form.oficio} maxLength={55} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label>Remitente:</label>
              <Select
                options={opcionesConOtro}
                value={opcionesConOtro.find(op => op.value === form.Fk_Personal_Remitente)}
                onChange={(selected) => {
                  const value = selected ? selected.value : "";
                  setForm(prev => ({
                    ...prev,
                    Fk_Personal_Remitente: value,
                    ...(value !== "0" && {
                      Nombre: "",
                      Cargo: "",
                      Dependencia: ""
                    })
                  }));
                  setOtro(value === "0");
                }}
                isLoading={loadingPersonal}
                placeholder="Buscar remitente..."
                isSearchable
                className="select-remitente"
              />
            </div>
          </div>

          {/* CAMPO REMITENTE (REEMPLAZAR) */}
          <div className="row">
            
            {Otro && (
              <>
                <div className="col-md-3">
                  <label htmlFor="Nombre">Nombre:</label>
                  <input
                    type="text"
                    id="Nombre"
                    name="Nombre"
                    value={form.Nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="Cargo">Cargo:</label>
                  <input
                    type="text"
                    id="Cargo"
                    name="Cargo"
                    value={form.Cargo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="Dependencia">Dependencia:</label>
                  <input
                    type="text"
                    id="Dependencia"
                    name="Dependencia"
                    value={form.Dependencia}
                    onChange={handleChange}
                  />
                </div>
              </>

            )}
          </div>
          
          <div className="row">
            <div className="col-md-3">
              <label>Asunto:</label>
              <Select
                options={opcionesAsunto}
                value={opcionesAsunto.find(op => op.value === form.Asunto)}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    Asunto: selected ? selected.value : ""
                  }))
                }
                placeholder="Selecciona un asunto"
                className="select-remitente"
                classNamePrefix="react-select"
              />
            </div>
            <div className="col-md-4">
              <label>Motivo:</label>
              <Select
                options={opcionesMotivo}
                value={opcionesMotivo.find(op => op.value === form.Motivo)}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    Motivo: selected ? selected.value : ""
                  }))
                }
                placeholder="Selecciona un motivo"
                className="select-remitente"
                classNamePrefix="react-select"
              />
            </div>
            <div className="col-md-4">
              <label>Caracter:</label>
              <Select
                options={opcionesCaracter}
                value={opcionesCaracter.find(op => op.value === form.Caracter)}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    Caracter: selected ? selected.value : ""
                  }))
                }
                placeholder="Selecciona un caracter"
                className="select-remitente"
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
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
                className="select-remitente"
              />
            </div>
            <div className="col-md-3">
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
                className="select-remitente"
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="CP">Código Postal:</label>
              <input
                type="text"
                id="CP"
                name="CP"
                value={cp}
                readOnly
              />
            </div>

            {loading && <p>Cargando datos...</p>}

            <div className="col-md-3">
              <label htmlFor="Calle">Calle:</label>
              <input type="text" id="Calle" name="calle" value={form.calle} onChange={handleChange} maxLength={60}/>
            </div>

            <div className="col-md-1">
              <label htmlFor="NumC">#:</label>
              <input type="text" id="NumC" name="NumC" value={form.NumC} onChange={handleChange} maxLength={10}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <label htmlFor="Descripcion">Descripción:</label>
              <textarea id="Descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} maxLength={DESCRIPCION_MAX}/>
              <div style={{textAlign: "right", fontSize: "0.8rem", color: "#555"}}>
                {form.descripcion.length}/{DESCRIPCION_MAX}
              </div>
            </div>
            <div className="col-md-5">
              <label>Turnado:</label>
              <Select
                options={opcionesTurnado}
                value={opcionesTurnado?.find(op => op.value === form.Fk_Personal_Turnado)}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    Fk_Personal_Turnado: selected ? selected.value : ""
                  }))
                }
                isLoading={loadingTurnado}
                placeholder="Buscar turnado..."
                isSearchable
                className="select-remitente"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div className="row">

            <div className="save">
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
                !form.Fk_Personal_Turnado ||
                (Otro && (
                  !form.Nombre ||
                  !form.Cargo ||
                  !form.Dependencia
                ))
              }
              >Guardar</button>
            </div>

          </div>
        </form>
      </div>
      <Tabla />
    </div>
  );
};

export default FormIn;
