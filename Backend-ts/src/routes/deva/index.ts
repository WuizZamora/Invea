import { Router } from 'express';
import baseRoutes from './base.routes';
import personalRoutes from './personal.routes';
import direccionRoutes from './adress.routes';
import correspondenciaRoutes from './correspondencia.routes';

const router = Router();

router.use('/', baseRoutes);
router.use('/personal', personalRoutes);
router.use('/direccion', direccionRoutes);
router.use('/correspondencia', correspondenciaRoutes);

export default router;