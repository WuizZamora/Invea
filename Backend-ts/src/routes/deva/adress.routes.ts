import { Router } from 'express';
import { db } from '../../config/db';

const router = Router();

// GET Todas las direcciones
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Direccion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// GET por CP
router.get('/:alcaldia', async (req, res) => {
  try {
    const cp = req.params.alcaldia;
    const [rows] = await db.query(
      'SELECT Pk_IDAdress, Colonia, Alcaldia FROM Direccion WHERE Alcaldia = ?', 
      [cp]
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// POST Insertar nueva dirección
// router.post('/', async (req, res) => {
//   try {
//     const { datos } = req.body;
//     const [result] = await db.query(
//       'INSERT INTO Direccion SET ?',
//       [datos]
//     );
//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al crear dirección' });
//   }
// });

export default router;