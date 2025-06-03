import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('API de Correspondencia Interna DEVA');
});

export default router;