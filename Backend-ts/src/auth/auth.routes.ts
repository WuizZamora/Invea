import { Router } from 'express';
import { login, logout, checkSession } from './authController';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-session', checkSession);

export default router;
