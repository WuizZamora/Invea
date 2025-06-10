import React, { useState, useEffect } from "react";
import "./Detalle.css";
import useSelectObtenerPersonal from "../hooks/SelectObtenerPersonal";
import DetalleVisual from "./DetalleVIsual";
import DetalleEditar from "./DetalleEditar";
import { updateCorrespondencia } from "../hooks/updateCorrespondencia";

const ModalDetalle = ({ item, loading, error, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...item });
  const [TipoMensaje, setTipoMensaje] = useState("");

  const camposOcultos = ["Pk_IDCorrespondenciaIn", "Dependencia", "SoporteDocumental",""];
  const camposNoEditables = ["Alcaldia", "Colonia", "CodigoPostal"];
  const camposSelect = ["Asunto", "Motivo", "Caracter"];
  const camposSelectPersonal = ["Remitente", "Turnado"];

  const { opcionesPersonal, loading: loadingPersonal } = useSelectObtenerPersonal();

  const handleGuardar = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas actualizar los datos?");
    if (!confirmar) return;

    const id = item.Pk_IDCorrespondenciaIn;

    const { success, result, error } = await updateCorrespondencia(id, formData);

    if (success) {
      alert("Correspondencia actualizada correctamente");
      setTipoMensaje("success");
      setEditMode(false);
    } else {
      setMensaje("Error al actualizar: " + error.message);
      setTipoMensaje("error");
    }


  };

  const [calle, numCalle] = item.Direccion
  ? item.Direccion.split("#")[0].trim() && item.Direccion.split("#")[1]?.split(",")[0].trim()
    ? [
        item.Direccion.split("#")[0].trim(),
        item.Direccion.split("#")[1]?.split(",")[0].trim()
      ]
    : ["", ""]
  : ["", ""];

  useEffect(() => {
    if (editMode && opcionesPersonal.length > 0) {
      const findIdByName = (nombre) => {
        const match = opcionesPersonal.find(p => p.label === nombre);
        return match ? match.value : "";
      };

      setFormData({
        ...item,
        Calle: calle,
        NumCalle: numCalle,
        Remitente: findIdByName(item.Remitente),
        Turnado: findIdByName(item.Turnado),
      });
    }
  }, [editMode, item, opcionesPersonal]);

  const opcionesSelect = {
    Asunto: [
      "REMITE INFORMACIÓN", "SOLICITA INSPECCIÓN OCULAR", "SOLICITA VISITA DE VERIFICACIÓN",
      "REPOSICIÓN DE SELLOS DE CLAUSURA", "REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES"
    ],
    Motivo: [
      "ATENCIÓN CIUDADANA", "AUDIENCIA CIUDADANA", "CASA POR CASA",
      "INTERNOS", "REMITE INFORMACIÓN", "MEDIOS DIGITALES", "OFICIALIA DE PARTES"
    ],
    Caracter: ["ORDINARIO", "URGENTE"],
  };

  const handleChange = (clave, value) => {
    setFormData((prev) => ({ ...prev, [clave]: value }));
  };

  const handleCancelar = () => {
    setFormData({ ...item });
    setEditMode(false);
  };

  const mostrarNombreCampo = (clave) => (clave === "FechaIn" ? "Fecha" : clave);

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${editMode ? "modal-edit" : "modal-view"}`}>
        <h3>Detalles del registro</h3>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : editMode ? (
          <DetalleEditar
            formData={formData}
            handleChange={handleChange}
            camposOcultos={camposOcultos}
            camposNoEditables={camposNoEditables}
            camposSelect={camposSelect}
            camposSelectPersonal={camposSelectPersonal}
            opcionesSelect={opcionesSelect}
            opcionesPersonal={opcionesPersonal}
            loadingPersonal={loadingPersonal}
            mostrarNombreCampo={mostrarNombreCampo}
          />
        ) : (
          <DetalleVisual
            item={item}
            camposOcultos={camposOcultos}
            mostrarNombreCampo={mostrarNombreCampo}
          />
        )}

        <div className="botones-editar">
          {editMode ? (
            <>
              <button className="boton-editar" onClick={handleGuardar}>Guardar</button>
              <button className="boton-editar" onClick={handleCancelar}>Cancelar</button>
            </>
          ) : (
            <button className="boton-editar" onClick={() => setEditMode(true)}>Editar</button>
          )}
        </div>

        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ModalDetalle;
