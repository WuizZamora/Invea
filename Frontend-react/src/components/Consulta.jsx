import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import "../css/Consulta.css";

const alcaldias = [];

const subDirecciones = [
  { value: "juridico", label: "Jurídico" },
  { value: "tecnica", label: "Técnica" },
  { value: "operativa", label: "Operativa" },
];

const asuntos = [
  { value: "inspeccion", label: "Inspección" },
  { value: "reporte", label: "Reporte" },
  { value: "solicitud", label: "Solicitud" },
];

const Consulta = () => {
  const { register, control, watch } = useForm();

  // Solo para mostrar datos en consola en tiempo real (opcional)
  const values = watch();
  console.log(values);

  return (
    <form className="consulta">
      <div className="row">
        <div className="col-md-1">
          <label>Fecha Inicio:</label>
          <input type="date" {...register("fechaInicio")} />
        </div>

        <div className="col-md-1">
          <label>Fecha Final:</label>
          <input type="date" {...register("fechaFinal")} />
        </div>

        <div className="col-md-3">
          <label>Asunto:</label>
          <Controller
            name="asunto"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={asuntos}
                placeholder="Selecciona un asunto"
              />
            )}
          />
        </div>

        <div className="col-md-2">
          <label>Alcaldía:</label>
          <Controller
            name="alcaldia"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={alcaldias}
                placeholder="Selecciona una alcaldía"
              />
            )}
          />
        </div>

        <div className="col-md-2">
          <label>Subdirección:</label>
          <Controller
            name="subDireccion"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={subDirecciones}
                placeholder="Selecciona una subdirección"
              />
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default Consulta;
