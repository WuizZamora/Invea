import React, { useState } from 'react';
import Select from 'react-select';

const RespuestaTurnado = () => {
  const [formData, setFormData] = useState({
    fechaSalida: new Date().toISOString().slice(0, 16),
    accion: '',
    oficio: '',
    descripcion: '',
    soporteDocumental: null
  });

  const DESCRIPCION_MAX = 255;

    const opcionesAccion = [
        { value: "INSPECION OCULAR", label: "INSPECION OCULAR" },
        { value: "VISITA DE VERIFICACION", label: "VISITA DE VERIFICACION" },
        { value: "ZONIFICACION", label: "ZONIFICACION" },
        { value: "NO EJECUTADO", label: "NO EJECUTADO" },
        { value: "EJECUTADO", label: "EJECUTADO" },
    ];

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
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append('fechaSalida', formData.fechaSalida);
    datos.append('accion', formData.accion);
    datos.append('oficio', formData.oficio);
    datos.append('descripcion', formData.descripcion);
    if (formData.soporteDocumental) {
      datos.append('soporteDocumental', formData.soporteDocumental);
    }

    // Enviar al backend (ejemplo con fetch)
    fetch('/ruta/guardar-correspondencia', {
      method: 'POST',
      body: datos,
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Formulario enviado con éxito');
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        alert('Error al enviar el formulario');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
      <div className="mb-3">
        <label className="form-label">Fecha de Salida</label>
        <input
          type="datetime-local"
          className="form-control"
          name="fechaSalida"
          value={formData.fechaSalida}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <div className="d-flex gap-3 align-items-center">
          <label className="form-label">Tipo de Respuesta:</label>
          <div>
            Parcial
            <input
              type="radio"
              name="tipo"
              value={1}
              checked={formData.Estatus === 1}
              onChange={handleChange}
            />
          </div>
          <div>
            Definitiva
            <input
              type="radio"
              name="tipo"
              value={2}
              checked={formData.Estatus === 2}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Acción</label>
              <Select
                options={opcionesAccion}
                value={opcionesAccion.find(op => op.value === formData.accion)}
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

      <div className="mb-3">
        <label className="form-label">Oficio</label>
        <input
          type="text"
          className="form-control"
          name="oficio"
          value={formData.oficio}
          maxLength={55}
          onChange={handleChange}
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
          required
        />
        <div style={{textAlign: "right", fontSize: "0.8rem", color: "#555"}}>
            {formData.descripcion.length}/{DESCRIPCION_MAX}
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
        />
      </div>

      <button type="submit" className="btn btn-primary">Enviar</button>
    </form>
  );
};

export default RespuestaTurnado;
