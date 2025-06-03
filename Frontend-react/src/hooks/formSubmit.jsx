

export const handleFormSubmit = async (form, direccionID) => {
  const payload = {
    NumDVSC: parseInt(form.NumDVSC),
    FechaIn: new Date(form.date).toISOString().slice(0, 19).replace("T", " "),
    Oficio: form.oficio,
    Fk_Personal_Remitente: parseInt(form.Fk_Personal_Remitente),
    Asunto: form.Asunto,
    Descripcion: form.descripcion,
    Motivo: form.Motivo,
    Caracter: form.Caracter,
    Fk_Direccion_IDAdress: direccionID,
    Calle: form.calle,
    NumCalle: form.NumC,
    Fk_Personal_Turnado: parseInt(form.Fk_Personal_Turnado),
    SoporteDocumental: ""
  };

  console.log(payload);

  try {
    const response = await fetch(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PUERTO}${process.env.REACT_APP_DIRECCION}/correspondencia/guardar-correspondencia`, {
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
