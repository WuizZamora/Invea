import React, { useState, useEffect } from "react";
import "./Detalle.css";
import useSelectObtenerPersonal from "../hooks/SelectObtenerPersonal";
import useSelectPersonalTurnado from "../hooks/SelectPersonalTurnado";
import DetalleVisual from "./DetalleVIsual";
import DetalleEditar from "./DetalleEditar";
import { updateCorrespondencia } from "../hooks/updateCorrespondencia";
import { showSuccess, showError, showConfirm } from "../utils/alerts";

const ModalDetalle = ({ item, loading, error, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...item });
  const [TipoMensaje, setTipoMensaje] = useState("");

  const camposOcultos = ["Pk_IDCorrespondenciaIn", "Dependencia", "SoporteDocumental", ""];
  const camposNoEditables = ["Alcaldia", "Colonia", "CodigoPostal"];
  const camposSelect = ["Asunto", "Motivo", "Caracter"];
  const camposSelectPersonal = ["Remitente", "Turnado"];

  const { opcionesPersonal, loading: loadingPersonal } = useSelectObtenerPersonal();
  const { opcionesTurnado, loading: loadingTurnado } = useSelectPersonalTurnado();

  const handleGuardar = async () => {
    const confirmar = await showConfirm(
      "¿Estás seguro de que quieres actualizar los datos?",
      "Esta acción sobrescribirá los datos previamente guardados.",
      "Sí, actualizar",
      "Cancelar"
    );
    if (!confirmar) return;

    const id = item.Pk_IDCorrespondenciaIn;

    const { success, result, error } = await updateCorrespondencia(id, formData);

    if (success) {
      showSuccess("Correspondencia actualizada correctamente");
      setTipoMensaje("success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showError("Error: " + (data.error || "No se pudo actualizar"));
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
    if (editMode && opcionesPersonal.length > 0 && opcionesTurnado.length > 0) {
      const findIdByName = (nombre, opciones) => {
        const match = opciones.find(p => p.label === nombre);
        return match ? match.value : "";
      };

      setFormData({
        ...item,
        Calle: calle,
        NumCalle: numCalle,
        Remitente: findIdByName(item.Remitente, opcionesPersonal),
        Turnado: findIdByName(item.Turnado, opcionesTurnado),
      });
    }
  }, [editMode, item, opcionesPersonal, opcionesTurnado]);

  const opcionesSelect = {
    Asunto: [
      "REMITE INFORMACIÓN", "SOLICITA INSPECCIÓN OCULAR", "SOLICITA VISITA DE VERIFICACIÓN",
      "REPOSICIÓN DE SELLOS DE CLAUSURA","RETIRO DE SELLOS", "REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES", "SOLICITA INFORMACIÓN", "NOTIFICACIÓN", "AMPARO", "JUICIO DE NULIDAD"
    ],
    Motivo: [
      "ATENCIÓN CIUDADANA", "AUDIENCIA CIUDADANA", "CASA POR CASA", "INTERNOS", "MEDIOS DIGITALES", "OFICIALIA DE PARTES", "ANUNCIOS", "PAOT", "CARPETA DE INVESTIGACIÓN", "REMITE INFORMACIÓN", "NOTIFICACIÓN CON SANCIÓN", "NOTIFICACIÓN SIN SANCIÓN"

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

  const mostrarNombreCampo = (clave) => (clave === "FechaDocuemnto" ? "Fecha" : clave);

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
            opcionesTurnado={opcionesTurnado}
            loadingTurnado={loadingTurnado}
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
