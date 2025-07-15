export const toSelectOptions = (items = []) =>
  items.map((item) => ({ value: item, label: item }));

export const Catalogo = {

  // Para las opciones en FromCIin y MedalDetalle

  Asunto: [
    "AMPARO",
    "JUICIO DE NULIDAD",
    "NOTIFICACIÓN",
    "REMITE INFORMACIÓN",
    "REPOSICIÓN DE SELLOS DE CLAUSURA",
    "REPOSICIÓN DE SELLOS DE MEDIDAS CAUTELARES",
    "RESOLUCIÓN",
    "RETIRO DE SELLOS",
    "SOLICITA INFORMACIÓN",
    "SOLICITA INSPECCIÓN OCULAR",
    "SOLICITA VISITA DE VERIFICACIÓN",
  ],

  Motivo: [
    "ACUERDO",
    "ANUNCIOS",
    "ATENCIÓN CIUDADANA",
    "AUDIENCIA CIUDADANA",
    "CARPETA DE INVESTIGACIÓN",
    "CASA POR CASA",
    "INTERNOS",
    "MEDIOS DIGITALES",
    "NOTIFICACIÓN CON SANCIÓN",
    "NOTIFICACIÓN SIN SANCIÓN",
    "OFICIALIA DE PARTES",
    "PAOT",
    "REMITE INFORMACIÓN",
  ],

  Caracter: [
    "ORDINARIO", 
    "URGENTE"
  ],

  TipoInmueble: [
    "Establecimiento",
    "Medios publicitarios",
    "Obra",
  ],

// Para los selects en Consulta

  SubDireccion: [
    "x",
    "y",
    "z",
  ],

  // Para las acciones de respuesta en RespuestaTurnado

  Accion: [
      "CONTESTACIÓN",
      "EJECUTADO",
      "INSPECION OCULAR",
      "NO EJECUTADO",
      "REPOSICÓN DE SELLOS",
      "RETIRO DE SELLOS",
      "VISITA DE VERIFICACIVISITA DE VERIFICACION",
      "ZONIFICACION",
  ],
};