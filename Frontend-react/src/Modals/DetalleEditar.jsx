import React from "react";
import Select from "react-select";

const DetalleEditar = ({
  formData,
  handleChange,
  camposOcultos,
  camposNoEditables,
  camposSelect,
  camposSelectPersonal,
  opcionesSelect,
  opcionesPersonal,
  loadingPersonal,
  mostrarNombreCampo
}) => {
  return (
    <ul>
      {Object.entries(formData).map(([clave, valor]) => {
        if (camposOcultos.includes(clave) || clave === "Direccion") return null;

        return (
          <li key={clave}>
            <strong>{mostrarNombreCampo(clave)}:</strong>{" "}
            {camposNoEditables.includes(clave) ? (
              <span>{valor}</span>
            ) : clave === "FechaIn" ? (
              <input
                type="datetime-local"
                value={
                  valor ? new Date(valor).toISOString().slice(0, 16) : ""
                }
                onChange={(e) => handleChange(clave, e.target.value)}
              />
            ) : camposSelectPersonal.includes(clave) ? (
              loadingPersonal ? (
                <span>Cargando opciones...</span>
              ) : (
                <Select
                  value={
                    opcionesPersonal.find(opt => opt.value === valor) || null
                  }
                  onChange={(selected) =>
                    handleChange(clave, selected ? selected.value : "")
                  }
                  options={opcionesPersonal}
                  placeholder="Seleccione una persona..."
                  isClearable
                />
              )
            ) : camposSelect.includes(clave) ? (
              <Select
                className="mi-select"
                classNamePrefix="mi-select"
                value={
                  opcionesSelect[clave]
                    .map((opt) => ({ label: opt, value: opt }))
                    .find((o) => o.value.toLowerCase() === (valor || "").toLowerCase()) || null
                }
                onChange={(selected) =>
                  handleChange(clave, selected ? selected.value : "")
                }
                options={opcionesSelect[clave].map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                placeholder="Seleccione..."
                isClearable
              />
            ) : (
              <input
                type="text"
                value={valor ?? ""}
                onChange={(e) => handleChange(clave, e.target.value)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DetalleEditar;
