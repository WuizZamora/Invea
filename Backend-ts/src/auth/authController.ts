import { Request, Response } from 'express';

const usuarioHardcodeado = {
  username: 'admin',
  password: '1234',
};

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === usuarioHardcodeado.username && password === usuarioHardcodeado.password) {
    (req.session as any).usuario = { username };
    res.json({state: true });
  } else {
    res.status(401).json({ state: false});
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    res.json({ mensaje: 'Sesión cerrada' });
  });
};
