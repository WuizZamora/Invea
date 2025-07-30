import { Router } from 'express';
import { devaPool } from '../../config/db';

const router = Router();

// GET Todas las direcciones
router.get('/', async (req, res) => {
  try {
    const [rows] = await devaPool.query('SELECT * FROM Direccion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

export default router;