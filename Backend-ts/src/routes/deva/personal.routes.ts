import { Router } from 'express';
import { devaPool } from '../../config/db';

const router = Router();

// GET Todos los registros
router.get('/', async (req, res) => {
  try {
    const [rows] = await devaPool.query('SELECT * FROM Personal');
    res.json({data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// GET por ID
router.get('/:NumEmpleado', async (req, res) => {
  try {
    const NumEmpleado = req.params.NumEmpleado;
    const [rows] = await devaPool.query(
      'SELECT Pk_IDPersona, Nombre FROM Personal WHERE Pk_IDPersona = ?', 
      [NumEmpleado]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// // POST Insertar nuevo registro
// router.post('/', async (req, res) => {
//   try {
//     const { campos } = req.body;
//     const [result] = await db.query(
//       'INSERT INTO Personal SET ?', 
//       [campos]
//     );
//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al insertar' });
//   }
// });

export default router;