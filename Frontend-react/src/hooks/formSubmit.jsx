

export const handleFormSubmit = async (form, direccionID) => {
  const payload = {
    NumDVSC: parseInt(form.NumDVSC),
    Num: parseInt(form.Num),
    FechaDocumento: new Date(form.FechaDocumento).toISOString().slice(0, 10),
    Oficio: form.oficio,
    Expediente: form.expediente,
    Fk_Personal_Remitente: parseInt(form.Fk_Personal_Remitente),
    Nombre: form.Nombre,
    Cargo: form.Cargo,
    Dependencia: form.Dependencia,
    Asunto: form.Asunto,
    Descripcion: form.descripcion,
    Motivo: form.Motivo,
    Caracter: form.Caracter,
    OP: form.OP,
    Fk_Direccion_IDAdress: direccionID,
    Calle: form.calle,
    NumCalle: form.NumC,
    TipoInmueble: form.TipoInmueble,
    Denominacion: form.Denominacion,
    Fk_Personal_Turnado: parseInt(form.Fk_Personal_Turnado)
  };

  try {
    console.log(payload);
    const response = await fetch(
          `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/guardar-correspondencia`, {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Error al enviar los datos");
    }

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error("Error al enviar:", error);
    return { success: false, error };
  }
};
