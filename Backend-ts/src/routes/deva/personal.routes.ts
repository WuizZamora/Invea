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
      WHERE	Pk_IDPersonalTurnado IN(1,2,3,4,5,30);
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
        WHERE u.Pk_IDUsuario NOT IN(1, 2)  AND Vigente = 1
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
        AND u.Pk_IDUsuario <> ? AND Vigente = 1
      `, [id, id]);
    }

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// POST para insertar turno de correspondencia usando el stored procedure
router.post('/lcp-turnar', async (req, res) => {
  try {
    const { Fk_IDCorrespondenciaIn, Fk_LCP_Turnado, id } = req.body;

    // Ahora se pasan 3 parámetros al procedimiento
    const [rows] = await devaPool.query(`
      CALL TurnarCorrespondencia(?, ?, ?);
    `, [Fk_IDCorrespondenciaIn, Fk_LCP_Turnado, id]);

    const horaMexico = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: true,
    });

    console.log(`Correspondencia ${Fk_IDCorrespondenciaIn} turnada a id: ${Fk_LCP_Turnado} por usuario ${id} - ${horaMexico}`);

    res.json({ success: true, message: 'Turno registrado exitosamente' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al turnar correspondencia:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Error desconocido al turnar correspondencia:', error);
      res.status(500).json({ error: 'Error desconocido en la base de datos' });
    }
  }
});

export default router;