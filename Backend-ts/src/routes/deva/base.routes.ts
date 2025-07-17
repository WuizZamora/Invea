import { Router } from 'express';
import { devaPool } from '../../config/db';

import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/', (req, res) => {
  res.send('API de Correspondencia Interna DEVA');
});

router.get('/anuncio', (req, res) => {
  const filePath = path.resolve(__dirname, '../../../anuncio.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err || !data.trim()) {
      return res.status(204).send(); // No hay contenido
    }
    res.send({ mensaje: data.trim() });
  });
});

router.get("/chat/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  const [rows] = await devaPool.query(
    "SELECT * FROM chat_mensajes WHERE Fk_IDUsuario = ? ORDER BY timestamp ASC",
    [usuario_id]
  );
  res.json(rows);
});

router.get("/userchat", async (req, res) => {
  try {
    const [rows]: any = await devaPool.query('CALL ObtenerUsuariosConMensajes();');
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios con mensajes' });
  }
});
export default router;