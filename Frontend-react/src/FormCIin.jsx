import React, { useState } from "react";
import "./App.css";
import Tabla from "./TablaCorrespodencia";
import Header from "./Header";
import CPInput from "./hooks/CPInput";

const FormIn = () => {

  const [cp, setCp] = useState("");
  const [alcaldia, setAlcaldia] = useState("");
  const [colonia, setColonia] = useState("");

  return (

    <div className="form-container">
      <Header />
      <div className="form-card">
        <h2>Correspondencia Interna Entrada</h2>
        <form>
          <div className="input-row">
            <label htmlFor="name">#DVSC:</label>
            <input type="number" id="NumDVSC" name="NumDVSC" />

            <label htmlFor="date">Fecha de Recepción:</label>
            <input type="date" id="date" name="date" />

            <label htmlFor="Oficio">Oficio:</label>
            <input type="text" id="Oficio" name="Oficio" />
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
            <textarea id="Descripcion" name="Descripcion"/>

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
            <CPInput
              cp={cp}
              setCp={setCp}
              setAlcaldia={setAlcaldia}
              setColonia={setColonia}
            />

            <label htmlFor="Alcaldia">Alcaldía:</label>
            <input
              type="text"
              id="Alcaldia"
              name="Alcaldia"
              value={alcaldia}
              readOnly
              className="mi-estilo"
            />

            <label htmlFor="Colonia">Colonia:</label>
            <input
              type="text"
              id="Colonia"
              name="Colonia"
              value={colonia}
              readOnly
              className="mi-estilo"
            />

            <label htmlFor="Calle">Calle:</label>
            <input type="text" id="Calle" name="Calle" />
            
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
