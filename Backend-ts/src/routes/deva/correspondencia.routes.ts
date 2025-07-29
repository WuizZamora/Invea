import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { devaPool } from '../../config/db';
import { ResultSetHeader } from 'mysql2';

const router = express.Router();

// GUARDAR ARCHIVO
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../../../uploads/correspondencia');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const storageOut = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads/correspondenciaOUT');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadOut = multer({ storage: storageOut });

// CONSULTA GENERAL PARA DASHBOARD
router.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    // const { fechaInicio, fechaFin } = req.body;
    const fechaInicio = "2025-05-01";""
    const fechaFin = "2025-07-29";
    if (!fechaInicio || !fechaFin) {
      res.status(400).json({ error: 'Faltan fechas' }); 
      return;
    }

    const [rows]: any = await devaPool.query('CALL ObtenerDatosDashboard(?, ?)', [fechaInicio, fechaFin]);

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// Entradas CONSULTA GENERAL Y TEST
router.get('/entrada', async (req, res) => {
  try {
    const [rows] = await devaPool.query('SELECT * FROM Correspondencia_Interna_In');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
    console.log(error)
  }
});

// Procedimiento almacenado
router.get('/obtener-correspondencia/:nivel', async (req: Request, res: Response): Promise<void> => {
  const nivel = Number(req.params.nivel);
  const turnado = Number(req.query.turnado);

  try {
    let rows;

    if (nivel === 1 || turnado === 3) {
      // Si es nivel 1, o el turnado es 3, siempre usa CorrespondenciaInterna
      const [result] = await devaPool.query('CALL ObtenerCorrespondenciaInterna()');
      rows = result;
    } else if (nivel === 2) {
      if (!turnado) {
        res.status(400).json({ error: 'Falta el parámetro "turnado" para nivel 2' });
        return;
      }
      const [result] = await devaPool.query('CALL ObtenerCorrespondenciaSub(?)', [turnado]);
      rows = result;
    } else if (nivel === 4) {
      if (!turnado) {
        res.status(400).json({ error: 'Falta el parámetro "turnado" para nivel 4' });
        return;
      }
      const [result] = await devaPool.query('CALL ObtenerCorrespondenciaLCP(?)', [turnado]);
      rows = result;
    } else {
      res.status(400).json({ error: 'Nivel no válido. Debe ser 1, 2 o 4.' });
      return;
    }

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/obtener-correspondencia-id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows]: any = await devaPool.query('CALL ObtenerCorrespondenciaInternaPorID(?)', [id]);
    const data = rows?.[0]?.[0];
    const numDVSC = data?.NumDVSC;
    const numDEVA = data?.NumDEVA;

    const campoMostrado = numDVSC != null ? 'NumDVSC' : 'NumDEVA';
    const valorMostrado = numDVSC != null ? numDVSC : numDEVA;

    const horaMexico = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: true,
    });

    console.log(`Consulta de ${campoMostrado}: ${valorMostrado} - ${horaMexico}`);

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.post('/guardar-correspondencia', async (req, res) => {
  try {
    const horaMexico = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: true,
    });

    console.log(`Guardar Correspondecia - ${horaMexico}`);
    console.log(req.body);
    let {
      NumDVSC,
      FechaIn,
      Oficio,
      Fk_Personal_Remitente,
      Nombre,
      Cargo,
      Dependencia,
      Asunto,
      Descripcion,
      Motivo,
      Caracter,
      Fk_Direccion_IDAdress,
      Calle,
      NumCalle,
      Fk_Personal_Turnado,
      SoporteDocumental,
      Num,
      OP,
      Expediente,
      FechaDocumento,
      TipoInmueble,
      Denominacion
    } = req.body;

    if (Fk_Personal_Remitente == 0) {
      const insertQuery = `
        INSERT INTO Personal (Nombre, Cargo, Dependencia)
        VALUES (?, ?, ?)
      `;

      const [insertResult] = await devaPool.query<ResultSetHeader>(insertQuery, [Nombre, Cargo, Dependencia]);
      Fk_Personal_Remitente = insertResult.insertId;
    }

    // Ahora llamamos al procedimiento almacenado con el remitente ya resuelto
    const query = 'CALL GuardarCorrespondenciaInternaIn(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      Num,
      NumDVSC,
      FechaIn,
      Oficio,
      Fk_Personal_Remitente,
      Asunto,
      Descripcion,
      Motivo,
      Caracter,
      Fk_Direccion_IDAdress,
      Calle,
      NumCalle,
      Fk_Personal_Turnado,
      SoporteDocumental,
      OP,
      Expediente,
      FechaDocumento,
      TipoInmueble,
      Denominacion
    ];

    await devaPool.query(query, values);

    res.status(201).json({ message: 'Correspondencia guardada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la correspondencia' });
  }
});

