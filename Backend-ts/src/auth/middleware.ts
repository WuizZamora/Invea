import { Request, Response, NextFunction } from 'express';

export const verificarSesion = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any).usuario) {
    next();
  } else {
    res.status(401).json({ mensaje: 'No autorizado, inicia sesión' });
  }
};
