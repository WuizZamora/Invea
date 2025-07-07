import { Router } from 'express';
import { devaPool } from '../../config/db';

const router = Router();

// GET Todos los registros
router.get('/', async (req, res) => {
  try {
    const [rows] = await devaPool.query('SELECT * FROM Personal');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// GET Todos los registros
router.get('/personal-turnado', async (req, res) => {
  try {
    const [rows] = await devaPool.query(`
      SELECT * 
      FROM Personal_Turnado 
      WHERE Iniciales NOT IN ('DEVA', 'DIRECCION');
    `);
    res.json({ data: rows });
  } catch (error) {
    console.error(error); // Para depuración
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// GET Registro por ID
router.get('/lcp-turnado/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await devaPool.query(`
      SELECT Pk_IDLCPTurnado, CONCAT(Iniciales, '-', Nombre) AS Nombre
      FROM Lcp_Turnado
      WHERE FK_SubAdscrito = ?
    `, [id]); // Se pasa el parámetro para evitar SQL Injection

    res.json({ data: rows });
  } catch (error) {
    console.error(error); // Para depuración
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// POST para insertar turno de correspondencia
router.post('/lcp-turnar', async (req, res) => {
  try {
    const { Fk_IDCorrespondenciaIn, Fk_LCP_Turnado } = req.body;

    const [rows] = await devaPool.query(`
      INSERT INTO Correspondencia_Turnada (Fk_IDCorrespondenciaIn, Fk_LCP_Turnado)
      VALUES (?, ?);
    `, [Fk_IDCorrespondenciaIn, Fk_LCP_Turnado]);

    res.json({ success: true, message: 'Turno registrado exitosamente' });
  } catch (error) {
    console.error('Error en el INSERT:', error);
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