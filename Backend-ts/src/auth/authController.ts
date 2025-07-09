import { Request, Response } from 'express';
import { devaPool } from '../config/db';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const [rows]: any = await devaPool.query(
      `SELECT
        u.Pk_IDUsuario,
        u.Fk_IDPersonalTurnado,
        u.Nivel,
        COALESCE(p.Nombre, lt.Nombre) AS Lcp,
        u.Usuario,
        u.Fk_IDLcpTurnado
      FROM Usuario AS u
      LEFT JOIN Personal_Turnado AS p
            ON p.Pk_IDPersonalTurnado = u.Fk_IDPersonalTurnado
      LEFT JOIN Lcp_Turnado AS lt
            ON lt.Pk_IDLCPTurnado     = u.Fk_IDLcpTurnado
       WHERE  u.Usuario = ? AND u.Pass = ?`,
      [username, password]
    );

    if (rows.length > 0) {
      const { Fk_IDPersonalTurnado, Fk_IDLcpTurnado, Nivel, Lcp, Usuario, Pk_IDUsuario } = rows[0];
      (req.session as any).usuario = {
        id: Pk_IDUsuario,
        idLCP: Fk_IDLcpTurnado,
        nivel: Nivel,
        lcp: Lcp,
        usuario: Usuario
      };
      res.json({ state: true, nombre: Lcp, nivel: Nivel, id: Pk_IDUsuario, usuario: Usuario});
      const horaMexico = new Date().toLocaleTimeString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour12: false,
      });
      console.log(`Inicio de sesión: ${Usuario} - ${horaMexico}`);
    } else {
      res.status(401).json({ state: false, mensaje: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al consultar el usuario:', error);
    res.status(500).json({ state: false, mensaje: 'Error en el servidor' });
  }
};

// authController.ts
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ state: false, mensaje: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid'); // Nombre de cookie según tu configuración
    res.json({ state: true, mensaje: 'Sesión cerrada correctamente' });
  });
};

export const checkSession = (req: Request, res: Response) => {
  const usuario = (req.session as any).usuario;

  if (usuario) {
    res.json({
      state: true,
      nombre: usuario.lcp,
      usuario: usuario.Usuario,
      nivel: usuario.nivel,
      id: usuario.id,
      idLCP: usuario.idLCP
    });
  } else {
    res.status(401).json({ state: false, mensaje: 'No hay sesión activa' });
  }
};