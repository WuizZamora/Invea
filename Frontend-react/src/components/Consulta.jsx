import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

const alcaldias = [
  { value: "cuauhtemoc", label: "Cuauhtémoc" },
  { value: "iztapalapa", label: "Iztapalapa" },
  { value: "coyoacan", label: "Coyoacán" },
];

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
    <form className="formulario">
      <div>
        <label>Fecha Inicio:</label>
        <input type="date" {...register("fechaInicio")} />
      </div>

      <div>
        <label>Fecha Final:</label>
        <input type="date" {...register("fechaFinal")} />
      </div>

      <div>
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

      <div>
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

      <div>
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
    </form>
  );
};

export default Consulta;
