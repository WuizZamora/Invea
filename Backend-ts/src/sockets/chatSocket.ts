import { Server } from "socket.io";
import { guardarMensaje } from "../services/chatService";

interface ChatMensaje {
  Fk_IDUsuario: number;
  mensaje: string;
  nombre: string;
  remitente: 'user' | 'admin';
}

export const setupChatSocket = (io: Server) => {
  io.on('connection', (socket) => {

    socket.on('mensaje', async (data: ChatMensaje) => {

      // Guardar en base de datos
      await guardarMensaje(data);

      // Reenviar a todos los sockets conectados
      io.emit('mensaje', data);
    });

    socket.on('disconnect', () => {

    });
  });
};
