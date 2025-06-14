import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { devaPool} from '../../config/db';
import { Console } from 'console';
import { isConditionalExpression } from 'typescript';
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
router.get('/obtener-correspondencia', async (req, res) => {
  try {
    const [rows] = await devaPool.query('CALL ObtenerCorrespondenciaInterna()');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/obtener-correspondencia-id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await devaPool.query('CALL ObtenerCorrespondenciaInternaPorID(?)', [id]); 
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.post('/guardar-correspondencia', async (req, res) => {
  try {
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
      SoporteDocumental
    } = req.body;

    // Si el remitente es 0, insertamos en la tabla Personal
    if (Fk_Personal_Remitente == 0) {
      const insertQuery = `
        INSERT INTO Personal (Nombre, Cargo, Dependencia)
        VALUES (?, ?, ?)
      `;

   const [insertResult] = await devaPool.query<ResultSetHeader>(insertQuery, [Nombre, Cargo, Dependencia]);
    Fk_Personal_Remitente = insertResult.insertId;
    }

    // Ahora llamamos al procedimiento almacenado con el remitente ya resuelto
    const query = 'CALL GuardarCorrespondenciaInternaIn(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
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
      SoporteDocumental
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
    const{
      NumDVSC,
      FechaIn,
      Oficio,
      Fk_Personal_Remitente,
      Asunto,
      Descripcion,
      Motivo,
      Caracter,
      Calle, 
      NumCalle, 
      OP,
      Fk_Personal_Turnado
    }=req.body;
    console.log(req.body);
    const query='CALL ActualizarCorrespondenciaInternaIn(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values= [
      id,
      NumDVSC,
      FechaIn,
      Oficio,
      Fk_Personal_Remitente,
      Asunto,
      Descripcion,
      Motivo,
      Caracter,
      Calle, 
      NumCalle, 
      Fk_Personal_Turnado,
      OP
    ];
    console.log(values);
    await devaPool.query(query, values);
    res.status(201).json({ message: 'Correspondencia actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la correspondencia' });
  }
});

export default router;