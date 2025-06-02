import { Router } from 'express';
import { db } from '../config/db';

const router = Router();

router.get('/', (req, res) => {
  res.send('API de Correspondencia Interna DEVA');
});

router.get('/Personal', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Personal');
    res.json({
      status: "OK",
      data: rows
    });
    // res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/Direccion', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Direccion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/Entrada', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Correspondencia_Interna_In');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/ObtenerCorrespondenciaInterna', async (req, res) => {
  try {
    const [rows] = await db.query('CALL ObtenerCorrespondenciaInterna()');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/ObtenerDireccion/:cp', async (req, res) => {

  try {
    const cp = req.params.cp;
    const [rows] = await db.query('SELECT Pk_IDAdress, Colonia, Alcaldia FROM Direccion WHERE CP = ?', [cp]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/ObtenerPersonal/:NumEmpleado', async (req, res) => {

  try {
    const NumEmpleado = req.params.NumEmpleado;
    const [rows] = await db.query('SELECT Pk_IDPersona , Nombre FROM Personal WHERE Pk_IDPersona = ?', [NumEmpleado]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

export default router;
