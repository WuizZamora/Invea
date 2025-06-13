import express from 'express';
import cors from 'cors';
import path from 'path';
import devaRoutes from './routes/deva';  // Importa el grupo de rutas de DEVA
import dvscRoutes from './routes/dvsc';  // Para futuros proyecto

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.HOST_FRONT,
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Monta todas las rutas de DEVA bajo /deva
app.use('/deva', devaRoutes);

// Agregar más proyectos aquí:
app.use('/dvsc', dvscRoutes);

// Ruta raíz (opcional)
app.get('/', (req, res) => {
  res.send('API Principal - Proyectos disponibles: /deva');
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});