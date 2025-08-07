import { Router } from 'express';
import baseRoutes from './base.routes';
const router = Router();

router.use('/', baseRoutes);

export default router;