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
      WHERE	Pk_IDPersonalTurnado IN(1,2,3,4,5);
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
    
    const [rows] = await devaPool.query(
      'CALL Turno_SELECT_Personal(?)', 
      [id]
    );

    res.json({ data: (rows as any[])[0] });
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