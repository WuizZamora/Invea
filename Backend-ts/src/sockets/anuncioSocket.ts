import { Server } from "socket.io";
import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "../../anuncio.txt");

export const setupAnuncioSocket = (io: Server) => {
  // Enviar el contenido actual al conectarse
  io.on("connection", (socket) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (!err && data.trim()) {
        socket.emit("anuncio-actualizado", data.trim());
      }
    });
  });

  // Vigilar el archivo para cambios
  fs.watch(filePath, (eventType) => {
    if (eventType === "change") {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (!err && data.trim()) {
          io.emit("anuncio-actualizado", data.trim());
        }
      });
    }
  });
};
