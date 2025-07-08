import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import useSelectObtenerPersonal from "../hooks/SelectObtenerPersonal";
import useDireccionPorAlcaldia from "../hooks/AlcaldiaIinput";
import useSelectPersonalTurnado from "../hooks/SelectPersonalTurnado";
import { showSuccess, showError } from "../utils/alerts";
import { handleFormSubmit } from "../hooks/formSubmit";
import Tabla from "./TablaCorrespodencia";

const FormIn = () => {
  const { opcionesPersonal, loading: loadingPersonal } = useSelectObtenerPersonal();
  const { opcionesTurnado, loading: loadingTurnado } = useSelectPersonalTurnado();
  const [Otro, setOtro] = useState(false);
  const [refetchOut, setRefetchOut] = useState(false);

  const {
    alcaldias,
    colonias,
    cp,
    selectedAlcaldia,
    setSelectedAlcaldia,
    selectedColonia,
    setSelectedColonia,
    loading,
    direccionID
  } = useDireccionPorAlcaldia();

  const InputMayusculas = ({ register, name, ...props }) => (
    <input
      {...register(name)}
      {...props}
      onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
      style={{ textTransform: "uppercase" }}
    />
  );

  const { register, handleSubmit, control, reset, watch, formState: { isValid }} = useForm({
    mode: "onChange",
    defaultValues: {
      NumDVSC: "",
      Num: "1",
      FechaDocumento: new Date().toISOString().slice(0, 10),
      oficio: "",
      expediente: "",
      Fk_Personal_Remitente: "",
      Nombre: "",
      Cargo: "",
      Dependencia: "",
      descripcion: "",
      calle: "",
      NumC: "",
      Asunto: "",
      Motivo: "",
      Caracter: "",
      OP: "",
      TipoInmueble: "",
      Denominacion: "",
      Fk_Personal_Turnado: ""
    }
  });

  const Num = watch("Num");
  const Fk_Personal_Remitente = watch("Fk_Personal_Remitente");
  const isOtro = Fk_Personal_Remitente === "0";

  const opcionesConOtro = [...opcionesPersonal, { label: "OTRO", value: "0" }];

  const onSubmit = async (data) => {
    const { success, error } = await handleFormSubmit(data, direccionID);
    if (success) {
      showSuccess("Datos guardados correctamente!");
      setRefetchOut(prev => !prev);
      reset({
        NumDVSC: "",
        Num: "1",
        FechaDocumento: new Date().toISOString().slice(0, 10),
        oficio: "",
        expediente: "",
        Fk_Personal_Remitente: "",
        Nombre: "",
        Cargo: "",
        Dependencia: "",
        descripcion: "",
        calle: "",
        NumC: "",
        Asunto: "",
        Motivo: "",
        Caracter: "",
        OP: "",
        TipoInmueble: "",
        Denominacion: "",
        Fk_Personal_Turnado: ""
      });
      setSelectedAlcaldia("");
      setSelectedColonia("");
      setOtro(false);
    } else {
      showError(error || "Error al guardar los datos");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h4>Captura de Correspondencia Interna</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Selector DVSC/DEVA y Número */}
          <div className="row">
            <label>Num</label>
            <div className="col">
              DVSC
              <input type="radio" value={"1"} {...register("Num")} defaultChecked />
            </div>
            <div className="col">
              DEVA
              <input type="radio" value={"2"} {...register("Num")} />
            </div>
            <div className="col-md-1">
              <label htmlFor="NumDVSC">#{parseInt(Num) === 1 ? "DVSC" : "DEVA"}:</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={7}
                {...register("NumDVSC", { 
                  required: true,
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Solo se permiten números"
                  }
                })}
                onInput={e => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
            </div>
            <div className="col-md-2">
              <label>Fecha de Oficio:</label>
              <input type="date" {...register("FechaDocumento")} />
            </div>
            <div className="col-md-4">
              <label>Oficio:</label>
              <input type="text" {...register("oficio", { required: true })} maxLength={55} 
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}/>
            </div>
            <div className="col-md-4">
              <label>Expediente:</label>
              <input type="text" {...register("expediente")} placeholder="Opcional" maxLength={55} 
                  onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}/>
            </div>
          </div>

          {/* Remitente */}
          <div className="row">
            <div className="col-md-3">
              <label>Remitente:</label>
              <Controller
                name="Fk_Personal_Remitente"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={opcionesConOtro}
                    isLoading={loadingPersonal}
                    className="select-remitente"
                    placeholder="Buscar remitente..."
                    onChange={(val) => {
                      field.onChange(val?.value || "");
                      setOtro(val?.value === "0");
                    }}
                    value={opcionesConOtro.find(op => op.value === field.value) || null}
                  />
                )}
              />
            </div>

            {Otro && (
              <>
                <div className="col-md-3">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    {...register("Nombre", {
                      required: isOtro ? "El nombre es obligatorio" : false
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label>Cargo:</label>
                  <input
                    type="text"
                    {...register("Cargo", {
                      required: isOtro ? "El cargo es obligatorio" : false
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label>Dependencia:</label>
                  <input
                    type="text"
                    {...register("Dependencia", {
                      required: isOtro ? "La dependencia es obligatoria" : false
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Asunto / Motivo / Caracter / OP */}
          <div className="row">
            {["Asunto", "Motivo", "Caracter", ].map((campo, i) => (
              <div className="col-md-3" key={i}>
                <label>{campo}:</label>
                <Controller
                  name={campo}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="select-remitente"
                      options={
                        campo === "Asunto"
                          ? [
                              { value: "AMPARO", label: "AMPARO" },
                              { value: "JUICIO DE NULIDAD", label: "JUICIO DE NULIDAD" },
                              { value: "NOTIFICACIÓN", label: "NOTIFICACIÓN" },
                              { value: "REMITE INFORMACIÓN", label: "REMITE INFORMACIÓN" },
                              { value: "REPOSICIÓN DE SELLOS DE CLAUSURA", label: "REPOSICIÓN DE SELLOS DE CLAUSURA" },
                              { value: "REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES", label: "REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES" },
                              { value: "RESOLUCIÓN", label: "RESOLUCIÓN" },
                              { value: "RETIRO DE SELLOS", label: "RETIRO DE SELLOS" },
                              { value: "SOLICITA INFORMACIÓN", label: "SOLICITA INFORMACIÓN" },
                              { value: "SOLICITA INSPECCIÓN OCULAR", label: "SOLICITA INSPECCIÓN OCULAR" },
                              { value: "SOLICITA VISITA DE VERIFICACIÓN", label: "SOLICITA VISITA DE VERIFICACIÓN" }
                            ]
                          : campo === "Motivo"
                          ? [
                              { value: "ACUERDO", label: "ACUERDO" },
                              { value: "ANUNCIOS", label: "ANUNCIOS" },
                              { value: "ATENCIÓN CIUDADANA", label: "ATENCIÓN CIUDADANA" },
                              { value: "AUDIENCIA CIUDADANA", label: "AUDIENCIA CIUDADANA" },
                              { value: "CARPETA DE INVESTIGACIÓN", label: "CARPETA DE INVESTIGACIÓN" },
                              { value: "CASA POR CASA", label: "CASA POR CASA" },
                              { value: "INTERNOS", label: "INTERNOS" },
                              { value: "MEDIOS DIGITALES", label: "MEDIOS DIGITALES" },
                              { value: "NOTIFICACIÓN CON SANCIÓN", label: "NOTIFICACIÓN CON SANCIÓN" },
                              { value: "NOTIFICACIÓN SIN SANCIÓN", label: "NOTIFICACIÓN SIN SANCIÓN" },
                              { value: "OFICIALIA DE PARTES", label: "OFICIALIA DE PARTES" },
                              { value: "PAOT", label: "PAOT" },
                              { value: "REMITE INFORMACIÓN", label: "REMITE INFORMACIÓN" }
                            ]
                          : [
                              { value: "ORDINARIO", label: "ORDINARIO" },
                              { value: "URGENTE", label: "URGENTE" }
                            ]
                      }
                      value={
                        field.value
                          ? { value: field.value, label: field.value }
                          : null
                      }
                      onChange={(val) => field.onChange(val?.value || "")}
                    />
                  )}
                />
              </div>
            ))}
            <div className="col-md-1">
              <label>OP:</label>
              <input type="text" {...register("OP")} placeholder="Opcional" maxLength={10} />
            </div>
          </div>

          {/* Dirección */}
          <div className="row">
            <div className="col-md-3">
              <label>Calle:</label>
              <input type="text" {...register("calle", { required: true })} maxLength={60} 
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}              
              />
            </div>
            <div className="col-md-2">
              <label>#:</label>
              <input type="text" {...register("NumC", { required: true })} maxLength={30} 
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}                
              />
            </div>
            <div className="col-md-3">
              <label>Alcaldía:</label>
              <Select
                className="select-remitente"
                options={alcaldias.map(a => ({ label: a, value: a }))}
                value={
                  selectedAlcaldia
                    ? { label: selectedAlcaldia, value: selectedAlcaldia }
                    : null
                }
                onChange={(val) => {
                  setSelectedAlcaldia(val?.value || "");
                  setSelectedColonia("");
                }}
                isLoading={loading}
              />
            </div>
            <div className="col-md-3">
              <label>Colonia:</label>
              <Select
                className="select-remitente"
                options={colonias.map(c => ({ label: c, value: c }))}
                value={
                  selectedColonia
                    ? { label: selectedColonia, value: selectedColonia }
                    : null
                }
                onChange={(val) => {
                  setSelectedColonia(val?.value || "");
                }}
                isDisabled={!selectedAlcaldia}
                isLoading={loading}
              />
            </div>
            <div className="col-md-1">
              <label>Código Postal:</label>
              <input type="text" value={cp} readOnly />
            </div>
          </div>

          {/* Tipo de Inmueble y Denominicación */}
          <div className="row">
            <div className="col-md-4">
              <label>Tipo de Inmueble (Opcional):</label>
              <Controller
                name="TipoInmueble"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="select-remitente"
                    options={[
                      { value: "Obra", label: "Obra" },
                      { value: "Medios publicitarios", label: "Medios publicitarios" },
                      { value: "Establecimiento", label: "Establecimiento" }
                    ]}
                    placeholder="Selecciona tipo (opcional)"
                    isClearable={true} // 👈 permite limpiar la selección
                    value={
                      field.value
                        ? { value: field.value, label: field.value[0].toUpperCase() + field.value.slice(1) }
                        : null
                    }
                    onChange={(val) => field.onChange(val?.value || "")}
                  />
                )}
              />
            </div>
            <div className="col-md-4">
              <label>Denominación:</label>
              <input type="text" {...register("Denominacion")} placeholder="Opcional" maxLength={50} 
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}                
              />
            </div>
          </div>

          {/* Descripción y Turnado */}
          <div className="row">
            <div className="col-md-7">
              <label>Descripción:</label>
              <textarea {...register("descripcion", { required: true })} maxLength={255} 
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}                
              />
            </div>
            <div className="col-md-5">
              <label>Turnado:</label>
              <Controller
                name="Fk_Personal_Turnado"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="select-remitente"
                    options={opcionesTurnado}
                    isLoading={loadingTurnado}
                    placeholder="Buscar turnado..."
                    onChange={(val) => field.onChange(val?.value || "")}
                    value={opcionesTurnado.find(op => op.value === field.value) || null}
                  />
                )}
              />
            </div>
          </div>

          <div className="row">
            <div >
              <button className="save-button" type="submit" disabled={!isValid}>Guardar</button>
            </div>
          </div>
        </form>
      </div>
      <Tabla key={refetchOut} />
    </div>
  );
};

export default FormIn;
