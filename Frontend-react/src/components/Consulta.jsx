import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import "../css/Consulta.css";
import useDireccionPorAlcaldia from "../hooks/AlcaldiaIinput";
import ReporteSub from "./ReporteSub";
import { Catalogo } from "../utils/Catalogos";

const toSelectOptions = (array) =>
  array.map((item) => ({ value: item, label: item }));

const subDirecciones = [
  { value: "juridico", label: "Jurídico" },
  { value: "tecnica", label: "Técnica" },
  { value: "operativa", label: "Operativa" },
];

const Consulta = () => {
  const { register, control, watch } = useForm();
  const { alcaldias } = useDireccionPorAlcaldia();

  return (
    <>
      <div>
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
                    className="select-remitente"
                    options={toSelectOptions(Catalogo.Asunto)}
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
                    className="select-remitente"
                    options={toSelectOptions(alcaldias)}
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
                    className="select-remitente"
                    options={toSelectOptions(Catalogo.SubDireccion)}
                    placeholder="Selecciona una subdirección"
                  />
                )}
              />
            </div>
          </div>
        </form>
        <div className="text-center text-danger">
          <h2>Sistema de Consultas en desarrollo no funcional de momento</h2>
        </div>
      </div>

      <div className="Reporte">
        <ReporteSub/>
      </div>
    </>
    
    
  );
};

export default Consulta;
