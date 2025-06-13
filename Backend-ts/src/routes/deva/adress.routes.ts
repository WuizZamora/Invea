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

// GET por CP
router.get('/:alcaldia', async (req, res) => {
  try {
    const cp = req.params.alcaldia;
    const [rows] = await devaPool.query(
      'SELECT Pk_IDAdress, Colonia, Alcaldia FROM Direccion WHERE Alcaldia = ?', 
      [cp]
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/a/:alcaldia/:colonia', async (req, res) => {
  try {
    const { alcaldia, colonia } = req.params;

    const [rows] = await devaPool.query(
      'SELECT * FROM `Direccion` WHERE Alcaldia LIKE ? AND Colonia LIKE ?;',
      [`%${alcaldia}%`, `%${colonia}%`] // si quieres búsqueda parcial
    );

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
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