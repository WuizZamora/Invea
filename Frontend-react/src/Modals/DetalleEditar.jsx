import React from "react";
import Select from "react-select";

const toInputDate = (valor) => {
  if (!valor || typeof valor !== "string") return "";

  // Si ya viene en formato ISO, devuélvelo tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }

  // Si viene en formato DD/MM/YYYY, conviértelo a ISO
  const parts = valor.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // En cualquier otro caso, regresa vacío
  return "";
};

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
            ) : clave === "Seguimiento" ? (
              <div>
                <input
                  type="checkbox"
                  checked={formData[clave] === 1} // true si marcado
                  onChange={(e) =>
                    handleChange(clave, e.target.checked ? 1 : 0) // envía "1" o "0"
                  }
                />
              </div>
            ) :clave === "FechaDocumento" ? (
              <div>
                <input
                  type="date"
                  value={toInputDate(valor)}
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ) : clave === "NumDVSC" ? (
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
            ) : clave === "Oficio" ? (
              <div>
                <input
                  type="text"
                  value={valor ?? ""}
                  maxLength={55}
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ) : clave === "Expediente" ? (
              <div>
                <input
                  type="text"
                  value={valor ?? ""}
                  maxLength={55}
                  onChange={(e) => handleChange(clave, e.target.value)}
                />
              </div>
            ) : clave === "Descripcion" ? (
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
            ) : camposSelect.includes(clave) ? (
              
              <Select
                className="mi-select"
                classNamePrefix="mi-select"
                value={
                  ((opcionesSelect[clave] || [])
                    .map((opt) => ({ label: opt, value: opt }))
                    .find((o) =>
                      o?.value?.toLowerCase() === (valor || "").toLowerCase()
                    )) || null
                }
                onChange={(selected) =>
                  handleChange(clave, selected ? selected.value : "")
                }
                options={(opcionesSelect[clave] || []).map((opt) => ({
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
