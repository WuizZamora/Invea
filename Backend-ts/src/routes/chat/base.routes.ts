import { Router } from 'express';
import { devaPool } from '../../config/db';
const router = Router();

router.get("/userchat", async (req, res) => {
  try {
    const [rows]: any = await devaPool.query('CALL ObtenerUsuariosConMensajes();');
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios con mensajes' });
  }
});

router.get("/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  const [rows] = await devaPool.query(
    "SELECT * FROM chat_mensajes WHERE Fk_IDUsuario = ? ORDER BY timestamp ASC",
    [usuario_id]
  );
  res.json(rows);
});

export default router;