router.post('/subir-soporte/:id', upload.single('archivo'), async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No se ha subido ningún archivo' });
      return;  // Solo return sin valor
    }

    const filePath = `/uploads/correspondencia/${file.filename}`;

    const query = 'UPDATE Correspondencia_Interna_In SET SoporteDocumental = ? WHERE Pk_IDCorrespondenciaIn = ?';
    await devaPool.query(query, [filePath, id]);

    res.json({ message: 'Archivo subido y ruta actualizada correctamente', path: filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el archivo o actualizar la base de datos' });
  }
});

router.delete('/borrar-soporte/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);
    // Obtener la ruta del archivo desde la base de datos
    const [rows]: any = await devaPool.query(
      'SELECT SoporteDocumental FROM Correspondencia_Interna_In WHERE Pk_IDCorrespondenciaIn = ?',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Correspondencia no encontrada' });
      return;
    }

    const filePath = rows[0].SoporteDocumental;

    if (!filePath) {
      res.status(400).json({ error: 'No hay archivo asociado para este registro' });
      return;
    }

    // Eliminar el archivo del sistema de archivos
    const absolutePath = path.join(__dirname, '../../../', filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // Actualizar el campo SoporteDocumental a NULL en la base de datos
    await devaPool.query(
      'UPDATE Correspondencia_Interna_In SET SoporteDocumental = NULL WHERE Pk_IDCorrespondenciaIn = ?',
      [id]
    );

    res.json({ message: 'Archivo eliminado y soporte documental actualizado a NULL' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el archivo o actualizar la base de datos' });
  }
});

router.put('/actualizar-correspondencia/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const {
      NumDVSC,
      NumDEVA,
      Oficio,
      Fk_Personal_Remitente,
      Asunto,
      Descripcion,
      Motivo,
      Caracter,
      Calle,
      NumCalle,
      OP,
      Fk_Personal_Turnado,
      FechaDocumento,
      Expediente,
      TipoInmueble,
      Denominacion
    } = req.body;

    const query = 'CALL ActualizarCorrespondenciaInternaIn(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      id,
      NumDVSC,
      NumDEVA,
      Oficio,
      Fk_Personal_Remitente,
      Asunto,
      Descripcion,
      Motivo,
      Caracter,
      Calle,
      NumCalle,
      Fk_Personal_Turnado,
      OP,
      Expediente,
      FechaDocumento,
      TipoInmueble,
      Denominacion
    ];
    await devaPool.query(query, values);
    res.status(201).json({ message: 'Correspondencia actualizada correctamente' });

    // Determinar cuál campo usar
    const campoMostrado = NumDVSC != null ? 'NumDVSC' : 'NumDEVA';
    const valorMostrado = NumDVSC != null ? NumDVSC : NumDEVA;

    const horaMexico = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: true,
    });

    console.log(`Actualización de ${campoMostrado}: ${valorMostrado} - ${horaMexico}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la correspondencia' });
  }
});


router.post('/guardar-correspondencia-out/:idIn', uploadOut.single('archivo'), async (req: Request, res: Response): Promise<void> => {
  try {
    const fkId = Number(req.params.idIn);
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No se ha subido ningún archivo.' });
      return;             // ← devuelve void
    }
    const {
      Accion,
      Oficio,
      Descripcion,
      EstaTerminado,
      id
    } = req.body;

    const estaTerminadoNum =
      EstaTerminado === '1' || EstaTerminado === 1 || EstaTerminado === true
        ? 1
        : 0;

    const filePath = `/uploads/correspondenciaOUT/${file.filename}`;

    const sql = `
        INSERT INTO Correspondencia_Interna_Out
          (Fk_Correspondencia_Interna_In,
           FechaOut,
           Accion,
           Oficio,
           Descripcion,
           SoporteDocumental,
           EstaTerminado,
           FK_IDUsuarioContestacion)
        VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)
      `;

    await devaPool.query(sql, [
      fkId,
      Accion,
      Oficio,
      Descripcion,
      filePath,
      estaTerminadoNum,
      id
    ]);

    res.json({
      message: 'Archivo OUT subido y registro creado correctamente',
      path: filePath,
    });

    const horaMexico = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: true,
    });

    console.log(`Respuesta en el id ${fkId}:  - ${horaMexico}`);
  } catch (err) {
    console.error('Error al subir OUT:', err);
    res.status(500).json({
      error: 'Error al subir el archivo o insertar en la base de datos',
    });
  }
},
);

router.get('/obtener-correspondencia-out/:idIn', async (req, res) => {
  try {
    const fkId = Number(req.params.idIn);

    const [rows] = await devaPool.query(
      'SELECT * FROM Correspondencia_Interna_Out WHERE Fk_Correspondencia_Interna_In = ? ORDER BY Pk_IDCorrespondenciaOut DESC',
      [fkId]
    );

    res.json({ data: rows });
  } catch (error) {
    console.error(error); // Para depuración
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/consulta-sub', async (req, res) => {
  try {
    const [rows] = await devaPool.query('CALL ConsultaSub()');
    res.json({ data: (rows as any[])[0] });
  } catch (error) {
    console.error('Error al ejecutar ConsultaSub:', error);
    res.status(500).json({ error: 'Error al ejecutar ConsultaSub' });
  }
});

export default router;