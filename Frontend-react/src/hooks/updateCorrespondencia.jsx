export const updateCorrespondencia = async (id, data) => {
  const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/actualizar-correspondencia/${id}`;
  const body = {
    NumDVSC: parseInt(data.NumDVSC),
    NumDEVA: parseInt(data.NumDEVA),
    FechaDocumento: new Date(data.FechaDocumento).toISOString().slice(0, 10),
    Oficio: data.Oficio,
    Expediente: data.Expediente,
    Fk_Personal_Remitente: parseInt(data.Remitente),
    Asunto: data.Asunto,
    Descripcion: data.Descripcion,
    Motivo: data.Motivo,
    Caracter: data.Caracter,
    Calle: data.Calle,
    NumCalle: data.NumCalle,
    Fk_Personal_Turnado: parseInt(data.Turnado),
    OP: data.OP
  };

  try {
    const response = await fetch(url, {
      credentials: 'include',
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error("Error actualizando correspondencia:", error);
    return { success: false, error };
  }
};