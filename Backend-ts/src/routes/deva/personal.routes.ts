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
    const id = parseInt(req.params.id, 10);
    let rows;

    if (id === 3 || id === 1) {
      [rows] = await devaPool.query(`
        SELECT
          u.Pk_IDUsuario,
          CONCAT(pt.Iniciales, ' - ', pt.Nombre) AS Nombre,
          u.Fk_IDPersonalTurnado
        FROM
          Usuario u
        LEFT JOIN Personal_Turnado pt ON
          u.Fk_IDPersonalTurnado = pt.Pk_IDPersonalTurnado
        WHERE u.Pk_IDUsuario NOT IN(1, 2)  
        ORDER BY Nombre ASC
      `);
    } else {
      [rows] = await devaPool.query(`
        SELECT 
          u.Pk_IDUsuario,
          CONCAT(pt.Iniciales, ' - ', pt.Nombre) AS Nombre
        FROM 
          Usuario u
        INNER JOIN Personal_Turnado pt 
          ON u.Fk_IDPersonalTurnado = pt.Pk_IDPersonalTurnado
        WHERE 
          pt.Fk_Area = (
            SELECT pt2.Fk_Area 
            FROM Usuario u2
            INNER JOIN Personal_Turnado pt2 
              ON u2.Fk_IDPersonalTurnado = pt2.Pk_IDPersonalTurnado
            WHERE u2.Pk_IDUsuario = ?
          )
        AND u.Pk_IDUsuario <> ?
      `, [id, id]);
    }

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
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

    const horaMexico = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: true,
    });

    console.log(`Correspondencia ${Fk_IDCorrespondenciaIn} turnada a id: ${Fk_LCP_Turnado}- ${horaMexico}`);
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