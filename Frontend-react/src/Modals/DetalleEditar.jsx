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
  opcionesTurnado,
  loadingTurnado,
  mostrarNombreCampo
}) => {
  return (
    <ul>
      {Object.entries(formData).map(([clave, valor]) => {
        if (
          camposOcultos.includes(clave) ||
          clave === "Direccion" ||
          clave === "Cargo" 
          // || ((clave === "NumDVSC" || clave === "NumDEVA") && !valor)
        ) return null;
        return (
          <li key={clave}>
            <div>
            <strong>{mostrarNombreCampo(clave)}:</strong>
            </div>
            {" "}
            {camposNoEditables.includes(clave) ? (
              <span>{valor}</span>
            ) : clave === "FechaDocumento" ? (
              <div>
                <input
                  type="date"
                  value={
                    valor ? new Date(valor).toISOString().slice(0, 16) : ""
                  }
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ):clave === "NumDVSC" ? (
              <div>
                <input
                  type="text"
                  maxLength={7}
                  value={valor ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange(clave, value);
                  }}
                />
              </div>
            ) : clave === "NumDEVA" ? (
              <div>
                <input
                  type="text"
                  maxLength={7}
                  value={valor ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange(clave, value);
                  }}
                />
              </div>
            ) :clave === "Oficio" ? (
              <div>
                <input
                  type="text"
                  value={valor ?? ""}
                  maxLength={55}
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ) :clave === "Expediente" ? (
              <div>
                <input
                  type="text"
                  value={valor ?? ""}
                  maxLength={55}
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ) :clave === "Descripcion" ? (
              <div>
                <input
                  type="text"
                  value={valor ?? ""}
                  maxLength={255}
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ) : camposSelectPersonal.includes(clave) ? (
              clave === "Remitente" ? (
                loadingPersonal ? (
                  <span>Cargando opciones...</span>
                ) : (
                  <Select
                    value={opcionesPersonal.find(opt => opt.value === valor) || null}
                    onChange={(selected) =>
                      handleChange(clave, selected ? selected.value : "")
                    }
                    options={opcionesPersonal}
                    placeholder="Seleccione un remitente..."
                    isClearable
                  />
                )
              ) : clave === "Turnado" ? (
                loadingTurnado ? (
                  <span>Cargando opciones...</span>
                ) : (
                  <Select
                    value={opcionesTurnado.find(opt => opt.value === valor) || null}
                    onChange={(selected) =>
                      handleChange(clave, selected ? selected.value : "")
                    }
                    options={opcionesTurnado}
                    placeholder="Seleccione un turnado..."
                    isClearable
                  />
                )
              ) : null
            ): camposSelect.includes(clave) ? (
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
