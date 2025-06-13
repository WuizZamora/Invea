import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('API de Correspondencia Interna DVSC');
});

export default router;