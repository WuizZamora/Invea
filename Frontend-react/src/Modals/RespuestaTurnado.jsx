import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { showSuccess, showError } from "../utils/alerts";
import { Catalogo } from "../utils/Catalogos";
import { useUsuario } from "../context/UserContext";

const toSelectOptions = (array) =>
  array.map((item) => ({ value: item, label: item }));

const RespuestaTurnado = ({ idCorrespondencia, onSuccess }) => {
  const { usuario } = useUsuario();

  const [formData, setFormData] = useState({
    accion: "",
    oficio: "",
    descripcion: "",
    EstaTerminado: "0",
    soporteDocumental: null,
  });

  const DESCRIPCION_MAX = 500;
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'soporteDocumental') {
      const file = files[0];
      if (file && file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      setFormData((prev) => ({ ...prev, soporteDocumental: file }));
    } else {
      const upperValue = ['oficio', 'descripcion'].includes(name)
        ? value.toUpperCase()
        : value;

      setFormData((prev) => ({ ...prev, [name]: upperValue }));
    }
  };

  // efecto para manejar los cambios de CONOCIMIENTO
  useEffect(() => {
    if (formData.accion === "CONOCIMIENTO") {
      setFormData((prev) => ({
        ...prev,
        oficio: "SinOficio",
        descripcion: "SinObservaciones",
        EstaTerminado: "1",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        oficio: prev.oficio === "SinOficio" ? "" : prev.oficio,
        descripcion: prev.descripcion === "SinObservaciones" ? "" : prev.descripcion,
        EstaTerminado: "0",
      }));
    }
  }, [formData.accion]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append('Accion', formData.accion);
    datos.append('Oficio', formData.oficio);
    datos.append('Descripcion', formData.descripcion);
    datos.append('EstaTerminado', formData.EstaTerminado);
    datos.append('id', usuario.id);

    if (formData.soporteDocumental) {
      datos.append('archivo', formData.soporteDocumental);
    }

    fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/guardar-correspondencia-out/${idCorrespondencia}`, {
      method: 'POST',
      body: datos,
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(() => {
        showSuccess('Respuesta guardada');
        setFormData({
          accion: "",
          oficio: "",
          descripcion: "",
          EstaTerminado: "0",
          soporteDocumental: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.error(err);
        showError('Error al guardar la respuesta');
      });
  };

  const isFormInvalid =
    formData.accion.trim() === "" ||
    formData.oficio.trim() === "" ||
    formData.descripcion.trim() === "";
    // || !formData.soporteDocumental || formData.soporteDocumental.type !== 'application/pdf';

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
      <div className="mb-3">
        <div className="d-flex gap-3 align-items-center">
          <label className="form-label">Tipo de Respuesta:</label>
          <div>
            Parcial
            <input
              type="radio"
              name="EstaTerminado"
              value="0"
              checked={formData.EstaTerminado === "0"}
              onChange={handleChange}
            />
          </div>
          <div>
            Definitiva
            <input
              type="radio"
              name="EstaTerminado"
              value="1"
              checked={formData.EstaTerminado === "1"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Acción</label>
        <Select
          options={toSelectOptions(Catalogo.Accion)}
          value={
            formData.accion
              ? toSelectOptions(Catalogo.Accion).find(op => op.value === formData.accion)
              : null
          }
          onChange={(selected) =>
            setFormData(prev => ({
              ...prev,
              accion: selected ? selected.value : ""
            }))
          }
          placeholder="Selecciona un asunto"
          className="select-remitente"
          classNamePrefix="react-select"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Oficio</label>
        <input
          type="text"
          className="form-control"
          name="oficio"
          value={formData.oficio}
          maxLength={55}
          onChange={handleChange}
          disabled={formData.accion === "CONOCIMIENTO"}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          maxLength={DESCRIPCION_MAX}
          disabled={formData.accion === "CONOCIMIENTO"}
          required
        />
        <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#555" }}>
          {(formData.descripcion?.length || 0)}/{DESCRIPCION_MAX}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Soporte Documental (PDF)</label>
        <input
          type="file"
          className="form-control"
          name="soporteDocumental"
          accept="application/pdf"
          onChange={handleChange}
          ref={fileInputRef}
        />
      </div>

      <button type="submit" className="save-button" disabled={isFormInvalid}>
        Enviar
      </button>
    </form>
  );
};

export default RespuestaTurnado;
