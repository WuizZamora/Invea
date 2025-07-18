export const updateCorrespondencia = async (id, data) => {

  const toISODate = (valor) => {
    if (!valor || typeof valor !== "string") return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
    const parts = valor.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return null;
  };

  const url = `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/actualizar-correspondencia/${id}`;
  const body = {
    NumDVSC: parseInt(data.NumDVSC),
    NumDEVA: parseInt(data.NumDEVA),
    FechaDocumento: toISODate(data.FechaDocumento),
    Oficio: data.Oficio,
    Expediente: data.Expediente,
    Fk_Personal_Remitente: parseInt(data.Remitente),
    Asunto: data.Asunto,
    Descripcion: data.Descripcion,
    Motivo: data.Motivo,
    Caracter: data.Caracter,
    Calle: data.Calle,
    NumCalle: data.NumCalle,  
    TipoInmueble: data.TipoInmueble,
    Denominacion: data.Denominacion,                      
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