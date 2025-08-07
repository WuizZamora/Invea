import { Router } from 'express';

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


export default router;