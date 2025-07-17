import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

import devaRoutes from './routes/deva';
import dvscRoutes from './routes/dvsc';
import { verificarSesion } from './auth/middleware';
import authRoutes from './auth/auth.routes';
import { setupChatSocket } from './sockets/chatSocket';

const app = express();
const server = createServer(app); // ⬅️ HTTP server necesario para socket.io

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.HOST_FRONT,
    credentials: true,
  }
});

app.use(express.json());

app.use(cors({
  origin: process.env.HOST_FRONT,
  credentials: true
}));

app.use(session({
  secret: process.env.CLAVE_SESSION!,
  resave: false,
  saveUninitialized: false,
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/deva', verificarSesion, devaRoutes);
app.use('/dvsc', dvscRoutes);

app.get('/', (req, res) => {
  res.send('API Principal - Proyectos disponibles: /deva');
});

app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

// 💬 Aquí activas los sockets
setupChatSocket(io); // 👈 delega la lógica del chat

// Iniciar el servidor (HTTP + WebSocket)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
