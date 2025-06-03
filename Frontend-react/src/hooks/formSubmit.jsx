export const handleFormSubmit = async (form, direccionID) => {
  const payload = {
    NumDVSC: Number(form.NumDVSC),
    FechaIn: form.date + " 00:00:00",
    Oficio: form.oficio,
    Fk_Personal_Remitente: 1775,
    Asunto: form.Asunto,
    Descripcion: form.descripcion,
    Motivo: form.Motivo,
    Caracter: form.Caracter,
    Fk_Direccion_IDAdress: direccionID,
    Calle: form.calle,
    NumCalle: form.NumC,
    Fk_Personal_Turnado: 1820,
    SoporteDocumental: "RUTALOCA"
  };

  try {
    const response = await fetch("", {
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
