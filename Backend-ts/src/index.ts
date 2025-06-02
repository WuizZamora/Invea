import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';



const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173' // permite peticiones desde tu frontend
}));

app.use(express.json());

app.use('/', userRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  // res.status(404).json({ error: 'Ruta no encontrada' });
  res.status(404).send('<h1>404 - Página no encontrada</h1>');

});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
