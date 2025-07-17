import { devaPool } from "../config/db"; 

interface ChatMensaje {
  Fk_IDUsuario: number;
  mensaje: string;
  remitente: 'user' | 'admin';
}

export async function guardarMensaje(data: ChatMensaje) {
  const query = `
    INSERT INTO chat_mensajes (Fk_IDUsuario, mensaje, remitente)
    VALUES (?, ?, ?)
  `;

  const values = [data.Fk_IDUsuario, data.mensaje, data.remitente];

  try {
    await devaPool.execute(query, values);
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    throw error;
  }
}
